<script>
	
    import * as Plot from "@observablehq/plot";
    import { timeFormat } from "d3-time-format";
       
    
    export let options;
    const d = options.x.dataSongsDecades || options.x.dataPersonal
    let orderByReleaseDate = d.sort((a,b)=> new Date(a["release_date"]) - new Date(b["release_date"]));
    orderByReleaseDate.map(d => d.format_release_date = new Date(d.release_date))
    //console.log("orderByReleaseDate", orderByReleaseDate);
    const formatX = timeFormat("%b"); 
    function myplot(node) {
        node.appendChild(
            Plot.plot({
                nice: true,
                grid: true,
                height: 380,               
                color: {legend:true, scheme: "category10" },
                x: {                                     
                    tickFormat: formatX , // Configura el formato de las etiquetas del eje x
                },
                y: { label: "energía" },
                marks: [
                    Plot.line(
                        orderByReleaseDate,
                        Plot.windowY({
                            k: 7,
                            x: "release_date",
                            y: "energy",
                            z: null,
                            title: (d) => d.names + " / " + d.artists + " / " + d.release_date,
                            stroke: "mode",
                            tip:true,
                            
                            strokeWidth: 2
                    }))
                ],
                tooltip: {
                    fill: "red",
                    stroke: "blue",
                    r: 8
                },
                caption: "Evolución de enerdía en canciones desde los 40"
                })
        )
    }
</script>


{#key options}
    <div class="plot-container" use:myplot {...$$restProps}></div>
{/key}

