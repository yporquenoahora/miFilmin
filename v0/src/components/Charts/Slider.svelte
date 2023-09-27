<script>
    import { createEventDispatcher } from 'svelte';

    import { slidable } from '../actions/slidable';

    export let scale;
    export let value;

    const dispatch = createEventDispatcher();

    let pos;
    let sliding = false;

    function handleSlideStart() {
        sliding = true;
    }

    function handleSlide(e) {
        const newPos = pos + e.detail.dx;
        if (newPos < scale.range()[0] || newPos > scale.range()[1]) return;
        pos = newPos;
        dispatch('change', { selected: pos });
    }

    function handleSlideEnd() {
        sliding = false;
        dispatch('change', { selected: pos });
    }

    $: pos = value;
</script>

<div class="slider">
    <div class="slider-body">
        <div class="slider-range"></div>
            {#if (pos >= 0)}
                <div
                    class="slider-handle"
                    class:sliding
                    style="left: {pos}px;"
                    use:slidable
                    on:slidestart={handleSlideStart}
                    on:slide={e => handleSlide(e)}
                    on:slideend={handleSlideEnd}
                    on:click|stopPropagation>
                    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(10 16) rotate(180)">
                            <path d="M2 2L8 8L2 14" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
                        </g>
                    </svg>
                    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2L8 8L2 14" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
                    </svg>
                </div>
            {/if}
      </div>
</div>

<style lang="scss">
    @import '../../../../../../_lib/es6/scss/fonts/fonts';
    @import '../scss/config';

    .slider {
        position: relative;
        height: 70px;
        // margin-bottom: 0.8rem;
        --handle-width: 40px;
    }

    .slider-body {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .slider-range {
        width: 100%;
        height: 2px;
        background-color: $shade-lighter;
        @media (prefers-color-scheme: dark) {
            background-color: $shade-dark;
        }
    }

    .slider-handle {
        position: absolute;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        width: var(--handle-width);
        height: var(--handle-width);
        border: none;
        border-radius: 50%;
        background-color: $primary-base;
        cursor: pointer;
        user-select: none;
        transform: translateX(calc(-0.5 * var(--handle-width)));

        @media (prefers-color-scheme: dark) {
            background-color: $primary-base-dark;
        }

        svg path {
            stroke: $basic-white;

            @media (prefers-color-scheme: dark) {
                stroke: $basic-white-dark;
            }
        }
    }

    .slider-handle:not(.sliding) {
        transition: left 0.2s;
    }
</style>