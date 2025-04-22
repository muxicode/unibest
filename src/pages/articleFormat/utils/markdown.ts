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
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value

        return highlighted
      } catch (__) {}
    }
    return md.utils.escapeHtml(str)
  },
})

// 转换markdown为HTML，应用主题样式
export function convertMarkdownToHtml(
  markdown: string,
  themeName: string = 'theme-default',
): string {
  console.log('Input markdown:', JSON.stringify(markdown))

  // 特殊处理font标签和strong标签的保留
  markdown = preserveCustomFormatting(markdown)

  // 获取对应主题的解析器
  const themeParser = getThemeParser(themeName)

  // 使用主题特定的解析器来处理Markdown
  const html = themeParser.parse(markdown, md, hljs)

  console.log('Final HTML preview:', JSON.stringify(html.substring(0, 200)) + '...')
  return html
}

// 预处理markdown，保留特定格式标签
function preserveCustomFormatting(markdown: string): string {
  // 清理任何可能已经转义的HTML实体，确保我们处理的是干净的HTML
  markdown = markdown
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')

  // 处理 <strong><font color="#xxx"> 形式
  markdown = markdown.replace(
    /<strong><font\s+color=["']([^"']*)["']((?:\s+style=["'][^"']*["'])?)>(.*?)<\/font><\/strong>/gi,
    (match, color, style, content) => {
      return `<strong data-has-font="true"><font color="${color}"${style || ''}>${content}</font></strong>`
    },
  )

  // 处理 <font color="#xxx"> 形式
  markdown = markdown.replace(
    /<font\s+color=["']([^"']*)["']((?:\s+style=["'][^"']*["'])?)>(.*?)<\/font>/gi,
    (match, color, style, content) => {
      if (!match.includes('<strong>')) {
        // 避免重复处理
        return `<font color="${color}"${style || ''}>${content}</font>`
      }
      return match
    },
  )

  // 清理任何残留的preserved-format div
  markdown = markdown.replace(
    /<div\s+class=["']preserved-format["'][^>]*data-color=["']([^"']*)["'][^>]*data-style=["']([^"']*)["'][^>]*data-content=["']([^"']*)["'][^>]*>(.*?)<\/div>/gi,
    (match, color, style, content, origContent) => {
      try {
        const decodedContent = decodeURIComponent(content)
        if (match.includes('data-type="font"')) {
          return `<font color="${color}"${style ? ' ' + style : ''}>${decodedContent}</font>`
        } else {
          return `<strong><font color="${color}"${style ? ' ' + style : ''}>${decodedContent}</font></strong>`
        }
      } catch (e) {
        // 如果解码失败，返回原内容
        return origContent
      }
    },
  )

  return markdown
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

  // 处理显示为文本的div标签
  html = html.replace(
    /&lt;div class=&quot;preserved-format&quot; data-color=&quot;([^&quot;]*)&quot; data-style=&quot;([^&quot;]*)&quot; data-content=&quot;([^&quot;]*)&quot;&gt;/g,
    (match, color, style, content) => {
      try {
        const decodedContent = decodeURIComponent(content)
        return `<font color="${color}"${style ? ' ' + style : ''}>${decodedContent}</font>`
      } catch (e) {
        // 如果解码失败，尽量保留原始格式
        return `<font color="${color}"${style ? ' ' + style : ''}>preserved content</font>`
      }
    },
  )

  // 处理结束的div标签
  html = html.replace(/&lt;\/div&gt;/g, '')

  // 处理文本中的font标签
  html = html.replace(
    /&lt;font color=&quot;([^&quot;]*)&quot;([^&gt;]*)&gt;(.*?)&lt;\/font&gt;/g,
    (match, color, attrs, content) => {
      return `<font color="${color}"${attrs ? attrs.replace(/&quot;/g, '"') : ''}>${content}</font>`
    },
  )

  // 直接保留font标签的color属性
  html = html.replace(
    /<font\s+color=["']([^"']*)["']([^>]*)>/gi,
    '<font color="$1" $2 data-preserve-color="true">',
  )

  // 直接保留带style的font标签
  html = html.replace(
    /<font\s+style=["']([^"']*)["']([^>]*)>/gi,
    '<font style="$1" $2 data-preserve-style="true">',
  )

  // 特殊处理strong包裹的font标签
  html = html.replace(
    /<strong[^>]*>(<font[^>]*>)/gi,
    '<strong data-has-font="true" selectable="true">$1',
  )

  // 修复图片宽度问题
  html = html.replace(/<img\s([^>]*?)>/gi, (match, attrs) => {
    // 提取src和alt属性
    const srcMatch = attrs.match(/src=["']([^"']*)["']/i)
    const altMatch = attrs.match(/alt=["']([^"']*)["']/i)

    const src = srcMatch ? srcMatch[1] : ''
    const alt = altMatch ? altMatch[1] : ''

    return `<img src="${src}" alt="${alt}" style="max-width:100% !important;width:auto !important;height:auto !important;display:block;margin:1.2em auto;max-width: 100% !important; width: auto !important; height: auto !important; margin: 1.2em auto; border-radius: 4px; display: block;" selectable="true">`
  })

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

  // 添加section嵌套来匹配预期结构 - 这是关键修改
  if (!html.includes('<section id="nice"')) {
    // 提取现有section的样式
    const sectionStyleMatch = html.match(/<section\s+style="([^"]*)"/i)
    const sectionStyle = sectionStyleMatch ? sectionStyleMatch[1] : ''

    // 创建嵌套结构
    html = html.replace(
      /<section\s+style="([^"]*)"\s*selectable="true">([\s\S]*?)<\/section>/i,
      `<section style="$1" selectable="true"><section id="nice" data-tool="mdnice编辑器" data-website="https://www.mdnice.com" style="margin-top: 0px; margin-bottom: 0px; margin-left: 0px; margin-right: 0px; padding-top: 0px; padding-bottom: 0px; padding-left: 10px; padding-right: 10px; background-attachment: scroll; background-clip: border-box; background-color: rgba(0, 0, 0, 0); background-image: none; background-origin: padding-box; background-position-x: 0%; background-position-y: 0%; background-repeat: no-repeat; background-size: auto; width: auto; font-family: Optima, PingFangSC-regular, serif; font-size: 16px; color: rgb(0, 0, 0); line-height: 1.5em; word-spacing: 0em; letter-spacing: 0em; word-break: break-word; overflow-wrap: break-word; text-align: left;" selectable="true">$2</section></section>`,
    )
  }

  // 改进段落样式匹配预期
  html = html.replace(
    /<p\s+style="([^"]*)"\s*selectable="true">/gi,
    '<p data-tool="mdnice编辑器" style="$1;color: rgb(90, 90, 90); font-size: 15px; line-height: 1.8em; letter-spacing: 0.02em; text-align: left; text-indent: 0em; margin-top: 10px; margin-bottom: 10px; margin-left: 0px; margin-right: 0px; padding-top: 8px; padding-bottom: 8px; padding-left: 0px; padding-right: 0px;user-select: text; -webkit-user-select: text;" selectable="true">',
  )

  // 改进标题样式匹配预期
  html = html.replace(
    /<h([1-6])\s+style="([^"]*)"\s*selectable="true">/gi,
    '<h$1 data-tool="mdnice编辑器" style="$2;user-select: text; -webkit-user-select: text;" selectable="true">',
  )

  // 改进列表样式匹配预期
  html = html.replace(
    /<(ol|ul)\s+style="([^"]*)"\s*selectable="true">/gi,
    '<$1 data-tool="mdnice编辑器" style="$2" selectable="true">',
  )

  // 改进列表项样式
  html = html.replace(/<li\s+style="([^"]*)"\s*selectable="true">/gi, '<li selectable="true">')

  // 确保列表项中包含section
  html = html.replace(/<li selectable="true">(.*?)<\/li>/gi, (match, content) => {
    // 如果内容不以<section开头，则包裹一个section
    if (!content.trim().startsWith('<section')) {
      return `<li selectable="true"><section style="margin-top: 5px; margin-bottom: 5px; color: rgb(90, 90, 90); font-size: 15px; line-height: 1.8em; letter-spacing: 0.02em; text-align: left; font-weight: normal;" selectable="true">${content}</section></li>`
    }
    return match
  })

  // 彻底修改列表处理，确保标题等块级元素不被嵌套进列表
  html = restructureHTML(html)

  // 直接使用字符串解析方式
  return parseHTMLFallback(html)
}

