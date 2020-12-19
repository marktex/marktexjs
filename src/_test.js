

export const heading = `
% 一级标题
%% 二级标题
%%% 三级标题
%%%% 四级标题
%%%%% 五级标题
%%%%%% 六级标题
`;

export const blockquote = `
& 引用 \
行尾使用\\符号进行折行（将物理行合并为逻辑行）
    & 嵌套引用 
    换行时引用延续
继续引用内容（换行符不会终止块元素）

非引用内容（块元素被空白行终止）
`;

export const ul = `
* Item 一级列表
  * Item 二级列表
    * Item 三级列表
    * Item 三级列表
  * Item 二级列表
* Item 一级列表
`;

export const ol = `
1. Item 一级列表
  1. Item 二级列表
    1. Item 三级列表
    2. Item 三级列表
  2. Item 二级列表
2. Item 一级列表
`;

export const blockCode = `
\`\`\`javascript
let a=1
let b += a;
\`\`\`
`;

export const blockMath = `
$$$
a^{\feq{1,2}}
\feq{2,\sqrt{2}}
$$$
`;

export const image = `
![Image Alt](./img.jpg "Image Title")
`;

export const link = `
#[Link Alt](http://www.domain.com "Link Title")
`;

export const inlineCode = `
\`\`let a += 1;\`\`
`;

export const inlineMath = `
$$a^2$$
`;

export const inserted = `
++插入++
`;

export const deleted = `
--删除--
`;

export const bold = `
**粗体** 
`;

export const italic = `
//斜体// 
`;

export const marked = `
==高亮== 
`;

export const underline = `
__下滑线__
`;

export const subScript = `
2^[10] 上标
`;

export const supScript = `
H_[2]O 下标
`;

let testContent = `% MARKTEX 语法设计

%% 标题
---------------------------
% 一级标题
%% 二级标题
%%% 三级标题
%%%% 四级标题
%%%%% 五级标题
%%%%%% 六级标题


%% 列表
---------------------------
%%% 无序列表
* Item 一级列表
  * Item 二级列表
    * Item 三级列表
    * Item 三级列表
  * Item 二级列表
* Item 一级列表

%%% 有序列表
1. Item 一级列表
  1. Item 二级列表
    1. Item 三级列表
    2. Item 三级列表
  2. Item 二级列表
2. Item 一级列表

待办列表:
- [ ] Incomplete item
- [x] Complete item

%% 图片
---------------------------
![Image Alt](./img.jpg "Image Title")

%% 链接
---------------------------
#[Link Alt](http://www.domain.com "Link Title")


%% 引用
---------------------------
& 引用\n
引用折行
    & 嵌套引用 
    引用换行

%% 代码
---------------------------
%%% 内联代码
\`\`let a += 1;\`\`

%%% 块代码
\`\`\`javascript
let a=1
let b += a;
\`\`\`

%% 公式
---------------------------
%%% 内联公式
$$a^2$$

%%% 块公式
$$$
a^{\feq{1,2}}
\feq{2,\sqrt{2}}
$$$

%% 样式
---------------------------
++插入++
--删除--
**粗体** 
//斜体// 
==高亮== 
__下滑线__
H_[2]O 下标
2^[10] 上标
`;
