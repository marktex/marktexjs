const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');

export default {
    input: "src/_index.js",
    output: {
        name: "marktex",
        file: "marktex.js",
        format: "umd",
    },
    plugins: [
        commonjs(),
        babel({
            exclude: "node_modules/**", // 只编译我们的源代码
            presets: [['@babel/preset-env', { loose: true }]]
        }),
    ],
};
