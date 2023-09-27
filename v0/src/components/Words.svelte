<script>
    //import {cloud} from 'd3'
    //import { interpolatePiYG} from "https://cdn.skypack.dev/d3-scale-chromatic@3";
    import * as cloud from "d3-cloud";
    

    export let data;

    let width = 300, height = 100;
   


    $: layout = cloud()
      .size([width, height])
			.words(
				data.map(d => ({ text: d.label, size: (d.value*0.2) }))
			)
			.padding(1)
			.rotate(() => {
				return (~~(Math.random() * 6) - 3) * 30;
			})
			.font("Arial")
			.fontSize((d) => {
				return d.size;
			}) 

    </script>
    
    <div class="container">
      <!-- <WordCloud words={words}/> -->
      <div class="wsf-word-cloud" id="wsf-word-cloud" style="display:inline">
        {#if data && data.length}
       
          {#each layout.words() as entry, ix}          
          <span 
          style="font-size: {entry.size}px;color:{interpolatePiYG(entry.size % 3)};">
         
           {entry.text} {data[ix].value}
      </span>
         
          {/each}
        {:else}
        <p>lade Daten...</p>
        {/if}
      </div>

    </div>

    
<style lang="scss">
  .container{
    margin: 10%;
  }
</style>