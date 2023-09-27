/*********************************************************************************************************************/
/**********                                          DER SPIEGEL                                            **********/
/**********                            Svelte Vite SCSS Template 'svelte-iframe'                            **********/
/*********************************************************************************************************************/

import { terser } from 'rollup-plugin-terser';
import { defineConfig } from 'vite';
import { ViteAliases } from 'vite-aliases';
import { createHtmlPlugin } from "vite-plugin-html";
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
// import { viteSingleFile } from './vite-plugin-sp-singlefile-v0.9.0';
import { viteSingleFile } from './vite-plugin-sp-singlefile-v0.11.1';

// https://github.com/vbenjs/vite-plugin-html


/*********************************************************************************************************************/
/**********                                     Projekt-Einstellungen                                       **********/
/*********************************************************************************************************************/

const htmlFile = "index.html";
const htmlFileDev = htmlFile;
const htmlData = {
    title: 'Catalog Filmin',
    injectScript: `<script type="module" src="/src/app.js"></script>`
};
const port = 1947;
const buildTarget = 'iframe'; // iframe|embed // default: iframe

/*********************************************************************************************************************/



const path = require('path');
const production = process.env.NODE_ENV === 'production';

const config = defineConfig({
    plugins: [
        svelte({
            emitCss: true,
            preprocess: sveltePreprocess(),
            compilerOptions: {
                dev: !production
            },
            hot: !production
        }),
        ViteAliases({
            allowLogging: false
        }),
        viteSingleFile({target: buildTarget}),
        createHtmlPlugin({
            minify: false,
            template: htmlFileDev,
            inject: {data: htmlData}
        })
    ],
    server: {
        host: false,
        port
    },
    build: {
        sourcemap: !production,
        target: 'esnext',//'es2022',
        minify: production ? 'terser' : false,
        assetsInlineLimit: 100000000,
        chunkSizeWarningLimit: 100000000,
        cssCodeSplit: false,
        brotliSize: false,
        outDir: path.resolve(__dirname, 'dist'),
        rollupOptions: {
            inlineDynamicImports: true,
            plugins: [
                terser({
                    compress: {
                        defaults: false,
                        drop_console: true
                    },
                    format: {
                        comments: false,
                        ecma: 2015
                    }
                })
            ],
            output: {
                // manualChunks: () => 'everything.js'
            },
            input: {
                index: path.resolve(__dirname, htmlFile)
                // about: path.resolve(__dirname, 'src/about.html')
            }/*,
			resolve: {
				alias: [{
					find: '@lib',
					replacement: "C:/WorkplaceGit/apps/_lib/es6"
				}],
				extensions: ['.mjs', '.js', '.svelte'],
				mainFields: ['svelte', 'browser', 'module', 'main']
			}*/
        },/*
        babel: {
            configFile: './.babelrc'
          }*/
    },
    css: {
        postcss: {
            plugins: [
                autoprefixer()
            ]
        }
    }
});

export default config;
