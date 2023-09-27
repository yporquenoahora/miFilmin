<script>
    import { orderBy } from 'lodash-es';
    import { rollups, sum } from 'd3';

    import { showDetail } from '@stores/dimensions';

    import PartiesLegend from '@components/PartiesLegend.svelte';
    import Coalition from '@components/Coalition.svelte';

    export let coalitionOptions = [];
    export let averages = [];
    export let partyColors;

    let othersFactor = 1;

    $: lastAverage = averages.slice(-1)[0];

    $: others = averages.find(d => d.party === 'SONSTIGE');

    $: if (others && others.data && others.data.length) othersFactor = 100 / (100 - others.data.slice(-1)[0].value)

    $: options = coalitionOptions.map(c => {
        const { parteien: parties, label } = c;
        const partiesData = parties.map(party => {
            const { data, ...rest } = averages.find(d => d.party === party);
            const lastAverage = data.slice(-1)[0];
            return {
                ...rest,
                poll: {
                    ...lastAverage,
                    coalitionValue: lastAverage.value * othersFactor
                },
                color: partyColors[party]
            };
        });
        const sum = partiesData.reduce((acc, cur) => acc + cur.poll.coalitionValue, 0);
        return {
            id: label,
            label,
            sum,
            data: partiesData
        };
    });

    $: orderedOptions = orderBy(options, 'sum', 'desc');

    $: lastDate = [...new Set(options.map(d => d.data.map(dd => dd.poll.date)).flat())][0];

    $: parties = options.map(d => {
        return d.data.map(dd => {
            return {
                party: dd.party,
                label: dd.partyLabel,
                value: dd.poll.value,
                coalitionValue: dd.poll.coalitionValue,
                color: dd.color
            };
        })
    }).flat();

    $: condensedParties = orderBy(
        rollups(parties,
            v => sum(v, d => d.coalitionValue), d => d.party), d => d[1], 'desc').map(d => {
        const party = parties.find(dd => dd.party === d[0]);
        return party;
    });

</script>

<div class="coalition-options">
    {#if (lastDate)}
        <!--{#if ($showDetail)}-->
            <PartiesLegend
                parties={condensedParties}
            />
        <!--{/if}-->
        <div class="grid">
            {#each orderedOptions as { id, label, data, sum }, i (id)}
                <Coalition
                    label={label}
                    data={data}
                    sum={sum}
                    i={i}
                />
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
    @import '../../../../../../_lib/es6/scss/fonts/fonts';
    @import '../scss/config';

    .coalition-options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        height: 100%;
        color: $basic-black;
        @include fontFamily('SpiegelSans4UI-Regular');
        font-size: 1rem;

        @media (prefers-color-scheme: dark) {
            color: $basic-white-dark;
        }
    }

    //.explainer {
    //    align-self: flex-end;
    //}

    .grid {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
        padding-bottom: 2rem;
    }
</style>