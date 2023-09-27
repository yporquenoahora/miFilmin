<script>
  export let checked = true;
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();


</script>

<style>


  .switch {
    position: relative;
    display: inline-block;
    width: 36px;
    height:12px;
    margin-top: 1px;

  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #989694;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 20px;

  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: -0.5px;
    border: 1px solid #989694;
    bottom: -3px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    background-color: #fff;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #000;
  }

  input:checked + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(20px);
    -ms-transform: translateX(20px);
    transform: translateX(20px);
    border: 1px solid #000;
  }
</style>


<!--<div>Zoom Axis</div>-->
    <label class="switch">
  <input type="checkbox"  on:click={() => dispatch('toggle')} checked={checked}/>
  <span class="slider" />


</label>