import MarkdownIt from 'markdown-it'
// 使用ESM方式引入highlight.js
import hljs from 'highlight.js/lib/core'
// 按需引入需要的语言
import python from 'highlight.js/lib/languages/python'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'

// 注册语言
hljs.registerLanguage('python', python)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', scss)

// 主题配置
interface ThemeConfig {
  textPrimary: string
  textSecondary: string
  textEmphasis: string
  linkColor: string
  codeBg: string
  borderColor: string
  blockquoteBg: string
  blockquoteBorder: string
  codeText: string
  codeKeyword: string
  codeFunction: string
  codeString: string
  codeComment: string
  background: string
  codeNumber: string
  codeOperator: string
}

// 默认主题
const defaultTheme: ThemeConfig = {
  textPrimary: '#2c3e50',
  textSecondary: '#476582',
  textEmphasis: '#3eaf7c',
  linkColor: '#3eaf7c',
  codeBg: '#f8f8f8',
  borderColor: '#eaecef',
  blockquoteBg: '#f8f8f8',
  blockquoteBorder: '#42b983',
  codeText: '#476582',
  codeKeyword: '#c92c2c',
  codeFunction: '#2973b7',
  codeString: '#42b983',
  codeComment: '#90a4ae',
  background: '#ffffff',
  codeNumber: '#d19a66',
  codeOperator: '#56b6c2',
}

// 暗色主题
const darkTheme: ThemeConfig = {
  textPrimary: '#ffffff',
  textSecondary: '#b3b3b3',
  textEmphasis: '#42b983',
  linkColor: '#42b983',
  codeBg: '#282c34',
  borderColor: '#3e4c5a',
  blockquoteBg: '#1c1c1c',
  blockquoteBorder: '#42b983',
  codeText: '#abb2bf',
  codeKeyword: '#c678dd',
  codeFunction: '#61afef',
  codeString: '#98c379',
  codeComment: '#5c6370',
  background: '#1a1a1a',
  codeNumber: '#d19a66',
  codeOperator: '#56b6c2',
}

// 护眼主题
const greenTheme: ThemeConfig = {
  textPrimary: '#2c3e2e',
  textSecondary: '#3c4a3f',
  textEmphasis: '#67c23a',
  linkColor: '#42b983',
  codeBg: '#f1f8f1',
  borderColor: '#a3d899',
  blockquoteBg: '#f0f9eb',
  blockquoteBorder: '#67c23a',
  codeText: '#476582',
  codeKeyword: '#c92c2c',
  codeFunction: '#2973b7',
  codeString: '#42b983',
  codeComment: '#90a4ae',
  background: '#f0f9eb',
  codeNumber: '#d19a66',
  codeOperator: '#56b6c2',
}

// 创建markdown-it实例
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value

        // Convert highlighted code to inline styles
        const styledCode = highlighted
          .replace(/<span class="hljs-keyword">/g, '<span style="color: #c678dd;">')
          .replace(/<span class="hljs-string">/g, '<span style="color: #98c379;">')
          .replace(/<span class="hljs-comment">/g, '<span style="color: #5c6370;">')
          .replace(/<span class="hljs-function">/g, '<span style="color: #61afef;">')
          .replace(/<span class="hljs-number">/g, '<span style="color: #d19a66;">')
          .replace(/<span class="hljs-operator">/g, '<span style="color: #56b6c2;">')
          .replace(/<span class="hljs-built_in">/g, '<span style="color: #61afef;">')
          .replace(/<span class="hljs-title function_">/g, '<span style="color: #61afef;">')
          .replace(/<span class="hljs-params">/g, '<span style="color: #abb2bf;">')
          .replace(/<span class="hljs-subst">/g, '<span style="color: #abb2bf;">')
          .replace(/<span class="hljs-literal">/g, '<span style="color: #56b6c2;">')

        // Add pre and code with inline styles
        return `<pre style="
          position: relative;
          padding: 1.25em 1.5em;
          margin: 1.2em 0;
          overflow-x: auto;
          background-color: #282c34;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          border: 1px solid rgba(0,0,0,0.1);
        "><code style="
          display: block;
          padding: 0;
          overflow-x: auto;
          font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
          font-size: 0.95em;
          line-height: 1.7;
          color: #abb2bf;
          white-space: pre;
          background: none;
        ">${styledCode}</code></pre>`
      } catch (__) {}
    }

    // Handle non-highlighted code
    return `<pre style="
      position: relative;
      padding: 1em;
      margin: 1.2em 0;
      overflow-x: auto;
      background-color: var(--code-bg);
      border-radius: 8px;
    "><code style="
      display: block;
      padding: 0;
      overflow-x: auto;
      font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
      font-size: 0.9em;
      line-height: 1.6;
      color: var(--code-text);
      white-space: pre;
      background: none;
    ">${md.utils.escapeHtml(str)}</code></pre>`
  },
})

