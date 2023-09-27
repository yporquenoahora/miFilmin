<script>
    import {params} from "@stores/params";
    import {data} from "@stores/data";
    import Header from "@components/Header.svelte";
    import Sources from "@components/Sources.svelte";

    const title = $params.title;
    const subtitle = $params.subtitle;
    const sources = $params.sources;

    $: {
        const appData = $data? $data.sections : [];
        console.log("appData > sections", appData);
    }

</script>


<div data-type="graphics-svelte-app">
    <Header {title} {subtitle}/>
    <Sources {sources}/>
</div>


<style lang="scss">
  @import "scss/main.app";

  div[data-type="graphics-svelte-app"] {
    @extend %appDimensions;
    @extend %baseColors;
    @extend %baseFont;
  }
</style>
