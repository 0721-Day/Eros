export default {
    // 每行代码的最大字符数，超过这个值会自动换行
    printWidth: 80,
  
    // 缩进使用的空格数（或制表符的宽度）
    tabWidth: 4,
  
    // 是否使用制表符 (tab) 进行缩进，true 表示使用制表符，false 表示使用空格
    useTabs: true,
  
    // 是否在语句末尾添加分号
    semi: true,
  
    // 是否使用单引号而不是双引号
    singleQuote: true,
  
    // 对象属性是否使用引号，可选值：
    // - "as-needed": 仅在必要时添加引号
    // - "consistent": 如果有一个属性需要引号，则所有属性都加引号
    // - "preserve": 保留原始的引号使用方式
    quoteProps: 'as-needed',
  
    // 多行时是否在末尾添加逗号，可选值：
    // - "es5": 在 ES5 中有效的结尾逗号（如对象、数组等）
    // - "none": 不加结尾逗号
    // - "all": 所有可能的地方都加逗号（包括函数参数）
    trailingComma: 'es5',
  
    // 箭头函数参数是否使用括号，可选值：
    // - "always": 总是使用括号，例如 (x) => x
    // - "avoid": 当参数只有一个时省略括号，例如 x => x
    arrowParens: 'always',
  
    // 对象字面量中的括号之间是否添加空格，true: { foo: bar }, false: {foo: bar}
    bracketSpacing: true,
  
    // 将多行 JSX 元素的 `>` 放在最后一行的末尾，而不是单独一行
    jsxBracketSameLine: true,
  
    // 行尾换行符，可选值：
    // - "lf": 使用 Unix 风格的换行符（\n）
    // - "crlf": 使用 Windows 风格的换行符（\r\n）
    // - "cr": 使用旧版 Mac 风格的换行符（\r）
    // - "auto": 根据当前操作系统自动选择
    endOfLine: 'lf',
  };