<script>
    export let parties = [];
</script>

<ul class="parties-legend">
    {#each parties as { party, label, color } (party)}
        <li>
            <span class="color" style="background-color: {color};"></span>
            <span>{label}</span>
        </li>
    {/each}
</ul>

<style lang="scss">
    @import '../scss/fonts';
    @import '../scss/config';

    .parties-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin: 0;
        padding: 0;
        @include fontFamily('SpiegelSans4UI-Regular');
        font-size: 1rem;
        list-style-type: none;

        li {
            display: flex;
            align-items: center;
            gap: 0.25rem;

            .color {
                display: inline-block;
                width: 12px;
                height: 12px;
                border: none;
                border-radius: 2px;
            }
        }
    }
</style>