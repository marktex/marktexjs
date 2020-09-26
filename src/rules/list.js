import reg from "./regexp";

export function list(state) {
    state.tokenize(reg.list, 'list');
}

export default list;
