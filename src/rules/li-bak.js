// import reg from "./regexp";

/**
 * 列表， 示例：
 * 1）Unordered list
 *      * 1st-level list item
 *      ** 2nd-level list item
 *      *** 3th-level list item
 *      * 1st-level list item
 *      etc...
 * 2) Ordered list
 *      1. 1st-level list item with number one
 *      1.. 2nd-level list item with number one
 *      2)) 2nd-level list item with number two
 *      1... 3th-level list item with number one
 *      2. 1st-level list item with number two
 *      etc...
 * 3) incomplete list
 *      + 1st-level list item
 *      ++ 2nd-level list item
 *      etc...
 * 4) complete list
 *      - 1st-level list item
 *      -- 2nd-level list item
 *      etc...
 */
export const reg = /^([ \t]*)(\d+[\.\)]|[\*\+\-])[ \t]+([^\n]+(?:\\\n)?)+\n(?:\1[ \t]+(?:\d+[\.\)]|[\*\+\-])[ \t]+(?:[^\n]+(?:\\\n)?)+\n)*/;
// let cnt=0;
export function parse(src, state) {
    // state.tokenize(reg, "list");

    // let value, raw, maker, input, index, shadow, lines, row, col, map;
    // let src = state.src;

    let value = reg.exec(src);
    // console.log("li", value)
    // if(value) console.log(`${cnt++}:`, value[0])
    // if (!value) return null;

    /* input = value["input"];

    index = value["index"]; // start index
    shadow = index + raw.length; // 阴影，规则匹配后的作用范围， 比如：`### 三级标题` 的阴影为 8 （整个字符串的长度，也即 token.raw 的长度）
    
    lines = input.substring(0, index).split(/\n/);
    row = lines.length; // line number
    col = lines.pop().length; // column number
    
    map = [index, shadow, row, col]; */

    if (value) {
        // state.token('list', value, map, raw)
        let step = value[1].length+value[2].length+1;
        state.token("li", [...value], value[0], step);
        return step;
    }
    // return value ? [value[1].length, "li", [...value], value[0]] : null;
    return -1;
}

export function render(state) {}

export default parse;
