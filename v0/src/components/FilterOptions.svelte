<!-- FilterOptions.svelte -->
<script>
    import { selectedGenres, generos } from '../stores/movieStore.js';
    import { onMount } from 'svelte';
    import {dataF} from "@stores/data.js"

    export let genres = [];
    

    onMount(() => {
        genres = Array.from(new Set($dataF.map((movie) => movie.generos.split(","))));
        genres = genres.flat();
        genres = genres.map((p)=> p.trim())
        generos.set(genres);
        genres = genres.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    
    });
    
   
  </script>
  
  <div>
    <p>Seleccionar géneros:</p>
    {#each genres as genre}
      <label>
        <input type="checkbox" bind:group={$selectedGenres} value={genre} />
        {genre}
      </label>
    {/each}
  </div>
  