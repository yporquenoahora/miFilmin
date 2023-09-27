<script>



    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { fade } from 'svelte/transition';
    import { forceSimulation, forceY, forceCollide, min, max } from 'd3';

    import { isMobile } from '@stores/dimensions';
    import { getDataFromDate } from '@utils/math';
    import { formatValue } from '@utils/format';

    import MarkerDot from '@components/MarkerDot.svelte';

    export let x = null;
    export let y = 0;
    export let maxWidth = 0;
    export let date;
    export let data = [];
    export let colors;
    export let isHovered = false;
    export let maxMarkerLabelWidth = 0;
    export let zoomX;
    export let isCoalitions;
    export let legendeColors;

    const tX = tweened(null, {duration: 200, easing: cubicOut});
    const tMinY = tweened(null, {duration: 200, easing: cubicOut});

    let label;
    let renderedLabels = [];
    let labelWidths = [];
    let labelHeights = [];

    $: labelOffset = $isMobile ? 27 : 20;

    $:tX.set(x);

    $: labels = data.map(d => {
        const { party, data: values, partyLabel } = d;
        const { y, value, accurateDate } = getDataFromDate(values, date);
        return {
            party,
            color: colors[party],
            fx: 0,
            y,
            fixedY: y,
            value,
            date: accurateDate,
            partyLabel
        };
    });



    $: labelWidth = label ? label.getBBox().width : 0;
    
    $: maxMarkerLabelWidth = max(labelWidths);
    $: maxMarkerLabelHeight = max(labelHeights);

    $: simulation = forceSimulation()
        .force('y', forceY().y(d => d.y))
        .force('collide', forceCollide()
            .radius(maxMarkerLabelHeight / 2.5)
            .iterations(2)
            .strength(1))
        .on('end', () => {
            renderedLabels = [...labels];
        });

    $: if (labels.length) simulation
        .nodes(labels)
        .alpha(0.8)
        .tick(300);

    $: tMinY.set(min(renderedLabels, d => d.fixedY));

    $: accurateDate = [...new Set(renderedLabels.map(d => d.date))][0];

</script>

<g
    class="marker"
    transform="translate({$tX || 0} 0)"
>
    <path
        class="marker-line"
        d="M0 {$tMinY || 0}V{y}"
        transition:fade|local={{duration: 200}}
    />
    <g
        class="marker-dots"
    >
        {#each renderedLabels as { party, y, fixedY, color, value, partyLabel }, i (party)}
            <MarkerDot
                y={y}
                fixedY={fixedY}
                color={(isCoalitions) ? legendeColors[i] :  color}
                label={partyLabel}
                value={value}
                bind:width={labelWidths[i]}
                bind:height={labelHeights[i]}
                {zoomX}
            />
        {/each}
    </g>
    {#if (accurateDate && isHovered)}
        <g
            class="marker-label"
            transform="translate(0 {y + labelOffset})"
            transition:fade|local={{duration: 200}}
        >
            <text
                bind:this={label}
                text-anchor={$tX < labelWidth / 1.5 ? 'start' : (maxWidth - $tX) < labelWidth / 1.5 ? 'end' : 'middle'}
            >
                {formatValue(accurateDate, 'day-month-year')}
            </text>
        </g>
    {/if}
</g>

<style lang="scss">
    @import '../../../../../../_lib/es6/scss/fonts/fonts';
    @import '../scss/config';

    .marker {
        position: absolute;
        z-index: 200;
    }

    .marker-line {
        stroke: $shade-darker;
        stroke-width: 1;

        @media (prefers-color-scheme: dark) {
            stroke: $basic-white-dark;
        }
    }

    .marker-label {
        text {
            @include fontFamily('SpiegelSans4UI-Regular');
            font-size: 1rem;

            @media (prefers-color-scheme: dark) {
                fill: $basic-white-dark;
            }
        }
    }
</style>