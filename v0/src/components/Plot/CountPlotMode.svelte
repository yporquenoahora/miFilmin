<script>	
    import * as Plot from "@observablehq/plot";
    
    export let options;
    console.log("options",options);
    const d = options.x.dataSongsDecades  || options.x.dataPersonal
    
    const freq = new Map();
    d.forEach(value => {
      const count = freq.get(value.mode) || 0;
      freq.set(value.mode, count + 1);
    });

    function myplot(node) {
        node.appendChild(
            Plot.plot({
                marks: [
                    Plot.barY(
                        d,
                        Plot.groupX(
                            { y: "count" }, 
                            { 
                            x: "mode", 
                            y: "count", 
                            sort: { x: "y", reverse: false }, 
                            fill: "orange",
                            filter: null 
                            }
                        ),
                        
                    )
                ],
                height: 150,
                marginLeft: 50,
                width: 200
                })
        )
    }
</script>


{#key options}
    <div class="plot-container" use:myplot {...$$restProps}></div>
{/key}

