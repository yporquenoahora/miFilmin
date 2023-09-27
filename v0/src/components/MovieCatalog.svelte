<!-- MovieCatalog.svelte -->
<script>
    
	import { categoria } from './../stores/movieStore.js';
	
    import { movies, selectedTags, selectedSortOption, searchTerm, minScore, 
        filteredMovies, recomendadas, recomendadasTags, titulo, keywords, recomendadasKeywords } from '../stores/movieStore';
	import {dataF, seriesF} from "@stores/data";
	import RangeFilter from './RangeFilter.svelte';
    import MovieSearch from "./MovieSearch.svelte";
    
    import FilterTags from "./FilterTags.svelte";
    import SortOptions from "./SortOptions.svelte";    
    import { onMount, beforeUpdate, afterUpdate, onDestroy } from 'svelte';


    import { filter } from 'd3-array';
    import App from '@/App.svelte';
    
    import Bubbles from './Charts/Bubbles.svelte';
    import ChooseDataset from './ChooseDataset.svelte';
    import SvelteSlider from './Charts/Sv-Slider.svelte';
    import { interpolateNearest } from '@observablehq/plot';

    let divResaltado = null;
    let isVisible = false;
    let numResultsLoaded = 10;
    let results = []
    let renderedMovies = []
    
    let storeLength = $selectedSortOption.length;
    let correlationMatrix = null;
    
    let itemsToShow = 8;

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
            score: d.score,
            reparto: d.reparto,
            minutos:d.minutos,
            votos:  (d.votos) ? d.votos.split(" ")[0] : 0}})
    
    function onMouseOver(div) {
        isVisible = true;
        divResaltado = div;
    }

    function onMouseOut() {
        isVisible = false;
        divResaltado = null;
    }
    
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
     
    $: results = $filteredMovies.slice(0, 20);
       
    $: $filteredMovies =  ($categoria.peliculas) ? 
        renderedMovies.filter((movie) => {          
            //console.log("FILTER MOVIES", $selectedTags)
            let genreMatch;
            let audioMatch;
            let recomendadasMatch;
            let recomendadasTagsMatch;

            recomendadasMatch = $recomendadas.length === 0 || $recomendadas.includes(movie["title"]);
            recomendadasTagsMatch = $recomendadasTags.length === 0 || $recomendadasTags.includes(movie["title"]);               
                     //console.log($recomendadas, movie.title, $recomendadas.includes(movie["title"]))
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
                    const filterScore = $minScore["score"] == "" || movie.score >= $minScore["score"];
                    const filterScoreMax = $minScore["scoreMax"] == "" || movie.score <= $minScore["scoreMax"];
                    const filterVotos = $minScore["votos"] == "" || movie.votos >= $minScore["votos"];
                    const filterDuracion = $minScore["minutos"] == "" || movie.minutos <= $minScore["minutos"];
                let rec = recomendadasMatch || recomendadasTagsMatch;
           
                //console.log(genreMatch , searchTermMatch , tagMatch , audioMatch , paisMatch , filterScore , filterVotos , filterScoreMax , filterDuracion , (recomendadasMatch || recomendadasTagsMatch))
                return genreMatch && searchTermMatch && tagMatch && audioMatch && paisMatch && filterScore && filterVotos && filterScoreMax && filterDuracion && (recomendadasMatch);// || recomendadasTagsMatch);                
                
        }) : 
        renderedSeries.filter((movie) => {          
            console.log("FILTER SERIES", $selectedTags)
            let genreMatch;
            let audioMatch;
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
                const searchTermMatch = $searchTerm === '' ||  ((movie.title!== null) ? movie.title.toString().toLowerCase().includes($searchTerm.toLowerCase()): null) ;
                const filterScore = $minScore["score"] == "" || movie.score >= $minScore["score"];
                const filterScoreMax = $minScore["scoreMax"] == "" || movie.score <= $minScore["scoreMax"];
                const filterVotos = $minScore["votos"] == "" || movie.votos >= $minScore["votos"];
                const filterDuracion = $minScore["minutos"] == "" || movie.minutos <= $minScore["minutos"];
            
            return genreMatch && searchTermMatch && tagMatch && audioMatch && paisMatch && filterScore && filterVotos && filterScoreMax && filterDuracion;
        
        })
 
    $: {
        $selectedSortOption;
        $selectedTags;
        $recomendadas;
        $recomendadasTags;
        $filteredMovies = $filteredMovies.sort(customSort);
        console.log("%cpeliculas filtradas", 'color: blue; font-size: 18px;',$filteredMovies)
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
            
            return d.audio.length ? 
                 {...d, audio:d.audio.map(d=> d.split(","))}:d.split(",")}
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
        
        $recomendadas = (k == "sin") ? []: $recomendadas;
        $recomendadasTags = (k == "tags") ? []: $recomendadasTags;
        console.log("reset", $recomendadas, $recomendadasTags)
    }
    $: filteredResults = results;
    let countDictionary = {};
    let countDictionaryTags = [];
    let sortedData = {};
    let sortedDataTags = {};
    let entries = [], entriesTags = [];
    $:  {
        countDictionary = {};
        sortedData = {};
        for (const key in $recomendadasKeywords) {
        
            for(const ix in $recomendadasKeywords[key]) {
        
                if (countDictionary[$recomendadasKeywords[key][ix]]) {
                    // If it exists, increment the count by 1
                    countDictionary[$recomendadasKeywords[key][ix]] += 1;
                } else {
                    // If it doesn't exist, initialize the count to 1
                    countDictionary[$recomendadasKeywords[key][ix]] = 1;
                }
            }
        }
        entries = Object.entries(countDictionary)
        entries.sort(custom);
        for (const [key, value] of entries) {
            sortedData[key] = value;
        }
    }
    $:  {
        countDictionaryTags = {};
        sortedDataTags = {};
        let arr = []
        for (const key in porTags()) {            
            arr = key.split(",")
            for(const ix in arr) {               
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
    $: console.log("%ccountdictionary","color: yellow",countDictionary)
    $: callAPI = ( key, title) => {
        
        console.log("call recomendador", key)
        async function obtenerKeyWords(  ) {
                console.log("%cobtenerKeyWords",'color: pink; font-size: 18px;', $titulo)
                let url =  'http://127.0.0.1:8100/matrizFrecuenciaTags?title='+ $titulo+ '&nres=20'; 
                //let url = (key == "sin") ? 'https://amago.pythonanywhere.com/matrizFrecuenciaTags?title='+ $titulo+ '&nres=20' : 'https://amago.pythonanywhere.com/matrizTags?title='+ $titulo + '&nres=20'                
                const respuesta = await fetch(url, 
                    {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                 }).then(response => response.json()) 
                    .then(data => {
                        $keywords = data.keywords;
                        $recomendadasKeywords = data.data;
                        console.log("%ckeywords",'color: green; font-size: 18px;',data, $keywords)                        
                    })
               
            .catch(error => {
                console.error('Error al cargar la plantilla:', error);
            });
        }
        async function obtenerDatosDesdeAPI(  ) {
                title = (title == "" || !title) ? "Con faldas y a lo loco" : title
                $titulo = title;
                let url = (key == "sin") ? 'http://127.0.0.1:8100/matriz?title='+ $titulo+ '&nres=20' : 'http://127.0.0.1:5000/matrizTags?title='+ $titulo + '&nres=20'                
                //let url = (key == "sin") ? 'https://amago.pythonanywhere.com/matriz?title='+ $titulo+ '&nres=20' : 'https://amago.pythonanywhere.com/matrizTags?title='+ $titulo + '&nres=20'                
                const respuesta = await fetch(url, 
                    {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                 }).then(response => response.json()) 
                    .then(data => {
                        $recomendadas = (key == "sin") ? data : $recomendadas;
                        $recomendadasTags = (key == "tags") ? data : $recomendadasTags;
                        $selectedTags= {tags:[],audio:[],generos:[],pais:[]};                                                                        
                        $searchTerm = "";
                        $filteredMovies = $recomendadas;
                        //console.log("%crecomendadas","color:orange, font-size:16px", $recomendadas);
                        obtenerKeyWords($titulo, 20); 
                    })
               
            .catch(error => {
                console.error('Error al cargar la plantilla:', error);
            });
                
        }

        // Llama a la función para obtener datos desde la API
        obtenerDatosDesdeAPI();
        
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
    
    <!-- Input para buscar películas por título -->
    <!--input type="text" bind:value={searchTerm} placeholder="Buscar películas"-->
    <MovieSearch /> 
    <!-- Lista de películas filtradas -->
    <div class="filters">
        <SortOptions options={['title',  'score', 'minutos', 'fecha']}  />
        <RangeFilter key="score" min={0} max={10}/>
        <!-- <RangeFilter key="scoreMax" min={0} max={10}/> -->
        
        <SvelteSlider key="votos" min={$minScore.votos} max={1000}/>
        <RangeFilter key="minutos" min={0} max={300}/>
        
        
        <!--FilterTags key="subtitulos"/-->
        <!-- <FilterTags key="pais"/> -->
     <!--    <FilterOptions /> -->
     <!--    <FilterTags key="tags"/> -->
        
    </div>
    <!-- <p class="resultados">{$filteredMovies.length} resultados</p> -->
    <Bubbles data={porTags()} key={"tags"}/>
    <Bubbles data={porGenero()} key={"generos"}/>
    <Bubbles data={porAudio()} key={"audio"}/>
    <p class="resultados">{$filteredMovies.length} resultados</p>

    <h3>    Si no te convence ninguna, haz click en la que más te haya gustado y te recomendamos algunas. </h3>
    
    {#if sortedData}
        <div class="keywords">
            {#each Object.entries(sortedData) as [ix, value]}
                <span>{ix} {value}</span>
                
            {/each}
        </div>
        {/if}
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
    <div class="catalogo" id="catalogo">
        <!--  "{isVisible ? "visible" : ""}"  -->
    {#if filteredResults.length>0}
        {#each filteredResults.sort(customSort) as movie}
            <div class="contenedor {movie.title}"
        
            on:mouseover={() => onMouseOver(movie.title)}
            on:click={callAPI("sin",movie.title)}
            on:keydown={callAPI("sin",movie.title)}
            on:mouseout={onMouseOut}
            on:focus={onMouseOut}
            on:blur={onMouseOut}>
            
            <div
            >
            <div class="column">
                <h2><a href="{movie.link}">{movie.title}</a></h2>
                <img class="pic" src="{movie.image}" alt="{movie.title}" />
           
                <p> <b style="font-weight: bold;">{movie.generos}</b>,
                {#if movie.availability}     
                    Disponible hasta {movie.availability},
                {/if}
                {movie.duracion},
                {#if movie.estreno}     
                    {movie.estreno},
                {/if}
                {movie.audio},
                puntuado {movie.score},
                <b style="font-weight: bold;">{movie.votos}</b> votos<br>
               
            </div>
           
            <div class="column">
                
                    <div class="keywords">
                        {#if $recomendadasKeywords[movie.title]}
                            {#each $recomendadasKeywords[movie.title] as ix}
                            <span class="key_catalogo">{ix}</span>
                            {/each}
                        {/if}
                    </div>
                </div>

            </div>
            <div class="tags">
                {#each movie.tags.split(",") as tag}
                    <span class="tag">{tag}</span>
                {/each}
            </div>
            
            <!--   {#if divResaltado === movie.title}
                <div class="info {movie.title}">{movie.sinopsis}</div>
                {/if} -->
            </div>
        {/each}
    {/if}
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
    .keywords .key_catalogo{
        background-color: var(--int-filmin-pink);
        font-size: 11px;
        margin: .25rem;
        font-weight: bold;
    }
    .header{
      background-color:var(--filmin-color-base);
      margin-top: 0;
    }

    h1 {
      text-align: center;      
      color: rgb(246, 243, 243);
      font-weight: bold;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
      padding: 1rem;
      -webkit-text-stroke: 2px var(--int-filmin-pink); /* Text stroke width and color (for Webkit browsers) */
      background-clip:border-box;  
      
    }

    h2 a{
        font-weight: 600;
        font-size: 1.25rem;
    }
    .reset{
        border: 2px solid red ;
        border-radius: 15px;
        padding: 1rem;
        background-color: whitesmoke;
        font-weight: bold;
        font-size: 1.25rem;
        width: auto;
    }
  
    input {
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      font-size: 1rem;
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
    .resultados, #resRecomendador, .recomendador{
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
        .contenedor {
            position: relative;
            cursor:pointer;
            background-color: var(--filmin-color-base);
            color: rgb(61, 57, 57);
            font-weight:300;
        }
        .contenedor a{
            color: var(--int-info);
            text-decoration: none
        }
        .contenedor > div{
            display: flex;
            flex-wrap: wrap;
            margin-top: -.625rem;
        }
        .info {          
            position: absolute;
            top: 0;
            left: 0;
            background-color: var(--int-info);  
            color: white;          
            font-weight: bold;
            width: 200px;
            font-size: .75rem;
            z-index: 9999;
            transform: translateY(-10px); /* Move the element 10px up initially */
            transition: opacity 0.3s ease, transform 0.3s ease;
            }
        .info.visible {            
            opacity: 1;
            transform: translateX(30px); /* Move the element back to its original position */
  }
  
  .pic{
    border-radius: 5px;
    
    width: auto;
    height: 80px;
    margin-left: .5rem;
    border: 2px solid white;
  }

  @media screen and (max-width: 768px) {
    .catalogo{
        flex-direction: row;
    }
        .catalogo >div{
            flex-basis: calc(100% - 20px); /* Restamos 20px para dejar espacio entre los divs */
            border: 1px solid var(--int-filmin-pink);/* rgb(246, 165, 231);*/
            border-radius: 5px;
            margin: 3px;
            
        }
        .contenedor>div h2{
            font-size: .75rem;
            width: 100%;
            text-align: left;
        }

        .contenedor>div h2 a{
            font-size: .75rem;
            margin: 5px;
            
            
                    }
        .column{
            flex:1;
            font-size: 12px;
            text-align: left;
        }
        .keywords{
            font-size: 12px;
        }
    }
  </style>
  