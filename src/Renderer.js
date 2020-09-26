//

export class Renderer {
    static render(state, options = {}) {
        let renderer = new Renderer(state, options);
        return renderer.render();
    }
    constructor(state, options = {}) {
        /**
         * Renderer#state: State
         */
        this.state = state;
        /**
         * Renderer#options: options
         */
        this.options = options;
    }

    render() {
        const {
            state,
            state: { ast, out },
        } = this;

        // let node = ast,
        //     stack = [];
        // stack.push(node);
        // console.log(stack.length);
        let i, l, n;
        let stack = [ast];
        do {
            n = stack.shift();
            if(!n) continue;
            this.traverse(n);
            if (n.children && (l = n.children.length) > 0) {
                for (i = l; i > 0; i--) {
                    stack.push(n.children[i]);
                }
            }
        } while (stack.length);
        state.html = out.join("");
        return state;
    }

    traverse(node) {
        if (!node) return;
        const {
            state: { out },
        } = this;
        
        switch (node.type) {
            case "hr":
                out.push("<hr/>");
                break;
            default:
            // [TO DO]
        }
    }
}

export default Renderer;
