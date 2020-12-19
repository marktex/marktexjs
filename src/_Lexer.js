import { transfer, terminal } from "./_state";

const reservedWords = ["@import", "@stylesheet", "@data"];
const delimiters = ["[", "]", "{", "}", "(", ")", ":", ";", "!", "@", "#", "$", "%", "^", "&", "*"];
const markers = [];

const char2type = (char) => {
    switch (char) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            return "digit";
        // case ";":
        case "!": // => ![]()
        case "@": // => @{}, @[], @()
        case "#": // => #[]()
        case "$": // => $$<InlineMath>$$, $$$<BlockMath>$$$
        case "%": // => %1, %2, %3, %4, %5, %6
        case "^": // =>^<digit>, [^<text>]
        // case "&": // => &<id>
        case "*": // => **<BoldSpan>**
        case "-": // => --<DeletedSpan>--
        case "+": // => ++<InsertedSpan>++
        case "_": // => __<UnderlineSpan>__
        case "=": // => ==<MarkedSpan>==
        case "/": // => //<ItalicSpan>//
        case "[": // => @[=2*1, .class, #id]], [<span>][=2*1, .class, #id]
        case "]": // => @[=2*1, .class, #id]], [<span>][=2*1, .class, #id]
        case "{": // => @{width:100%; height:100%;}, [<span>]{width:100%; height:100%;}
        case "}": // => @{width:100%; height:100%;}, [<span>]{width:100%; height:100%;}
        case "(": // => @(classA classB classC), [<span>](classA classB classC)
        case ")": // => @(classA classB classC), [<span>](classA classB classC)
        case "|": // => |<space>, |:<space>
        // case "<":
        case ">": // => ><space>, >>
        case "`": // => ``<InlineCode>``, ```<BlockCode>```
        case ":":
        case "\\": // => \\n
        case "\n":
        case " ":
        case "\t":
            return char;
        // case " ":
        // case "\t":
        //     return "space";
        default:
            return "char";
    }
};

export function lex(src = "") {
    let currState = "000 000 001"; // 初始状态
    let buff = []; // 缓存字符，当前 currState 处在 terminal 时，拼接 buff 中的字符作为 token 并清空 buff
    let type = "";
    let tokens = [];
    let indentStack = []; // 用以判断当前 indent 输出为 token 时的类型（indent/dedent）
    let char, charType, nextState, tokenType;
    let cursor = 0;
    const token = (type) => {
        tokens.push({ type, value: buff.join("") });
        buff = [];
    };
    const next = (nextState) => {
        currState = nextState;
    };
    const walk = (n = 1) => {
        cursor += n;
    };
    while (cursor < src.length) {
        char = src[cursor];
        charType = char2type(src[cursor]);
        // console.log([currState, transfer[currState]])
        // nextState = transfer[currState][charType] || transfer[currState]["ε"];
        if ((type = terminal[currState])) {
            // console.log(currState, type);
            token(type);
            // cursor++;
        }

        if (!transfer[currState]) {
            next("000000"); // currState = "000000";
            continue;
        } else if ((nextState = transfer[currState][charType])) {
            buff.push(char);
            next(nextState); // currState = nextState;
            walk(); // cursor++;
            continue;
        } else if ((nextState = transfer[currState]["ε"])) {
            // type = terminal[nextState];
            // token(terminal[nextState]);
            next(nextState); // currState = nextState;
            // next("000000"); // currState = "000000";
            // currState = nextState;
            continue;
        } else {
            buff.push(char);
            token("string");
            next("000000"); // currState = "000000";
            walk(); // cursor++;
        }
    }
    return tokens;
}

class Lexer {
    constructor(state) {
        this.state = state;
    }
    // 我们从接收一个字符串开始，首先设置两个变量。
    lex() {}
}

export default Lexer;
