import summary from 'rollup-plugin-summary';
import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export default {
    input: 'src/mini.js',
    output: {
        file: './build/mini.bundled.js',
        format: 'esm',
    },
    onwarn(warning) {
        if (warning.code !== 'THIS_IS_UNDEFINED') {
            console.error(`(!) ${warning.message}`);
        }
    },
    plugins: [
        replace({'Reflect.decorate': 'undefined', preventAssignment: true}),
        resolve(),
        terser({
            ecma: 2017,
            module: true,
            warnings: true,
            format: { comments: false },
            mangle: {
                properties: {
                    regex: /^__/,
                },
            },
        }),
        summary(),
    ],
};
