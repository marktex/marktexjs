/**
 * class AST
 *
 * Create new ast and fill passed properties.
 */

export class AST {
    constructor(type, tag, token) {
        /**
         * AST#type: String
         *
         * Type of the AST (string, e.g. "paragraph")
         */
        this.type = type;

        /**
         * AST#tag: String
         *
         * html tag name, e.g. "p"
         */
        this.tag = tag;

        /**
         * AST#token: String
         */
        this.token = token;

        /**
         * AST#nesting: Number
         *
         * Level change (number in {-1, 0, 1} set), where:
         *
         * -  `1` means the tag is opening
         * -  `0` means the tag is self-closing
         * - `-1` means the tag is closing
         */
        this.nesting = 0;

        /**
         * AST#attrs: Array
         *
         * Html attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
         */
        this.attrs = null;

        /**
         * AST#map: Array
         *
         * Source map info. Format: `[ line_begin, line_end ]`
         */
        this.map = null;

        /**
         * AST#level: Number
         *
         * nesting level, the same as `state.level`
         */
        this.level = 0;

        /**
         * AST#children: Array
         *
         * An array of child nodes (inline and img tokens)
         */
        this.children = null;

        /**
         * AST#content: String
         *
         * In a case of self-closing tag (code, html, fence, etc.),
         * it has contents of this tag.
         */
        this.content = "";

        /**
         * AST#markup: String
         *
         * '*' or '_' for emphasis, fence string for fence, etc.
         */
        this.markup = "";

        /**
         * AST#info: String
         *
         * fence info string
         */
        this.info = "";

        /**
         * AST#meta: Object
         *
         * A place for plugins to store an arbitrary data
         */
        this.meta = null;

        /**
         * AST#block: Boolean
         *
         * True for block-level tokens, false for inline tokens.
         * Used in renderer to calculate line breaks
         */
        this.block = false;

        /**
         * AST#hidden: Boolean
         *
         * If it's true, ignore this element when rendering. Used for tight lists
         * to hide paragraphs.
         */
        this.hidden = false;
    }

    /**
     * AST.indexAttr(name): Number
     *
     * Search attribute index by name.
     */
    indexAttr(name) {
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
    pushAttr(attrData) {
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
    setAttr(name, value) {
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
    getAttr(name) {
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
    joinAttr(name, value) {
        var idx = this.attrIndex(name);

        if (idx < 0) {
            this.attrPush([name, value]);
        } else {
            this.attrs[idx][1] = this.attrs[idx][1] + " " + value;
        }
    }
}

export default AST;
