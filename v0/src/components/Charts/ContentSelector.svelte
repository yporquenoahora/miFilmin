<script>
    export let options = [];
    export let selectedOption = null;

    function handleClick(id) {
        selectedOption = id;
    }
</script>

<ul class="content-selector">
    {#each options as { id, label } (id)}
        <li
            class:active={selectedOption && selectedOption === id}
            on:click={() => handleClick(id)}
        >
            <span>
                {label}
            </span>
        </li>
    {/each}
</ul>

<style lang="scss">
    @import '../../../../../../_lib/es6/scss/fonts/fonts';
    @import '../scss/config';

    .content-selector {
        display: flex;
        margin: 0;
        padding: 0;
        color: $shade-dark;
        @include fontFamily('SpiegelSans4UI-Regular');
        font-size: 1rem;
        list-style-type: none;

        @media (prefers-color-scheme: dark) {
            color: $shade-dark-dark;
        }

        li {
            padding: 0 0.75rem 0.375rem 0.75rem;
            text-align: center;
            border-bottom: 1px solid;
            border-color: $shade-base;
            cursor: pointer;
            box-sizing: border-box;
            user-select: none;

            @media (prefers-color-scheme: dark) {
                border-color: $shade-base-dark;
            }

            &.active {
                color: $basic-black;
                border-bottom: 2px solid;
                border-color: $basic-black;

                @media (prefers-color-scheme: dark) {
                    color: $basic-white-dark;
                    border-color: $basic-white-dark;
                }
            }

            &:hover:not(.active) {
                color: $shade-darker;
                border-color: $shade-darker;

                @media (prefers-color-scheme: dark) {
                    color: $shade-darker-dark;
                    border-color: $shade-darker-dark;
                }
            }
        }
    }
</style>