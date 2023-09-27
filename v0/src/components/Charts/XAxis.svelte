<script>
    import { fade } from 'svelte/transition';

    import { formatValue } from '@utils/format';
    export let scale;
    export let zoomX = true;
    export let y = 0;
    export let width;
    export let ticksVisible = false;

    const tickHeight = 5;

     $: ticks = scale.ticks(scale.range()[1] / 100);

     $: formatVal = (tick) => (!zoomX && (width < 895)) ?  formatValue(tick, 'year') : formatValue(tick, 'month-short')
</script>

<g
    class="x-axis"
    transform="translate(0 {y})"
>
    {#if (ticksVisible)}
        <g
            class="x-axis-ticks"
            transition:fade|local={{duration: 200}}
        >
            {#each ticks as tick, i}

                <g
                    class="x-axis-tick"
                    transform="translate({scale(tick)} 0)"
                >
                    <path
                        d="M0 0V{tickHeight}"
                    />
                    <text
                        y={4 * tickHeight}
                        text-anchor={i === 0 ? 'start' : scale.range()[1] - scale(tick) < 40 ? 'end' : 'middle'}
                    >

                        {formatVal(tick)}


                    </text>

                </g>
            {/each}
        </g>
    {/if}
</g>

<style lang="scss">
    @import '../../../../../../_lib/es6/scss/fonts/fonts';
    @import '../scss/config';

    .x-axis-tick {
        path {
            fill: none;
            stroke: $shade-lighter;
            stroke-width: 1;
            @media (prefers-color-scheme: dark) {
                stroke: $basic-white-dark;
            }
        }

        text {
            @include fontFamily('SpiegelSans4UI-Regular');
            width: 50px;
            font-size: 1rem;
            @media (prefers-color-scheme: dark) {
                fill: $basic-white-dark;
            }
        }
    }
</style>