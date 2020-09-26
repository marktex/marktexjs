import AST from "./ast";

export class State {
    constructor(src, preset = null) {
        this.src = (preset && preset(src)) || src;
        /**
         * Lexer#tokens: Array
         */
        this.tokens = [];
        /**
         * Lexer#table: Object
         */
        this.table = {}; // { [tokens[i].index]:i }
        // this.AST = AST;
        this.ast = new AST('root', '', 0);
    }

    tokenize(regexp, type='') {
        let value,
            index,
            input,
            src = this.src,
            raw,
            map;
        while ((value = regexp.exec(src))) {
            index = value["index"];
            input = value["input"];
            raw = value[0];
            map = [
                index, // start index
                index + raw.length - 1, // end index
                input.substring(0, index).split(/\n/).length, // line number
            ];

            if (value) {
                let l = this.tokens.push({
                    type,
                    value: [...value],
                    index,
                    raw,
                    map,
                });
                this.table[index] = l - 1;
            }
        }
    }
}

export default State;
