<script>
	import { getContext, createEventDispatcher } from 'svelte';
	import { quadtree } from 'd3-quadtree';

	const { data, xGet, yGet, width, height } = getContext('LayerCake');

	let visible = false;
	let found = {};
	let e = {};

	export let dataset = undefined;
	export let x = 'x';
	export let y = 'y';
	export let searchRadius = undefined;

	$: xGetter = x === 'x' ? $xGet : $yGet;
	$: yGetter = y === 'y' ? $yGet : $xGet;

	let RM;


	let dispatch = createEventDispatcher();
	function findItem (evt) {
		clearTimeout(RM);
		e = evt;

		const xLayer = `layer${x.toUpperCase()}`;
		const yLayer = `layer${y.toUpperCase()}`;

		const xLayerVal = (evt[xLayer] / (x === 'x' ? $width : $height)) * 100;
		const yLayerVal = (evt[yLayer] / (y === 'y' ? $height : $width)) * 100;

		found = finder.find(xLayerVal, yLayerVal, searchRadius) || {};

		// dispatch("evento", {highlightPoints});
		visible = (Object.keys(found).length > 0) && yLayerVal > 0;
	}

	const doMousemove = (evt) => {
		clearTimeout(RM);
		RM = setTimeout(()=>{
			findItem(evt);
		}, 10);
	}

	$: finder = quadtree()
		.extent([[-1, -1], [$width + 1, $height + 1]])
		.x(xGetter)
		.y(yGetter)
		.addAll(dataset || $data);

</script>

<style>
	.bg {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1000;
	}
</style>

<div
	class="bg"
	on:mousemove="{doMousemove}"
	on:mouseout="{() => {visible = false; }}"
></div>
<slot
	x={xGetter(found) || 0}
	y={yGetter(found) || 0}
	{found}
	{visible}
	{e}
></slot>
