<script>
    import { onMount, onDestroy } from 'svelte';
    import { scaleTime, scaleLinear, max, line, curveMonotoneX } from 'd3';
    import { start2021 } from '@stores/fixedDates';

    import { isMobile } from '@stores/dimensions';

    import CoalitionsLegend from '@components/PollsLegend.svelte';
    import Canvas from '@components/Canvas.svelte';
    import PollDot from '@components/PollDot.svelte';
    import XAxis from '@components/XAxis.svelte';
    import YAxis from '@components/YAxis.svelte';
    import Marker from '@components/Marker.svelte';
    import Slider from '@components/Slider.svelte';

    import Switch from '@components/Switch.svelte';
    import {tweened} from "svelte/motion";
    import {coalitionOptions} from "@stores/data";

    export let polls = [];
    export let averagePartyData = [];
    export let parties;
    export let partyColors;
    export let coalitionsColors = [];
    export let coalitionAvg = [];
    export let startDate;
    export let endDate;
    export let coalitions;
    export let firstRender = false;
    const mobileXOffset = 20;
    const electionDay = new Date('2021-09-26');
    const beginDate = new Date("2017-06-21");

    let width = 0;
    let height = 0;
    let xScale;
    let markerX = null;
    let isHovered = false;
    let zoomX = true;
    let xDomain = (zoomX) ?  [start2021, electionDay] : [ beginDate,endDate];

    const padding = {
        top: 20,
        right: 20,
        bottom: 48,
        left: $isMobile ? mobileXOffset : 2
    };

    let maxMarkerLabelWidth = 0;
    let tid;
    let yScale;
    let ready = false;
    let tweenX = tweened(undefined, {duration: 300});

    tweenX.set(xDomain);

    const lineGenerator = line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(curveMonotoneX);
    
    function resetIsHovered() {
        clearTimeout(tid);
        tid = setTimeout(() => {
            isHovered = false;
        }, 3000);
    }

    function handleMouseMove(e) {
        const { clientX } = e;
        if (clientX < xScale.range()[0] || clientX > xScale.range()[1]) return;
        markerX = clientX;
        isHovered = true;
    }

    function handleMouseLeave() {
        markerX = xScale.range()[1];
        isHovered = false;
    }

    function handleTouchstart() {
        resetIsHovered();
    }

    function handleSliderChange(e) {
        markerX = e.detail.selected;
        isHovered = true;
        resetIsHovered();
    }

    onMount(() => {
        if (firstRender) {
            setTimeout(() => {
                ready = true;
            }, 600);
        } else {
            ready = true;
        }
    });

    onDestroy(() => {
        clearTimeout(tid);
    });

    $: startDate = (!zoomX) ? beginDate : start2021;

    $: fPolls = polls.filter(d => d.date >= beginDate && d.date <= endDate);

    $: {
        xScale = scaleTime()
            .domain([startDate, endDate])
            .range([padding.left, width - padding.right - (maxMarkerLabelWidth || 0)]);
        markerX = xScale.range()[1];
    }

    $: ready, yScale = scaleLinear()
        .domain([0, max(fPolls.map(d => Object.values(d.values)).flat())])
        .range([height - padding.bottom, padding.top]);

    $: averageLineData = polls.map(d => {
        const { data, ...rest } = d;
        console.log(d, data);
        const fData = data
            .filter(dd => dd.date >= startDate && dd.date <= endDate)
            .map(dd => {
                return {
                    ...dd,
                    x: xScale(dd.date),
                    y: yScale(dd.value)
                };
            });
        return {
            ...rest,
            data: fData
        };
    });
    console.log(averageLineData, polls);
    $: dotRadius = Math.max(2, Math.min(3, width / 200));

    $: xScale = scaleTime().domain($tweenX).range([padding.left, width - padding.right  ]);

    $: switchXAxis = () => {
        zoomX = !zoomX;
        xDomain = (zoomX) ? [start2021, endDate] :  [beginDate, endDate];

        padding.left = (!zoomX) ? 0: 0;
        padding.right = (!zoomX) ? 80: 50;

    }

    $: tweenX.set(xDomain);

</script>


<div class="polls-over-time">

    <CoalitionsLegend />
    <div class="switcher">
        <Switch bind:checked={zoomX} on:toggle = {switchXAxis}  ></Switch>
        {#if !zoomX}
            <span style="margin-right: 8px;">Seit Wahl 2017</span>
        {:else}
            <span style="margin-right: 8px;">Fokus auf 2021</span>
        {/if}

    </div>
    {#if (ready)}
    <div
        class="chart"
        bind:clientWidth={width}
        bind:clientHeight={height}
        on:mousemove={handleMouseMove}
        on:mouseleave={handleMouseLeave}
        on:touchstart={handleTouchstart}
    >

        <svg
            width={width}
            height={height}
        >
            {#each averageLineData as { party, data } (party)}
                <path
                    class="average-line"
                    d={lineGenerator(data)}
                    stroke={partyColors[party]}
                />
            {/each}
            <XAxis
                scale={xScale}
                y={yScale.range()[0]}
                ticksVisible={!isHovered}
            />
            <YAxis
                scale={yScale}
                x={xScale.range()[0]}
                width={xScale.range()[1] - xScale.range()[0]}
                tickOffset={$isMobile ? -mobileXOffset : 0}
            />
            {#if (markerX >= 0)}
                <Marker
                    x={markerX}
                    y={yScale.range()[0]}
                    maxWidth={width}
                    date={xScale.invert(markerX)}
                    data={averageLineData}
                    colors={partyColors}
                    isHovered={isHovered}
                    bind:maxMarkerLabelWidth={maxMarkerLabelWidth}
                />
            {/if}
        </svg>
    </div>
    {#if ($isMobile)}
        <Slider
            scale={xScale}
            value={markerX}
            on:change={handleSliderChange}
        />
    {/if}
    {/if}
</div>

<style lang="scss">
    .polls-over-time {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .chart {
        flex: 1;
        position: relative;
        width: 100%;
        overflow: hidden;
    }

    svg {
        position: absolute;
        z-index: 100;
    }

    .average-line {
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
    }
    .switcher{
        color: black;
        @media (prefers-color-scheme: dark) {
          color: white;
        }
    }
</style>