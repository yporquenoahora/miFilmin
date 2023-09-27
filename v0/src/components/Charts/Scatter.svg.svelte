<script>
	import { onMount, getContext } from 'svelte';

	//import { pos } from "./../stores/AssetdataStore";

	import {select, selectAll} from 'd3-selection';
	// import {scaleOrdinal, scaleLinear} from 'd3-scale';

	let {  data, xGet, yGet,  width, xScale, yScale, xDomain, xRange, height,padding} = getContext('LayerCake');

	export let xScaleC, yScaleC;
	// let localRange = scaleLinear().domain([25,$width]).range([0, 100]);

	// $: $xScale.domain(xScaleC.domain());
	let r = 1.4;
	let fill = '#000';
	let stroke = '#0cf';
	export let strokeWidth = 0;
	export let dx = 0;
	export let dy = 0;


	let selected = false, w;
	let  selection, notSel, position,posY;
	const epsilon = 0.39;

	onMount(()=>{

		const deleteWahlTagPoint = ()=>{
			select(".point:first-of-type").remove();
		}
		setTimeout(deleteWahlTagPoint, 1000);


	});
	// $: {
	// 	w =  ($width > 440) ? $width : 440;
	//
	// 	position = $pos.x + $padding.left;
	// 	posY = $pos.y;
	// 	notSel = selectAll(".marked").remove();
	// 	console.log(position, $width);
	// 	if(position < $width){
	//
	// 		selection = selectAll(".point")
	// 				.filter(function(){
	// 					const x = parseFloat(select(this).attr("cx"));
	// 					return ((x - epsilon) < position) && ((x + epsilon) > position);
	// 					})
	// 				.each(function(){
	// 					const point = select(this);
	// 					// console.log(position, point.attr("cx"), $width);
	// 					select(".scatter-group")
	// 							.append("circle")
	// 							.attr("class", "marked")
	// 							.attr("cx", parseFloat(point.attr("cx")) )
	// 							.attr("cy", parseFloat(point.attr("cy")))
	// 							.attr("fill", point.attr("fill"))
	// 							.attr("r", 3)
	// 							.attr("stroke", "white")
	// 							.attr("stroke-width", 0.5)
	// 							.attr("opacity", 1)
	// 							.attr("z-index", 3);
	//
	// 				});
	//
	// 		}else{
	// 			notSel = selectAll(".marked").remove();
	// 		}
	// }



</script>

<g class="scatter-group">

	{#each $data as d}
		{#each d.values as t, i}
			{yScaleC(t.value)}
			{#if yScaleC(t.value) < $height}
				<circle class="point {d.key}"
					cx={xScaleC(t.year) + (typeof dx === 'function' ? dx(xScaleC) : dx)}
					cy={yScaleC(t.value) + (typeof dy === 'function' ? dy(yScaleC) : dy)}
					value = {t.value}
					opacity = 0.3
					{r}
					fill = {d.color}
					stroke = {d.color}
					stroke-width={strokeWidth}
				/>

				{/if}


	{/each}
	{/each}
</g>

