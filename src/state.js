import AST from "./ast";
import Ruler from "./ruler";
import rules from "./rules";
import { curry } from "./util";

export class State {
    constructor(src, preset = null) {
        /**
         * Lexer#ruler: Ruler
         *
         * [[Ruler]] instance. Keep configuration of parse rules.
         */
        this.ruler = new Ruler(rules);

        /**
         * State#src: String
         */
        this.src = (preset && preset(src)) || src;

        /**
         * State#position: Number
         */
        this.position = 0;

        /**
         * State#tokens: Array
         */
        this.tokens = [];

        /**
         * State#table: Object
         */
        this.table = {}; // { [tokens[i].index]:i }

        // this.AST = AST;
        /**
         * State#ast: AST
         */
        this.ast = new AST({ type: "root", map: [0, this.src.length, 0] });

        /**
         * State#out: Array
         *
         * Used to output html string with method [].join("")
         */
        this.out = [];
    }

    get tower() {
        return this.ruler.tower;
    }

    get rules() {
        return this.ruler.rules;
    }

    /**
     *
     * @param {RegExp} regexp
     * @param {String} type
     * @param {Number} step 步长，规则匹配后游标应向后移动的距离，比如：`### 三级标题` 的步长为 4（前缀 `### `的长度）
     */
    tokenize(regexp, type = "", step = 0) {
        let value, raw, input, index, shadow, lines, row, col, map;
        let src = this.src;
        while ((value = regexp.exec(src))) {
            raw = value[0];
            input = value["input"];
            index = value["index"]; // start index
            shadow = index + raw.length; // 阴影，规则匹配后的作用范围， 比如：`### 三级标题` 的阴影为 8 （整个字符串的长度，也即 token.raw 的长度）
            // console.log(input, raw, shadow, index,input.substring(0, index), input.substring(0, index).split(/\n/))
            lines = input.substring(0, index).split(/\n/);
            row = lines.length; // line number
            col = lines.pop().length; // column number
            map = [index, shadow, row, col];

            if (value) {
                let l = this.tokens.push({
                    type,
                    value: [...value],
                    index,
                    raw,
                    map,
                    // step,
                });
                this.table[index] = l - 1;
            }
        }
    }

    /**
     * 装载 Token
     * @param {string} type such as 'hr', 'list', etc.
     * @param {array} value
     * @param {array} map Format: [start, end, line, offset]
     * @param {string} raw
     */
    token(type, value, raw = "", step=0) {
        const { src, position } = this;
        // console.log(
        //     type,
        //     src.length,
        //     position,
        //     [value[0]] /* , $src.substring(0, 6) */
        // );
        let lines = src.substring(0, position).split(/\n/),
            map = [
                position, // start position
                position + raw.length, // end position，也即阴影，规则匹配后的作用范围， 比如：`### 三级标题` 的阴影为 8 （整个字符串的长度，也即 token.raw 的长度）
                lines.length, // line number
                lines.pop().length, // column number
            ];
        let l = this.tokens.push({
            type,
            value: [...value],
            map, // [start, end, line, offset]
            raw,
            step,
        });
        // this.table[map[0]] = l - 1;
        this.table[position] = this.table[position] || [];
        this.table[position].push(l-1);
    }

    check(position = 0) {
        this.position = position;
    }
}

export default State;
