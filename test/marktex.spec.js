const fs = require("fs");
const path = require("path")

const mt = require("../marktex")

const tpl = {
    hr: path.resolve(__dirname, "./hr.md"),
    heading: path.resolve(__dirname, "./heading.md"),
    code: path.resolve(__dirname, "./code.md"),
    emphasis: path.resolve(__dirname, "./emphasis.md"),

    list: path.resolve(__dirname, "./list.md"),
    abbreviation: path.resolve(__dirname, "./abbreviation.md"),
    blockquote: path.resolve(__dirname, "./blockquote.md"),
    container: path.resolve(__dirname, "./container.md"),
    definition: path.resolve(__dirname, "./definition.md"),
    emoji: path.resolve(__dirname, "./emoji.md"),
    footnote: path.resolve(__dirname, "./footnote.md"),
    image: path.resolve(__dirname, "./image.md"),
    insert: path.resolve(__dirname, "./insert.md"),
    link: path.resolve(__dirname, "./link.md"),
    replacement: path.resolve(__dirname, "./replacement.md"),
    subscript: path.resolve(__dirname, "./subscript.md"),
    table: path.resolve(__dirname, "./table.md"),
    template: path.resolve(__dirname, "./template.md"),
}

fs.readFile(tpl.list, function(err, data){
    if(err){
        console.log(err);
        res.send("文件不存在！");
    }else{
        // console.log(data.toString());
        mt(data.toString());
    } 
});