// 完全重构HTML，确保适当的块级元素嵌套
function restructureHTML(html: string): string {
  // 将HTML按块级元素分割处理
  const blocks: string[] = []

  // 分离出所有h1-h6标题
  const headingRegex = /<h([1-6])[^>]*>[\s\S]*?<\/h\1>/gi
  const lastIndex = 0
  let match

  // 匹配所有头部元素
  const blockElements = [
    { regex: /<h([1-6])[^>]*>[\s\S]*?<\/h\1>/gi, type: 'heading' },
    { regex: /<p[^>]*>[\s\S]*?<\/p>/gi, type: 'paragraph' },
    { regex: /<(ul|ol)[^>]*>[\s\S]*?<\/\1>/gi, type: 'list' },
    { regex: /<img[^>]*>/gi, type: 'image' },
  ]

  // 所有匹配的块及其位置
  const allMatches: Array<{ start: number; end: number; content: string; type: string }> = []

  // 找到所有块级元素及其位置
  for (const element of blockElements) {
    let elementMatch
    const regex = new RegExp(element.regex)
    while ((elementMatch = regex.exec(html)) !== null) {
      allMatches.push({
        start: elementMatch.index,
        end: elementMatch.index + elementMatch[0].length,
        content: elementMatch[0],
        type: element.type,
      })
    }
  }

  // 按开始位置排序
  allMatches.sort((a, b) => a.start - b.start)

  // 找出最外层元素（不被其他元素包含的元素）
  const topLevelBlocks: Array<{ start: number; end: number; content: string; type: string }> = []

  for (let i = 0; i < allMatches.length; i++) {
    const current = allMatches[i]
    let isContained = false

    for (let j = 0; j < allMatches.length; j++) {
      if (i === j) continue

      const other = allMatches[j]
      if (current.start > other.start && current.end < other.end) {
        isContained = true
        break
      }
    }

    if (!isContained) {
      topLevelBlocks.push(current)
    }
  }

  // 按开始位置排序
  topLevelBlocks.sort((a, b) => a.start - b.start)

  // 如果有列表，处理嵌套列表的问题
  html = fixNestedListIssues(html)

  // 如果是标题元素，确保它在最外层
  html = html.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (match) => {
    // 确保标题前后有正确关闭的标签
    return `</li></ul></ol></section>${match}`
  })

  // 修复由于添加的关闭标签导致的多余标签
  html = html.replace(/(<\/li>|<\/ul>|<\/ol>){2,}/gi, (match) => {
    // 保留一个结束标签，简化多余的嵌套
    return match.substring(0, match.indexOf('</') + 5)
  })
  html = html.replace(/<\/li>(?!<li|<\/ul>|<\/ol>)/gi, '</li></ul>')
  html = html.replace(/<\/ul><\/ol><\/ul><\/ol>/gi, '</ul></ol>')
  html = html.replace(/<\/ol><\/ul><\/ol><\/ul>/gi, '</ol></ul>')

  // 移除头部的关闭标签
  html = html.replace(/^(<\/[^>]+>)+/gi, '')

  // 处理悬空的列表项
  html = html.replace(
    /<li selectable="true">([\s\S]*?)<\/li>(?!<li|<\/ul>|<\/ol>)/gi,
    '<li selectable="true">$1</li></ul>',
  )

  // 在所有h1-h6标签前强制闭合任何可能的列表结构
  let cleanedHtml = ''
  const sections = html.split(/(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>)/gi)

  for (let i = 0; i < sections.length; i++) {
    if (i > 0 && sections[i].match(/^<h[1-6]/i)) {
      // 在每个标题前添加关闭标签
      cleanedHtml += '</li></ul></ol>'
    }
    cleanedHtml += sections[i]
  }

  // 清理多余标签
  html = cleanedHtml.replace(/(<\/li>|<\/ul>|<\/ol>){3,}/gi, '</li></ul></ol>')

  // 最后一步：确保所有列表都有开始和结束标签
  const openTags = {
    ol: (html.match(/<ol[^>]*>/gi) || []).length,
    ul: (html.match(/<ul[^>]*>/gi) || []).length,
    li: (html.match(/<li[^>]*>/gi) || []).length,
  }

  const closeTags = {
    ol: (html.match(/<\/ol>/gi) || []).length,
    ul: (html.match(/<\/ul>/gi) || []).length,
    li: (html.match(/<\/li>/gi) || []).length,
  }

  // 添加缺失的闭合标签
  if (openTags.ol > closeTags.ol) {
    for (let i = 0; i < openTags.ol - closeTags.ol; i++) {
      html += '</ol>'
    }
  }

  if (openTags.ul > closeTags.ul) {
    for (let i = 0; i < openTags.ul - closeTags.ul; i++) {
      html += '</ul>'
    }
  }

  if (openTags.li > closeTags.li) {
    for (let i = 0; i < openTags.li - closeTags.li; i++) {
      html += '</li>'
    }
  }

  // 在处理color属性后还原所有保留的格式标签
  html = html.replace(
    /<div\s+class="preserved-format"[^>]*data-color="([^"]*)"[^>]*data-style="([^"]*)"[^>]*data-content="([^"]*)"[^>]*>([\s\S]*?)<\/div>/gi,
    (match, color, style, content, original) => {
      // 直接返回原始内容，确保不被破坏
      const decodedContent = decodeURIComponent(content)
      if (match.includes('data-type="font"')) {
        return `<font color="${color}"${style ? ' ' + style : ''}>${decodedContent}</font>`
      } else {
        return `<strong><font color="${color}"${style ? ' ' + style : ''}>${decodedContent}</font></strong>`
      }
    },
  )

  return html
}

