import reg from "./regexp";

export function hr(state) {
    //  hr: /^(?:([\-] ?)+)\1\1$/gm,
    state.tokenize(reg.hr);

    // const value = reg.hr.exec(state.src);

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
}

export default hr;
