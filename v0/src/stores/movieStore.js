// movieStore.js
import { writable } from 'svelte/store';
import {/*dataL,*/ dataF, seriesF} from "./data"


export const selectedTags = writable({tags:[],audio:[],generos:[],pais:[]});
export const selectedSortOption = writable([]);
export const recomendadas = writable([]);
export const recomendadasTags = writable([]);
export const minScore = writable({score:0, minVotos: 0,votos:0, scoreMax:10, votosMax:11600, minutos: 0});
export const searchTerm = writable('');
export const categoria = writable({series:false,peliculas:true})  

export const movies = writable(dataF);
export const series = writable(seriesF);
//export const moviesLastDays = writable(dataL);
export const generos = writable([]);
export const keywords = writable([]);
export const recomendadasKeywords = writable([]);

export const filteredMovies = writable(dataF);
export const filterGenresAnd = writable(false);
export const filterTagsAnd = writable(false);
export const filterAudioAnd = writable(false);
export const filterPaisAnd = writable(false);






export const titulo = writable();