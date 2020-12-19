/**
 * 说明：
 *      1）采用正则表达式描述终结符
 * 
 * digit        -> /\d/
 * number       -> digit+
 * letter       -> /\w/
 * string       -> letter+
 * text         -> number | string
 * operator     -> +|-|*|/
 * expression   -> number | operator expression+
 * 
 * S            -> Document
 *               | $
 * 
 * Document     -> Block*
 * Block        -> Heading
 *               | Hr
 *               | Paragraph
 *               | List
 *               | Blockqoute
 *               | Code
 *               | Table
 *               | Variable
 * 
 * Anchor       -> \# Text \#
 * Image        -> \!\[ Span \]\( Src Text \)
 * Link         -> \#\[ Span \]\( Url Text \)
 * Heading       -> \%[1-6] Space Span \n
 * Hr           -> \+{3,} Space* \n | \-{3,} Space* \n | \*{3,} Space* \n | \/{3,} Space* \n
 * Paragraph    -> \n P \n
 * List         -> Li+
 * Code         -> \`\` Text \`\`
 *               | \`\`\` Lang Space \n Text \`\`\`
 * Table        -> Tr+
 * 
 * Span         -> Emphasis Span
 *               | Strong Span
 *               | Deleted Span
 *               | Inserted Span
 *               | Marked Span
 *               | Underline Span
 *               | Text Span
 *               | ε
 * Emphasis       -> // Span // Anchor
 * Strong       -> ** Span ** Anchor
 * Deleted      -> -- Span -- Anchor
 * Inserted     -> ++ Span ++ Anchor
 * Marked       -> == Span == Anchor
 * Underline    -> __ Span __ Anchor
 * 
 * Line         -> Span Line
 *               | Image Line
 *               | Link Line
 *               | \n
 * 
 * Li           -> * Anchor Space P
 *               | - Anchor Space P
 *               | + Anchor Space P
 * P            -> Line+
 * 
 * Tr           -> Cell+ \| \n
 * Cell         -> \|+\:*[\<\>]? Span
 *               | \|\:?[ \t]*\-+[ \t]*\:?
 */