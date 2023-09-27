<script>
    import { orderBy } from 'lodash-es';

    export let label;
    export let data = [];
    export let sum;
    export let i = -1;

    let width;
</script>

<div
    class="coalition"
    bind:clientWidth={width}
>
    <div class="top-container">
        <div
            class="label"
        >
            {label}
        </div>
        <div
            class="fifty-percent"
            class:simple={i > 0}
        >
            {#if (i === 0)}
                <span>50%</span>
            {/if}
        </div>
    </div>
    <div
        class="bar-container"
    >
        <div class="bars">
            {#each orderBy(data, d => d.poll.value, 'desc') as { party, partyLabel, poll, color } (party)}
                <div
                    class="bar"
                    class:faint={Math.round(sum) < 50}
                    style="width: {poll.coalitionValue}%;
                           background-color: {color};"
                ></div>
            {/each}
            <div class="value-label">
                {Math.round(sum)}%
            </div>
            <div class="bar rest"></div>
        </div>
    </div>
</div>

<style lang="scss">
    @import '../../../../../../_lib/es6/scss/fonts/fonts';
    @import '../scss/config';

    .coalition {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        @include fontFamily('SpiegelSans4UI-Regular');

        .top-container {
            position: relative;
            width: 100%;
            height: 1rem;

            .label {
                position: absolute;
                bottom: 0;
                z-index: 20;
                margin: 0;
                padding: 0;
                font-size: 1rem;
                font-weight: normal;
                line-height: 1;
                background-color: $basic-white;

                @media (prefers-color-scheme: dark) {
                    background-color: $basic-black-dark;
                }
            }

            .fifty-percent {
                position: absolute;
                left: calc(50% - 0.375rem);
                bottom: -1.75rem;
                z-index: 1;
                width: 0.375rem;
                height: 0.5rem;
                border-right: 1px solid;
                border-bottom: 1px solid;
                border-bottom-right-radius: 2px;
                border-color: $basic-black;
                opacity: 0.8;

                @media (prefers-color-scheme: dark) {
                    border-color: $basic-white-dark;
                }

                &.simple {
                    border-bottom: none;
                    border-radius: 0;
                }

                span {
                    display: inline-block;
                    font-size: 0.75rem;
                    transform: translateX(calc(-100% - 0.25rem)) translateY(-20%);
                }
            }
        }
    
        .bar-container {
            position: relative;

            .bars {
                display: flex;
                align-items: center;
                width: 100%;

                .bar {
                    height: 1rem;
                    transition: width 0.2s ease-out;

                    &:first-of-type {
                        border-top-left-radius: 2px;
                        border-bottom-left-radius: 2px;
                    }

                    &:last-of-type {
                        border-top-right-radius: 2px;
                        border-bottom-right-radius: 2px;
                    }
                }

                .rest {
                    flex: 1;
                    background-color: $shade-lightest;

                    @media (prefers-color-scheme: dark) {
                        background-color: $shade-darkest;
                    }
                }

                .value-label {
                    padding-left: 0.5rem;
                    line-height: 1;
                    background-color: $shade-lightest;

                    @media (prefers-color-scheme: dark) {
                        background-color: $shade-darkest;
                    }
                }
            }
        }
    }

    .faint {
        opacity: 0.4;
    }
</style>