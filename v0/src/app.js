//import {resize} from '@lib/controller/embedbridge.v0';
import {getScriptTag} from "@lib/util/getCurrentScriptTag";
import App from './App.svelte';
const scriptTag = getScriptTag(import.meta);

new App({
    target: scriptTag.previousElementSibling,//getScriptTag(import.meta).previousElementSibling,
    props: {}
});


// default: autoResize = true
// setter für andere Einstellung vorhanden
//resize();
