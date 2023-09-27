<!-- FilterOptions.svelte -->
<script>
    import {  minScore, filteredMovies } from '../stores/movieStore.js';
    import {dataF} from "@stores/data.js"
    export let key, min, max;
   //  $:console.log($dataF, $dataF.map(d=>d.votos || 0 ))
   $: console.log(maxVotos) 
   //$minScore.votos = Math.min(...$filteredMovies.map(d=>d.votos));
   $:maxVotos = Math.max(...$filteredMovies.map(d=>(d.votos) ? parseInt(d.votos.split(" ")[0]) : 0 )) || 12000;
   
   
   $: if (key === "scoreMax") min = ($minScore.scoreMax >= $minScore.score) ? min : $minScore.score;
   //$: maxVal = $filteredMovies.filter(d => d.votos == $minScore.votosMax)
   
  </script>
  
  <div>
    
   
  
  </div>
  

  <div class="rangeContainer">
   
    
    {#if (key === "votos")}
    <span>{key} : {$minScore[key]}</span>
      <input type="range"
       class="custom-range"
        min="{0}"
         max="{maxVotos}" 
         step="1" 
         bind:value={$minScore[key]}  />      
        <span>{maxVotos}</span>
    {/if}  
      {#if (key === "minutos")}
      <span>{key} : {$minScore[key]}</span><br/>
        <input type="range" class="custom-range" min="{0}" max="{max}" step="1" bind:value={$minScore[key]}  />
      {/if}
      {#if (key === "score")}
      <span>Puntuación: {$minScore.score} - {$minScore.scoreMax}</span><br/>
      <div class="slider-container">
        
          <input type="range" class="custom-range" min="{0}" max="{$minScore.scoreMax}" step="1" bind:value={$minScore.score}  />
          <input type="range" class="custom-range" min="{$minScore.score}" max="{max}" step="1" bind:value={$minScore.scoreMax}  />
          </div>
      {/if}
     
    
  </div>

 

  
  <style >
   
   /* .rangeContainer{
      @extend %appDimensions;
      @extend %baseColors;
     
      margin-top: 1rem;
      
   } */
   .rangeContainer span{
    color:var(--int-font-color-credit);
   }

   .slider-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

   /* Style for the range input */
.custom-range {
  width: 70%; /* Set the width to fill its container */
  height: 20px; /* Set the height of the track */
  appearance: none; /* Remove default styling */
  margin: 1rem;

  /* Styling the track */
  background-color: var(--filmin-color-base);
  border-radius: 5px;
  outline: none; /* Remove focus outline */
}

/* Styling the thumb (slider handle) */
.custom-range::-webkit-slider-thumb {
  appearance: none; /* Remove default styling */
  width: 20px;
  height: 20px;
  background-color: black;
  border-radius: 5px;
  cursor: pointer;
  border: 2px solid black;
}

.custom-range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background-color: var(--int-font-color-shade-darker);
  border-radius: 5px;
  cursor: pointer;
}

</style>