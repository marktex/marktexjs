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
         * Lexer#ruler: Ruler
         *
         * [[Ruler]] instance. Keep configuration of parse rules.
         */
        this.ruler = new Ruler(rules);
        // this.ruler.push(rules);
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
        const { state, ruler:{rules} } = this;

        for (let i = 0, l = rules.length; i < l; i++) {
            rules[i].apply(state);
        }

        return state;
    }
}

export default Lexer;
