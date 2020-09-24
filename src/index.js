function escape(html, encode) {
    return html
        .replace(!encode ? /&(?!#?\w+;)/g : /&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

const headline = /^(\#{1,6}) +([^\#\n]+)$/m;
while ((rets = headline.exec(str)) !== null) {
    level = rets[1].length;
    str = str
        .replace(
            rets[0],
            "<h" + level + ">" + escape(rets[2].trim()) + "</h" + level + ">"
        )
        .trim();
}
const Lexer = require('./Lexer.js');
const Parser = require('./Parser.js');
const Renderer = require('./Renderer.js');
// const Tokenizer = require('./Tokenizer.js');
// const TextRenderer = require('./TextRenderer.js');
// const Slugger = require('./Slugger.js');

function MarkTex(src, opt, callback) {
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
        const tokens = Lexer.lex(src, opt);
        // if (opt.walkTokens) {
        //     marked.walkTokens(tokens, opt.walkTokens);
        // }
        return Parser.parse(tokens, opt);
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

MarkTex.Parser = Parser;
MarkTex.parse = Parser.parse;

MarkTex.Renderer = Renderer;
// MarkTex.TextRenderer = TextRenderer;

MarkTex.Lexer = Lexer;
MarkTex.lex = Lexer.lex;

module.exports = MarkTex;

