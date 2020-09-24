const rules = {
    block: {
        /**
         * 标题，示例：
         *      # h1 Heading
         *      ## h2 Heading
         *      ### h3 Heading
         *      #### h4 Heading
         *      ##### h5 Heading
         *      ###### h6 Heading
         *      # h1 Multi-line \
         *          Heading
         */
        heading: /^(\#{1,6})([^\#\n]+(?:\\\n|\n))+$/m,
        code: /\s*\`\`\`\n?([^`]+)\`\`\`/g, // 代码块
        /**
         * Horizontal Rules 水平分割线，示例：
         *      ---
         */
        hr: /^(?:([\-] ?)+)\1\1$/gm,
        /**
         * 列表， 示例：
         * 1）Unordered list
         *      * 1st-level list item
         *      ** 2nd-level list item
         *      *** 3th-level list item
         *      * 1st-level list item
         *      etc...
         * 2) Ordered list
         *      1. 1st-level list item with number one
         *      1.. 2nd-level list item with number one
         *      2)) 2nd-level list item with number two
         *      1... 3th-level list item with number one
         *      2. 1st-level list item with number two
         *      etc...
         * 3) incomplete list
         *      + 1st-level list item
         *      ++ 2nd-level list item
         *      etc...
         * 4) complete list
         *      - 1st-level list item
         *      -- 2nd-level list item
         *      etc...
         */
        list: /^((\s*((\*|\+|\-)+|\d(\.|\))+) [^\n]+)\n)+/gm,
        /* bolditalic: /(?:([\*_~]{1,3}))([^\*_~\n]+[^\*_~\s])\1/g, */
        link: /!?\[([^\]<>]+)\]\(([^ \)<>]+)( "[^\(\)\"]+")?\)/g,
        /* reflinks: /\[([^\]]+)\]\[([^\]]+)\]/g, */
        /* smlinks: /\@([a-z0-9]{3,})\@(t|gh|fb|gp|adn)/gi, */
        /* mail: /<(([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,7}))>/gim, */
        table: /\n(([^|\n]+ *\| *)+([^|\n]+\n))((:?\-+:?\|)+(:?\-+:?)*\n)((([^|\n]+ *\| *)+([^|\n]+)\n)+)/g,
        /* include: /[\[<]include (\S+) from (https?:\/\/[a-z0-9\.\-]+\.[a-z]{2,9}[a-z0-9\.\-\?\&\/]+)[\]>]/gi, */
        /* url: /<([a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)>/g, */
    },
    inline: {
        escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
        /* autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/, */
        /**
         * 链接，示例：
         * 1) url
         *      [link](http://example.com)
         * 2) image
         *      [alt](!img.jpg)
         *      [alt](!img) // !img: http://example.com/img.jpg
         *      [alg](!img.jpg =60x50) // 尺寸 60x50，等价于 =60*50
         * 3) css style
         *      [text](color:red font-size:20px)
         * 4) css class
         *      [text](.class) // .class: { ... }
         * 5) anchor, to do
         *      [text](#id) // @(#id)
         */
        url: /^\s*\[([^\n]+)\]\(([^\n]+)\)/g,
        tag:
            "^comment" +
            "|^</[a-zA-Z][\\w:-]*\\s*>" + // self-closing tag
            "|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>" + // open tag
            "|^<\\?[\\s\\S]*?\\?>" + // processing instruction, e.g. <?php ?>
            "|^<![a-zA-Z]+\\s[\\s\\S]*?>" + // declaration, e.g. <!DOCTYPE html>
            "|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>", // CDATA section
        link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
        code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
        br: /^( {2,}|\\)\n(?!\s*$)/,
        /**
         * 加粗，示例：
         *      **This is bold text**
         */
        bold: /(?:(\*{1,3}))([^\*\n]+[^\*\s])\1/g,
        /**
         * 倾斜，示例：
         *      __This is italic text__
         */
        italic: /(?:(_{1,3}))([^_\n]+[^_\s])\1/g,
        /**
         * 删除线，示例：
         *      ~~Strike through~~
         */
        del: /(?:(～{1,3}))([^～\n]+[^～\s])\1/g,
        text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n)))/,
    },
    var: {
        /**
         * 样式类，示例：
         *      .class: {color:red;font-size:20px;}
         */
        class:/^\s*\.([\w-]+)\: +\{\s*([^\{\}]+)\s*\}/gm, 
        /**
         * 自制图片，示例：
         *      .image: { to do ...}
         */
        image:/^\s*\!([\w-]+)\: +\{\s*([^\{\}]+)\s*\}/gm,
        /**
         * 脚注，示例：
         *      ^1: The footnote.
         */
        footnote:/^\s*\^([\w\d-]+)\: +([^\{\}\n]+)\s*/gm,
        /**
         * 缩写，示例：
         *      *HTML: Hyper Text Markup Language.
         */
        shortcut:/^\s*\*([\w-]+)\: +([^\{\}\n]+)\s*/gm,
    },
};

/**
 * Block-Level Grammar
 */
const block = {
    newline: /^\n+/,
    code: /^( {4}[^\n]+\n*)+/,
    fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
    hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
    heading: /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,
    blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
    list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
    html:
        "^ {0,3}(?:" + // optional indentation
        "<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)" + // (1)
        "|comment[^\\n]*(\\n+|$)" + // (2)
        "|<\\?[\\s\\S]*?(?:\\?>\\n*|$)" + // (3)
        "|<![A-Z][\\s\\S]*?(?:>\\n*|$)" + // (4)
        "|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)" + // (5)
        "|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)" + // (6)
        "|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)" + // (7) open tag
        "|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)" + // (7) closing tag
        ")",
    def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
    /* nptable: noopTest, */
    table: noopTest,
    /* lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/, */
    // regex template, placeholders will be replaced according to different paragraph
    // interruption rules of commonmark and the original markdown spec:
    _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,
    text: /^[^\n]+/,
};

/**
 * Inline-Level Grammar
 */
const inline = {
    escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
    autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
    url: noopTest,
    tag:
        "^comment" +
        "|^</[a-zA-Z][\\w:-]*\\s*>" + // self-closing tag
        "|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>" + // open tag
        "|^<\\?[\\s\\S]*?\\?>" + // processing instruction, e.g. <?php ?>
        "|^<![a-zA-Z]+\\s[\\s\\S]*?>" + // declaration, e.g. <!DOCTYPE html>
        "|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>", // CDATA section
    link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
    /* reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/, */
    /* nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/, */
    /* reflinkSearch: "reflink|nolink(?!\\()", */
    strong: {
        start: /^(?:(\*\*(?=[*punctuation]))|\*\*)(?![\s])|__/, // (1) returns if starts w/ punctuation
        middle: /^\*\*(?:(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)|\*(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)*?\*)+?\*\*$|^__(?![\s])((?:(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)|_(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)*?_)+?)__$/,
        endAst: /[^punctuation\s]\*\*(?!\*)|[punctuation]\*\*(?!\*)(?:(?=[punctuation_\s]|$))/, // last char can't be punct, or final * must also be followed by punct (or endline)
        endUnd: /[^\s]__(?!_)(?:(?=[punctuation*\s])|$)/, // last char can't be a space, and final _ must preceed punct or \s (or endline)
    },
    em: {
        start: /^(?:(\*(?=[punctuation]))|\*)(?![*\s])|_/, // (1) returns if starts w/ punctuation
        middle: /^\*(?:(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)|\*(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)*?\*)+?\*$|^_(?![_\s])(?:(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)|_(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)*?_)+?_$/,
        endAst: /[^punctuation\s]\*(?!\*)|[punctuation]\*(?!\*)(?:(?=[punctuation_\s]|$))/, // last char can't be punct, or final * must also be followed by punct (or endline)
        endUnd: /[^\s]_(?!_)(?:(?=[punctuation*\s])|$)/, // last char can't be a space, and final _ must preceed punct or \s (or endline)
    },
    code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
    br: /^( {2,}|\\)\n(?!\s*$)/,
    /**
     * 加粗，示例：
     *      **This is bold text**
     */
    bold: /(?:(\*{1,3}))([^\*\n]+[^\*\s])\1/g,
    /**
     * 倾斜，示例：
     *      __This is italic text__
     */
    italic: /(?:(_{1,3}))([^_\n]+[^_\s])\1/g,
    /**
     * 删除线，示例：
     *      ~~Strike through~~
     */
    del: /(?:(～{1,3}))([^～\n]+[^～\s])\1/g,
    text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n)))/,
    punctuation: /^([\s*punctuation])/,
};

module.exports = { block, inline };
