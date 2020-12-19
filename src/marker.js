const marker = {
    hr: /([+-*/] ){3,}/,
    heading: [/#{1,6} +/, /(?!\\)\n/],
    strong: [/\*(?!\*\s)/, /(?!\*\s)\*/],
    em: [/\/(?!\/\s)/, /(?!\/\s)\//],
    mark: [/\=(?!\=\s)/, /(?!\=\s)\=/],
    del: [/\-(?!\-\s)/, /(?!\-\s)\-/],
    ins: [/\+(?!\+\s)/, /(?!\+\s)\+/],
    u: [/\_(?!\_\s)/, /(?!\_\s)\_/], // 下划线
    img: [/\[/, /\](!.+?)/],
    a: [/\[/, /\](#.+?)/],
    class: [/\[/, /\](\..+?)/],
    list: [
        /[ \t]*(?:\d[\.\)]|[\+\-\*])[ \t]+/,
        /(?!\\)\n(?![ \t]*(?:\d[\.\)]|[\+\-\*]))/,
    ], // /([ \t]*)(?:\d[\.\)]|[\+\-\*])[ \t]+[\s\S]+?(?!\\)\n(?![ \t]*\1(?:\d[\.\)]|[\+\-\*]))/
    li: [/[ \t]*(?:\d[\.\)]|[\+\-\*])[ \t]+/, /(?!\\)\n/],
};

const tokenType = {
    // inline marker
    newline: /(?!\\)\n+/,
    ins: /(?!\+)\+(?!\s)([^\+]+)(?!\s)\+(?!\+)/, // eg. +Inserted text+
    del: /(?!\-)\-(?!\s)([^\-]+)(?!\s)\-(?!\-)/, // eg. -Deleted text-
    strong: /(?!\*)\*(?!\s)([^\*]+)(?!\s)\*(?!\*)/, // eg. *Bold text*
    em: /(?!\/)\/(?!\s)([^\/]+)(?!\s)\/(?!\/)/, // eg. /Italic text/
    u: /(?!\_)\_(?!\s)([^\_]+)(?!\s)\_(?!\_)/, // eg. _Underline text_
    mark: /(?!\=)\=(?!\s)([^\=]+)(?!\s)\=(?!\=)/, // eg. =Marked text=
    subscript: /[\^\_]\[(.+)\]/, // eg. sub: X^[2], H_[2]O
    img: /\!\[([\s\S]+?)\]\(([^\)]+)\)/, // eg. ![alt](./img.png "Title")
    link: /\#\[([\s\S]+?)\]\(([^\)]+)\)/, // eg. #[alt](https://chjiali.net "Title")
    cell: /\|+(\:*) [^\|]+/, // eg. :-1)
    footnote: /\[\^(.+)\]/, // eg. [^2]
    emoji: /\:(.+)\)/, // eg. :-1)
    // single-line marker
    heading: /#{1,6} +/, // eg. "# h1\n## h2\n### h3\n#### h4\n##### h5\n###### h6"
    span: /.+(?!\\)\n+/,
    hr: /([+-*/] ?){3,}/, // eg. "+++", "---", "***", "///", "+ + +", "- - -", "* * *", "/ / /"
    li: /[ \t]*(?:\d[\.\)]|[\+\-\*])[ \t]+/, // eg. " * item\n    - item\n        + item\n", "1. item\n2. item\n3. item"
    // multi-line marker
    list: /(?:\n)([ \t]*)(?:\d[\.\)]|[\+\-\*])[ \t]+[\s\S]+?\n(?![ \t]*\1(?:\d+[\.\)]|[\*\+\-]))/,
    code: /(\`+)(?!\`)([\s\S]+?)\1(?!\`)/, // eg. `inline code`, ``one line code``, ```lang\nmulti-line code\n```
    math: /(\$+)(?!\$)([\s\S]+?)\1(?!\$)/, // eg. $inline math$, $$one line math$$, $$$lang\nmulti-line math\n$$$
    blockquote: /(\>+)[ \t]+/,
    table: "",
    paragraph: /(?:\n\s*\n)([\s\S]+)(?:\n\s*\n)/, // eg. "\n\n    This is \na paragraph!\n    the following are more details...\n\n"
    container: /\:\:\:+/, // eg. ":::\n<div>a</div>\n<div>b</div>\n<div>c</div>\n:::"
};
