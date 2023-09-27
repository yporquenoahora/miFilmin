import {derived} from 'svelte/store';
import {json} from 'd3-fetch';
import {params} from '@stores/params';


export const data = derived(params, async ($params, set) => {
    Promise.all([
        json($params.data)
    ]).then(([data]) => {

        const {meta, participants, sections} = data.json_output.chat;

        set({
            meta,
            participants,
            sections
        });
    });
});
