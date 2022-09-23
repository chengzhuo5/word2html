# word2html Word 转 html

此工具用于将 Word 文档转换成 HTML 文件，并添加一些样式使其能在移动端正常显示。

## 使用方式

先安装依赖：

```bash
pnpm i
pnpm run package
```

再将`dist/word2html.exe`复制到需要转换的 word 文件夹中，双击`word2html.exe`，即可转换当前文件夹及子文件夹中所有的 doc、docx 文件到`output`文件夹中。

## 运行环境

需要 Windows 系统和 Microsoft Office Word。

## 原理

本工具使用[DocTo](https://github.com/tobya/DocTo)调用 Word 的[API](https://learn.microsoft.com/en-us/dotnet/api/microsoft.office.interop.word?view=word-pia)将 Word 文档转换成 HTML 文件，再调用[JSDOM](https://github.com/jsdom/jsdom)进行后期处理。
