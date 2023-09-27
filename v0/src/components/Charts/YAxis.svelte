<script>
    export let scale;
    export let x = 0;
    export let width = 0;
    export let tickOffset = 0;

    const tickWidth = 5;

    $: ticks = scale.ticks(3);
    $: labelTicks = scale.ticks(3);
</script>

<g
    class="y-axis"
    transform="translate({x} 0)"
>
    <g class="y-axis-lines">
        {#each ticks as tick, i}
            <g
                class="y-axis-line"
                class:last={i === 0}
                transform="translate({i === 0 ? 0 : tickOffset} {scale(tick)})"
            >
                <path
                    d="M0 0H{i === 0 ? width : tickWidth}"
                />
                
            </g>
        {/each}
        {#each labelTicks as tick, i}
            <g
                class="y-axis-label"
                transform="translate({tickOffset} {scale(tick) - 5})"
            >
                <text class="background">
                    {tick}{i === labelTicks.length - 1 ? '%' : ''}
                </text> 
                <text>
                    {tick}{i === labelTicks.length - 1 ? '%' : ''}
                </text>   
            </g>
        {/each}
    </g>
</g>

<style lang="scss">
    //@import '../../../../../../_lib/es6/scss/fonts/fonts';
    @import '../../scss/config';

    .y-axis-line {
        path {
            fill: none;
            stroke: $shade-lighter;
            stroke-width: 1;

            @media (prefers-color-scheme: dark) {
                stroke: $basic-white-dark;
            }
        }

        &.last path {
            @media (prefers-color-scheme: dark) {
                stroke: $basic-white-dark;
            }
        }
    }

    .y-axis-label {
        text {
            @include fontFamily('SpiegelSans4UI-Regular');
            font-size: 1rem;
            fill: $basic-black;

            @media (prefers-color-scheme: dark) {
                fill: $basic-white-dark;
            }

            &.background {
                fill: $basic-white;
                stroke: $basic-white;
                stroke-width: 2;

                @media (prefers-color-scheme: dark) {
                    fill: $basic-black-dark;
                    stroke: $basic-black-dark;
                }
            }
        }
    }
</style>