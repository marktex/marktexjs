// import reg from "./regexp";
/**
 * Horizontal Rules 水平分割线，示例：
 *      ---
 */
const reg = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;

export function hr(src, state) {
    //  hr: /^(?:([\-] ?)+)\1\1$/gm,
    // state.tokenize(reg.hr, "hr");

    const value = reg.exec(src);

    // let raw = value[0],
    //     index = value["index"],
    //     input = value["input"],
    //     map = [
    //         index, // start index
    //         index + raw.length - 1, // end index
    //         input.substring(0, index).split(/\n/).length, // line number
    //     ];

    // if (value) {
    //     let l = state.tokens.push({
    //         type: "hr",
    //         value: [...value],
    //         index,
    //         raw,
    //         map,
    //     });
    //     state.table[index] = l - 1;
    // }

    if (value) {
        // state.token('list', value, map, raw)
        let step = value[0].length;
        state.token("code", [ ...value], value[0], step);
        return step;
    }
    // return value ? [value[1].length, "li", [...value], value[0]] : null;
    return -1;
}

export default hr;
