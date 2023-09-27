<script>    
	import { filteredMovies } from '@stores/movieStore.js';
	import { onMount, onDestroy } from 'svelte';
	import { generos, selectedTags } from './../../stores/movieStore.js';
    
    

    export let data =  [];
    //export let labels = ['Label A', 'Label B', 'Label C', 'Label D', 'Label E', 'Label F'];
   
    export let height = 300;

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
        
        let genres = entry[0].split(', ');
        let count = entry[1]
        genres.forEach(genre => {
            if (genre in genre_counts)
                genre_counts[genre] += count
            else
                genre_counts[genre] = count            
        });
    });}
   

//$: console.log(sortedData,genre_counts, $generos, data)

    $: combinaciones = ( key )=>{      
      let comb =  Object.entries(data).filter((ix,val) => ix[0].includes(key));
      
      let sinKey = comb.map( d => [d[0].replace(key, ""), d[1]]);
      
      let sinComasInicio = sinKey.map(d => [d[0].replace(/^, /, ''), d[1]]);
      let sinComasFin = sinComasInicio.map(d => [d[0].replace(/, $/, ''), d[1]]);
      
      let sinComasIntermedias = sinComasFin.map( d=> [d[0].replace(", ,", ","), d[1]])
      //console.log(key, sinComasIntermedias)
      return sinComasIntermedias;
      
    }

    let activeIndex = -1; // -1 indica que no hay ningún panel abierto

  function togglePanel(index) {
    activeIndex = (activeIndex === index) ? -1 : index;
    $selectedTags["generos"] = [];
    
    if ($selectedTags["generos"].includes(index)) {
          $selectedTags["generos"] = $selectedTags["generos"].filter(opt => opt !== index);
        } else {
          $selectedTags["generos"] = [...$selectedTags["generos"], index];
        } 
    console.log($selectedTags["generos"])
  }

  const toggleSubPanel = (index) => {
    activeIndex = (activeIndex === index) ? -1 : index;
    
    console.log("SUBPANEL",activeIndex, index,  $selectedTags["generos"])
    if(activeIndex){
      
      index.split(",").forEach(d => {
    
        if(!$selectedTags["generos"].includes(d.trim(" "))){
          $selectedTags["generos"].push(d.trim(""));
          
        }else{
          
          if(d!== index)
            $selectedTags["generos"] =  $selectedTags["generos"].filter(item => item !== d.trim(" "));
        }
        const targetDiv = document.getElementById('catalogo');
        targetDiv.scrollIntoView({ behavior: 'smooth' });
        $selectedTags["generos"] = $selectedTags["generos"];
    })

    }
    console.log($selectedTags["generos"])
    
  }

  $: reset = ()=>{
    $selectedTags.generos = [];
  }
    
  </script>
    
  <button on:click={()=> reset()}>RESET</button>

  <div class="chart" bind:this={targetElement}>
    {#each sortedGenres as [key, value]}    
    <div class="bar-container" 
      height=" {height / data.length - 10}px"
      on:click={() => togglePanel(key)}
      on:keydown={togglePanel(key)}>
        <div class="label">{key}</div>
        <div
          class="bar"
          style="width: {((value / elementWidth)*10)}%;"
        />
          &nbsp;{value}
      </div>
      {#each combinaciones(key).sort(customSort) as [key2, value2]} 
      {#if activeIndex === key}   
      <div class="bar-subcontainer" 
        class:fade-transition={activeIndex === key} 
        height=" {height / data.length - 10}px"
        on:click={() => toggleSubPanel(key2)}
        on:keydown={toggleSubPanel(key2)}
        >
          <div class="label">{key2}</div>
          <div
            class="bar"
            style="width: {((value2 / elementWidth)*10)}%;"
          />
            &nbsp;{value2}
        </div>
        {/if}
    {/each}
    {/each}
    </div>
  
  <style>
    .chart {
    display: flex;
    align-items: initial;
    height: auto;
    flex-direction: column;
  }

  .bar-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .bar-subcontainer {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    margin-left: 1.625rem;
    
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
    width: 150px;
  }
  .bar-subcontainer .label{
    width: 250px;
  }
  </style>