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
  codeText: '#e0e0e0',
  codeKeyword: '#ff7875',
  codeFunction: '#61aeee',
  codeString: '#98c379',
  codeComment: '#676e95',
  background: '#1a1a1a',
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
        // 返回高亮后的HTML，包含必要的样式
        return `<div class="hljs" style="background: none;">${highlighted}</div>`
      } catch (__) {}
    }
    // 如果语言不支持或出错，返回原始代码
    return `<pre><code>${md.utils.escapeHtml(str)}</code></pre>`
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
  renderer.code_block = (tokens, idx) => {
    const content = tokens[idx].content
    return `<pre style="
      padding: 1em;
      margin: 1.2em 0;
      overflow: auto;
      background-color: ${theme.codeBg};
      border-radius: 6px;
    "><code style="
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
      font-size: 0.85em;
      line-height: 1.6;
      color: ${theme.codeText};
    ">${content}
    </code></pre>`
  }

  // 行内代码
  renderer.code_inline = (tokens, idx) => {
    return `<code style="
      padding: 0.25em 0.5em;
      margin: 0 0.2em;
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
      font-size: 0.85em;
      color: ${theme.codeText};
      background-color: ${theme.codeBg};
      border-radius: 3px;
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

  // 添加全局样式
  const html = md.render(markdown)
  console.log('Rendered HTML:', JSON.stringify(html))

  const wrappedHtml = `<div style="
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
  // 简单的HTML解析函数
  function parseHTML(html: string): any[] {
    const nodes: any[] = []
    const stack: any[] = []
    let currentIndex = 0

    while (currentIndex < html.length) {
      // 找到下一个标签开始
      const tagStart = html.indexOf('<', currentIndex)

      if (tagStart === -1) {
        // 剩余的都是文本
        if (currentIndex < html.length) {
          const text = html.slice(currentIndex).trim()
          if (text) {
            const textNode = {
              type: 'text',
              text,
            }
            if (stack.length > 0) {
              stack[stack.length - 1].children.push(textNode)
            } else {
              nodes.push(textNode)
            }
          }
        }
        break
      }

      // 处理标签前的文本
      if (tagStart > currentIndex) {
        const text = html.slice(currentIndex, tagStart).trim()
        if (text) {
          const textNode = {
            type: 'text',
            text,
          }
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
        if (stack.length > 0 && stack[stack.length - 1].name === tagName) {
          const node = stack.pop()
          if (stack.length > 0) {
            stack[stack.length - 1].children.push(node)
          } else {
            nodes.push(node)
          }
        }
        currentIndex = tagEnd + 1
        continue
      }

      // 解析标签名和属性
      const [tagName, ...attrParts] = tag.split(' ')
      const attrs: Record<string, string> = {}

      // 处理属性
      if (attrParts.length > 0) {
        const attrString = attrParts.join(' ')
        // 处理style属性
        const styleMatch = attrString.match(/style="([^"]*)"/)
        if (styleMatch) {
          attrs.style = styleMatch[1]
        }
        // 处理color属性
        const colorMatch = attrString.match(/color="([^"]*)"/)
        if (colorMatch) {
          attrs.color = colorMatch[1]
        }
        // 处理其他属性
        const otherAttrs = attrString.match(/(\w+)="([^"]*)"/g)
        if (otherAttrs) {
          otherAttrs.forEach((attr) => {
            const [key, value] = attr.split('=')
            if (key !== 'style' && key !== 'color') {
              attrs[key] = value.replace(/"/g, '')
            }
          })
        }
      }

      // 创建节点
      const node = {
        name: tagName,
        attrs,
        children: [],
      }

      // 自闭合标签直接添加到当前层级
      if (tag.endsWith('/') || ['img', 'br', 'hr'].includes(tagName)) {
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

    return nodes
  }

  const nodes = parseHTML(html)
  console.log('Parsed nodes:', JSON.stringify(nodes, null, 2))
  return nodes
}
