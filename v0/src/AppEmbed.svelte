<script>

    import {params, embedParams} from "@stores/params";
    import Header from "@components/Header.svelte";
    import Sources from "@components/Sources.svelte";

    export let dataParams;

    console.log(">> data-params verhaften", dataParams);
    $embedParams = dataParams;

    const title = $params.title || "";
    const subtitle = $params.subtitle || "";
    const sources = $params.sources || "";

</script>


<div data-type="graphics-svelte-app">

    <Header {title} {subtitle}/>
    <Sources {sources}/>

</div>


<style lang="scss">
  @import "scss/main.app.embed";

  div[data-type="graphics-svelte-app"] {
    @extend %appDimensions;
    @extend %baseColors;
    @extend %baseFont;
  }

</style>
