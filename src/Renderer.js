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

        let stack = [ast];

        /* let n, i, c;
        do {
            n = stack.shift();
            this.traverse(n);
            // let ret = this.fn(n);

            if ((c = n.children) && c.length > 0) {
                // while ((i = c.shift())) {
                //     stack.push(i);
                // }
                stack.push(...c);
                // console.log(
                //     stack,
                //     stack.length,
                //     // stack.map((item) => item.type)
                // );
            }
        } while (stack.length > 0);
        state.html = out.join(""); */
        state.html = this.r(ast);
        return state;
    }

    r(ast) {
        if (!ast) return "";

        const t = this.t(ast);

        let { children } = ast,
            pieces = [];
        if (Array.isArray(children)  && children.length) {
            // stack.push(ast);
            pieces = children
                .map((node) => {
                    return this.r(node);
                });
        }
        return pieces.length ? t(pieces) : t();
    }

    t({ type, value, raw }) {
        if (!type) return;

        let tag;
        // console.log({type})
        switch (type) {
            case "hr":
                return () => `<hr/>`;
            case "heading":
                tag = `h${value[1].length}`;
                return (pieces = [value[2]]) => `<${tag}>${pieces.join("")}</${tag}>`;
            case "list":
                // out.push("<hr/>");
                tag = `${/(\d+[\.\)])/.exec(value[2])?'ol':'ul'}`;
                return (pieces=[])=>`<${tag}>${pieces.join("")}</${tag}>`;
            case "li":
                // out.push("<hr/>");
                // tag = `li`;
                return (pieces=[])=>`<li>${pieces.join("")}</li>`;/* <span>${value[3]}</span> */
            case "text":
                // out.push("<hr/>");
                // tag = `li`;
                return ()=>`<p>${raw}</p>`;
            default:
                return (pieces = []) => `${pieces.join("")}`;
            // [TO DO]
        }
    }

    traverse({ type, value }) {
        if (!type) return;
        const {
            state: { out },
        } = this;

        switch (type) {
            case "hr":
                out.push(`<hr/>`);
                break;
            case "heading":
                let tag = `h${value[1].length}`;
                out.push(`<${tag}>${value[2]}</${tag}>`);
                break;
            case "list":
                // out.push("<hr/>");
                break;
            default:
            // [TO DO]
        }
    }
}

export default Renderer;
