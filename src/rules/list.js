import reg from "./regexp";

export function list(state) {
    state.tokenize(reg.list);
}

export default list;
