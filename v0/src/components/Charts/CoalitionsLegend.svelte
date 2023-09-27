<script>
    const svgDim = 14;
</script>

<div class="polls-legend">
    <div class="single-poll">
        <svg
            class="dot"
            width={svgDim}
            height={svgDim}
        >
            <circle
                cx={svgDim / 2}
                cy={svgDim / 2 + 1}
                r={3}
            />
        </svg>
        <span class="label">einzelne Umfrage</span>
    </div>
    <div class="average-poll">
        <svg
            class="line"
            width={svgDim}
            height={svgDim}
        >
            <path d="M2 {svgDim / 2 + 1}H{svgDim - 2}" />
        </svg>
        <span class="label">Durchschnitt</span>
    </div>
</div>

<style lang="scss">
    @import '../../../../../../_lib/es6/scss/fonts/fonts';
    @import '../scss/config';

    .polls-legend {
        display: flex;
        gap: 0.75rem;
        @include fontFamily('SpiegelSans4UI-Regular');
        font-size: 1rem;

        @media (prefers-color-scheme: dark) {
            color: $basic-white-dark;
        }

        & > div {
            display: flex;
            align-items: center;
            gap: 0.125rem;
        }

        circle {
            fill: $basic-black;
            stroke: none;

            @media (prefers-color-scheme: dark) {
                fill: $basic-white-dark;
            }
        }

        path {
            fill: none;
            stroke: $basic-black;
            stroke-width: 2;
            stroke-linecap: round;

            @media (prefers-color-scheme: dark) {
                stroke: $basic-white-dark;
            }
        }
    }
</style>