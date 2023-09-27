<script>
	
    import { movies, selectedSortOption} from "../stores/movieStore"
    import {dataF} from "@stores/data.js"
    export let label = '';
    export let isChecked = false;
    export let disabled = false;
    //export let selectedOption;
   
    const customSort = (a,b)=> {              
                for (const feature of $selectedSortOption) {
                    
                    if (a[feature] !== b[feature]) {
                        return b[feature] > a[feature] ? 1 : -1;
                    }
                }
                return 0; // Si todas las características son iguales
            };

    const toggleCheckbox = () => {      
        isChecked = !isChecked;
       
       if(isChecked) {
        $selectedSortOption.push(label)
        
      }else{
            let indice = $selectedSortOption.indexOf(label);
            if (indice !== -1) {
                let elemento = $selectedSortOption.splice(indice, 1)[0];            
            } 
        }
        $dataF.sort(customSort)
        console.log("checkbox", $selectedSortOption, $dataF)
    }
   
   
   
  </script>
  
  <label>
    <input class="checkbox " 
    type="checkbox" 
    bind:checked={isChecked} 
    disabled={disabled} 
    on:click={toggleCheckbox}
    
    />
    {label}
  </label>

  
  <style>
    label {
      display: flex;
      align-items: center;
      font-size: 1.25rem;
    }
    .checkbox {
    display: inline-block;
    padding: 10px;
    border: 1px solid #ccc;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .checkbox {
    background-color: lightgreen;
  }
  </style>
  