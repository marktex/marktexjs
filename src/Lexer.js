// import { smartypants } from "./util";

// import AST from "./ast";
import Ruler from "./ruler"
import State from "./state";
import hr from "./rules/hr";

let $rules = [
    ["hr", hr]
    // ["normalize", normalize],
    // ["block", require("./rules/block")],
    // ["inline", require("./rules/inline")],
    // ["linkify", require("./rules/linkify")],
    // ["replacements", require("./rules/replacements")],
    // ["smartquotes", require("./rules/smartquotes")],
];

export class Lexer {
    static lex(src, options = {}) {
        let lexer = new Lexer(src, options);
        return lexer.lex();
    }

    constructor(src, options = {}) {
        /**
         * Lexer#src: String
         */
        this.src = src;
        /**
         * Lexer#ruler: Ruler
         *
         * [[Ruler]] instance. Keep configuration of parse rules.
         */
        this.ruler = new Ruler();
        this.ruler.push($rules);
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
         * Lexer#state: State
         */
        this.state = new State(this.preset(src));
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
        const { rules } = this.ruler;

        for (let i = 0, l = rules.length; i < l; i++) {
            rules[i].apply(this.state);
        }

        return this.state.tokens
    }
}

export default Lexer;
