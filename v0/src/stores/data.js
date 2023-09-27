import {derived} from 'svelte/store';
import {csv} from 'd3-fetch';
import {params} from '@stores/params';
import { writable } from "svelte/store";

export const data = derived(params, ($params) => {
    const { data, dataLast } = $params;
   
    return Promise.all([
        csv(data),
        csv(dataLast)
    ]).then(([dataFull, dataLast]) => {
        console.log("data params",dataFull, dataLast)
        return {
            data:dataFull, 
            dataLast: dataLast
        };
    }).catch((error) => {
        console.error("La promesa fue rechazada:", error);
      });
});

export const dataF = writable([]);//await csv("data/catalogo-full.csv")
export const dataL = writable([]);//await csv("data/dataUltimosDias.csv")
export const seriesF = writable([]);//await csv("data/data-full-series.csv")