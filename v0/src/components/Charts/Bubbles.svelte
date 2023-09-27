<script>    
	import { filteredMovies } from '@stores/movieStore.js';
	import { onMount, onDestroy } from 'svelte';
	import { generos, selectedTags } from '../../stores/movieStore.js';
    
    

    export let data =  [];
    export let key = "";
    //export let labels = ['Label A', 'Label B', 'Label C', 'Label D', 'Label E', 'Label F'];
   
    export let height = 300;
    let itemsToShow = 5;
    let elementWidth = 0; // Initialize with an initial value

    let targetElement; // Reference to the target element
    let show = []

    // Update elementWidth when the component is mounted
    // and when the target element's width changes due to resizing
    const updateElementWidth = () => {
        elementWidth = targetElement.offsetWidth;
    };

    onMount(updateElementWidth); // Initialize elementWidth when the component is mounted

    // Update elementWidth when the target element is resized
    const handleResize = () => {
        updateElementWidth();
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component is destroyed
    onDestroy(() => {
        window.removeEventListener('resize', handleResize);
    });
    
    
    const toggleSubCategory = (key)=> {
      if(show[key]) show[key] = false
      else show[key] = true
    }

    //$:data = data ? data : []
    $: sortedData = Object.entries(data).sort(customSort);
    $: sortedGenres = Object.entries(genre_counts).sort(customSort);
    
    const customSort = (a,b)=> {                        
               return a[1] < b[1];
            };
    const genresMap = {};
    
    /* const individualGenres = Object.entries(sortedData).map(([genre, count]) => ({
        genre,
        count
    }));    */      
    let genre_counts = {};

    $: {
        genre_counts = {};
        sortedData.forEach(entry => {
        
        let genres = entry[0].split(',');
        let count = entry[1]
        genres.forEach(genre => {
            if (genre in genre_counts)
                genre_counts[genre] += count
            else
                genre_counts[genre] = count            
        });
    });}
   

//$: console.log(sortedData,genre_counts, $generos, data)

    

    let activeIndex = -1; // -1 indica que no hay ningún panel abierto

  function togglePanel(index) {
    activeIndex = (activeIndex === index) ? -1 : index;
    //$selectedTags["generos"] = [];
    console.log(key, $selectedTags)
    if ($selectedTags[key].includes(index)) {
          $selectedTags[key] = $selectedTags[key].filter(opt => opt !== index);
        } else {
          $selectedTags[key] = [...$selectedTags[key], index];
        } 
    
  }

  function showMore() {
    // Incrementa la cantidad de elementos para mostrar    
    itemsToShow = (sortedGenres.length >= itemsToShow + 10) ? itemsToShow + 10 : sortedGenres.length; 
  }
    
   

  $: reset = ()=>{
    $selectedTags[key] = [];
  }
    
  </script>
    
  <!-- <button class="reset" on:click={()=> reset()}>RESET</button> -->

  <div class="chart" bind:this={targetElement}>
    {#each sortedGenres.slice(0, itemsToShow) as [key, value]}    
    <div class="bar-container" 
      height=" {height / data.length - 10}px"
      class:active={$selectedTags["generos"].includes(key) || $selectedTags["audio"].includes(key)|| $selectedTags["tags"].includes(key)}
      on:click={() => togglePanel(key)}
      on:keydown={togglePanel(key)}>
        <div class="label">{key}</div>
        <div
          class="bar"
          
        />
         <span class="valor"> &nbsp;{value}</span>
      </div>
     
    {/each}
    </div>
    {#if itemsToShow < sortedGenres.length}
      <button on:click={showMore}>Mostrar más ...</button>
    {/if}
  <style>
     
    .chart {
    display: flex;
    align-items: initial;
    height: auto;
    
    flex-wrap: wrap;
  }

  .valor{
    color: var(--int-font-color-default)
  }
  .reset, button{
    border: 2px solid rgb(104, 133, 110) ;
    border-radius: 15px;
    padding: .5rem;
    background-color: var(--filmin-color-base) ;
    font-weight: bold;
    font-size: 14px;
  }

  .bar-container {
    display: flex;
    align-items: center;
    margin: 10px;
    padding: 10px;
    border-radius: 1rem;
    background-color: var(--filmin-color-base) ;
    
  }
  .bar-container.active{
      background-color: rgb(255, 127, 221);
    }

  .bar-subcontainer {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    margin-left: 1.625rem;
    padding: 8px;
    border-radius: 1rem;
    background-color: pink;
    
  }
  .bar-subcontainer.active{
      background-color: rgb(255, 127, 221);
    }
  .fade-transition {
    transition: opacity 0.5s ease;
  }

  .bar {
    background-color: #d5f2e8;
    height: 20px;
    
  }

  .label {
    font-size: 12px;
    margin-right: 10px;
    color: var(--int-font-color-default)
    
  }
  .bar-subcontainer .label{
    width: 250px;
  }
  </style>