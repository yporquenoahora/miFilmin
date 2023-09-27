<script>
    
    import * as Plot from "@observablehq/plot";
    
    export let options;
    const d = options.x.corrMatrixDecades;
    
    //let dataset = d.map(({ analysis_url, id, track_href,uri,type,  ...rest }) => rest);
    
    let dataset = d.map(d =>{
        return {
            danceability: d.danceability,
            energy: d.energy,
            key: d.key,
            loudness: d.loudness,
            mode: d.mode,
            speechiness: d.speechiness,
            acousticness: d.acousticness,
            instrumentalness: d.instrumentalness,
            liveness: d.liveness,
            valence: d.valence,
            tempo: d.tempo
        }
    })
    let keys = Object.keys(dataset[0])

    
    let matriz = ()=> {
        let array = [];
        keys.map((i,t)=>{            
            array[t] = Object.keys(d[t]).map((key) => {                
                return (key != "")  ? d[t][key] : null
            });            
            return array
        })
        let withoutFirstColumn = array.map((row) => row.slice(1))
        const convertedArray = withoutFirstColumn.map((row) =>
          row.map((element) => parseFloat(element))
        );
        return convertedArray
    }
    let M = matriz()

    // Filtrar la matriz para obtener solo los valores por encima o en la diagonal principal
    const heatmapTriangular = M.map((fila, i) => fila.slice(0, i + 1));
     
    
    const datosTriangular = [];
    for (let i = 0; i < heatmapTriangular.length; i++) {
        for (let j = 0; j < heatmapTriangular[i].length; j++) {
            datosTriangular.push({ i, j, value: heatmapTriangular[i][j] });
        }
    }

    // Función para formatear el contenido del tip
    const formatTipContent = (d) => `${keys[d.i]}\n${keys[d.j]}\nValor: ${d.value}`;

    const formatXAxisTick = (value) => keys[value];//`X-${value}`;

    const heatmap = Plot.plot({
        marks: [            
                Plot.cell(datosTriangular, {
                    x: "j", 
                    y: "i",
                    fill: "value", 
                    inset: 0, 
                    tip: true, 
                    xAxis: false,
                    yAxis: false,
                    marginLeft:100,
                    title: (d) => formatTipContent(d)
                }),
                Plot.text(datosTriangular, {
                    x: "j", 
                    y: "i",
                    text: "value",                     
                    inset: 0,
                    marginLeft:100,
                    title: (d) => formatTipContent(d)
                }),
                                       
        ],
        x: {
            label: null, // Puedes agregar una etiqueta para describir los datos del eje x
            values: null, // Índices de las columnas
            tickFormat: formatXAxisTick
        },
        y: {
            label: null, // Puedes agregar una etiqueta para describir los datos del eje y
            values:null, // Índices de las filas
            tickFormat: formatXAxisTick
        },
        
        color: { scheme: "blues" }, // Opcionalmente, puedes ajustar el esquema de color
        width: 900, // Ancho del gráfico
        height: 300, // Alto del gráfico
        marginTop: 30, // Margen superior del gráfico
        marginBottom: 30, // Margen inferior del gráfico
        marginLeft: 100, // Margen izquierdo del gráfico
        marginRight: 30
        });

    
  
    function myplot(node) {          
        node.appendChild(heatmap)        
    }
    
    </script>
    
    {#key dataset}
    
        <div class="plot-container" use:myplot {...$$restProps}></div>
        
    {/key}
    
    
    
    
    <div id="heatmap"></div>

    
    