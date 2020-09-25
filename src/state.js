import AST from "./ast";

export class State {
    constructor(src) {
        this.src = src;
        /**
         * Lexer#tokens: Array
         */
        this.tokens = [];
        /**
         * Lexer#map: Object
         */
        this.table = {}; // { [tokens[i].index]:i }
        // this.AST = AST;
        // this.ast = new AST('root', '', 0);
    }
}

export default State;
