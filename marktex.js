(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    /* 
        // Single-character tokens.
        LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE, COMMA, DOT, MINUS, PLUS, SEMICOLON, SLASH, STAR,

        // One or two character tokens.
        BANG, BANG_EQUAL, EQUAL, EQUAL_EQUAL, GREATER, GREATER_EQUAL, LESS, LESS_EQUAL,

        // Literals.
        IDENTIFIER, STRING, NUMBER,

        // Keywords.
        AND, CLASS, ELSE, FALSE, FUN, FOR, IF, NIL, OR, PRINT, RETURN, SUPER, THIS, TRUE, VAR, WHILE,
        
        EOF
    */

    var char2type = function char2type(_char) {
      switch (_char) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6": // case ";":

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
          return _char;
        // case " ":
        // case "\t":
        //     return "space";

        default:
          return "char";
      }
    };

    var transfer = {
      "000000": {
        // "\t": "009000",
        "\n": "000010",
        // "010000",
        // " ": "032000",
        "!": "033000",
        // '"': "034000",
        // "#": "035000",
        "$": "036000",
        "%": "037000",
        "&": "038000",
        // "'": "039000",
        "(": "000040",
        // "040000",
        ")": "000041",
        // "041000",
        "*": "042000",
        "+": "043000",
        // ",": "044000",
        "-": "045000",
        // ".": "046000",
        "/": "047000",
        // ":": "058000",
        // ";": "059000",
        // "<": "060000",
        "=": "061000",
        // ">": "062000",
        // "?": "063000",
        "@": "064000",
        "[": "000091",
        // "091000",
        "\\": "092000",
        "]": "000093",
        // "093000",
        "^": "094000",
        "_": "095000",
        "`": "096000",
        "{": "000123",
        // "123000",
        "|": "124000",
        "}": "000125",
        // "125000",
        // "~": "126000",
        "char": "500000",
        "space": "300000"
      },
      // 初始状态
      // 终止状态
      // \n,
      "000010": {
        "space": "300000",
        " ": "300000",
        "\t": "300000",
        "ε": "000000"
      },
      // \n
      // "000300": {}, // indent

      /* 中间状态 @{ */
      // \t,
      "009000": {
        "space": "009000",
        " ": "009000",
        "\t": "009000",
        "ε": "000300"
      },
      // \t
      // 空格,
      "032000": {
        "space": "032000",
        " ": "032000",
        "\t": "032000",
        "ε": "000300"
      },
      // 空格
      // !,
      "033000": {
        "[": "000401"
      },
      // ! => ![<AltSpan>](<Src> <Text>),
      // ",
      "034000": {},
      // ",
      // #,
      "035000": {
        "[": "000402"
      },
      // # => #[<AltSpan>](<Url> <Text>),
      // $,
      "036000": {
        $: "036001"
      },
      // $ => $$
      "036001": {
        $: "036002",
        "char": "000423"
      },
      // $$ => $$$, $$<InlineMath>$$
      "036002": {
        $: "036002",
        "char": "000311"
      },
      // $$ => $$$, $$$<BlockMath>$$$
      // %,
      "037000": {
        1: "037001",
        2: "037002",
        3: "037003",
        4: "037004",
        5: "037005",
        6: "037006"
      },
      // % => %1, %2, %3, %4, %5, %6
      "037001": {
        "space": "000301",
        " ": "000301",
        "\t": "000301"
      },
      // %1 => %1<space>
      "037002": {
        "space": "000302",
        " ": "000302",
        "\t": "000302"
      },
      // %2 => %2<space>
      "037003": {
        "space": "000303",
        " ": "000303",
        "\t": "000303"
      },
      // %3 => %3<space>
      "037004": {
        "space": "000304",
        " ": "000304",
        "\t": "000304"
      },
      // %4 => %4<space>
      "037005": {
        "space": "000305",
        " ": "000305",
        "\t": "000305"
      },
      // %5 => %5<space>
      "037006": {
        "space": "000306",
        " ": "000306",
        "\t": "000306"
      },
      // %6 => %6<space>
      // &,
      "038000": {
        "space": "000312",
        " ": "000312",
        "\t": "000312"
      },
      // & => &<space>
      // ',
      "039000": {},
      // '
      // (,
      "040000": {},
      // (
      // ),
      "041000": {},
      // )
      // *,
      "042000": {
        "*": "042001",
        "space": "000308",
        " ": "000308",
        "\t": "000308"
      },
      // * => **, *<space>
      "042001": {
        "*": "042002",
        "char": "000406"
      },
      // ** => ***, **<BoldSpan>**
      "042002": {
        "*": "042002",
        "space": "042002",
        " ": "042002",
        "\t": "042002",
        "\n": "000307"
      },
      // *** => ****
      // +,
      "043000": {
        "+": "043001",
        "space": "000308",
        " ": "000308",
        "\t": "000308"
      },
      // + => ++, +<space>
      "043001": {
        "+": "043002",
        "char": "000404"
      },
      // ++ => +++, ++<InsertedSpan>++
      "043002": {
        "+": "043002",
        "space": "043002",
        " ": "043002",
        "\t": "043002",
        "\n": "000307"
      },
      // +++ => ++++
      // ,,
      "044000": {},
      // ,
      // -,
      "045000": {
        "-": "045001",
        "space": "000308",
        " ": "000308",
        "\t": "000308"
      },
      // - => --, -<space>
      "045001": {
        "-": "045002",
        "char": "000405"
      },
      // -- => ---, --<DeletedSpan>--
      "045002": {
        "-": "045002",
        "space": "045002",
        " ": "045002",
        "\t": "045002",
        "\n": "000307"
      },
      // --- => ----
      // .,
      "046000": {},
      // .
      // /,
      "047000": {
        "/": "047001"
        /* space: "", " ": "", "\t": "" */

      },
      // / => //,
      "047001": {
        "/": "047002",
        "char": "000407"
      },
      // // => ///, //<ItalicSpan>//
      "047002": {
        "/": "047002",
        "space": "047002",
        " ": "047002",
        "\t": "047002",
        "\n": "000307"
      },
      // /// => ////
      // :,
      "058000": {},
      // :
      // ;,
      "059000": {},
      // ;
      // <,
      "060000": {},
      // <
      // =,
      "061000": {
        "=": "061001"
        /* space: "", " ": "", "\t": "" */

      },
      // = => ==,
      "061001": {
        "=": "000307",
        "char": "000408"
      },
      // == => ===, ==<ItalicSpan>==
      // >,
      "062000": {},
      // >
      // ?,
      "063000": {},
      // ?
      // @,
      "064000": {
        "(": "000040",
        "[": "000091",
        "{": "000123"
      },
      // @
      // [,
      "091000": {},
      // [
      // \\,
      "092000": {
        "\n": "000424"
      },
      // \ => \\n
      // ],
      "093000": {
        "(": "000040",
        "[": "000091",
        "{": "000123"
      },
      // ]
      // ^,
      "094000": {
        "[": "000426"
      },
      // ^ => ^[
      // _,
      "095000": {
        "_": "095001",
        "[": "000427"
        /* space: "", " ": "", "\t": "" */

      },
      // _ => __, _[
      "095001": {
        _: "000307",
        "char": "000409"
      },
      // __ => ___, __<ItalicSpan>__
      // `,
      "096000": {
        "`": "096001"
      },
      // ` => ``,
      "096001": {
        "char": "000422",
        "`": "096002"
      },
      // `` => ``<InlineCode>``, ```
      "096002": {
        "char": "000310",
        "`": "096002"
      },
      // ``` => ```<BlockCode>```, ````
      "123000": {},
      // {
      "124000": {
        space: "000309"
        /* ":":"124000" */

      },
      // | => |<space>,
      "125000": {},
      // }
      "126000": {},
      // ~
      "300000": {
        "space": "300000",
        " ": "300000",
        "\t": "300000",
        "ε": "000300"
      },
      //
      "500000": {
        "char": "500000",
        ε: "000500"
      } //

      /* @} */

    };
    var terminal = {
      "000010": "\n",
      "000040": "(",
      "000041": ")",
      "000091": "[",
      "000093": "]",
      "000123": "{",
      "000125": "}",

      /* Block */
      "000300": "indent",
      "000301": "h1",
      // h1: %1
      "000302": "h2",
      // h2: %2
      "000303": "h3",
      // h3: %3
      "000304": "h4",
      // h4: %4
      "000305": "h5",
      // h5: %5
      "000306": "h6",
      // h6: %6
      "000307": "hr",
      // hr: ---, +++, ***, ///
      // "001008":  "paragraph", // paragraph
      "000308": "li",
      // li: -<space> => -<space><ListItemParagraph>, +<space> => +<space><ListItemParagraph>, *<space> => *<space><ListItemParagraph>
      // "001009":  "tr", // tr
      "000309": "cell",
      // cell: |<space>, |:<space>
      "000310": "code",
      // code: ``` => ```<BlockCode>```
      "000311": "math",
      // math: $$$<space> => $$$<space><BlockMath>
      "000312": "blockquote",
      // blockquote: ><space> => ><space><BlockquoteParagraph>

      /* Inline */
      "000401": "img",
      // img: ![ => ![<AltSpan>](<Src> <Text>)
      "000402": "link",
      // link: #[ => #[<AltSpan>](<Url> <Text>)
      "000403": "span",
      // span: [ => [<span>](class), [<span>]{<style>}
      "000404": "ins",
      // ins: ++ => ++<InsertedSpan>++
      "000405": "del",
      // del: -- => --<DeletedSpan>--
      "000406": "strong",
      // strong: ** => **<BoldSpan>**
      "000407": "em",
      // em: // => //<ItalicSpan>//
      "000408": "mark",
      // mark: == => ==<MarkedSpan>==
      "000409": "u",
      // u: __ => __<UnderlineSpan>__
      "000410": "text",
      // text
      "000411": "id",
      // id
      // "000422": "anchor", // anchor: #<id>#
      "000422": "code",
      // code: `` => ``<InlineCode>``
      "000423": "math",
      // math: $$ => $$<InlineMath>$$
      "000424": "",
      // \\n
      "000425": "br",
      // \n
      "000426": "sub",
      // sub: ^[ => ^[<SubSpan>]
      "000427": "sup",
      // sup: _[ => _[<SupSpan>]

      /*  */
      "000500": "string" // string: char => char

    };
    function lex(src) {
      if (src === void 0) {
        src = "";
      }

      var currState = "000000"; // 初始状态

      var buff = []; // 缓存字符，当前 currState 处在 terminal 时，拼接 buff 中的字符作为 token 并清空 buff

      var type = "";
      var tokens = [];

      var _char2, charType, nextState;

      var cursor = 0;

      var token = function token(type) {
        tokens.push({
          type: type,
          value: buff.join("")
        });
        buff = [];
      };

      var next = function next(nextState) {
        currState = nextState;
      };

      var walk = function walk(n) {
        if (n === void 0) {
          n = 1;
        }

        cursor += n;
      };

      while (cursor < src.length) {
        _char2 = src[cursor];
        charType = char2type(src[cursor]); // console.log([currState, transfer[currState]])
        // nextState = transfer[currState][charType] || transfer[currState]["ε"];

        if (type = terminal[currState]) {
          // console.log(currState, type);
          token(type); // cursor++;
        }

        if (!transfer[currState]) {
          next("000000"); // currState = "000000";

          continue;
        } else if (nextState = transfer[currState][charType]) {
          buff.push(_char2);
          next(nextState); // currState = nextState;

          walk(); // cursor++;

          continue;
        } else if (nextState = transfer[currState]["ε"]) {
          // type = terminal[nextState];
          // token(terminal[nextState]);
          next(nextState); // currState = nextState;
          // next("000000"); // currState = "000000";
          // currState = nextState;

          continue;
        } else {
          buff.push(_char2);
          token("string");
          next("000000"); // currState = "000000";

          walk(); // cursor++;
        }
      }

      return tokens;
    }

    var testContent = "%1 MARKTEX \u8BED\u6CD5\u8BBE\u8BA1\n\n%2 \u6807\u9898\n---------------------------\n%1 \u4E00\u7EA7\u6807\u9898\n%2 \u4E8C\u7EA7\u6807\u9898\n%3 \u4E09\u7EA7\u6807\u9898\n%4 \u56DB\u7EA7\u6807\u9898\n%5 \u4E94\u7EA7\u6807\u9898\n%6 \u516D\u7EA7\u6807\u9898\n\n\n%2 \u5217\u8868\n---------------------------\n%3 \u65E0\u5E8F\u5217\u8868\n* Item \u4E00\u7EA7\u5217\u8868\n  * Item \u4E8C\u7EA7\u5217\u8868\n    * Item \u4E09\u7EA7\u5217\u8868\n    * Item \u4E09\u7EA7\u5217\u8868\n  * Item \u4E8C\u7EA7\u5217\u8868\n* Item \u4E00\u7EA7\u5217\u8868\n\n%3 \u6709\u5E8F\u5217\u8868\n1. Item \u4E00\u7EA7\u5217\u8868\n  1. Item \u4E8C\u7EA7\u5217\u8868\n    1. Item \u4E09\u7EA7\u5217\u8868\n    2. Item \u4E09\u7EA7\u5217\u8868\n  2. Item \u4E8C\u7EA7\u5217\u8868\n2. Item \u4E00\u7EA7\u5217\u8868\n\n\u5F85\u529E\u5217\u8868:\n- [ ] Incomplete item\n- [x] Complete item\n\n%2 \u56FE\u7247\n---------------------------\n![Image Alt](./img.jpg \"Image Title\")\n\n%2 \u94FE\u63A5\n---------------------------\n#[Image Alt](http://www.domain.com \"Link Title\")\n\n\n%2 \u5F15\u7528\n---------------------------\n& \u5F15\u7528\n\n\u5F15\u7528\u6298\u884C\n    & \u5D4C\u5957\u5F15\u7528 \n    \u5F15\u7528\u6362\u884C\n\n%2 \u4EE3\u7801\n---------------------------\n%3 \u5185\u8054\u4EE3\u7801\n``let a += 1;``\n\n%3 \u5757\u4EE3\u7801\n```javascript\nlet a=1\nlet b += a;\n```\n\n%2 \u516C\u5F0F\n---------------------------\n%3 \u5185\u8054\u516C\u5F0F\n$$a^2$$\n\n%3 \u5757\u516C\u5F0F\n$$$\na^{\feq{1,2}}\n\feq{2,sqrt{2}}\n$$$\n\n%2 \u6837\u5F0F\n---------------------------\n++\u63D2\u5165++\n--\u5220\u9664--\n**\u7C97\u4F53** \n//\u659C\u4F53// \n==\u9AD8\u4EAE== \n__\u4E0B\u6ED1\u7EBF__\nH_[2]O \u4E0B\u6807\n2^[10] \u4E0A\u6807\n";
    console.log(lex(testContent));

})));
