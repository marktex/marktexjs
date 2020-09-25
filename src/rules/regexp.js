export const regexp = {
    /**
     * Horizontal Rules 水平分割线，示例：
     *      ---
     */
    hr: /^\s*((?:[\-] ?){3,})\s*$/gm,
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
    heading: /^(\#{1,6}) +([^\#\n]+(?:\\\n)?)+$/gm,
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
    list: /^\s*(?:(\*|\+|\-)+|\d(\.|\))+) ([^\n]+(?:\\\n)?)+$/gm,
};

export default regexp;
