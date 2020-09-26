import AST from "./ast"

export class Parser {
    static parse(state, options = {}) {
        let parser = new Parser(state, options);
        return parser.parse();
    }

    constructor(state, options = {}) {
        /**
         * Parser#state: State
         */
        this.state = state;
        /**
         * Parser#options: options
         */
        this.options = options;
    }

    parse() {
        const {
            state,
            state: { tokens, table, ast },
        } = this;
        let children = [];
        Object.keys(table).forEach((key) => {
            let token = tokens[table[key]];
            switch (token.type) {
                case "hr":
                    children.push(new AST("hr", "hr", token));
                    break;
                default:
                // [TO DO]
            }
        });
        ast.children = children;
        return state;
    }
}

export default Parser;
