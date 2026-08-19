# dsh-base64-file · Base64 文件转换

文件 ↔ base64（含 data URL），用于图片嵌入 HTML/JSON。纯 Node 实现。

## 提供的工具

| 工具 | 作用 |
|---|---|
| `file_to_base64` | 文件 → base64/data URL |
| `base64_to_file` | base64/data URL → 文件 |

## 安装

```bash
dsh plugin add dsh-base64-file
```
安装后在 profile 的 `package.json` 的 `dsh.profile.bundles` 中加入 `"dsh-base64-file"`。

## 用法示例

```
把这张图转成 data URL 嵌入 HTML
→ 调用 file_to_base64(file="logo.png")
```

## 安装

```bash
dsh plugin add github:uckkk/dsh-base64-file
```

> 安装即在本机运行第三方代码，请自行审阅源码。

## 安装

```bash
dsh plugin add github:uckkk/dsh-base64-file
```

## 使用

安装后在会话中调用该插件注册的工具即可。