// 修复嵌套列表问题
function fixNestedListIssues(html: string): string {
  // 1. 确保列表项不包含不该有的内容
  html = html.replace(
    /<li selectable="true">([\s\S]*?)(<h[1-6]|<\/section><h[1-6])/gi,
    (match, content, heading) => {
      return `<li selectable="true">${content}</li>${heading}`
    },
  )

  // 2. 确保每个列表都正确关闭
  const openLists = (html.match(/<(ol|ul)[^>]*>/g) || []).length
  const closeLists = (html.match(/<\/(ol|ul)>/g) || []).length

  // 如果开标签多于闭标签，添加缺失的闭标签
  if (openLists > closeLists) {
    for (let i = 0; i < openLists - closeLists; i++) {
      html += '</ul></ol>'.substring(0, 5) // 添加一个通用的结束标签
    }
  }

  // 3. 强制在h1-h6之前闭合所有列表
  html = html.replace(/(<h[1-6][^>]*>)/gi, '</ul></ol></li>$1')

  // 4. 清理多余的闭合标签
  html = html.replace(/<\/ul><\/ol><\/li>(<h[1-6])/gi, '</ul></ol>$1')

  // 5. 移除没有对应开标签的闭标签
  html = html.replace(/^(<\/[^>]+>)+/, '')

  return html
}

