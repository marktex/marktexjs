// import { smartypants } from "./util";

// import AST from "./ast";
import Ruler from "./ruler";
import State from "./state";
import rules from "./rules";

// let rules = [
//     ["hr", hr],
//     ["heading", heading],
//     ["list", list],
//     // ["normalize", normalize],
//     // ["block", require("./rules/block")],
//     // ["inline", require("./rules/inline")],
//     // ["linkify", require("./rules/linkify")],
//     // ["replacements", require("./rules/replacements")],
//     // ["smartquotes", require("./rules/smartquotes")],
// ];

export class Lexer {
    static lex(state, options = {}) {
        let lexer = new Lexer(state, options);
        return lexer.lex();
    }

    constructor(state, options = {}) {
        // /**
        //  * Lexer#src: String
        //  */
        // this.src = src;
        /**
         * Lexer#state: State
         */
        // this.state = new State(this.preset(src));
        this.state = state;

        /**
         * Lexer#options: Object
         */
        this.options = options;
        // /**
        //  * Lexer#tokens: Array
        //  */
        // this.tokens = [];
        // /**
        //  * Lexer#map: Object
        //  */
        // this.map = {};
        /**
         * Lexer#ast: AST
         */
        // this.ast = new AST(this.preset(src), "root", "", 0);
    }

    /**
     * Lexer.prest(src)
     * @param {String} src
     */
    preset(src) {
        return src
            .replace(/\r\n?|\n/g, "\n") // Normalize newlines
            .replace(/\0/g, "\uFFFD") // Replace NULL characters
            .replace(/\t/g, "    "); // Replace tab with four blank space
    }

    /**
     * Parse.parse(state)
     */
    lex() {
        const {
            state,
            state: { src, tower, table, tokens },
        } = this;

        // for (let i = 0, l = rules.length; i < l; i++) {
        //     rules[i].apply(state);
        // }

        let $src, $pos, walk, rules;
        Object.keys(tower).forEach((level) => {
            // console.log("tower");
            ($src = src), ($pos = 0);
            walk = (n) => {
                $pos += n;
                $src = $src.substring(n);
            };

            rules = tower[level];

            let step = -1,
                retry = rules.length;
            while ($src) {
                rules.forEach((rule) => {
                    state.check($pos);
                    // console.log($pos, rule.name, retry);
                    if ((step = rule.apply($src, state)) > 0) {
                        walk(step);
                    }
                });
                if (state.position === $pos && !--retry) {
                    walk(1); // 前后两次位置不变时，尝试遍历所有规则，若仍未有位置移动，则强制前进 1, 一避免死循环
                    retry = rules.length;
                }
            }
        });

        /* 添加结尾哨兵 token */
        state.check(src.length);
        state.token("over", [], "", 0);

        // 解析文本段 token
        ($src = src), ($pos = 0);
        let last = 0,
            curr = 0,
            $tokens = [],
            lines = [];
        Object.keys(table)
            .map((item) => parseInt(item))
            .forEach((pos) => {
                table[pos].forEach((index) => {
                    let { step } = tokens[index];
                    curr = parseInt(pos);
                    if (last !== curr) {
                        // console.log({last, curr})
                        // pieces.push([last, curr]);
                        src.substring(last, curr)
                            .split(/(?<=[^\\]\n)/) // 前后两个 token 之间可能存在段落换行符，须拆分为多个段落
                            .forEach((text) => {
                                lines = src.substring(0, last).split(/\n/); // 获取行
                                $tokens.push({
                                    type: "text",
                                    map: [last, curr, lines.length],
                                    raw: text,
                                    step: text.length,
                                });
                                state.check(last);
                                state.token(
                                    "text",
                                    [
                                        last,
                                        curr,
                                        lines.length,
                                        lines.pop().length,
                                    ],
                                    text,
                                    text.length
                                );
                                last += text.length;
                            });
                    }
                    last = curr + step;
                });
            });
        // pieces.push([pieces[pieces.length-1][1], src.length]);
        // pieces.forEach(([start, end]) => {});
        // console.log($tokens.map(({ map, raw }) => [map, raw]));
        // state.tokens.push(...$tokens);

        return state;
    }
}

export default Lexer;
