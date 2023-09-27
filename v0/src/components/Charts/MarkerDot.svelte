<script>
    import { tick } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    export let y = 0;
    export let fixedY = 0;
    export let radius = 4;
    export let color = '#000000';
    export let label;
    export let value;
    export let width = 0;
    export let height = 0;

    const tY = tweened(null, {duration: 200, easing: cubicOut});
    const tFixedY = tweened(null, {duration: 200, easing: cubicOut});
    const textMargin = 10;

    let labelElem;

    $: tY.set(y);
    $: tFixedY.set(fixedY);

    $: (async function () {
        await tick();
        width = labelElem ? labelElem.getBBox().width : 0;
    })();

    $: (async function () {
        await tick();
        height = labelElem ? labelElem.getBBox().height : 0;
    })();

    $: roundedValue = Math.round(value);
</script>

<g class="marker-dot">
    <g transform="translate(0 {$tFixedY})">
        <circle
            cx={0}
            cy={0}
            r={radius}
            fill={color}
        />
    </g>
    <g
        transform="translate({textMargin} {$tY + 5})"
    >
        <text
            class="background"
        >
            <tspan>{roundedValue}%</tspan> {label}
        </text>
        <text
            bind:this={labelElem}
            fill={color}
        >
            <tspan>{roundedValue}%</tspan> {label}
        </text>
    </g>
</g>

<style lang="scss">
    @import '../../../../../../_lib/es6/scss/fonts/fonts';
    @import '../scss/config';

    circle {
        stroke: none;
    }

    .marker-dot {
        text {
            @include fontFamily('SpiegelSans4UI-Regular');
            font-size: 1rem;

            tspan {
                @include fontFamily('SpiegelSans4UI-Bold');
            }

            &.background {
                fill: $basic-white;
                stroke: $basic-white;
                stroke-width: 5;

                @media (prefers-color-scheme: dark) {
                    fill: $basic-black-dark;
                    stroke: $basic-black-dark;
                }
            }
        }
    }
</style>