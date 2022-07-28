module.exports = {
    // 一行最多 100 字符
    printWidth: 100,
    // 使用 4 个空格缩进
    tabWidth: 4,
    // 不使用 tab 缩进，而使用空格
    useTabs: false,
    // 行尾需要有分号
    semi: true,
    // vue文件的script标签和Style标签下的内容需要缩进
    vueIndentScriptAndStyle: true,
    // 使用单引号代替双引号
    singleQuote: true,
    // 对象的 key 仅在必要时用引号
    quoteProps: 'as-needed',
    // 大括号内的首尾需要空格 { foo: bar }
    bracketSpacing: true,
    // 末尾不使用逗号
    trailingComma: 'none',
    // 箭头函数，只有一个参数的时候，也需要括号
    arrowParens: 'always',
    // 不需要自动在文件开头插入 @prettier
    insertPragma: false,
    // 不需要写文件开头的 @prettier
    requirePragma: false,
    // 折行标准 如果散文超过宽度，则换行。
    proseWrap: 'always',
    // 空白敏感性 "strict"- 所有标签周围的空格（或缺少空格）被认为是重要的。
    htmlWhitespaceSensitivity: 'strict',
    // 换行符使用 lf
    endOfLine: 'auto'
};
