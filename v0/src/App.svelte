<script>
	
	
    //import {params} from "@stores/params";
    import { onMount } from "svelte";
    import {csv} from 'd3-fetch';
    import Papa from "papaparse";
    import {dataF, dataL, seriesF} from "@stores/data";
    import Header from "@components/Header.svelte";
    import Sources from "@components/Sources.svelte";
    import MovieCatalog from "@components/MovieCatalog.svelte";
      
    //const sources = $params.sources;

    import Image from '@components/Image.svelte'
    
    /*  let appData

    $: {      
        appData = dataL ? dataL : [];            
        console.log("appData > sections", appData);

     }  */

     onMount(async () => {
      const response = await fetch("data/catalogo-full.csv");
      const responseSeries = await fetch("data/data-full-series.csv");
      const text = await response.text();
      const textSeries = await responseSeries.text();
      

      // Parse the CSV data and store it
      // Parse the CSV data using PapaParse
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: results => {
          const data = results.data;                  
          dataF.set(data);
        }
      });

      Papa.parse(textSeries, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: results => {
          const data = results.data;
          seriesF.set(data);
        }
      });
      
      
      //console.log($dataF, $seriesF)
      
    });
    //$: console.log($dataF);
  
</script>
<!--TODO hover y ejemplo de canción de ese género-->


<div data-type="graphics-svelte-app">

    <!--Header title="Catálogo" tipo="p"/-->
    <MovieCatalog />
</div>

<style lang="scss">
  @import "scss/main.app";

  div[data-type="graphics-svelte-app"] {
    @extend %appDimensions;
    @extend %baseColors;
    @extend %baseFont;

    font-size: 1rem;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    margin: 10 auto;
    
    max-width: 764px; /* Ancho del contenedor */
    margin: 0 auto; /* Margen automático a la izquierda y derecha para centrarlo */
    text-align: center; /* Centra el contenido dentro del contenedor */
    border: 1px solid lightgray;
  }
</style>
