<script>
import {select, selectAll } from 'd3-selection';
import * as Plot from "@observablehq/plot";
import {format} from "d3-format";
import { max, min, range} from "d3-array";
import { axisLeft, axisBottom} from "d3-axis";
import { scaleSequential, scaleLinear, scaleBand } from "d3-scale";

import { onMount } from 'svelte';

export let options;
const d = options.x.corrMatrixDecades;
console.log(d);
//let dataset = d;//d.map(({ id,analysis_url,release_date_year,format_release_date,names, track_href,artist, type, uri, genre,  ...rest }) => rest);


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


const margin  = {left: 100, top: 50, bottom:50, right: 50}
const types =  Object.keys(dataset[0]);

let buildData = () => {
        let array = [];
        
        types.map((d,i) => {
            
            const o = types.map((t) => ({
                
                t: t,
                n: d,
                value: dataset[i][t] * 100
            })
        )
            array = [...array,...o]
        })
        
        return array
        }
onMount(() => {

   
       let data = buildData();
        // Sample data for the heatmap
        

        // Set the dimensions of the heatmap
        const width = 800;
        const height = 400;
        
       let  y_scale = scaleBand().domain(types).range([height-margin.top, 0])
        
       let  x_scale = scaleBand()
        .domain(types)
        .range([0, width - margin.right - margin.left - 50])

        // Create the SVG element
        const svg = select("#heatmap")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

        const g = svg.attr('width', width - margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', 0)')

        g.append('g')
            .attr('transform', 'translate(0,' +  (height - margin.top) +')')
            .call(axisBottom(x_scale))
            .selectAll("text") 
            .style("text-anchor", "end") 
            .attr("dx", "-.8em") 
            .attr("dy", ".15em") 
            .attr("transform", "rotate(-65)" ); 
            
       g.append('g')
            .call(axisLeft(y_scale))

       let  color_scale = scaleLinear()
        .domain([0, 100])
        .range(['#ccc', '#e15759'])

        // Create the heatmap rectangles
        const rects = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr('x', (d) => x_scale(d.t) + margin.left)
        .attr('y', (d) => { return y_scale(d.n)})
        .attr('width', x_scale.bandwidth())
        .attr('height', (d) => 20)
        .attr('fill', (d) => color_scale(d.value))

        const text = svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr('x', (d) => x_scale(d.t) + margin.left + 5)
        .attr('y', (d) => { return y_scale(d.n) - 5})
        .attr("dy", "20px")
        .text(function(d) { return format(",.1f")(d.value); });

        console.log( [x_scale("danceability"), y_scale("tempo")], [x_scale("tempo"), y_scale("danceability")])
        console.log(data)



        
})
</script>



<div id="heatmap"></div>
