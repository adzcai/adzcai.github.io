import type { UserConfig } from 'vite'
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await'

export default {
    plugins: [
        wasm(),
        topLevelAwait()
    ]
} satisfies UserConfig;
