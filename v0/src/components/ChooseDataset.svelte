<script>
	  import { recomendadas } from './../stores/movieStore.js';
    import { categoria, selectedTags} from "../stores/movieStore"    
    export const label = '';
    export let isChecked = false;
    export const disabled = false;
    
    const toggleCheckbox = (e) => {      
      
       isChecked = !isChecked;
       $selectedTags = {tags:[],audio:[],generos:[],pais:[], keywords:[]}
       $recomendadas = [];
       
        $categoria[e.target.value] = true;
        if(e.target.value=="series") $categoria["peliculas"] = false;
        else $categoria["series"] = false
        
        
    }
   
    
   
  </script>
  

<div class="chooseDataset">
  <div class="labels">
  <label class="custom-radio">
    <input type="radio" name="options" value="series" checked={$categoria.series}
    on:change={toggleCheckbox} >
    <span class="radio-circle"></span>
    Series
  </label>
</div>
<div class="labels">
  <label class="custom-radio">
    <input type="radio" name="options" value="peliculas" on:change={toggleCheckbox} checked={$categoria.peliculas}>
    <span class="radio-circle"></span>
    Peliculas
  </label>
</div>
</div>
  <style>
    label {
      display: flex;
      align-items: center;
      font-size: 1.25rem;
    }
   
 
  .chooseDataset{
    display: flex;
    margin: 1rem;
  }
  .labels{
    display: flex;
    columns: 2;
  }
  /* Estilo para el contenedor del radio button personalizado */
.custom-radio {
    display: inline-block;
    position: relative;
    padding-left: 30px; /* Espacio para el radio button personalizado */
    margin-right: 15px;
    cursor: pointer;
    font-size: 16px;
}

/* Estilo para el radio button oculto */
.custom-radio input[type="radio"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

/* Estilo para el círculo del radio button personalizado */
.radio-circle {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: var(--filmin-color-base); /* Color de fondo cuando el radio button no está seleccionado */
    border-radius: 0%; /* Hace que el círculo sea redondo */
}

/* Estilo para el círculo del radio button cuando está seleccionado */
.custom-radio input[type="radio"]:checked ~ .radio-circle {
    background-color: var(--filmin-color-base); /* Color de fondo cuando el radio button está seleccionado */
}

/* Estilo para el punto dentro del radio button cuando está seleccionado */
.radio-circle:after {
    content: "";
    position: absolute;
    display: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background-color: white; /* Color del punto */
    border-radius: 0%; /* Hace que el punto sea redondo */
}

/* Estilo para el punto dentro del radio button cuando está seleccionado */
.custom-radio input[type="radio"]:checked ~ .radio-circle:after {
    display: block;
}

  </style>
  