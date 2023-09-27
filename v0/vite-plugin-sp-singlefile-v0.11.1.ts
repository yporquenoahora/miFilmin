import { UserConfig, Plugin } from "vite"
import { OutputChunk, OutputAsset, OutputOptions } from "rollup"
import micromatch from "micromatch"

export type Config = {
    // Modifies the Vite build config to make this plugin work well. See `_useRecommendedBuildConfig`
    // in the plugin implementation for more details on how this works.
    //
    // @default true
    useRecommendedBuildConfig?: boolean
    // Remove the unused Vite module loader. Safe to do since all JS is inlined by this plugin.
    //
    // @default true
    removeViteModuleLoader?: boolean
    // Optionally, only inline assets that match one or more glob patterns.
    //
    // @default []
    inlinePattern?: string[]
    //
    // @default "iframe"
    target?: string
}

const defaultConfig = { useRecommendedBuildConfig: true, removeViteModuleLoader: true }

const getIIFE  = code => `(()=>{${code}})()`;

const getEmbedHTMLFragment = html => {
    // Doctype, SP-CSS und <head/> finden, um sie zu entfernen
    const rxHead = /<!DOCTYPE.+(?:\r?\n)*(?:\s*.+(?:\r?\n))*<\/head>(\r?\n)*/gmi
    // div svelte-app finden, um  dev-data-params zu entfernen
    const rxSvelteDiv = /\s*(<div class="graphics-svelte-wrap" data-type="svelte-app").+>/
    html = html.replace(rxHead, "");
    return html.replace(rxSvelteDiv, "$1>");
};

export function replaceScript(html: string, scriptFilename: string, scriptCode: string, removeViteModuleLoader = false): string {
    const reScript = new RegExp(`<script([^>]*?) src="[./]*${scriptFilename}"([^>]*)></script>`)
    const preloadMarker = '"__VITE_PRELOAD__"'
    const newCode = `<script>\n${getIIFE(scriptCode.replace(preloadMarker, "void 0"))}\n</script>`;

    let inlined = html.replace(reScript, "");

    const parts = inlined.split('<!-- js-placeholder -->');
    inlined = parts[0] + newCode + parts[1];
    // Parameter "import.meta" für Dev wichtig, in der Modul-losen Live-Variante ein Fehler
    // => aus kombinierten und minifizierten Code entfernen
    inlined = inlined.replace("(import.meta)", "()");

    // (_, beforeSrc, afterSrc) => `<script${beforeSrc}${afterSrc}>\n${newCode}\n</script>`)
    return removeViteModuleLoader ? _removeViteModuleLoader(inlined) : inlined
}

export function replaceCss(html: string, scriptFilename: string, scriptCode: string, isEmbed: boolean): string {
    const reCss = new RegExp(`<link[^>]*? href="[./]*${scriptFilename}"[^>]*?>`)
    const searchValue = isEmbed? "<!-- css-placeholder -->" : reCss;
    return html.replace(searchValue, `<style>\n${scriptCode}</style>`)
}

const warnNotInlined = (filename: string) => console.warn(`WARNING: asset not inlined: ${filename}`)

export function viteSingleFile({
                                   useRecommendedBuildConfig = true,
                                   removeViteModuleLoader = true,
                                   inlinePattern = [],
                                   target = "iframe"
    }: Config = defaultConfig): Plugin {

    console.log("Build für Target", target);
    const isEmbed = target === "embed";

    return {
        name: "vite:singlefile",
        config: useRecommendedBuildConfig ? _useRecommendedBuildConfig : undefined,
        enforce: "post",
        generateBundle: (_, bundle) => {
            const jsExtensionTest = /\.[mc]?js$/
            const htmlFiles = Object.keys(bundle).filter((i) => i.endsWith(".html"))
            const cssAssets = Object.keys(bundle).filter((i) => i.endsWith(".css"))
            const jsAssets = Object.keys(bundle).filter((i) => jsExtensionTest.test(i))
            const bundlesToDelete = [] as string[]
            for (const name of htmlFiles) {
                const htmlChunk = bundle[name] as OutputAsset
                let replacedHtml = htmlChunk.source as string
                for (const jsName of jsAssets) {
                    if (!inlinePattern.length || micromatch.isMatch(jsName, inlinePattern)) {
                        const jsChunk = bundle[jsName] as OutputChunk
                        if (jsChunk.code != null) {
                            bundlesToDelete.push(jsName)
                            replacedHtml = replaceScript(replacedHtml, jsChunk.fileName, jsChunk.code, removeViteModuleLoader)
                        }
                    } else {
                        warnNotInlined(jsName)
                    }
                }
                for (const cssName of cssAssets) {
                    if (!inlinePattern.length || micromatch.isMatch(cssName, inlinePattern)) {
                        const cssChunk = bundle[cssName] as OutputAsset
                        bundlesToDelete.push(cssName)
                        replacedHtml = replaceCss(replacedHtml, cssChunk.fileName, cssChunk.source as string, isEmbed);
                    } else {
                        warnNotInlined(cssName)
                    }
                }
                if(isEmbed){
                   replacedHtml = getEmbedHTMLFragment(replacedHtml);
                }
                htmlChunk.source = replacedHtml
            }
            for (const name of bundlesToDelete) {
                delete bundle[name]
            }
            for (const name of Object.keys(bundle).filter((i) => !jsExtensionTest.test(i) && !i.endsWith(".css") && !i.endsWith(".html"))) {
                warnNotInlined(name)
            }
        },
    }
}

// Optionally remove the Vite module loader since it's no longer needed because this plugin has inlined all code.
const _removeViteModuleLoader = (html: string) => {
    const match = html.match(/(<script type="module">[\s\S]*)(const (\S)=function\(\)\{[\s\S]*\};\3\(\);)/)
    // Graceful fallback if Vite updates the format of their module loader in the future.
    if (!match || match.length < 3) return html
    return html.replace(match[1], '  <script type="module">').replace(match[2], "")
}

// Modifies the Vite build config to make this plugin work well.
const _useRecommendedBuildConfig = (config: UserConfig) => {
    if (!config.build) config.build = {}
    // Ensures that even very large assets are inlined in your JavaScript.
    config.build.assetsInlineLimit = 100000000
    // Avoid warnings about large chunks.
    config.build.chunkSizeWarningLimit = 100000000
    // Emit all CSS as a single file, which `vite-plugin-singlefile` can then inline.
    config.build.cssCodeSplit = false
    // Avoids the extra step of testing Brotli compression, which isn't really pertinent to a file served locally.
    config.build.reportCompressedSize = false

    if (!config.build.rollupOptions) config.build.rollupOptions = {}
    if (!config.build.rollupOptions.output) config.build.rollupOptions.output = {}

    const updateOutputOptions = (out: OutputOptions) => {
        // Ensure that as many resources as possible are inlined.
        out.inlineDynamicImports = true
    }

    if (!Array.isArray(config.build.rollupOptions.output)) {
        updateOutputOptions(config.build.rollupOptions.output)
    } else {
        config.build.rollupOptions.output.forEach(updateOutputOptions)
    }
}
