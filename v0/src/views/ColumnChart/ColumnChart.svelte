<script>

    import {scaleLinear } from 'd3-scale';
    import {max} from 'd3-array';

    //import {data} from "@stores/data";
    
    export let data;
    
    $: json_data = data;
    let renderedData = [];
   
    $:{        
        
        if(json_data){            
                json_data.forEach(d=> {                    
                    renderedData.push({
                        label:d.label,
                        value: d.value
                    })
            })
            renderedData.sort(function (a, b){
                return a.value - b.value;
            });
            renderedData.reverse();
        }

       
    }
    $: console.log("columnChart", json_data)
    let width = 200;
    let height = 150;
    let maxY, scaleY;
    $: console.log(renderedData, scaleY(50), maxY)
    //$: scaleX = scaleLinear().range([0,width]).domain([0,max(data, d=>d.value)]);
    $: {
        maxY = max(renderedData, d=>d.value);
        scaleY = scaleLinear().range([0,height]).domain([0,maxY]); 
    }

</script>



<div class="column-chart">
    <div class="legend">
        
    </div>
    <main>
        {#each renderedData as d}        
            <div style="display:flex; align-items: flex-end;">
                        <div class="label">{d.label}&nbsp{d.value}</div>
                        <div class="election" style="width: {scaleY(d.value)}px; background-color:pink">&nbsp;</div>
                        
                <div>
                    <!-- <div  class="lastResult" style="width: {width}"> {Math.round(d.value)}</div> -->
                </div>
            </div>
        {/each}

    </main>


   
</div>

<style src="./ColumnChart.scss"></style>