// 自定义渲染规则
function setupRenderer(theme: ThemeConfig) {
  const renderer = md.renderer.rules

  // 标题
  renderer.heading_open = (tokens, idx) => {
    const token = tokens[idx]
    const level = token.tag // h1, h2, etc.
    const style = `
      margin-top: 1.5em;
      margin-bottom: 0.8em;
      font-weight: 600;
      line-height: 1.25;
      color: ${level === 'h1' || level === 'h2' ? theme.textPrimary : theme.textSecondary};
      font-size: ${
        level === 'h1' ? '2em' : level === 'h2' ? '1.65em' : level === 'h3' ? '1.35em' : '1.15em'
      };
      ${level === 'h2' ? `border-bottom: 1px solid ${theme.borderColor};` : ''}
    `
    return `<${token.tag} style="${style}">`
  }

  // 段落
  renderer.paragraph_open = () => {
    return `<p style="margin: 1.2em 0; line-height: 1.75;">`
  }

  // 强调（加粗）
  renderer.strong_open = () => {
    return `<strong style="font-weight: 600; color: ${theme.textEmphasis};">`
  }

  // 链接
  renderer.link_open = (tokens, idx) => {
    return `<a href="${tokens[idx].attrs?.[0][1]}" style="
      color: ${theme.linkColor};
      text-decoration: none;
      font-weight: 500;
    ">`
  }

  // 代码块
  delete renderer.code_block

  // 行内代码
  renderer.code_inline = (tokens, idx) => {
    return `<code style="
      padding: 0.25em 0.5em;
      margin: 0;
      font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
      font-size: 0.9em;
      color: #abb2bf;
      background-color: #282c34;
      border-radius: 4px;
    ">${tokens[idx].content}</code>`
  }

  // 引用块
  renderer.blockquote_open = () => {
    return `<blockquote style="
      padding: 0.8em 1em;
      margin: 1.2em 0;
      color: ${theme.textSecondary};
      background-color: ${theme.blockquoteBg};
      border-left: 4px solid ${theme.blockquoteBorder};
    ">`
  }

  // 列表
  renderer.bullet_list_open = () => {
    return `<ul style="padding-left: 1.2em; margin: 1.2em 0; line-height: 1.6;">`
  }

  renderer.ordered_list_open = () => {
    return `<ol style="padding-left: 1.2em; margin: 1.2em 0; line-height: 1.6;">`
  }

  // 列表项
  renderer.list_item_open = () => {
    return `<li style="margin: 0.5em 0;">`
  }

  // 图片
  renderer.image = (tokens, idx) => {
    const token = tokens[idx]
    const src = token.attrs?.[0][1]
    const alt = token.content
    return `<img src="${src}" alt="${alt}" style="
      max-width: 100%;
      margin: 1.2em 0;
      border-radius: 4px;
    ">`
  }

  return renderer
}

// 主题映射
const themes = {
  'theme-default': defaultTheme,
  'theme-dark': darkTheme,
  'theme-green': greenTheme,
}

// 转换markdown为HTML，应用主题样式
export function convertMarkdownToHtml(
  markdown: string,
  themeName: string = 'theme-default',
): string {
  console.log('Input markdown:', JSON.stringify(markdown))

  const theme = themes[themeName] || defaultTheme
  setupRenderer(theme)

  const html = md.render(markdown)
  console.log('Rendered HTML:', JSON.stringify(html))

  // 添加主题类名到最外层div
  const wrappedHtml = `<div class="${themeName}" style="
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.75;
    color: ${theme.textPrimary};
    background: ${theme.background};
  ">${html}</div>`

  console.log('Final wrapped HTML:', JSON.stringify(wrappedHtml))
  return wrappedHtml
}

