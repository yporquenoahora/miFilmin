<script>
    import { onMount, setContext } from "svelte"
    import { writable } from "svelte/store";
  
    import {csv} from "d3-fetch";
    import {scaleLinear,scaleBand} from "d3-scale"
    import {range, max, min} from "d3-array";
  
    import Rects from "./Rects.svelte"
   
    export let data;
  
   /*  $: data = writable({})
    $: data.set(dataset) */
    /*
      Dimensions
    */
    let width, height = 0
    const dimensions = writable({})
    $: dimensions.set({
      width,
      height
    })

  
    /*
      Scales
    */
    const scales = writable({})
    $: scales.set({
      xScale: scaleBand().domain(range(0,data.length)).range([0, $dimensions.width]),
      yScale: scaleBand().domain(range(1, 2)).range([0, $dimensions.height]),
      colorScale: scaleLinear().domain([1, 30, 50, 80, 125]).range([
        '#009fe4',
        '#00f3e5',
        '#efefef',
        '#ff6200',
        '#ff008c'
      ])
                                     
    });
  
    $: chartContext = {dimensions, scales, data}
    $: setContext("Chart", chartContext)
  </script>

  
  <figure>
    
    <div class = "chart-container"
      bind:offsetWidth={width}
      bind:offsetHeight={height}
    >
      <Rects {data}/>
    </div>
  </figure>
  
  
  <style>
    figure {
      display: block;
      position: relative;
      width: 100%;
      height: 30vh;
      min-height: 400px;
      margin: 0;
      user-select: none;
    }
  
    figure > * {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  </style>