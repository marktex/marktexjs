import reg from "./regexp";

export function heading(state) {
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
    state.tokenize(reg.heading);
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
}

export default heading;
