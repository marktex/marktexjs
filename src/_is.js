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
export const is = {
    /**
     * Sequence is important!
     * @{
     */
    wrap: () => {}, // /\\\n/
    newline: () => {}, // /\n/
    /**
     * @}
     */
    /**
     * Sequence is important!
     * @{
     */
    indent: () => {}, // /(?<=\n)[ \t]+/
    dedent: () => {}, // /(?<=\n)[ \t]+/
    space: (src) => {
        return /^[ \t]+/.test(src);
    }, // /[ \t]+/
    /**
     * @}
     */

    heading: () => {}, // /\#+ /
    hr: () => {}, // /[\+\-\*\/]{3,}/
    // paragraph: () => {},
    // list: () => {},
    li: () => {}, // /[\*\+\-] /
    blockqoute: () => {}, // /> /
    // table: () => {},
    // tr: () => {},
    td: () => {}, // /\|+\:*[<>]?/
    variable: () => {}, // /[\.\!\#\^\&][a-zA-Z\-\_][a-zA-Z0-9\-\_]*\:\s* */
    // span: () => {},
    anchor: () => {}, // /#[a-zA-Z\-\_][a-zA-Z\-\_0-9]*\#/
    fence: () => {}, // /\`\`\`+/
    code: () => {}, // /\`\`/
    strong: () => {}, // /\*\*/
    emphasis: () => {}, // /\/\//
    inserted: () => {}, // /\+\+/
    deleted: () => {}, // /\-\-/
    marked: () => {}, // /\=\=/
    underline: () => {}, // /\_\_/
    /**
     * Must be before the LBracket.
     * @{
     */
    image: () => {}, // /\!\[/
    link: () => {}, // /\#\[/
    sub: () => {}, // /\^\[/
    sup: () => {}, // /\_\[/
    footnote: () => {}, // /\[\^/
    /**
     * @}
     */
    // emoji: () => {},
    lbrace: () => {}, // /\{/
    rbrace: () => {}, // /\}/
    lbracket: () => {}, // /\[/
    rbracket: () => {}, // /\]/
    lparen: () => {}, // /\(/
    rparen: () => {}, // /\)/
    text: () => {}, // /(?:)/
};