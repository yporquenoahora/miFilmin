<!-- MovieSearch.svelte -->
<script>    
    import { searchTerm } from '../stores/movieStore.js';
    
  </script>
  
  <div>
    <input type="text" bind:value={$searchTerm} placeholder="Buscar ...">
  </div>
  <style>
    /* Estilos CSS (opcional) */
   
  
    input {
      width: 50%;
      padding: 10px;
      margin-bottom: 10px;
      font-size: 16px;
    }
  
    div {
      border: 0px solid #ccc;
      
      
      border-radius: 5px;
    }
  </style>