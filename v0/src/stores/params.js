import {derived, writable} from 'svelte/store';
import {autoType} from 'd3-dsv';


const defaultParams = {
    data: 'data/data-full.csv',
    dataLast: "data/dataUltimosDias.csv",
    series: "data/data-full-series.csv",
    title: 'Los géneros más populares',
    subtitle: 'Playlist de los últimos 40 años',
    sources: 'Fuente: ...',
    embed: false,
    debug: false
};

export const embedParams = writable({});

export const params = derived(embedParams, ($embedParams, set) => {
    const urlParamsObj = new URLSearchParams(window.location.search);
    const urlParams = Object.fromEntries(urlParamsObj);
    const completeParams = {
        ...defaultParams,
        ...autoType(urlParams),
        ...autoType($embedParams)
    };
   
    set(completeParams);
});
