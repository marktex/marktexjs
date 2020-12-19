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

        // global vars: 所有 rule 都匹配完才重置
        let $src, $position, walk, rules, retry;
        let stepMap = { 0: 0, [src.length - 1]: 0 },
            $stepMap;
        Object.keys(tower).forEach((level) => {
            // console.log("tower");
            ($src = src),
                ($position = 0),
                (walk = (n) => {
                    $position += n;
                    $src = $src.substring(n);
                });

            // local vars: $src 走完一趟即重置
            (rules = tower[level]),
                (retry = rules.length),
                ($stepMap = { 0: 0, [src.length - 1]: 0 });
            console.log({ rules });

            let startPosition, endPosition;
            let closestPosition, lastPosition;
            let token, step, raw, map;
            let nextStep, startMarkerStep, endMarkerStep;
            let i, rule;
            while ($src) {
                (closestPosition = -1), (lastPosition = $position);
                (nextStep = $stepMap[$position] || stepMap[$position]) &&
                    walk(nextStep);
                // console.log([nextStep]);
                // console.log({$position})
                for (i = 0, rule = rules[i]; i < rules.length; i++) {
                    if ($position < rule.index) {
                        continue;
                    } else {
                        rule.index = $position;
                    }
                    /**
                     * Token Format:
                     * {
                     *      type: String,
                     *      value: Array,
                     *      index: Number, // the $position where a rule applied
                     *      raw: String,
                     *      map: Array, // Format: [start position index relative to the $position, end position index relative to the $position]
                     *      step: Array | Number, // Format: [start marker step, end marker step] | step
                     * }
                     */
                    // 获取 token
                    if ((token = rule.apply($src, state))) {
                        token["index"] = $position;
                        // 收集 Token
                        state.tokenize(token);
                    } else {
                        // Do nothing
                        continue;
                    }

                    if (!(map = token.map)) {
                        continue;
                    } else if (!Array.isArray(map)) {
                        continue;
                    } else if (!Number.isInteger(map[0] || map[0] < 0)) {
                        continue;
                    } else if (!Number.isInteger(map[1] || map[1] < 0)) {
                        continue;
                    } else {
                        // [startPosition, endPosition] = map;
                        // map = map.map((item) => item + $position);
                        startPosition = $position + map[0];
                        endPosition = $position + map[1];
                        // 更新 rule.index
                        rule.index = endPosition;
                        if (
                            closestPosition < 0 ||
                            closestPosition > startPosition
                        )
                            closestPosition = startPosition;
                    }

                    // 更新 position
                    if (!(step = token.step)) {
                        continue;
                    } else if (Array.isArray(step)) {
                        [startMarkerStep, endMarkerStep] = step;
                        // 更新 position
                        Number.isInteger(startMarkerStep) &&
                            startMarkerStep > 0 &&
                            (stepMap[
                                startPosition
                            ] = startMarkerStep) /* &&
                            walk(startMarkerStep) */;
                        Number.isInteger(endMarkerStep) &&
                            endMarkerStep > 0 &&
                            (stepMap[
                                endPosition - endMarkerStep
                            ] = endMarkerStep);
                    } else if (Number.isInteger(step)) {
                        // step > 0 && walk(step);
                        $stepMap[startPosition] = step;
                    }

                    console.log([
                        token.index,
                        map,
                        step,
                        $position,
                        closestPosition,
                        $stepMap,
                        token.raw,
                    ]);
                }
                if (closestPosition > 0) {
                    walk(closestPosition - $position);
                }
                if (lastPosition === $position && !--retry) {
                    // console.log("walk(1)", [state.position, $position])
                    walk(1); // 前后两次位置不变时，尝试应用一遍所有规则，若仍未有位置移动，则强制前进 1, 以避免死循环
                    retry = rules.length;
                }
                // console.log([closestPosition, $position,$src]);
            }
        });

        /* 添加结尾哨兵 token */
        state.check(src.length);
        state.token("over", [], "", 0);

        // 解析文本段 token
        ($src = src), ($position = 0);
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
