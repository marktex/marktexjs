const reg = /^(\s+)/

export function parse(src) {
    // state.tokenize(reg, "list");

    // let value, raw, maker, input, index, shadow, lines, row, col, map;
    // let src = state.src;

    let value = reg.exec(src);
    // if(value) console.log(`${cnt++}:`, value[0])
    if (!value) return null;

    /* input = value["input"];

    index = value["index"]; // start index
    shadow = index + raw.length; // 阴影，规则匹配后的作用范围， 比如：`### 三级标题` 的阴影为 8 （整个字符串的长度，也即 token.raw 的长度）
    
    lines = input.substring(0, index).split(/\n/);
    row = lines.length; // line number
    col = lines.pop().length; // column number
    
    map = [index, shadow, row, col]; */

    // if (value) {
    //     state.token('list', value, map, raw)
    // }
    return value ? [value[1].length, "space", [...value], value[0]] : null;
}


export default parse;