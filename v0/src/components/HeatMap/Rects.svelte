<script>
	import { scaleLinear } from 'd3-scale';
    import { getContext } from "svelte"
    
  
    const { scales } = getContext("Chart")

    export let data;

    $: console.log("HeatMap", data.length, x.range(), x(10), $scales.xScale.bandwidth())
    $: x = scaleLinear().domain([0,data.length]).range([0,600])
  </script>
  
  <svg width="600px" height="400px">
  
    {#each data as {label, value}, ix}

      <rect 
        x={x(ix)}
        width={$scales.xScale.bandwidth()}
        height={50}
        fill={$scales.colorScale(value)}       
        stroke-width = 0
      ></rect>
      <text font-size="11px" letter-spacing="8" writing-mode="tb" height="320" x="{x(ix)+5}" y="10" rotate="-90">{label}</text>
    {/each}
  
  </svg>
  
  <style>
      svg{
          width: 100%;
          height: 100%
      }
  </style>