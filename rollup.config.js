import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
// import { terser } from 'rollup-plugin-terser';

// const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/components/hy-img/index.tsx',
    output: {
        file: `assets/hy-img.js`,
        format: 'es',
        sourcemap: true
    },
    plugins: [
        typescript(),
        resolve(),
        commonjs(),
        // terser(),
    ],
};