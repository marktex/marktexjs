(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.marktex = factory());
}(this, (function () { 'use strict';

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var Ruler = /*#__PURE__*/function () {
    function Ruler(rules) {
      var _this = this;

      if (rules === void 0) {
        rules = null;
      }

      /**
       * Parser#__rules__: Array
       *
       * List of added rules. Each element is:
       * {
       *      name: String,
       *      enabled: Boolean,
       *      state: Number,
       *      apply: Function(),
       *      options: Object,
       *      level: Number, // 规则等级
       * }
       */
      this.__rules__ = [];
      /**
       * [TO DO]:
       *
       * Ruler#levelMap: Object
       *
       * Format:
       * {
       *      '0': [{name, apply, enable, level, options}, ...]
       *      '3': [{name, apply, enable, level, options}, ...]
       * }
       */

      /**
       * Ruler#__cache__: Array | null
       *
       * 缓存 enabled rules，，以提升性能
       */

      this.__cache__ = null;
      /**
       * Parser#__tower__: Array
       *
       * List of added tower. Each element is:
       * {
       *      name: String,
       *      enabled: Boolean,
       *      state: Number,
       *      apply: Function(),
       *      options: Object,
       *      level: Number, // 规则等级
       * }
       */

      this.__tower__ = {};

      if (rules) {
        rules = Array.isArray(rules) ? rules : [rules];
        rules.forEach(function (_ref) {
          var name = _ref[0],
              apply = _ref[1],
              step = _ref[2],
              _ref$ = _ref[3],
              options = _ref$ === void 0 ? {} : _ref$;
          var _options = options,
              level = _options.level,
              enabled = _options.enabled;
          options = options || {};
          enabled = enabled || true;
          level = level || 0;
          /**
           * @deprecated
           */

          _this.__rules__.push({
            name: name,
            enabled: enabled,
            apply: apply,
            options: options
          });

          _this.__tower__[level] = _this.__tower__[level] ? _this.__tower__[level] : [];

          _this.__tower__[level].push({
            name: name,
            apply: apply,
            level: level,
            enabled: enabled,
            options: options
          });
        });
      }
    }

    var _proto = Ruler.prototype;

    /**
     * Ruler.indexOf(name)
     * @param {String} name
     *
     * Find rule index by name
     */
    _proto.indexOf = function indexOf(name) {
      for (var i = 0; i < this.__rules__.length; i++) {
        if (this.__rules__[i].name === name) {
          return i;
        }
      }

      return -1;
    };

    _proto.before = function before(beforeName, ruleName, apply, options) {
      if (options === void 0) {
        options = {};
      }

      var index = this.indexOf(beforeName); // let opt = options || {};

      if (index === -1) {
        throw new Error("Parser rule not found: " + beforeName);
      }

      this.__rules__.splice(index, 0, {
        name: ruleName,
        enabled: true,
        apply: apply,
        options: options
      });

      this.__cache__ = null;
    };

    _proto.after = function after(afterName, ruleName, apply, options) {
      if (options === void 0) {
        options = {};
      }

      var index = this.indexOf(afterName); // let opt = options || {};

      if (index === -1) {
        throw new Error("Parser rule not found: " + afterName);
      }

      this.__rules__.splice(index + 1, 0, {
        name: ruleName,
        enabled: true,
        apply: apply,
        options: options
      });

      this.__cache__ = null;
    };

    _proto.push = function push(rules) {
      var _this2 = this;

      // let opt = options || {};
      // ruleName, apply, options = {}
      if (!Array.isArray(rules)) {
        rules = [rules];
      }

      rules.forEach(function (_ref2) {
        var name = _ref2[0],
            apply = _ref2[1],
            enabled = _ref2[2],
            options = _ref2[3];

        _this2.__rules__.push({
          name: name,
          enabled: enabled || true,
          apply: apply,
          options: options || {}
        });
      });
      this.__cache__ = null;
    };

    _proto.enable = function enable(list, ignoreInvalid) {
      if (!Array.isArray(list)) {
        list = [list];
      }

      var result = []; // Search by name and enable

      list.forEach(function (name) {
        var idx = this.indexOf(name);

        if (idx < 0) {
          if (ignoreInvalid) {
            return;
          }

          throw new Error("Rules manager: invalid rule name " + name);
        }

        this.__rules__[idx].enabled = true;
        result.push(name);
      }, this);
      this.__cache__ = null;
      return result;
    };

    _proto.disable = function disable(list, ignoreInvalid) {
      if (!Array.isArray(list)) {
        list = [list];
      }

      var result = []; // Search by name and disable

      list.forEach(function (name) {
        var idx = this.indexOf(name);

        if (idx < 0) {
          if (ignoreInvalid) {
            return;
          }

          throw new Error("Rules manager: invalid rule name " + name);
        }

        this.__rules__[idx].enabled = false;
        result.push(name);
      }, this);
      this.__cache__ = null;
      return result;
    };

    _createClass(Ruler, [{
      key: "tower",
      get: function get() {
        /**
         * [TO DO]
         */
        return this.__tower__;
      }
    }, {
      key: "rules",
      get: function get() {
        var __rules__ = this.__rules__,
            __cache__ = this.__cache__;
        return __cache__ ? __cache__ : __rules__.filter(function (_ref3) {
          var enabled = _ref3.enabled;
          return enabled;
        });
      }
    }]);

    return Ruler;
  }();

  /**
   * class AST
   *
   * Create new ast and fill passed properties.
   */
  var AST = /*#__PURE__*/function () {
    function AST(_ref) {
      var type = _ref.type,
          map = _ref.map,
          _ref$value = _ref.value,
          value = _ref$value === void 0 ? [] : _ref$value,
          _ref$index = _ref.index,
          index = _ref$index === void 0 ? 0 : _ref$index,
          _ref$raw = _ref.raw,
          raw = _ref$raw === void 0 ? "" : _ref$raw;

      /**
       * AST#type: String
       *
       * Type of the AST (string, e.g. "paragraph")
       */
      this.type = type;
      /**
       * AST#value: Array
       *
       * results of RegExp matched value
       */

      this.value = value;
      /**
       * AST#index: Number
       * 
       * the start position 
       */

      this.index = index;
      /**
       * AST#raw: String
       */

      this.raw = raw;
      /**
       * AST#map: Array
       *
       * Format: [start, end, line]
       */

      this.map = map;
      /**
       * AST#token: Object | null
       */

      this.token = null;
      /**
       * AST#nesting: Number
       *
       * Level change (number in {-1, 0, 1} set), where:
       *
       * -  `1` means the tag is opening
       * -  `0` means the tag is self-closing
       * - `-1` means the tag is closing
       */
      // this.nesting = 0;

      /**
       * AST#attrs: Array
       *
       * Html attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
       */
      // this.attrs = null;

      /**
       * AST#level: Number
       *
       * nesting level, the same as `state.level`
       */
      // this.level = 0;

      /**
       * AST#children: Array
       *
       * An array of child nodes (inline and img tokens)
       */

      this.children = [];
      /**
       * AST#content: String
       *
       * In a case of self-closing tag (code, html, fence, etc.),
       * it has contents of this tag.
       */
      // this.content = "";

      /**
       * AST#markup: String
       *
       * '*' or '_' for emphasis, fence string for fence, etc.
       */
      // this.markup = "";

      /**
       * AST#info: String
       *
       * fence info string
       */
      // this.info = "";

      /**
       * AST#meta: Object
       *
       * A place for plugins to store an arbitrary data
       */
      // this.meta = null;

      /**
       * AST#block: Boolean
       *
       * True for block-level tokens, false for inline tokens.
       * Used in renderer to calculate line breaks
       */
      // this.block = false;

      /**
       * AST#hidden: Boolean
       *
       * If it's true, ignore this element when rendering. Used for tight lists
       * to hide paragraphs.
       */
      // this.hidden = false;
    }
    /**
     * AST.indexAttr(name): Number
     *
     * Search attribute index by name.
     */


    var _proto = AST.prototype;

    _proto.indexAttr = function indexAttr(name) {
      var attrs, i, len;

      if (!this.attrs) {
        return -1;
      }

      attrs = this.attrs;

      for (i = 0, len = attrs.length; i < len; i++) {
        if (attrs[i][0] === name) {
          return i;
        }
      }

      return -1;
    }
    /**
     * AST.pushAttr(attrData)
     *
     * Add `[ name, value ]` attribute to list. Init attrs if necessary
     */
    ;

    _proto.pushAttr = function pushAttr(attrData) {
      if (this.attrs) {
        this.attrs.push(attrData);
      } else {
        this.attrs = [attrData];
      }
    }
    /**
     * AST.setAttr(name, value)
     *
     * Set `name` attribute to `value`. Override old value if exists.
     */
    ;

    _proto.setAttr = function setAttr(name, value) {
      var idx = this.attrIndex(name),
          attrData = [name, value];

      if (idx < 0) {
        this.attrPush(attrData);
      } else {
        this.attrs[idx] = attrData;
      }
    }
    /**
     * AST.getAttr(name)
     *
     * Get the value of attribute `name`, or null if it does not exist.
     */
    ;

    _proto.getAttr = function getAttr(name) {
      var idx = this.attrIndex(name),
          value = null;

      if (idx >= 0) {
        value = this.attrs[idx][1];
      }

      return value;
    }
    /**
     * AST.joinAttr(name, value)
     *
     * Join value to existing attribute via space. Or create new attribute if not
     * exists. Useful to operate with token classes.
     */
    ;

    _proto.joinAttr = function joinAttr(name, value) {
      var idx = this.attrIndex(name);

      if (idx < 0) {
        this.attrPush([name, value]);
      } else {
        this.attrs[idx][1] = this.attrs[idx][1] + " " + value;
      }
    };

    return AST;
  }();

  // import reg from "./regexp";

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
  var reg = /^([ \t]*)(\d+[\.\)]|[\*\+\-])[ \t]+([^\n]+(?:\\\n)?)+\n(?:\1[ \t]*(\d+[\.\)]|[\*\+\-])[ \t]+(?:[^\n]+(?:\\\n)?)+\n)+/; // (?:(\1[ \t]*(?:\d+[\.\)]|[\*\+\-])[ \t]+)([^\n]+(?:\\\n)?)+\n)+
  // export const reg = /^([ \t]*)(\d+[\.\)]|[\*\+\-])[ \t]+([^\n]+(?:\\\n)?)+\n(?!\1[ \t]*(?:\d+[\.\)]|[\*\+\-])[ \t]+(?:[^\n]+(?:\\\n)?)+\n)+/; // (?:(\1[ \t]*(?:\d+[\.\)]|[\*\+\-])[ \t]+)([^\n]+(?:\\\n)?)+\n)+
  // let cnt=0;

  function parse(src, state) {
    // state.tokenize(reg, "list");
    // let value, raw, maker, input, index, shadow, lines, row, col, map;
    // let src = state.src;
    var value = reg.exec(src); // if(value) console.log(`${cnt++}:`, value[0])
    // if (!value) return null;

    /* input = value["input"];
     index = value["index"]; // start index
    shadow = index + raw.length; // 阴影，规则匹配后的作用范围， 比如：`### 三级标题` 的阴影为 8 （整个字符串的长度，也即 token.raw 的长度）
    
    lines = input.substring(0, index).split(/\n/);
    row = lines.length; // line number
    col = lines.pop().length; // column number
    
    map = [index, shadow, row, col]; */

    if (value) {
      // state.token('list', value, map, raw)
      state.token("list", [].concat(value), value[0], 0);
      return 0;
    } // return value ? [value[1].length, "list", [...value], value[0]] : null;


    return -1;
  }

  // import reg from "./regexp";

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
  var reg$1 = /^([ \t]*)(\d+[\.\)]|[\*\+\-])[ \t]+([^\n]+(?:\\\n)?)+\n(?:\1[ \t]+(?:\d+[\.\)]|[\*\+\-])[ \t]+(?:[^\n]+(?:\\\n)?)+\n)*/; // let cnt=0;

  function parse$1(src, state) {
    // state.tokenize(reg, "list");
    // let value, raw, maker, input, index, shadow, lines, row, col, map;
    // let src = state.src;
    var value = reg$1.exec(src); // console.log("li", value)
    // if(value) console.log(`${cnt++}:`, value[0])
    // if (!value) return null;

    /* input = value["input"];
     index = value["index"]; // start index
    shadow = index + raw.length; // 阴影，规则匹配后的作用范围， 比如：`### 三级标题` 的阴影为 8 （整个字符串的长度，也即 token.raw 的长度）
    
    lines = input.substring(0, index).split(/\n/);
    row = lines.length; // line number
    col = lines.pop().length; // column number
    
    map = [index, shadow, row, col]; */

    if (value) {
      // state.token('list', value, map, raw)
      var step = value[1].length + value[2].length + 1;
      state.token("li", [].concat(value), value[0], step);
      return step;
    } // return value ? [value[1].length, "li", [...value], value[0]] : null;


    return -1;
  }

  // export * from "./heading";
  // export * from "./list";
  // export * from "./li";
  // export * from "./space"

  var rules = [// ["hr", hr],
  // ["heading", heading],
  ["list", parse], ["li", parse$1] // ["space", space],
  ];

  var State = /*#__PURE__*/function () {
    function State(src, preset) {
      if (preset === void 0) {
        preset = null;
      }

      /**
       * Lexer#ruler: Ruler
       *
       * [[Ruler]] instance. Keep configuration of parse rules.
       */
      this.ruler = new Ruler(rules);
      /**
       * State#src: String
       */

      this.src = preset && preset(src) || src;
      /**
       * State#position: Number
       */

      this.position = 0;
      /**
       * State#tokens: Array
       */

      this.tokens = [];
      /**
       * State#table: Object
       */

      this.table = {}; // { [tokens[i].index]:i }
      // this.AST = AST;

      /**
       * State#ast: AST
       */

      this.ast = new AST({
        type: "root",
        map: [0, this.src.length, 0]
      });
      /**
       * State#out: Array
       *
       * Used to output html string with method [].join("")
       */

      this.out = [];
    }

    var _proto = State.prototype;

    /**
     *
     * @param {RegExp} regexp
     * @param {String} type
     * @param {Number} step 步长，规则匹配后游标应向后移动的距离，比如：`### 三级标题` 的步长为 4（前缀 `### `的长度）
     */
    _proto.tokenize = function tokenize(regexp, type, step) {
      if (type === void 0) {
        type = "";
      }

      var value, raw, input, index, shadow, lines, row, col, map;
      var src = this.src;

      while (value = regexp.exec(src)) {
        raw = value[0];
        input = value["input"];
        index = value["index"]; // start index

        shadow = index + raw.length; // 阴影，规则匹配后的作用范围， 比如：`### 三级标题` 的阴影为 8 （整个字符串的长度，也即 token.raw 的长度）
        // console.log(input, raw, shadow, index,input.substring(0, index), input.substring(0, index).split(/\n/))

        lines = input.substring(0, index).split(/\n/);
        row = lines.length; // line number

        col = lines.pop().length; // column number

        map = [index, shadow, row, col];

        if (value) {
          var l = this.tokens.push({
            type: type,
            value: [].concat(value),
            index: index,
            raw: raw,
            map: map // step,

          });
          this.table[index] = l - 1;
        }
      }
    }
    /**
     * 装载 Token
     * @param {string} type such as 'hr', 'list', etc.
     * @param {array} value
     * @param {array} map Format: [start, end, line, offset]
     * @param {string} raw
     */
    ;

    _proto.token = function token(type, value, raw, step) {
      if (raw === void 0) {
        raw = "";
      }

      if (step === void 0) {
        step = 0;
      }

      var src = this.src,
          position = this.position; // console.log(
      //     type,
      //     src.length,
      //     position,
      //     [value[0]] /* , $src.substring(0, 6) */
      // );

      var lines = src.substring(0, position).split(/\n/),
          map = [position, // start position
      position + raw.length, // end position，也即阴影，规则匹配后的作用范围， 比如：`### 三级标题` 的阴影为 8 （整个字符串的长度，也即 token.raw 的长度）
      lines.length, // line number
      lines.pop().length // column number
      ];
      var l = this.tokens.push({
        type: type,
        value: [].concat(value),
        map: map,
        // [start, end, line, offset]
        raw: raw,
        step: step
      }); // this.table[map[0]] = l - 1;

      this.table[position] = this.table[position] || [];
      this.table[position].push(l - 1);
    };

    _proto.check = function check(position) {
      if (position === void 0) {
        position = 0;
      }

      this.position = position;
    };

    _createClass(State, [{
      key: "tower",
      get: function get() {
        return this.ruler.tower;
      }
    }, {
      key: "rules",
      get: function get() {
        return this.ruler.rules;
      }
    }]);

    return State;
  }();

  // import { smartypants } from "./util";
  //     ["hr", hr],
  //     ["heading", heading],
  //     ["list", list],
  //     // ["normalize", normalize],
  //     // ["block", require("./rules/block")],
  //     // ["inline", require("./rules/inline")],
  //     // ["linkify", require("./rules/linkify")],
  //     // ["replacements", require("./rules/replacements")],
  //     // ["smartquotes", require("./rules/smartquotes")],
  // ];

  var Lexer = /*#__PURE__*/function () {
    Lexer.lex = function lex(state, options) {
      if (options === void 0) {
        options = {};
      }

      var lexer = new Lexer(state, options);
      return lexer.lex();
    };

    function Lexer(state, options) {
      if (options === void 0) {
        options = {};
      }

      // /**
      //  * Lexer#src: String
      //  */
      // this.src = src;

      /**
       * Lexer#state: State
       */
      // this.state = new State(this.preset(src));
      this.state = state;
      /**
       * Lexer#options: Object
       */

      this.options = options; // /**
      //  * Lexer#tokens: Array
      //  */
      // this.tokens = [];
      // /**
      //  * Lexer#map: Object
      //  */
      // this.map = {};

      /**
       * Lexer#ast: AST
       */
      // this.ast = new AST(this.preset(src), "root", "", 0);
    }
    /**
     * Lexer.prest(src)
     * @param {String} src
     */


    var _proto = Lexer.prototype;

    _proto.preset = function preset(src) {
      return src.replace(/\r\n?|\n/g, "\n") // Normalize newlines
      .replace(/\0/g, "\uFFFD") // Replace NULL characters
      .replace(/\t/g, "    "); // Replace tab with four blank space
    }
    /**
     * Parse.parse(state)
     */
    ;

    _proto.lex = function lex() {
      var state = this.state,
          _this$state = this.state,
          src = _this$state.src,
          tower = _this$state.tower,
          table = _this$state.table,
          tokens = _this$state.tokens; // for (let i = 0, l = rules.length; i < l; i++) {
      //     rules[i].apply(state);
      // }

      var $src, $pos, walk, rules;
      Object.keys(tower).forEach(function (level) {
        // console.log("tower");
        $src = src, $pos = 0;

        walk = function walk(n) {
          $pos += n;
          $src = $src.substring(n);
        };

        rules = tower[level];
        var step = -1,
            retry = rules.length;

        while ($src) {
          rules.forEach(function (rule) {
            state.check($pos); // console.log($pos, rule.name, retry);

            if ((step = rule.apply($src, state)) > 0) {
              walk(step);
            }
          });

          if (state.position === $pos && ! --retry) {
            walk(1); // 前后两次位置不变时，尝试遍历所有规则，若仍未有位置移动，则强制前进 1, 一避免死循环

            retry = rules.length;
          }
        }
      });
      /* 添加结尾哨兵 token */

      state.check(src.length);
      state.token("over", [], "", 0); // 解析文本段 token

      $src = src, $pos = 0;
      var last = 0,
          curr = 0,
          $tokens = [],
          lines = [];
      Object.keys(table).map(function (item) {
        return parseInt(item);
      }).forEach(function (pos) {
        table[pos].forEach(function (index) {
          var step = tokens[index].step;
          curr = parseInt(pos);

          if (last !== curr) {
            // console.log({last, curr})
            // pieces.push([last, curr]);
            src.substring(last, curr).split(/(?<=[^\\]\n)/) // 前后两个 token 之间可能存在段落换行符，须拆分为多个段落
            .forEach(function (text) {
              lines = src.substring(0, last).split(/\n/); // 获取行

              $tokens.push({
                type: "text",
                map: [last, curr, lines.length],
                raw: text,
                step: text.length
              });
              state.check(last);
              state.token("text", [last, curr, lines.length, lines.pop().length], text, text.length);
              last += text.length;
            });
          }

          last = curr + step;
        });
      }); // pieces.push([pieces[pieces.length-1][1], src.length]);
      // pieces.forEach(([start, end]) => {});
      // console.log($tokens.map(({ map, raw }) => [map, raw]));
      // state.tokens.push(...$tokens);

      return state;
    };

    return Lexer;
  }();

  var Parser = /*#__PURE__*/function () {
    Parser.parse = function parse(state, options) {
      if (options === void 0) {
        options = {};
      }

      var parser = new Parser(state, options);
      return parser.parse();
    };

    function Parser(state, options) {
      if (options === void 0) {
        options = {};
      }

      /**
       * Parser#state: State
       */
      this.state = state;
      /**
       * Parser#options: options
       */

      this.options = options;
    }

    var _proto = Parser.prototype;

    _proto.parse = function parse() {
      var state = this.state,
          _this$state = this.state,
          src = _this$state.src,
          tokens = _this$state.tokens,
          table = _this$state.table,
          ast = _this$state.ast;
      var stack = [],
          parent = ast,
          current;
      Object.keys(table).forEach(function (key) {
        table[key].forEach(function (position) {
          current = new AST(tokens[position]);

          var judge = function judge(currMap, lastMap) {
            return currMap[0] <= currMap[1] && lastMap[0] <= currMap[0] && currMap[1] <= lastMap[1];
          }; // console.log(
          //     // "stack",stack
          //     // parent.type,
          //     // current.type,
          //     // [parent.raw, current.raw],
          //     // judge(current.map, parent.map)
          // );
          // if(current.map[0]==231){
          //     console.log({current, parent}, judge(current.map, parent.map))
          // }
          // if (judge(current.map, parent.map)) {
          //     // not strict mode: $map[0] <= map[1]
          //     parent.children.push(current);
          //     stack.push(parent);
          //     parent = current;
          // } else {
          //     // current = parent;
          //     do {
          //         parent = stack.pop();
          //         if(current.map[0]==231){
          //             console.log({current, parent}, judge(current.map, parent.map))
          //         }
          //     } while (!judge(current.map, parent.map));
          //     parent.children.push(current);
          //     stack.push(parent);
          //     parent = current;
          // }


          while (!judge(current.map, parent.map)) {
            parent = stack.pop();
          }

          parent.children = parent.children || [];
          parent.children.push(current);
          stack.push(parent);
          parent = current;
        });
      }); // console.log({stack})
      // console.log("parse:stack", JSON.stringify(stack));
      // console.log({parent}, stack[0].type, stack[0].children/* .map(item=>item.type) */);
      // ast.children = children;
      // let curr = stack.shift(),
      //     next;
      // while (stack.length) {
      //     next = stack.shift();
      //     curr.children.push(next);
      //     curr = next;
      // }

      state.ast = stack[0];
      return state;
    };

    return Parser;
  }();

  //
  var Renderer = /*#__PURE__*/function () {
    Renderer.render = function render(state, options) {
      if (options === void 0) {
        options = {};
      }

      var renderer = new Renderer(state, options);
      return renderer.render();
    };

    function Renderer(state, options) {
      if (options === void 0) {
        options = {};
      }

      /**
       * Renderer#state: State
       */
      this.state = state;
      /**
       * Renderer#options: options
       */

      this.options = options;
    }

    var _proto = Renderer.prototype;

    _proto.render = function render() {
      var state = this.state,
          _this$state = this.state,
          ast = _this$state.ast,
          out = _this$state.out;
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
    };

    _proto.r = function r(ast) {
      var _this = this;

      if (!ast) return "";
      var t = this.t(ast);
      var children = ast.children,
          pieces = [];

      if (Array.isArray(children) && children.length) {
        // stack.push(ast);
        pieces = children.map(function (node) {
          return _this.r(node);
        });
      }

      return pieces.length ? t(pieces) : t();
    };

    _proto.t = function t(_ref) {
      var type = _ref.type,
          value = _ref.value,
          raw = _ref.raw;
      if (!type) return;
      var tag; // console.log({type})

      switch (type) {
        case "hr":
          return function () {
            return "<hr/>";
          };

        case "heading":
          tag = "h" + value[1].length;
          return function (pieces) {
            if (pieces === void 0) {
              pieces = [value[2]];
            }

            return "<" + tag + ">" + pieces.join("") + "</" + tag + ">";
          };

        case "list":
          // out.push("<hr/>");
          tag = "" + (/(\d+[\.\)])/.exec(value[2]) ? 'ol' : 'ul');
          return function (pieces) {
            if (pieces === void 0) {
              pieces = [];
            }

            return "<" + tag + ">" + pieces.join("") + "</" + tag + ">";
          };

        case "li":
          // out.push("<hr/>");
          // tag = `li`;
          return function (pieces) {
            if (pieces === void 0) {
              pieces = [];
            }

            return "<li>" + pieces.join("") + "</li>";
          };

        /* <span>${value[3]}</span> */

        case "text":
          // out.push("<hr/>");
          // tag = `li`;
          return function () {
            return "<p>" + raw + "</p>";
          };

        default:
          return function (pieces) {
            if (pieces === void 0) {
              pieces = [];
            }

            return "" + pieces.join("");
          };
        // [TO DO]
      }
    };

    _proto.traverse = function traverse(_ref2) {
      var type = _ref2.type,
          value = _ref2.value;
      if (!type) return;
      var out = this.state.out;

      switch (type) {
        case "hr":
          out.push("<hr/>");
          break;

        case "heading":
          var tag = "h" + value[1].length;
          out.push("<" + tag + ">" + value[2] + "</" + tag + ">");
          break;

      }
    };

    return Renderer;
  }();

  // import TextRenderer from './TextRenderer.js';
  // import Slugger from './Slugger.js';

  function MarkTex(src, opt, callback) {
    if (opt === void 0) {
      opt = {};
    }

    // throw error in case of non string input
    if (typeof src === "undefined" || src === null) {
      throw new Error("MarkTex(): input parameter is undefined or null");
    }

    if (typeof src !== "string") {
      throw new Error("MarkTex(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected");
    }

    if (typeof opt === "function") {
      opt = null;
    }

    try {
      var state = new State(src, function (src) {
        return src.replace(/\r\n?|\n/g, "\n") // Normalize newlines
        .replace(/\0/g, "\uFFFD") // Replace NULL characters
        .replace(/\t/g, "    "); // Replace tab with four blank space
      });
      state = Lexer.lex(state, opt); // console.log("MarkTex:tokens", state.tokens)
      // if (opt.walkTokens) {
      //     marked.walkTokens(tokens, opt.walkTokens);
      // }
      // return Parser.parse(tokens, opt);

      state = Parser.parse(state, opt); // console.log("MarkTex:table", JSON.stringify(state.table));

      console.log("MarkTex:ast", JSON.stringify(state.ast));
      state = Renderer.render(state, opt);
      console.log("MarkTex:html", state.html);
    } catch (e) {
      e.message += "\nPlease report this to https://github.com/marktex/marktexjs.";

      if (opt.silent) {
        return "<p>An error occurred:</p><pre>" + escape(e.message + "", true) + "</pre>";
      }

      throw e;
    }
  }
  /**
   * Expose
   */
  // MarkTex.Parser = Parser;
  // MarkTex.parse = Parser.parse;


  var testContent = "\nMARKTEX \u8BED\u6CD5\u8BBE\u8BA1\n\n\u6807\u9898\n---------------------------\n# \u4E00\u7EA7\u6807\u9898\n## \u4E8C\u7EA7\u6807\u9898\n### \u4E09\u7EA7\u6807\u9898\n#### \u56DB\u7EA7\u6807\u9898\n##### \u4E94\u7EA7\u6807\u9898\n###### \u516D\u7EA7\u6807\u9898\n\n\n\u5217\u8868\n---------------------------\n\u65E0\u5E8F\u5217\u8868\n* Item \u4E00\u7EA7\u5217\u8868\n  * Item \u4E8C\u7EA7\u5217\u8868\n    * Item \u4E09\u7EA7\u5217\u8868\n    * Item \u4E09\u7EA7\u5217\u8868\n  * Item \u4E8C\u7EA7\u5217\u8868\n* Item \u4E00\u7EA7\u5217\u8868\n\n\u6709\u5E8F\u5217\u8868\n1. Item \u4E00\u7EA7\u5217\u8868\n  1. Item \u4E8C\u7EA7\u5217\u8868\n    1. Item \u4E09\u7EA7\u5217\u8868\n    2. Item \u4E09\u7EA7\u5217\u8868\n  2. Item \u4E8C\u7EA7\u5217\u8868\n2. Item \u4E00\u7EA7\u5217\u8868\n\n\u5F85\u529E\u5217\u8868:\n- [ ] Incomplete item\n- [x] Complete item\n\n\u6837\u5F0F\n---------------------------\n*\u659C\u4F53* \n**\u7C97\u4F53** \n==\u9AD8\u4EAE== \n~~\u5220\u9664\u7EBF~~\n> \u5F15\u7528\nH_2_O \u4E0B\u6807\n2^10^ \u4E0A\u6807\n";
  MarkTex(testContent); // MarkTex.Renderer = Renderer;

  return MarkTex;

})));
