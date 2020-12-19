import em from "./em";
import strong from "./strong";
import del from "./del";
import mark from "./mark";
import code from "./code";
import hr from "./hr";
import heading from "./heading";
import list from "./list";
import li from "./li";
import space from "./space"

// export * from "./hr";
// export * from "./heading";
// export * from "./list";
// export * from "./li";
// export * from "./space"

export default [
    // ["strong", strong],
    // ["em", em],
    // ["del", del],
    // ["mark", mark],
    // ["hr", hr],
    // ["heading", heading],
    // ["code", code],
    ["list", list, {level:0}],
    ["li", li, {level:1}],
    // ["space", space],
]