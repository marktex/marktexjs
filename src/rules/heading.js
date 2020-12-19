// import reg from "./regexp";
/**
 * 标题，示例：
 *      # h1 Heading
 *      ## h2 Heading
 *      ### h3 Heading
 *      #### h4 Heading
 *      ##### h5 Heading
 *      ###### h6 Heading
 *      # h1 Multi-line \
 *          Heading
 */
const reg = /^(\#{1,6}) +([^\#\n]+(?:\\\n)?)+\n/;

export function heading(src, state) {
    /* const cap = this.rules.block.heading.exec(src);
    if (cap) {
        return {
            type: "heading",
            raw: cap[0],
            depth: cap[1].length,
            text: cap[2],
        };
    }
 */
    // state.tokenize(reg.heading, "heading");
    // let value;
    // while ((value = reg.heading.exec(state.src))) {
    //     let raw = value[0],
    //         index = value["index"],
    //         input = value["input"],
    //         map = [
    //             index, // start index
    //             index + raw.length - 1, // end index
    //             input.substring(0, index).split(/\n/).length, // line number
    //         ];

    //     if (value) {
    //         let l = state.tokens.push({
    //             type: "heading",
    //             value: [...value],
    //             index,
    //             raw,
    //             map,
    //         });
    //         state.table[index] = l - 1;
    //     }
    // }
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
        let step = value[1].length+1;
        state.token("heading", [...value], value[0], step);
        return step;
    }
    // return value ? [value[1].length, "li", [...value], value[0]] : null;
    return -1;
}

export default heading;
