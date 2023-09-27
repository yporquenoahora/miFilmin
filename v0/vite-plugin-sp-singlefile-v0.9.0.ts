import {IndexHtmlTransformResult, IndexHtmlTransformContext, UserConfig, Plugin} from "vite";
import {OutputChunk, OutputAsset, OutputOptions} from "rollup";

// original: https://github.com/richardtallent/vite-plugin-singlefile

export type Config = {
    // Modifies the Vite build config to make this plugin work well. See `_useRecommendedBuildConfig`
    // in the plugin implementation for more details on how this works.
    //
    // @default true
    useRecommendedBuildConfig?: boolean
    // Remove the unused Vite module loader. Safe to do since all JS is inlined by this plugin.
    //
    // @default false
    removeViteModuleLoader?: boolean
    // Remove the unused Vite module loader. Safe to do since all JS is inlined by this plugin.
    //
    // @default "iframe"
    target?: string
}

const defaultConfig = {useRecommendedBuildConfig: true, removeViteModuleLoader: false};

export function viteSingleFile({
                                   useRecommendedBuildConfig = true,
                                   removeViteModuleLoader = true,
                                   target = "iframe"
                               }: Config = defaultConfig): Plugin {

    console.log("Build für Target", target);
    const isEmbed = target === "embed";
    const getIIFE  = code => `(()=>{${code}})()`;

    return {
        name: "vite:singlefile",
        config: useRecommendedBuildConfig ? _useRecommendedBuildConfig : undefined,
        transformIndexHtml: {
            enforce: "post",
            transform(html: string, ctx?: IndexHtmlTransformContext): IndexHtmlTransformResult {
                // Only use this plugin during build
                if (!ctx || !ctx.bundle) return html;

                if (isEmbed) {
                    // Doctype und SP-CSS und <head/> entfernen...
                    const rxHead = /<!DOCTYPE.+(?:\r?\n)*(?:\s*.+(?:\r?\n))*<\/head>(\r?\n)*/gmi
                    const rxSvelteDiv = /\s*(<div class="graphics-svelte-wrap" data-type="svelte-app").+>/
                    html = html.replace(rxHead, "");
                    html = html.replace(rxSvelteDiv, "$1>");
                }

                // console.log("\nHTML? mit head?\n", html, "\n");

                // Get the bundle
                for (const [, value] of Object.entries(ctx.bundle)) {

                    const o = value as OutputChunk;
                    const a = value as OutputAsset;

                    if (o.code) {

                        const jsCode = `<script>\n${getIIFE(o.code)}\n</script>`;
                        //console.log("\n>> o hello chunk > stores-code \n", jsCode, "\n\n");

                        const parts = html.split('<!-- js-placeholder -->');
                        html = parts[0] + jsCode + parts[1];

                        const reScript = new RegExp(`<script type="module"[^>]*?src="[./]*${o.fileName}"[^>]*?></script>`);
                        html = html.replace(reScript, "");
                        // Parameter "import.meta" für Dev wichtig, in der Modul-losen Live-Variante ein Fehler
                        // => aus kombinierten und minifizierten Code entfernen
                        html = html.replace("(import.meta)", "()");

                        // //const code = `<script type="module">\n//${o.fileName}\n${o.code}\n</script>`;
                        // const code = `<script>\n${getIIFE(o.code)}\n</script>`;
                        // // const inlined = html.replace(reScript, (_) => code);
                        // let inlined:string = html.replace(reScript, "");
                        // inlined = inlined.replace(/<!-- stores-placeholder -->/, code);
                        html = removeViteModuleLoader ? _removeViteModuleLoader(html) : html;

                    } else if (a.fileName.endsWith(".css")) {
                        const reCSS = new RegExp(`<link rel="stylesheet"[^>]*?href="[./]*${a.fileName}"[^>]*?>`);
                        const code = `<style>\n${a.source}\n</style>`;
                        if (isEmbed) {
                            html = html.replace(reCSS, (_) => "");
                            html = html.replace('<!-- css-placeholder -->', (_) => code);
                        } else {
                            html = html.replace(reCSS, (_) => code);
                        }
                    } else {
                        console.warn(`!!! asset not inlined: ${a.fileName}`);
                    }
                }
                return html;
            }
        }
    };
}

// Optionally remove the Vite module loader since it's no longer needed because this plugin has inlined all code.
const _removeViteModuleLoader = (html: string) => {
    const match = html.match(/(<script type="module">[\s\S]*)(const (\S)=function\(\)\{[\s\S]*};\3\(\);)/);
    // Graceful fallback if Vite updates the format of their module loader in the future.
    if (!match || match.length < 3) return html;
    return html.replace(match[1], '  <script type="module">').replace(match[2], "");
};

// Modifies the Vite build config to make this plugin work well.
const _useRecommendedBuildConfig = (config: UserConfig) => {
    if (!config.build) config.build = {};
    // Ensures that even very large assets are inlined in your JavaScript.
    config.build.assetsInlineLimit = 100000000;
    // Avoid warnings about large chunks.
    config.build.chunkSizeWarningLimit = 100000000;
    // Emit all CSS as a single file, which `vite-plugin-singlefile` can then inline.
    config.build.cssCodeSplit = false;
    // Avoids the extra step of testing Brotli compression, which isn't really pertinent to a file served locally.
    config.build.reportCompressedSize = false;

    if (!config.build.rollupOptions) config.build.rollupOptions = {};
    if (!config.build.rollupOptions.output) config.build.rollupOptions.output = {};

    const updateOutputOptions = (out: OutputOptions) => {
        // Ensure that as many resources as possible are inlined.
        out.inlineDynamicImports = true;
    };

    if (!Array.isArray(config.build.rollupOptions.output)) {
        updateOutputOptions(config.build.rollupOptions.output);
    } else {
        config.build.rollupOptions.output.forEach(updateOutputOptions);
    }
};
