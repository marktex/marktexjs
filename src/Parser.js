import AST from "./ast";

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
            state: { src, tokens, table, ast },
        } = this;
        let stack = [],
            parent = ast,
            current;
        Object.keys(table).forEach((key) => {
            table[key].forEach((position) => {
                current = new AST(tokens[position]);

                const judge = (currMap, lastMap) =>
                    currMap[0] <= currMap[1] &&
                    lastMap[0] <= currMap[0] &&
                    currMap[1] <= lastMap[1];

                // console.log(
                //     // "stack",stack
                //     // parent.type,
                //     // current.type,
                //     // [parent.raw, current.raw],
                //     // judge(current.map, parent.map)
                // );
                // if(current.map[0]==231){
                //     console.log({current, parent}, judge(current.map, parent.map))
                // }
                // if (judge(current.map, parent.map)) {
                //     // not strict mode: $map[0] <= map[1]
                //     parent.children.push(current);
                //     stack.push(parent);
                //     parent = current;
                // } else {
                //     // current = parent;
                //     do {
                //         parent = stack.pop();
                //         if(current.map[0]==231){
                //             console.log({current, parent}, judge(current.map, parent.map))
                //         }
                //     } while (!judge(current.map, parent.map));
                //     parent.children.push(current);
                //     stack.push(parent);
                //     parent = current;
                // }
                while (!judge(current.map, parent.map)){
                    parent = stack.pop();
                }
                parent.children = parent.children || [];
                parent.children.push(current);
                stack.push(parent);
                parent = current;
            });
        });
        // console.log({stack})
        // console.log("parse:stack", JSON.stringify(stack));
        // console.log({parent}, stack[0].type, stack[0].children/* .map(item=>item.type) */);
        // ast.children = children;
        // let curr = stack.shift(),
        //     next;
        // while (stack.length) {
        //     next = stack.shift();
        //     curr.children.push(next);
        //     curr = next;
        // }
        state.ast = stack[0];

        return state;
    }
}

export default Parser;
