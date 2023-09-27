<!-- SortOptions.svelte -->
<script>
    import { movies, selectedSortOption} from "../stores/movieStore"
    import Checkbox from "./Checkbox.svelte";

    export let options = [];

        
    $: formatedOptions = options.map(d => {return {label: d,checked:false}})

  </script>
  
  <div class="ordenar">
      
      {#each options as option}
      <label class="custom-checkbox">
        <input type="checkbox" bind:group={$selectedSortOption} value={option} />
        <img src="./img/icons8-ordenar-16.png" alt="Unchecked" class="checkbox-image">
        {option}
      </label>
    {/each}
  </div>
  
  <style lang="scss">
  .ordenar{
   display: flex; 
   justify-content: center;
  }
  label{
    margin: 1rem;
  }
    /* Estilo para el contenedor del checkbox personalizado */
.custom-checkbox {
    display: inline-block;
    position: relative;
    cursor: pointer;
}

/* Estilo para el checkbox oculto */
.custom-checkbox input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

/* Estilo para la imagen del checkbox */
.checkbox-image {
    width: 20px; /* Ajusta el tamaño de la imagen según tus necesidades */
    height: 20px; /* Ajusta el tamaño de la imagen según tus necesidades */
}

.custom-checkbox input[type="checkbox"] + .checkbox-image {
    opacity: .5; /* Cambia la opacidad de la imagen cuando el checkbox está seleccionado */
}

/* Estilo para la imagen del checkbox cuando está seleccionado */
.custom-checkbox input[type="checkbox"]:checked + .checkbox-image {
    opacity: 1; /* Cambia la opacidad de la imagen cuando el checkbox está seleccionado */
}

  </style>