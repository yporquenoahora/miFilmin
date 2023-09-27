<script>
    import { onMount, onDestroy } from 'svelte';
    import { scaleTime, scaleLinear, max, line, curveMonotoneX } from 'd3';
    import { start2021 } from '@stores/fixedDates';

    import { orderBy } from 'lodash-es';

    import { isMobile } from '@stores/dimensions';

    import PollsLegend from '@components/PollsLegend.svelte';
    import Canvas from '@components/Canvas.svelte';
    import PollDot from '@components/PollDot.svelte';
    import XAxis from '@components/XAxis.svelte';
    import YAxis from '@components/YAxis.svelte';
    import Marker from '@components/Marker.svelte';
    import Slider from '@components/Slider.svelte';

    import ContentSelector from '@components/ContentSelector.svelte';
    import {tweened} from "svelte/motion";

    import { isDarkMode } from '@stores/colors';


    export let polls = [];
    export let averagePartyData = [];
    export let parties;
    export let partyColors;
    export let startDate;
    export let endDate = new Date();
    export let isCoalitions;
    export let firstRender = false;
    export let legendeColors= [];
    const mobileXOffset = 20;
    const beginDate = new Date("2017-10-01");


    let width = 0;
    let height = 0;
    let xScale;
    let markerX = null;
    let isHovered = false;
    let zoomX = true;
    let xDomain = (zoomX) ?  [start2021, endDate] : [ beginDate,endDate];

    const padding = {
        top: 20,
        right: 20,
        bottom: 48,
        left: $isMobile ? mobileXOffset : 2
    };

    const contentOptions = [
        {
            id: 'seit2017',
            label: 'Seit Oktober 2017'
        },{
            id: 'fokus2021',
            label: 'Fokus auf 2021'
        }
    ];

    let maxMarkerLabelWidth = 0;
    let tid;
    let yScale;
    let ready = false;
    let tweenX = tweened(undefined, {duration: 300});
    let selectedContentOption = 'fokus2021';


    tweenX.set(xDomain);

    const lineGenerator = line()
        .x(d => d.x)
        .y(d => d.y || 50)
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

    $: fPolls =  polls.filter(d => d.date >= startDate && d.date <= endDate);

    $: {
        xScale = scaleTime()
            .domain($tweenX)
            .range([padding.left, width - padding.right - (maxMarkerLabelWidth || 0)]);
        markerX = xScale.range()[1];
    }

    $: ready, yScale = scaleLinear()
        .domain([0, max(fPolls.map(d => Object.values(d.values)).flat())])
        .range([height - padding.bottom + 20, padding.top]);


    $: averageLineData = averagePartyData.map(d => {
        const { data, ...rest } = d;
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

    $: dotRadius = Math.max(2, Math.min(3, width / 200));

    $: zoomX = selectedContentOption !== "seit2017";
    $: xDomain = (zoomX) ? [start2021, endDate] :  [beginDate, endDate];
    $: tweenX.set(xDomain);

    $: getLineColor = () => $isDarkMode ? '#fff' : '#000';

    $: paddingMobile = () => (isMobile) ? padding.left : 0;

    $: sort =  averageLineData.sort((a,b)=> {
        return (a.data[a.data.length - 1].value > b.data[a.data.length - 1].value) ?  -1 :  1
    });
</script>


<div class="polls-over-time">


    <div class="header-container">

        <ContentSelector
                options={contentOptions}
                bind:selectedOption={selectedContentOption}
        />

    </div>
        <PollsLegend {isCoalitions} series = {averagePartyData} {legendeColors}/>

    {#if (ready)}
    <div
        class="chart"
        bind:clientWidth={width}
        bind:clientHeight={height}
        on:mousemove={handleMouseMove}
        on:mouseleave={handleMouseLeave}
        on:touchstart={handleTouchstart}
    >
        {#if !isCoalitions}
        <Canvas
            width={width}
            height={height}
            padding = {padding}
            --position="absolute"
            --z-index="0"
        >
            {#each fPolls as { id, date, values } (id)}
                {#each parties as party}
                    <PollDot
                        x={xScale(date)}
                        y={yScale(values[party])}
                        radius={dotRadius}
                        alpha={isHovered ? 0.05 : ((zoomX) ? 0.3 : 0.1)}
                        color={partyColors[party]}
                        obj={{party, values}}
                        padding = {padding}
                    />
                {/each}
            {/each}
        </Canvas>
        {/if}
        <svg
            width={width}
            height={height}
        >
            {#each averageLineData as { party, data } ,i (party)}
                <path
                    class="average-line"
                    d={lineGenerator(data)}
                    stroke={(isCoalitions) ? legendeColors[i] : partyColors[party]}
                />
            {/each}
            <line
                    class="line50p"
                    x1= {padding.left }
                    x2={xScale.range()[1] - xScale.range()[0] + paddingMobile()}
                    y1={yScale(50)}
                    y2={yScale(50)}
                    stroke= {getLineColor()}
                    stroke-width= "1.3px"
                    stroke-linecap="round"
                    stroke-dasharray="2px"

            ></line>
            <XAxis
                scale={xScale}
                y={yScale.range()[0]}
                ticksVisible={!isHovered}
                {zoomX}
                {width}

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
                    {isCoalitions}
                    {legendeColors}
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
        overflow: visible;
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

</style>