import { defineConfig } from "rollup";
import typescript from 'rollup-plugin-typescript2'

export default defineConfig({
    input: {
        index: './src/index.ts',
    },
    output: [
        {
            format: 'es',
            dir: 'dist',
            entryFileNames: '[name].mjs'
        },
        {
            format: 'cjs',
            dir: 'dist',
            entryFileNames: '[name].js'
        }
    ],
    external: [
        'path',
        'fs',
    ],
    plugins: [
        typescript({
            tsconfig: 'tsconfig.json',
            useTsconfigDeclarationDir: true,
        }),
    ]
})