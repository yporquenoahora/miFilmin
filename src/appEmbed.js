import {getScriptTag} from "@lib/util/getCurrentScriptTag";
import App from './AppEmbed.svelte';

const scriptTag = getScriptTag(import.meta);
const dataParams = scriptTag.parentNode.getAttribute("data-params") || "{}";

new App({
    target: scriptTag.previousElementSibling,
    props: {
        "dataParams": JSON.parse(dataParams)
    }
});