// 转换HTML为富文本节点数组
export function convertHtmlToNodes(html: string): any[] {
  // 为 iOS 添加特殊处理
  const isIOS = uni.getSystemInfoSync().platform === 'ios'

  if (isIOS) {
    // 在 iOS 上，我们需要确保所有节点都可以选择
    html = html.replace(
      /<([a-z][a-z0-9]*)\s/gi,
      '<$1 selectable="true" user-select="true" style="user-select: text; -webkit-user-select: text;" ',
    )
  }

  // 修复图片宽度问题
  html = html.replace(
    /<img\s([^>]*?)>/gi,
    '<img $1 style="max-width:100% !important;width:auto !important;height:auto !important;display:block;margin:1.2em auto;">',
  )

  // 直接使用字符串解析方式
  return parseHTMLFallback(html)
}

// 原来的解析方式作为回退方案
function parseHTMLFallback(html: string): any[] {
  const nodes: any[] = []
  const stack: any[] = []
  let currentIndex = 0
  const htmlLength = html.length

  while (currentIndex < htmlLength) {
    // 找到下一个标签开始
    const tagStart = html.indexOf('<', currentIndex)

    if (tagStart === -1) {
      // 处理剩余的文本
      const remainingText = html.slice(currentIndex).trim()
      if (remainingText) {
        const textNode = { type: 'text', text: remainingText }
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(textNode)
        } else {
          nodes.push(textNode)
        }
      }
      break
    }

    // 处理标签前的文本
    if (tagStart > currentIndex) {
      const text = html.slice(currentIndex, tagStart).trim()
      if (text) {
        const textNode = { type: 'text', text }
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(textNode)
        } else {
          nodes.push(textNode)
        }
      }
    }

    // 找到标签结束
    const tagEnd = html.indexOf('>', tagStart)
    if (tagEnd === -1) break

    // 解析标签
    const tag = html.slice(tagStart + 1, tagEnd)

    // 检查是否是结束标签
    if (tag.startsWith('/')) {
      const tagName = tag.slice(1)
      if (stack.length > 0) {
        const node = stack.pop()
        if (stack.length > 0) {
          // 将节点添加到父节点的children中
          stack[stack.length - 1].children.push(node)
        } else {
          // 如果没有父节点，添加到根节点列表
          nodes.push(node)
        }
      }
      currentIndex = tagEnd + 1
      continue
    }

    // 解析开始标签
    const spaceIndex = tag.indexOf(' ')
    const tagName = spaceIndex === -1 ? tag : tag.slice(0, spaceIndex)
    const attrs: Record<string, string> = {}

    // 解析属性
    if (spaceIndex !== -1) {
      const attrString = tag.slice(spaceIndex + 1)
      const attrMatches = attrString.match(/([a-zA-Z-]+)="([^"]*)"/g)
      if (attrMatches) {
        attrMatches.forEach((attr) => {
          const [key, value] = attr.split('=')
          attrs[key] = value.slice(1, -1) // 移除引号
        })
      }

      // 确保所有节点都有这些属性
      attrs.selectable = 'true'

      // 如果是文本相关标签，添加更多属性
      if (
        ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'a', 'code', 'pre'].includes(
          tagName,
        )
      ) {
        if (!attrs.style) attrs.style = ''
        attrs.style += 'user-select: text; -webkit-user-select: text;'
      }
    } else {
      // 如果没有属性，添加基本属性
      attrs.selectable = 'true'
    }

    // 创建节点
    const node = {
      name: tagName,
      attrs,
      children: [],
    }

    // 特殊处理img标签
    if (tagName === 'img') {
      if (!attrs.style) {
        attrs.style = ''
      }
      // 确保图片样式正确，强制设置最大宽度
      attrs.style +=
        'max-width: 100% !important; width: auto !important; height: auto !important; margin: 1.2em auto; border-radius: 4px; display: block;'
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(node)
      } else {
        nodes.push(node)
      }
      currentIndex = tagEnd + 1
      continue
    }

    // 处理自闭合标签
    if (tag.endsWith('/') || ['br', 'hr', 'img'].includes(tagName)) {
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(node)
      } else {
        nodes.push(node)
      }
    } else {
      // 非自闭合标签入栈
      stack.push(node)
    }

    currentIndex = tagEnd + 1
  }

  // 处理未正确闭合的标签
  while (stack.length > 0) {
    const node = stack.pop()
    if (stack.length > 0) {
      stack[stack.length - 1].children.push(node)
    } else {
      nodes.push(node)
    }
  }

  return nodes
}
