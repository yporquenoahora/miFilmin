import {getScriptTag} from "@lib/util/getCurrentScriptTag";
import App from './App.svelte';
import {embedParams} from "@models/embedParams";

const scriptTag = getScriptTag(import.meta);
const dataParams = JSON.parse(scriptTag.parentNode.getAttribute("data-params") || "{}");

embedParams.add(dataParams);

new App({
    target: scriptTag.previousElementSibling,
    props: {}
});
