<script>
import * as Plot from "@observablehq/plot";
import { arc } from "d3-shape";

export let options;
//const d = options.x.corrMatrixDecades;
$: console.log(options);

let dataset = options;

// Calcular el total de los valores para obtener el ángulo total del gráfico
const totalValue = dataset.reduce((sum, d) => sum + d.value, 0);

// Crear una función generadora de arcos
const arcGenerator = arc()
  .innerRadius(0) // Radio interno del arco (0 para tener una tarta completa)
  .outerRadius(200); // Radio externo del arco (ajustar según el tamaño deseado)

// Generar los datos de los arcos para cada sección de la tarta
const pieData = arcGenerator(
  dataset.map((datum) => ({
    startAngle: 0,
    endAngle: (datum.value / totalValue) * 2 * Math.PI,
    data: datum,
  }))
);
$: console.log("pieData",pieData)

const piechart = Plot.plot({
    marks:[
        Plot.arc(pieData, {
      x: 200, // Posición horizontal del centro del gráfico
      y: 200, // Posición vertical del centro del gráfico
      innerRadius: 0, // Radio interno del arco (0 para tener una tarta completa)
      outerRadius: 100, // Radio externo del arco (ajustar según el tamaño deseado)
      fill: (d) => d.data.category,
      title: (d) => `${d.data.category} (${d.data.value})`, // Mostrar título con categoría y valor
    })
        
    ],
    width: 400, // Ancho del gráfico
    height: 400, // Alto del gráfico
});

function myplot(node) {          
        node.appendChild(piechart)        
    }

</script>

    
{#key dataset}
    
<div class="plot-container" use:myplot {...$$restProps}></div>

{/key}




<div id="heatmap"></div>
