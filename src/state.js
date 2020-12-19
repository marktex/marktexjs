import AST from "./ast";
import Ruler from "./ruler";
import rules from "./rules";
import { curry } from "./util";

export class State {
    constructor(src, preset = null) {
        /**
         * 预处理
         */
        src = (preset && preset(src)) || src;

        /**
         * Lexer#ruler: Ruler
         *
         * [[Ruler]] instance. Keep configuration of parse rules.
         */
        this.ruler = new Ruler(rules);

        /**
         * State#src: String
         */
        this.src = src;

        /**
         * State#position: Number
         */
        this.position = 0;

        /**
         * State#cursor: Number
         */
        this.cursor = 0;

        /**
         * State#texts: Array
         *
         * Format: ["the text between 0 and cursor-1", "the text between cursor and src.length-1"]
         */
        this.texts = ["", src];

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
     * @param {Number} n
     */
    walk(n) {
        this.cursor += n;
        let [b, a] = this.texts;
        this.texts = this.src.split(
            new RegExp(`(?<=^[\\s\\S]{${this.cursor}})`)
        );
    }

    /**
     * 将 token.index, token.map[0], token.map[1] 由相对 position 转换为绝对 position
     * 补充 token.map[2], token.map[3]
     * @param {Object} token
     */
    tokenize({ type, step, value, index, raw, map }) {
        index = index + map[0];
        // shadow = index + map[1];
        // this.position = position;
        const { src } = this;
        // console.log(
        //     type,
        //     src.length,
        //     position,
        //     [value[0]] /* , $src.substring(0, 6) */
        // );
        let lines = src.substring(0, index).split(/\n/);
        // map = map || [
        //     position, // start position
        //     position + raw.length, // end position，也即阴影，规则匹配后的作用范围， 比如：`### 三级标题` 的阴影为 8 （整个字符串的长度，也即 token.raw 的长度）
        //     lines.length, // line number
        //     lines.pop().length, // column number
        // ];
        map = [
            index,
            index + map[1],
            lines.length, // line number
            lines.pop().length, // column number
        ];
        let l = this.tokens.push({
            type,
            step,
            value,
            index,
            raw,
            map,
        });
        // this.table[map[0]] = l - 1;
        this.table[index] = this.table[index] || [];
        this.table[index].push(l - 1);
    }

    /**
     * 装载 Token
     * @param {string} type such as 'hr', 'list', etc.
     * @param {array} value
     * @param {array} map Format: [start, end, line, offset]
     * @param {string} raw
     */
    token(type, value, raw = "", step = 0) {
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
        this.table[position].push(l - 1);
    }

    check(position = 0) {
        this.position = position;
    }
}

export default State;
