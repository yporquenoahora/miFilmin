<script>
    export let title = '';
    export let subtitle = '';
    export let tipo = "";

  
</script>


<div class="header  {tipo}">
    {#if title}
      {#if tipo}
        <div class="title {tipo} ">{title}</div>
      {:else}
        <div class="title {tipo} ">{title}</div>
      {/if}
    {/if}
    {#if subtitle}
        <div class="subtitle">{subtitle}</div>
    {/if}
</div>


<style lang="scss">
  @import '../scss/config';

  .header {
    line-height: $lineHeightDefault;
    margin-bottom: 0.75rem;
    position: relative;
    &.p{
      width: 100%;
      height: 100%;
      background-size: contain;
      //background-image: url("./img/bananarama.jpg");
      background-color: black;
      color: white;
      height: 100vh;
       width: 100%;
      top: 0;
      left: 0;
    }
  }

  .title {
    padding-bottom: 0.0625rem;

    width: 90%;
    font-weight: 900;
    font-size: $font-size-xxxl;
    position: relative;
    margin: 0;
    @media screen and (max-width: 488px) {
      font-size: $font-size-xl;
    }
    &.p{
      font-size: 64px;
      text-align: center;
      margin: 140px;
     
      height: 100%;
      margin: 0;
      position: absolute;
      top: 50%;
      //left: 10%;
      @media screen and (max-width: 520px) {
       top: 20%
    }
    }
  }

  .subtitle {
    font-size: $font-size-m;
  }
</style>
