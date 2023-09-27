<script>
	
    import * as Plot from "@observablehq/plot";
        
    export let options;  
 
 
    const d = (options.data) ? options.data : options;
    const params = (options.params) ? options.params : null;
    
    let color;
    

    let domain = (d)? ((params) ? d.map(d=>d.label) : null) : null;
    let orderByValue = (d) ?  d.sort((a,b) => b.value - a.value) : "";

    const getColor = ()=> {
        color = {
                    legend: (params) ? params.legend : false,                         
                    scheme: "RdBu"                    
                } 
        //domain = (d) ? ((options.params) ? d.map(d=>d.label) : null) : null;
    
        if (params)  
                if(params.legend)
                    if (domain) color.domain = domain;        
        return color;
    };

    //$: console.log(options, color)
   
    let barPlot = Plot.plot({
                //color: {legend: false},
                marginLeft: 160,
                marks: [
                    Plot.text(orderByValue, {
                        x: (d) => d.value + 2,//"value" , // Ajustar el valor de desplazamiento según tu preferencia
                        y: "label",
                        text: (d) => d.value.toString() ,
                        fill: "black",
                        textAnchor: "start",
                        lignmentBaseline: "middle",
                    }),
                    //Plot.ruleY([0]),
                    Plot.barX(
                        orderByValue.slice(0,50),
                      
                        { 
                            y: "label", 
                            x: "value",      
                            sort: {y: "-x"},
                            fill:"value",
                            inset: 0.5,
                            stroke:"value",
                            tip:true,
                           // scheme: "RdBu"
                            }
                    )
                ],
                color: getColor(),
                height: (params) ? params.h : 400,
                width: 551,
                y: {
                    label: null,
                    grid: (params) ? params.grid : false, // Mostrar líneas de la cuadrícula en el eje Y
                }
                });
                //Plot.ruleX([0])
    
 

    function myplot(node) {
        node.appendChild(barPlot)
    }
</script>


{#key options}
    <div class="plot-container" use:myplot {...$$restProps}></div>
{/key}

