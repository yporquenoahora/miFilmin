import {derived, writable} from 'svelte/store';
import {autoType} from 'd3-dsv';


const defaultParams = {
    data: 'data/data-full.json',
    title: 'Zeile',
    subtitle: 'Unterzeile',
    sources: 'Quelle: ...',
    embed: true,
    debug: false
};

export const embedParams = writable({});

export const params = derived(embedParams, ($embedParams, set) => {
    const urlParamsObj = new URLSearchParams(window.location.search);
    const urlParams = Object.fromEntries(urlParamsObj);
    let completeParams = {
        ...defaultParams,
        ...autoType(urlParams),
        ...autoType($embedParams)
    };
    set(completeParams);
});
