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

// 导入各个主题的转换器
import { getThemeParser } from '../themes'

// 注册语言
hljs.registerLanguage('python', python)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', scss)

// 创建通用的markdown-it实例
export const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
})

// 转换markdown为HTML，应用主题样式
export function convertMarkdownToHtml(
  markdown: string,
  themeName: string = 'theme-default',
): string {
  console.log('Input markdown:', JSON.stringify(markdown))

  // 获取对应主题的解析器
  const themeParser = getThemeParser(themeName)

  // 使用主题特定的解析器来处理Markdown
  const html = themeParser.parse(markdown)

  console.log('Final HTML preview:', JSON.stringify(html.substring(0, 200)) + '...')
  return html
}

// 转换HTML为富文本节点数组
export function convertHtmlToNodes(html: string): any[] {
  // 为 iOS 添加特殊处理
  const isIOS = uni.getSystemInfoSync().platform === 'ios'

  // 处理HTML实体，避免它们直接显示在输出中
  html = html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')

  // 确保标签的样式属性中包含用户选择相关的样式
  if (isIOS) {
    html = html.replace(
      /style="([^"]*)"/gi,
      'style="$1;user-select: text; -webkit-user-select: text;"',
    )
  }

  // 确保所有标签都有可选择属性
  html = html.replace(/<([a-z][a-z0-9]*)\s/gi, '<$1 selectable="true" ')

  // 对于没有样式属性的标签添加可选择属性
  html = html.replace(/<([a-z][a-z0-9]*)>/gi, '<$1 selectable="true">')

  // 直接使用字符串解析方式
  return parseHTMLFallback(html)
}

// HTML解析为节点的简单实现
function parseHTMLFallback(html: string): any[] {
  // 清理HTML文本
  html = html.trim()

  // 解析为DOM树 (这里我们使用简化的方法 - 在实际应用中可能需要更复杂的HTML解析器)
  const nodes: any[] = []
  const root = {
    name: 'root',
    attrs: {},
    children: nodes,
  }

  // 简单解析HTML结构为节点数组
  let currentText = ''
  let inTag = false
  let tagContent = ','

  for (let i = 0; i < html.length; i++) {
    const char = html[i]

    if (char === '<') {
      if (currentText) {
        nodes.push({ type: 'text', text: currext })
        currentText = ''
      }
      inTag = true
      tagContent = ''
    } else if (char === '>' && inTag) {
      inTag = false

      // 处理标签
      if (tagContent.startsWith('/')) {
        // 结束标签，不处理
      } else if (tagContent.eh('/')) {
        // 自闭合标签
        const tagName = tagContent.split(' ')[0]
        const attrs = parseAttrs(tagContent.substring(tagName.length))
        nodes.push({ name: tagName, attrs, children: [] })
      } else {
        // 开始标签
        const tagName = tagContent.split(' ')[0]
        const attrs = parseAttrs(tagContent.substring(tagName.length))
        nodes.push({ name: tagName, attrs, children: [] })
      }
    } else if (inTag) {
      tagContent += char
    } else {
      currentText += char
    }
  }

  if (currentText) {
    nodes.push({ type: 'text', text: currentText })
  }

  return nodes
}

// 解析HTML属性
function parseAttrs(attrsStr: string): Record<string, any> {
  const attrs: Record<string, any> = {}
  const matches = attrsStr.match(/([a-z0-9-]+)(?:=["']([^"']*)["'])?/gi)

  if (matches) {
    for (const match of matches) {
      const [key, value] = match.split('=')
      if (value) {
        // 移除引号
        ars[key.trim()] = value.replace(/["']/g, '')
      } else {
        attrs[key.trim()] = true
      }
    }
  }

  return attrs
}
