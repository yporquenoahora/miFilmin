// diccionario.js
import { writable } from 'svelte/store';
import {titulo} from "./movieStore.js"

let urls = {};

const unsubscribe = titulo.subscribe(titulo => {    
    urls = { 
        urlsTags :  {
            peliculas: {
                dev: "http://127.0.0.1:8100/matrizFrecuenciaTags?title="+ titulo+ "&nres=20",
                build: "https://amago.pythonanywhere.com/matrizFrecuenciaTags?title="+ titulo+ "&nres=20"
            },
          series: {
            dev: "http://127.0.0.1:8100/matrizFrecuenciaSeriesTags?title="+ titulo+ "&nres=20", 
            build: "https://amago.pythonanywhere.com/matrizFrecuenciaSeriesTags?title="+ titulo+ "&nres=20"
        }
    },
    urlItems : {
        peliculas: {
            dev: "http://127.0.0.1:8100/matriz?title="+ titulo+ "&nres=20",
            build: "https://amago.pythonanywhere.com/matriz?title="+ titulo+ "&nres=20"
        },
          series: {
            dev: "http://127.0.0.1:8100/matrizSeries?title="+ titulo+ "&nres=20", 
            build: "https://amago.pythonanywhere.com/matrizSeries?title="+ titulo+ "&nres=20"
        }
    }}
  });

  export function getUrls() {
    return urls;
  }

export const ENV = "build";