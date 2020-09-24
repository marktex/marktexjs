export default {
    input: "src/index.js",
    output: {
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
