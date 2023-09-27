<script>    
      import {  minScore, filteredMovies } from '../../stores/movieStore.js';
    import {dataF} from "@stores/data.js"
    export let key, min, max;

    let applauseValue = 0;
    
    let applauseIncrement = 50;
  
    const applauseIcons = [
      '👏',
      '👏👏',
      '👏👏👏',
      '👏👏👏👏',
      '👏👏👏👏👏',
      '👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏',
      '👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏',
      // Agrega más iconos si es necesario
    ];

    $:maxVotos = Math.max(...$filteredMovies.map(d=>(d.votos) ? parseInt(d.votos.split(" ")[0]) : 0 )) || 12000;
   
   
   $: if (key === "scoreMax") min = ($minScore.scoreMax >= $minScore.score) ? min : $minScore.score;

    function incrementApplause() {
    if (applauseValue <= max) {
      applauseValue += applauseIncrement;
      $minScore["votos"] = applauseValue;
    }else{
      $minScore["votos"] = $minScore.votosMax;
    }
  }

  function decrementApplause() {
    if (applauseValue > 0) {
      applauseValue -= applauseIncrement;
      $minScore["votos"] = applauseValue;
    }
  }
  </script>
  
  <div class="applause-control">
    <div class="controls">
    <button on:click={decrementApplause}>-</button>
    <span>{$minScore.votos}</span>
    <button on:click={incrementApplause}>+</button>
  </div>
    <div class="applause-icon">{applauseIcons[Math.floor(applauseValue / applauseIncrement)]}</div>
    
  </div>

  
  <style>
      .applause-control {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .controls {
    display: flex;
    align-items: center;
  }
  .applause-icon {
    font-size: 1.275rem;
    margin: 0 10px;
  }
  span{
    padding: 1rem;
    min-width: 80px;
    text-align: center;
  }
  </style>
  