// 解析HTML字符串为Nodes，兼容处理
function parseHTMLFallback(html: string): any[] {
  // 预处理HTML，确保所有实体都正确解码
  html = html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')

  // 处理preserved-format div标签，将它们转换为实际的font/strong标签
  html = html.replace(
    /<div\s+class=["']preserved-format["'][^>]*data-color=["']([^"']*)["'][^>]*data-style=["']([^"']*)["'][^>]*data-content=["']([^"']*)["'][^>]*>(.*?)<\/div>/gi,
    (match, color, style, content, origContent) => {
      try {
        const decodedContent = decodeURIComponent(content)
        if (match.includes('data-type="font"')) {
          return `<font color="${color}"${style ? ' ' + style : ''}>${decodedContent}</font>`
        } else {
          return `<strong><font color="${color}"${style ? ' ' + style : ''}>${decodedContent}</font></strong>`
        }
      } catch (e) {
        // 如果解码失败，返回原内容
        return origContent
      }
    },
  )

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

    // 解析属性 - 改进属性解析逻辑
    if (spaceIndex !== -1) {
      const attrString = tag.slice(spaceIndex + 1)

      // 用更健壮的方式解析属性
      const attrRegex = /([a-zA-Z0-9_-]+)="((?:[^"\\]|\\"|\\\\)*?)"/g
      let match

      while ((match = attrRegex.exec(attrString)) !== null) {
        const [_, key, value] = match
        // 解码属性值
        attrs[key] = value.replace(/\\"/g, '"').replace(/\\\\/g, '\\')
      }

      // 确保所有节点都有selectable属性
      if (!attrs.selectable) {
        attrs.selectable = 'true'
      }

      // 特殊处理font标签的color属性
      if (tagName === 'font' && attrs.color) {
        // 确保color属性同时存在于style属性中
        if (!attrs.style) {
          attrs.style = `color: ${attrs.color};`
        } else if (!attrs.style.includes('color:')) {
          attrs.style += `;color: ${attrs.color};`
        }
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
    if (tag.endsWith('/') || ['br', 'hr', 'img', 'input'].includes(tagName)) {
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

  // 确保所有子元素的样式被正确保留（特别是color属性）
  const ensureChildrenStylesPreserved = (children: any[]) => {
    return children.map((child) => {
      // 如果子元素有fontColor属性，确保它也存在于style中
      if (child.fontColor) {
        // 确保color在style字符串中
        if (!child.style) {
          child.style = `color: ${child.fontColor};`
        } else if (typeof child.style === 'string' && !child.style.includes('color:')) {
          child.style += `;color: ${child.fontColor};`
        } else if (typeof child.style === 'object') {
          // 将style对象转换为字符串
          const styleObj = { ...child.style, color: child.fontColor }
          let styleStr = ''
          for (const key in styleObj) {
            if (Object.prototype.hasOwnProperty.call(styleObj, key)) {
              styleStr += `${key}: ${styleObj[key]};`
            }
          }
          child.style = styleStr
        }
      }

      // 递归处理子元素的子元素
      if (child.children && child.children.length > 0) {
        child.children = ensureChildrenStylesPreserved(child.children)
      }

      return child
    })
  }

  // 根据标签名和属性创建node
  const createNode = (tagName: string, attrs: Record<string, any> = {}, children: any[] = []) => {
    // 特殊处理font标签，确保color属性被保留
    if (tagName === 'font' && attrs.color) {
      // 确保color属性同时存在于style字符串中，uniapp rich-text组件需要直接的style字符串而不只是style对象
      if (!attrs.style) {
        attrs.style = `color: ${attrs.color};`
      } else if (!attrs.style.includes('color:')) {
        attrs.style += `;color: ${attrs.color};`
      }

      return {
        type: 'text',
        children: ensureChildrenStylesPreserved(children),
        fontColor: attrs.color,
        font: 'STHeitiSC-Medium',
        textDecoration: 'none',
        ...attrs,
        // 确保style是字符串，不是对象
        style: attrs.style,
      }
    }

    // 特殊处理strong标签
    if (tagName === 'strong') {
      const hasFont = attrs['data-has-font'] === 'true'

      // 检查子元素中是否有font标签并获取其颜色
      let fontColor = null
      if (children.length > 0) {
        // 深度搜索查找font标签
        const findFontColor = (items: any[]): string | null => {
          for (const item of items) {
            if (item.fontColor) return item.fontColor
            if (item.children && item.children.length > 0) {
              const color = findFontColor(item.children)
              if (color) return color
            }
          }
          return null
        }

        fontColor = findFontColor(children)
      }

      // 确保字体颜色同时存在于style字符串中
      if (fontColor) {
        if (!attrs.style) {
          attrs.style = `color: ${fontColor};`
        } else if (!attrs.style.includes('color:')) {
          attrs.style += `;color: ${fontColor};`
        }
      }

      return {
        type: 'text',
        children: ensureChildrenStylesPreserved(children),
        fontWeight: 'bold',
        font: 'STHeitiSC-Medium',
        ...attrs,
        // 如果strong内部有带color的font，则把color保留
        ...(fontColor ? { fontColor } : {}),
      }
    }

    // 根据标签生成不同类型的节点
    switch (tagName) {
      case 'div':
        // 处理我们特别标记的带颜色的div
        if (attrs['data-is-colored'] === 'true' && attrs['data-color']) {
          // 确保color在style字符串中
          if (!attrs.style) {
            attrs.style = `color: ${attrs['data-color']};`
          } else if (!attrs.style.includes('color:')) {
            attrs.style += `;color: ${attrs['data-color']};`
          }

          return {
            type: 'text',
            children: ensureChildrenStylesPreserved(children),
            fontColor: attrs['data-color'],
            font: 'STHeitiSC-Medium',
            ...attrs,
          }
        }
        return {
          type: 'view',
          ...attrs,
          children: ensureChildrenStylesPreserved(children),
        }
      case 'a':
        return {
          type: 'text',
          fontWeight: 'regular',
          textDecoration: 'none',
          ...attrs,
          children: ensureChildrenStylesPreserved(children),
        }
      case 'p':
        return {
          type: 'paragraph',
          fontWeight: 'regular',
          font: 'STHeitiSC-Light',
          fontSize: '0.8rem',
          ...attrs,
          children: ensureChildrenStylesPreserved(children),
        }
      case 'span':
        return {
          type: 'text',
          fontWeight: 'regular',
          ...attrs,
          children: ensureChildrenStylesPreserved(children),
        }
      case 'section':
        // 对于section类型，我们需要确保所有子元素的样式都正确保留
        return {
          type: 'view',
          selectable: true,
          ...attrs,
          children: ensureChildrenStylesPreserved(children),
        }
      case 'article':
        return {
          type: 'view',
          ...attrs,
          children: ensureChildrenStylesPreserved(children),
        }
      default:
        return {
          type: 'view',
          ...attrs,
          children: ensureChildrenStylesPreserved(children),
        }
    }
  }

  // 特殊处理用于文本显示的HTML实体标签，可能出现在内容中而不是实际标签
  const processTextEntities = (node: any) => {
    if (node.type === 'text' && typeof node.text === 'string') {
      // 处理显示为文本的div/font标签
      node.text = node.text.replace(
        /&lt;div class=&quot;preserved-format&quot; .*?&gt;|&lt;\/div&gt;/g,
        '',
      )

      node.text = node.text.replace(
        /&lt;font color=&quot;([^&quot;]*)&quot;.*?&gt;(.*?)&lt;\/font&gt;/g,
        '$2',
      )
    }

    // 递归处理子节点
    if (Array.isArray(node.children)) {
      node.children.forEach(processTextEntities)
    }

    return node
  }

  const finalNodes = nodes
  // 递归处理所有节点
  finalNodes.forEach(processTextEntities)

  return finalNodes
}
