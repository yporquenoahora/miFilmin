<!-- SortOptions.svelte -->
<script>
    import {  selectedSortOption, recomendadas, categoria, keywords, 
      recomendadasKeywords, titulo, selectedTags, recomendadasTags, 
    searchTerm, filteredMovies} from "../stores/movieStore"
    import {getUrls, ENV} from "./../stores/diccionario.js"

    export let data = [];
    let isVisible = false;
    let divResaltado = null;
    
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

    function onMouseOver(div) {
        isVisible = true;
        divResaltado = div;
    }

    function onMouseOut() {
        isVisible = false;
        divResaltado = null;
    }
    
    
    $: callAPI = ( key, title) => {
        async function obtenerKeyWords(  ) {
                let url, urlTags;
                //console.log("%cobtenerKeyWords",'color: pink; font-size: 18px;', $titulo)
                urlTags = getUrls().urlsTags;
                url = (ENV == "local") ? 
                    ($categoria.peliculas) ? urlTags.peliculas.dev : urlTags.series.dev
                    : 
                    ($categoria.peliculas) ?  urlTags.peliculas.build : urlTags.series.build
                
                const respuesta = await fetch(url, 
                    {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                 }).then(response => {                    
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {

                        $keywords = data.keywords;
                        $recomendadas = data.data;
                        $recomendadasKeywords = data.keywords;
                        //console.log("%ckeywords",'color: green; font-size: 18px;',data, $recomendadas, $keywords)                        
                    })
               
            .catch(error => {
                console.error('Error al cargar la plantilla:', error);
            });
        }
        async function obtenerDatosDesdeAPI(  ) {
                title = (title == "" || !title) ? "Con faldas y a lo loco" : title
                $titulo = title;
                let url, urls;
                urls = getUrls().urlItems;
                url = (ENV == "local") ? 
                    ($categoria.peliculas) ? urls.peliculas.dev : urls.series.dev
                    : 
                    ($categoria.peliculas) ?  urls.peliculas.build : urls.series.build                
              
                
                const respuesta = await fetch(url, 
                    {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                 }).then(response => response.json()) 
                    .then(data => {                        
                        $recomendadas = data || $recomendadas;
                        $recomendadasTags = (key == "tags") ? data : $recomendadasTags;
                        $selectedTags= {tags:[],audio:[],generos:[],pais:[], keywords:[]};                                                                        
                        $searchTerm = "";
                        $filteredMovies = $recomendadas;
                        //refreshSelectedTags()
                       // console.log("%crecomendadas","color:orange, font-size:16px", $recomendadas);
                        obtenerKeyWords($titulo, 20); 
                    })
               
            .catch(error => {
                console.error('Error al cargar la plantilla:', error);
            });
                
        }

        // Llama a la función para obtener datos desde la API
        obtenerDatosDesdeAPI();
        
    }
  </script>
  {#if data.length>0}
  {#each data.sort(customSort) as movie}
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
                  {#if $recomendadas[movie.title]}
                      {#each $recomendadas[movie.title] as ix}
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
  <style lang="scss">
  h2 a{
    font-weight: 600;
    font-size: 1.25rem;
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

 .recomendador{
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

.contenedor{
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
.keywords .key_catalogo{
    background-color: var(--int-filmin-pink);
    font-size: 11px;
    margin: .25rem;
    font-weight: bold;
}
.tag{
    background-color: var(--int-info);
    font-size: 11px;
    margin: 2px;
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
@media screen and (max-width: 768px) {
.catalogo{
    flex-direction: row;
}
    .contenedor{
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