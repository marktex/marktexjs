import Lexer from "./Lexer.js";
import State from "./state.js";
import Parser from "./Parser.js";
import Renderer from "./Renderer.js";
// import Tokenizer from './Tokenizer.js';
// import TextRenderer from './TextRenderer.js';
// import Slugger from './Slugger.js';

function MarkTex(src, opt = {}, callback = () => {}) {
    // throw error in case of non string input
    if (typeof src === "undefined" || src === null) {
        throw new Error("MarkTex(): input parameter is undefined or null");
    }
    if (typeof src !== "string") {
        throw new Error(
            "MarkTex(): input parameter is of type " +
                Object.prototype.toString.call(src) +
                ", string expected"
        );
    }

    if (typeof opt === "function") {
        callback = opt;
        opt = null;
    }

    try {
        let state = new State(src, (src) => {
            return src
                .replace(/\r\n?|\n/g, "\n") // Normalize newlines
                .replace(/\0/g, "\uFFFD") // Replace NULL characters
                .replace(/\t/g, "    "); // Replace tab with four blank space
        });
        state = Lexer.lex(state, opt);
        // console.log("MarkTex:tokens", state.tokens)
        // if (opt.walkTokens) {
        //     marked.walkTokens(tokens, opt.walkTokens);
        // }
        // return Parser.parse(tokens, opt);
        state = Parser.parse(state, opt);
        // console.log("MarkTex:table", JSON.stringify(state.table));
        // console.log("MarkTex:ast", JSON.stringify(state.ast));
        state = Renderer.render(state, opt);
        console.log("MarkTex:html", state.html);
    } catch (e) {
        e.message +=
            "\nPlease report this to https://github.com/marktex/marktexjs.";
        if (opt.silent) {
            return (
                "<p>An error occurred:</p><pre>" +
                escape(e.message + "", true) +
                "</pre>"
            );
        }
        throw e;
    }
}

/**
 * Expose
 */

// MarkTex.Parser = Parser;
// MarkTex.parse = Parser.parse;

let testContent = `
# MARKTEX 语法设计

## 标题
---------------------------
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题


## 列表
---------------------------
### 无序列表
* Item 一级列表
  * Item 二级列表
    * Item 三级列表
    * Item 三级列表
  * Item 二级列表
* Item 一级列表

### 有序列表
1. Item 一级列表
  1. Item 二级列表
    1. Item 三级列表
    2. Item 三级列表
  2. Item 二级列表
2. Item 一级列表

待办列表:
- [ ] Incomplete item
- [x] Complete item

## 样式
---------------------------
*斜体* 
**粗体** 
==高亮== 
~~删除线~~
> 引用
H_2_O 下标
2^10^ 上标
`;

// console.log(testContent.match(/([ \t]*)(\d+[\.\)]|[\*\+\-])[ \t]+[\s\S]+?\n(?![ \t]*(?:\d+[\.\)]|[\*\+\-]))/g))
let ret,
    reg = /([ \t]*)(\d+[\.\)]|[\*\+\-])[ \t]+[\s\S]+?\n(?![ \t]*(?:\d+[\.\)]|[\*\+\-]))/;
MarkTex(testContent);

// MarkTex.Renderer = Renderer;
// MarkTex.render = Renderer.render;
// MarkTex.TextRenderer = TextRenderer;

// MarkTex.Lexer = Lexer;
// MarkTex.lex = Lexer.lex;

// module.exports = MarkTex;
export default MarkTex;
