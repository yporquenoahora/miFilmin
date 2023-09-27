<!-- FilterOptions.svelte -->
<script>
    import { filteredMovies, selectedTags } from '../stores/movieStore.js';
    
    import { onMount } from 'svelte';


    export let genres = [];
    export let key = "generos";
    


    $: {
             
        genres = Array.from(new Set($filteredMovies.map((movie) => movie[key] ? movie[key].split(",") : "sin genero")));
        genres = genres.flat();
        genres = genres.map((p)=> p.trim())
        
        genres = genres.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    }
    onMount(() => {
        //console.log("$filteredMovies",$filteredMovies, key)
        genres = Array.from(new Set($filteredMovies.map((movie) => (movie[key] !== null) ? movie[key].split(",") : "")));
        genres = genres.flat();
        genres = genres.map((p)=> p.trim())
        
        genres = genres.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
        
       // let excluir = ["Festival", "Premios", "premios", "Subtítulos", "Cine"]
       // genres = genres.filter((value)=> excluir.every(s => !value.includes(s)))
       // console.log(genres)
    });
    
    let isOpen = false;

    function toggleDropdown() {
        isOpen = !isOpen;
    }

    function toggleOption(option) {
        console.log($selectedTags[key], option)
        if ($selectedTags[key].includes(option)) {
          $selectedTags[key] = $selectedTags[key].filter(opt => opt !== option);
        } else {
          $selectedTags[key] = [...$selectedTags[key], option];
        }
        
    }
  </script>
  
  <div>
    
  </div>
  <div class="dropdown" >
    <div class="selected-options" 
        on:click={toggleDropdown}
        on:keydown={toggleDropdown}>
        {$selectedTags[key].length > 0
            ? $selectedTags[key].join(', ')
            : 'Seleccionar ' + key
            }
    </div>
    
    {#if isOpen}
        <div class="options" class:active={isOpen}>
            {#each genres as genre}
                <label>
                    {genre}
                    <input type="checkbox"  checked={$selectedTags[key].includes(genre)} on:change={() => toggleOption(genre)} />
                 </label><br>
            {/each}
        </div>
    {/if}
</div>
  
  <style>
    .dropdown {
        position: relative;
        width: 80%;
        border: 1px solid #ccc;
        padding: 5px;
        background-color: white;
        margin-top: 1rem;
    }

    .selected-options {
        cursor: pointer;
        color: var(--int-font-color-default);
    }

    label{
        color: var(--int-font-color-default);
    }

    .options {
        position: absolute;
        top: 100%;
        left: 0;
        background-color: #fff;
        border: 1px solid #ccc;
        padding: 5px;
        z-index: 999;

        opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s, transform 0.3s;
    }

  
 
    .options.active {
        opacity: 1;
        transform: translateY(0);
    }
</style>