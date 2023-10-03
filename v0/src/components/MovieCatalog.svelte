<!-- MovieCatalog.svelte -->
<script>
    
	import { categoria } from './../stores/movieStore.js';
	
    import { movies, selectedTags, selectedSortOption, searchTerm, minScore, 
        filteredMovies, recomendadas, recomendadasTags, titulo, keywords, recomendadasKeywords } from '../stores/movieStore';
   
	import {dataF, seriesF} from "@stores/data";
	import RangeFilter from './RangeFilter.svelte';
    import MovieSearch from "./MovieSearch.svelte";
    import Ficha from './Ficha.svelte';
    import FilterTags from "./FilterTags.svelte";
    import SortOptions from "./SortOptions.svelte";    
    import { onMount, beforeUpdate, afterUpdate, onDestroy } from 'svelte';


    import { filter } from 'd3-array';
    import App from '@/App.svelte';
    
    import Bubbles from './Charts/Bubbles.svelte';
    import ChooseDataset from './ChooseDataset.svelte';
    import SvelteSlider from './Charts/Sv-Slider.svelte';
    import { interpolateNearest } from '@observablehq/plot';

    
    
    let numResultsLoaded = 10;
    let results = []
    let renderedMovies = []
    
    let storeLength = $selectedSortOption.length;
    let correlationMatrix = null;
    
    let itemsToShow = 8;

    let countDictionary = {};
    let countDictionaryTags = [];
    let sortedData = {};
    let sortedDataTags = {};
    let entries = [], entriesTags = [];

    $: renderedMovies = $dataF.map((d,i)=> {              
        return {
            id: i,
            pais: d.pais,
            subtítulos:d.subtítulos,
            sinopsis: d.sinopsis,
            tags: d.tags,
            title: d.title,
            audio:  d.audio ?  d.audio.split("\n") : "", 
            director: d.director,
            duracion: d.duracion,
            estreno: d.estreno,
            fecha: d.fecha,
            generos: d.generos,
            image: d.image,
            link: d.link,
            score: d.score,
            reparto: d.reparto,
            minutos:d.minutos,
            votos:  (d.votos) ? d.votos.split(" ")[0] : 0}})
        
     $: renderedSeries = $seriesF.map((d,i)=> {              
        return {
            id: i,
            pais: d.pais,
            subtítulos:d.subtítulos,
            sinopsis: d.sinopsis,
            tags: d.tags,
            title: d.title,
            audio:  d.audio ?  d.audio.split("\n") : "", 
            //director: d.director,
            //duracion: d.duracion,
            //estreno: d.estreno,
            fecha: d.fecha,
            generos: d.generos,
            image: d.image,
            link: d.link,
            //score: d.score,
            reparto: d.reparto,
            //minutos:d.minutos,
            //votos:  (d.votos) ? d.votos.split(" ")[0] : 0
        }
        })
    
   
    
    // Función para cargar más resultados
    const loadMoreResults = () =>  {
        // Simulamos cargar más resultados
        
        let max = (($filteredMovies.length - results.length) >= 5) ? 5 :  $filteredMovies.length - results.length ;
        //controlamos que queden más resultados
        
        setTimeout(()=>{
            if(max > 0){
            
                let rl = results.length;
                
                for (let i = 0; i < max; i++) {
                    //results.push(`Resultado ${numResultsLoaded + i}`);                
                    results.push($filteredMovies[rl + i])  
                }
                numResultsLoaded += 5;            
            }
        },1000)
     
    }

  // Función para detectar el scroll y cargar más resultados si es necesario
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
        if (scrollTop + clientHeight >= scrollHeight - 50) {
             loadMoreResults();
                }
    }

  
    // Agregar el oyente de eventos al scroll
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchmove', handleScroll);
    window.addEventListener('touchstart', handleScroll);
    // Limpiar el oyente de eventos cuando el componente se desmonta
     // Agregar el oyente de eventos al scroll cuando el componente esté listo
    onMount(() => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('touchmove', handleScroll);
        window.addEventListener('touchstart', handleScroll);
    });

    // Eliminar el oyente de eventos cuando el componente se actualice
    beforeUpdate(() => {
        window.removeEventListener('scroll', handleScroll);
        window.addEventListener('touchmove', handleScroll);
        window.addEventListener('touchstart', handleScroll);
    });

    // Volver a agregar el oyente de eventos después de una actualización
    afterUpdate(() => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('touchmove', handleScroll);
        window.addEventListener('touchstart', handleScroll);
    });

    // Eliminar el oyente de eventos cuando el componente se desmonte
    onDestroy(() => {
        window.removeEventListener('scroll', handleScroll);
        window.addEventListener('touchmove', handleScroll);
        window.addEventListener('touchstart', handleScroll);
    });

  const custom = (a,b)=>  b[1] - a[1]; 

  const customSort = (a,b)=> {        
                
            for (const feature of $selectedSortOption) {
                
                if (a[feature] !== b[feature]) {
                    if(feature =="title")
                        return b[feature] < a[feature] ? 1 : -1;
                    else
                        return b[feature] > a[feature] ? 1 : -1;
                }
            }
            return 0; // Si todas las características son iguales
        }; 
     
    $: results =  $filteredMovies.slice(0, 20);
    $: dataset = ($categoria.peliculas) ? renderedMovies : renderedSeries;
    $: $filteredMovies =  dataset.filter((movie) => {          
            //console.log("FILTER MOVIES", $selectedTags)
            let genreMatch;
            let audioMatch;
            let recomendadasMatch;
            let recomendadasTagsMatch;
            let keywordsMatch;

            recomendadasMatch = $recomendadas.length === 0 || Object.keys($recomendadas).includes(movie["title"]);
            recomendadasTagsMatch = $recomendadasTags.length === 0 || $recomendadasTags.includes(movie["title"]);               
            
             if($recomendadas[movie.title]){
                keywordsMatch = $selectedTags["keywords"].length === 0 || $selectedTags["keywords"].every(d => $recomendadas[movie.title].includes(d));               
            }else{
                keywordsMatch = $selectedTags["keywords"].length === 0
            } 
                   
                if(movie.generos){
                    if (movie["generos"].split(",").length>1) {
                        //genreMatch = $selectedTags["generos"].length === 0 || movie["generos"].split(",").every(item => $selectedTags["generos"].includes(item)) ; 
                        genreMatch = $selectedTags["generos"].length === 0 || $selectedTags["generos"].every(item => movie["generos"].includes(item));
                    // console.log(movie["generos"].split(",").every(item => $selectedTags["generos"].includes(item)), movie["generos"], $selectedTags["generos"]);
                    }else{
                        if(movie.generos !== null)            
                            genreMatch = $selectedTags["generos"].length === 0 ||  movie["generos"].includes($selectedTags["generos"]) ; 
                        
                    }
                }
                if (movie["audio"]){
                    if (movie["audio"][0].split(",").length>1) {
                        //genreMatch = $selectedTags["generos"].length === 0 || movie["generos"].split(",").every(item => $selectedTags["generos"].includes(item)) ; 
                        audioMatch = $selectedTags["audio"].length === 0 || $selectedTags["audio"].every(item => movie["audio"].includes(item));
                    }else{
                        if(movie.audio !== null)            
                        audioMatch = $selectedTags["audio"].length === 0 ||  $selectedTags["audio"].every(item => movie["audio"].includes(item));//movie["audio"].includes($selectedTags["audio"]) ;                 
                    }
                }
                    const tagMatch = $selectedTags["tags"].length === 0 || ((movie["tags"]!== null) ? movie["tags"].includes($selectedTags["tags"]) : null);
                    //const audioMatch = $selectedTags["audio"].length === 0 || ((movie["audio"]!== null) ? movie["audio"].includes($selectedTags["audio"]) : null) ;
                    const paisMatch = $selectedTags["pais"].length === 0 || ((movie["pais"]!== null) ? movie["pais"].includes($selectedTags["pais"]) : null) ;
                    const searchTermMatch = $searchTerm === '' ||  
                        ((movie.title!== null) ? movie.title.toString().toLowerCase().includes($searchTerm.toLowerCase()): null) ||
                        ((movie.tags!== null) ? movie.tags.toString().toLowerCase().includes($searchTerm.toLowerCase()): null) ||
                        ((movie.director!== null) ? movie.director.toString().toLowerCase().includes($searchTerm.toLowerCase()): null) ||
                        ((movie.reparto!== null) ? movie.reparto.toString().toLowerCase().includes($searchTerm.toLowerCase()): null)                                         
                        ;
                /*   if(searchTerm && searchTerm.split(" ").length>1){
                        ((movie.title!== null) ? movie.title.toString().toLowerCase().includes($searchTerm.toLowerCase()): null)
                    } */
                    if($categoria.peliculas){
                        const filterScore = $minScore["score"] == "" || movie.score >= $minScore["score"];
                        const filterScoreMax = $minScore["scoreMax"] == "" || movie.score <= $minScore["scoreMax"];
                        const filterVotos = $minScore["votos"] == "" || movie.votos >= $minScore["votos"];
                        const filterDuracion = $minScore["minutos"] == "" || movie.minutos <= $minScore["minutos"];
                        return genreMatch && searchTermMatch && tagMatch && audioMatch && paisMatch && filterScore && filterVotos && filterScoreMax && filterDuracion && (recomendadasMatch) && keywordsMatch;// || recomendadasTagsMatch);                
                    }else{
                        return genreMatch && searchTermMatch && tagMatch && audioMatch && paisMatch && (recomendadasMatch) && keywordsMatch;// || recomendadasTagsMatch);                
                    }
        });
 
    $: {
        $selectedSortOption;
        $selectedTags;
        $recomendadas;
        $recomendadasTags;
        $filteredMovies = $filteredMovies.sort(customSort);
        //console.log("%cpeliculas filtradas", 'color: blue; font-size: 18px;',$filteredMovies)
    }
   
    $: porGenero = () => {
        let valueCount = {};
        
        $filteredMovies.forEach(item => {
            
            let attributeValue = item.generos;
            
            if (valueCount[attributeValue]) {
                valueCount[attributeValue]++;
            } else {
                valueCount[attributeValue] = 1;
            }
        } )
        
        return valueCount;

    }

    $: porAudio = () => {
        let valueCount = {};
       
        $filteredMovies.map( d =>  {          
            
            return d.audio ? ( d.audio.length ? 
                 {...d, audio:d.audio.map(d=> d.split(","))}:d.split(",")) : []}
             );

        $filteredMovies.forEach(item => {
            
            let attributeValue = item.audio;
            
            if (valueCount[attributeValue]) {
                valueCount[attributeValue]++;
            } else {
                valueCount[attributeValue] = 1;
            }
        } )
        
        return valueCount;

    }

    $: porTags = () => {
        let valueCount = {};
       
        $filteredMovies.map( d =>  {                     
            return d.tags.split(",").length>1 ? 
                 {...d, tags:d.tags.split(",")} : d}
             );

        $filteredMovies.forEach(item => {
            
            let attributeValue = item.tags;
            
            if (valueCount[attributeValue]) {
                valueCount[attributeValue]++;
            } else {
                valueCount[attributeValue] = 1;
            }
        } )
        
        return valueCount;

    }
   
    $: reset = ( k )=>{
        
        $recomendadas = [];
        $recomendadasTags = [];
        $selectedTags = {tags:[],audio:[],generos:[],pais:[], keywords:[]}
        
    }
    $: filteredResults = results;
    
    $:  {
        countDictionary = {};
        sortedData = {};
        Object.keys($recomendadas).forEach((key)=>{
            const val = $recomendadas[key]
            
            if(Array.isArray(val))
                val.forEach((d)=>{            
                if (countDictionary[d]) {
                        // If it exists, increment the count by 1
                        countDictionary[d] += 1;
                    } else {
                        // If it doesn't exist, initialize the count to 1
                        countDictionary[d] = 1;
                    }
                }) 
            })
        entries = Object.entries(countDictionary)
        entries.sort(custom);
        for (const [key, value] of entries) {
            sortedData[key] = value;
        }
       //console.log(sortedData, $recomendadasKeywords, countDictionary)
    }
    
    $:  {
        countDictionaryTags = {};
        sortedDataTags = {};
        let arr = []
        for (const key in porTags()) {      
            
            arr = key.split(",")
            for(const [ix, value] in arr) {    
               
                if (countDictionaryTags[arr[ix]]) {
                    // If it exists, increment the count by 1
                    countDictionaryTags[arr[ix]] += 1;
                } else {
                    // If it doesn't exist, initialize the count to 1
                    countDictionaryTags[arr[ix]] = 1;
                }
           }
        }
        entriesTags = Object.entries(countDictionaryTags)
        entriesTags.sort(custom);
       
        for (const [key, value] of entriesTags) {
            sortedDataTags[key] = value;
        }
    }
    
  
    
    function showMore() {
        // Incrementa la cantidad de elementos para mostrar    
        itemsToShow = (Object.entries(sortedDataTags).length >= itemsToShow + 10) ? itemsToShow + 10 : Object.entries(sortedDataTags).length; 
    }
    function showLess() {
        // Incrementa la cantidad de elementos para mostrar    
        itemsToShow = (Object.entries(sortedDataTags).length >= 10 ) ? itemsToShow - 10 : Object.entries(sortedDataTags).length - 1; 
    }

    

  </script>
  
  <main
  
  >
    <div class="header"><h1>Recomendador de Filmín</h1></div>
  
    <ChooseDataset/>
    
    <MovieSearch /> 
    <!-- Lista de películas filtradas -->
    <div class="filters">
        <SortOptions options={['title',  'score', 'minutos', 'fecha']}  />
        <RangeFilter key="score" min={0} max={10}/>
        <!-- <RangeFilter key="scoreMax" min={0} max={10}/> -->
        
        <SvelteSlider key="votos" min={$minScore.votos} max={1000}/>
        <RangeFilter key="minutos" min={0} max={300}/>
        
     
        
    </div>
    <!-- <p class="resultados">{$filteredMovies.length} resultados</p> -->
    <p>Generos</p>
    <Bubbles data={porGenero()} key={"generos"}/>
    <p>Tags</p>
    <Bubbles data={porTags()} key={"tags"}/>
    <p>Audio</p>
    <Bubbles data={porAudio()} key={"audio"}/>
    {#if $filteredMovies.length == 0 }
        <p>Ningún resultado con estos filtros</p>
    {:else}
        <p class="resultados">{$filteredMovies.length} resultados</p>
    {/if}

    <h3>    Si no te convence ninguna, haz click en la que más te haya gustado y te recomendamos algunas. </h3>
    
    
    <Bubbles data={sortedData} key={"keywords"}/>
        {#if sortedDataTags}
        <div class="tags">
            {#each Object.entries(sortedDataTags).slice(0, itemsToShow) as [ix, value]}
                <span class="tag">{ix} {value}</span>
                
            {/each}
        </div>
        {/if}
        {#if itemsToShow < Object.entries(sortedDataTags).length}
         <button on:click={showMore}>Mostrar más ...</button>
        {/if}
        {#if itemsToShow > 10}
         <button on:click={showLess}>Mostrar menos ...</button>
        {/if}
        <div class="reset"
        on:click={()=> reset()}
        on:mousedown={()=> reset()}
        on:keydown={()=> reset()}
        >reset</div>

        <div class="catalogo" id="catalogo">        
            <Ficha data={filteredResults}/>
        </div>
  </main>
  
  <style>
    
   h3{
    margin: 1rem;
   }
    .keywords, .tags{
        display: flex;
        flex-wrap: wrap;
    }
    .keywords span, .tag{
        background-color: var(--int-filmin-pink);
        padding: .5rem;
        border-radius: 15px;
        margin: .5rem;
        color: var(--int-basic-white-dark);
        border: 1px solid var(--int-filmin-pink);
    }
    .tag{
        background-color: var(--int-info);
        font-size: 11px;
        margin: 2px;
    }
   
    .header{
      background-color:var(--filmin-color-base);
      margin-top: 0;
    }

    

  
    .reset{
        display: flex;
        border: 2px solid var(--filmin-color-base) ;
        border-radius: 5px;
        padding: 1rem;
        background-color: var(--int-filmin-pink);

        font-weight: bold;
        font-size: 1.25rem;
        width: fit-content;
        cursor: pointer;
    }
    div, .filters {
      
      padding: 5px;
      
      border-radius: 0px;
      font-size: 1rem;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
      margin: 10px auto;
    }
    .filters{
        margin-top: 0;
    }
    .resultados{
        background-color: var(--filmin-color-base) ;
        color: white;
        font-size: 1.25rem;
        font-weight: bold;
        border-radius: 5px;
        width: 60%;
        padding: 1rem;
        margin: 5px ;
    }
    .catalogo{
        display: flex;
        flex-wrap: wrap;
        font-size: 11px;
        overflow: auto;
        justify-content: space-between;
       
    }
    .catalogo >div{
            flex-basis: calc(33.33% - 20px); /* Restamos 20px para dejar espacio entre los divs */
            border: 1px solid rgb(246, 165, 231);
            border-radius: 5px;
            margin: 5px;
            
        }
   
    .catalogo div p, .catalogo div h2{
            margin: 5px;
        }
  
  </style>
  