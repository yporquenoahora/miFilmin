<script>
	import Chart from "./Chart.svelte"

    export let data;

    $: console.log("heatmap",data)
</script>

<main>
   

	<Chart {data}/>

</main>

<style>
	main {
		text-align: center;
		margin: 0 auto;
    font-family: "Inter", sans-serif;
    padding: 0 1em;
    max-width: 50em;
	}


	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 2em;
		font-weight: 100;
	}

</style>