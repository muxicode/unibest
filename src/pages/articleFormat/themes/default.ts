import { ThemeParser } from './index'
import MarkdownIt from 'markdown-it'

// 默认主题解析器 (紫色风格)
export const defaultThemeParser: ThemeParser = {
  name: 'theme-default',
  description: '姹紫主题',
  parse: (markdown: string): string => {
    // 预处理Markdown，确保图片能正确展示
    const processedMarkdown = markdown
      // 将markdown格式的图片语法转换为HTML图片标签
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<image src="$2" alt="$1">')

    // 样式模板，使用和提供的样式示例一致的样式
    const themeStyles = {
      wrapper:
        "margin-top: 0px; margin-bottom: 0px; margin-left: 0px; margin-right: 0px; padding-top: 0px; padding-bottom: 0px; padding-left: 10px; padding-right: 10px; background-attachment: scroll; background-clip: border-box; background-color: rgba(0, 0, 0, 0); background-image: linear-gradient(90deg, rgba(50, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 6.76%), linear-gradient(360deg, rgba(50, 0, 0, 0.05) 0%, rgba(249, 247, 252, 0) 9.46%); background-origin: padding-box; background-position-x: 0%; background-position-y: 0%; background-repeat: repeat, repeat; background-size: 20px 20px, 20px 20px; width: auto; font-family: Optima, 'Microsoft YaHei', PingFangSC-regular, serif; font-size: 16px; color: rgb(0, 0, 0); line-height: 1.5em; word-spacing: 0em; letter-spacing: 0em; word-break: break-word; overflow-wrap: break-word; text-align: left;",
      h1: 'margin-top: 30px; margin-bottom: 15px; margin-left: 0px; margin-right: 0px; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; display: block;',
      h1Content:
        'font-size: 24px; color: rgb(89, 89, 89); line-height: 1.5em; letter-spacing: 0em; text-align: left; font-weight: bold; display: block;',
      h2: 'margin-top: 30px; margin-bottom: 15px; margin-left: 0px; margin-right: 0px; align-items: unset; background-attachment: scroll; background-clip: border-box; background-color: unset; background-image: none; background-origin: padding-box; background-position-x: 0%; background-position-y: 0%; background-repeat: no-repeat; background-size: auto; border-top-style: none; border-bottom-style: none; border-left-style: none; border-right-style: none; border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-width: 1px; border-top-color: rgb(0, 0, 0); border-bottom-color: rgb(0, 0, 0); border-left-color: rgb(0, 0, 0); border-right-color: rgb(0, 0, 0); border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-left-radius: 0px; border-bottom-right-radius: 0px; box-shadow: none; display: block; flex-direction: unset; float: unset; height: auto; justify-content: unset; line-height: 1.5em; overflow-x: unset; overflow-y: unset; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; position: relative; text-align: left; text-shadow: none; transform: none; width: auto; -webkit-box-reflect: unset;',
      h2Content:
        'font-size: 18px; color: rgb(89, 89, 89); line-height: 1.8em; letter-spacing: 0em; padding-top: 0px; padding-bottom: 0px; padding-left: 10px; padding-right: 0px; border-top-style: none; border-bottom-style: none; border-left-style: solid; border-right-style: none; border-top-width: 1px; border-bottom-width: 1px; border-left-width: 5px; border-right-width: 1px; border-top-color: rgb(0, 0, 0); border-bottom-color: rgb(0, 0, 0); border-left-color: rgb(222, 198, 251); border-right-color: rgb(0, 0, 0); border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-left-radius: 0px; border-bottom-right-radius: 0px; align-items: unset; background-attachment: scroll; background-clip: border-box; background-color: unset; background-image: none; background-origin: padding-box; background-position-x: 0%; background-position-y: 0%; background-repeat: no-repeat; background-size: auto; box-shadow: none; display: block; font-weight: bold; flex-direction: unset; float: unset; height: auto; justify-content: unset; margin-top: 0px; margin-bottom: 0px; margin-left: 0px; margin-right: 0px; overflow-x: unset; overflow-y: unset; position: relative; text-align: left; text-indent: 0em; text-shadow: none; transform: none; width: auto; -webkit-box-reflect: unset;',
      h3: 'margin-top: 30px; margin-bottom: 15px; margin-left: 0px; margin-right: 0px; align-items: unset; background-attachment: scroll; background-clip: border-box; background-color: transparent; background-image: none; background-origin: padding-box; background-position-x: 0%; background-position-y: 0%; background-repeat: no-repeat; background-size: auto; border-top-style: none; border-bottom-style: none; border-left-style: none; border-right-style: none; border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-width: 1px; border-top-color: rgb(0, 0, 0); border-bottom-color: rgb(0, 0, 0); border-left-color: rgb(0, 0, 0); border-right-color: rgb(0, 0, 0); border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-left-radius: 0px; border-bottom-right-radius: 0px; box-shadow: none; display: flex; flex-direction: unset; float: unset; height: auto; justify-content: center; line-height: 1.5em; overflow-x: unset; overflow-y: unset; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; position: relative; text-align: left; text-shadow: none; transform: none; width: auto; -webkit-box-reflect: unset;',
      h3Content:
        'font-size: 17px; color: rgb(89, 89, 89); border-bottom-color: rgb(222, 198, 251); line-height: 1.5em; letter-spacing: 0em; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; align-items: unset; background-attachment: scroll; background-clip: border-box; background-color: transparent; background-image: none; background-origin: padding-box; background-position-x: 0%; background-position-y: 0%; background-repeat: no-repeat; background-size: auto; border-top-style: none; border-bottom-style: solid; border-left-style: none; border-right-style: none; border-top-width: 1px; border-bottom-width: 2px; border-left-width: 1px; border-right-width: 1px; border-top-color: rgb(0, 0, 0); border-left-color: rgb(0, 0, 0); border-right-color: rgb(0, 0, 0); border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-left-radius: 0px; border-bottom-right-radius: 0px; box-shadow: none; display: inline; font-weight: bold; flex-direction: unset; float: unset; height: auto; justify-content: unset; margin-top: 0px; margin-bottom: 0px; margin-left: 0px; margin-right: 0px; overflow-x: unset; overflow-y: unset; position: relative; text-align: left; text-indent: 0em; text-shadow: none; transform: none; width: auto; -webkit-box-reflect: unset;',
      p: 'color: rgb(89, 89, 89); font-size: 17px; line-height: 1.8em; letter-spacing: 0.02em; text-align: left; text-indent: 0em; margin-top: 0px; margin-bottom: 0px; margin-left: 0px; margin-right: 0px; padding-top: 8px; padding-bottom: 8px; padding-left: 0px; padding-right: 0px;',
      ul: 'list-style-type: circle; margin-top: 8px; margin-bottom: 8px; margin-left: 0px; margin-right: 0px; padding-top: 0px; padding-bottom: 0px; padding-left: 25px; padding-right: 0px; color: rgb(0, 0, 0);',
      ol: 'list-style-type: decimal; margin-top: 8px; margin-bottom: 8px; margin-left: 0px; margin-right: 0px; padding-top: 0px; padding-bottom: 0px; padding-left: 25px; padding-right: 0px; color: rgb(0, 0, 0);',
      li: 'margin-top: 5px; margin-bottom: 5px; color: rgb(89, 89, 89); font-size: 14px; line-height: 1.8em; letter-spacing: 0em; text-align: left; font-weight: normal;',
      blockquote:
        'margin-top: 20px; margin-bottom: 20px; margin-left: 0px; margin-right: 0px; padding-top: 10px; padding-bottom: 10px; padding-left: 20px; padding-right: 10px; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-width: 1px; border-top-color: rgba(222, 198, 251, 0.4); border-bottom-color: rgba(222, 198, 251, 0.4); border-left-color: rgba(222, 198, 251, 0.4); border-right-color: rgba(222, 198, 251, 0.4); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-attachment: scroll; background-clip: border-box; background-color: rgb(246, 238, 255); background-image: none; background-origin: padding-box; background-position-x: 0%; background-position-y: 0%; background-repeat: no-repeat; background-size: auto; width: auto; height: auto; box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px; display: block; overflow-x: auto; overflow-y: auto;',
      blockquoteSign:
        'display: block; color: rgb(222, 198, 251); font-size: 28px; line-height: 1.5em; letter-spacing: 0em; text-align: left; font-weight: bold;',
      blockquoteContent:
        'text-indent: 0em; padding-top: 8px; padding-bottom: 8px; padding-left: 0px; padding-right: 0px; color: rgb(0, 0, 0); font-size: 14px; line-height: 1.8em; letter-spacing: 0em; text-align: left; font-weight: normal; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px;',
      code: "color: rgb(145, 109, 213); font-size: 14px; line-height: 1.8em; letter-spacing: 0em; background-attachment: scroll; background-clip: border-box; background-color: rgba(27, 31, 35, 0.05); background-image: none; background-origin: padding-box; background-position-x: 0%; background-position-y: 0%; background-repeat: no-repeat; background-size: auto; width: auto; height: auto; margin-top: 0px; margin-bottom: 0px; margin-left: 2px; margin-right: 2px; padding-top: 2px; padding-bottom: 2px; padding-left: 4px; padding-right: 4px; border-top-style: none; border-bottom-style: none; border-left-style: none; border-right-style: none; border-top-width: 3px; border-bottom-width: 3px; border-left-width: 3px; border-right-width: 3px; border-top-color: rgb(0, 0, 0); border-bottom-color: rgba(0, 0, 0, 0.4); border-left-color: rgba(0, 0, 0, 0.4); border-right-color: rgba(0, 0, 0, 0.4); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; overflow-wrap: break-word; font-family: 'Operator Mono', Consolas, Monaco, Menlo, monospace; word-break: break-all;",
      codeBlock:
        'overflow-x: auto; padding: 16px; color: #abb2bf; padding-top: 15px; background: #282c34; border-radius: 5px; display: -webkit-box; font-family: Consolas, Monaco, Menlo, monospace; font-size: 12px;',
      pre: 'border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.55) 0px 2px 10px; text-align: left; margin-top: 10px; margin-bottom: 10px; margin-left: 0px; margin-right: 0px; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px;',
      preHeader:
        'display: block; background: url(https://files.mdnice.com/user/3441/876cad08-0422-409d-bb5a-08afec5da8ee.svg); height: 30px; width: 100%; background-size: 40px; background-repeat: no-repeat; background-color: #282c34; margin-bottom: -7px; border-radius: 5px; background-position: 10px 10px;',
      img: 'display: block; margin-top: 0px; margin-right: auto; margin-bottom: 0px; margin-left: auto; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);',
      hr: 'margin-top: 10px; margin-bottom: 10px; margin-left: 0px; margin-right: 0px; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; border-top-style: solid; border-bottom-style: none; border-left-style: none; border-right-style: none; border-top-width: 2px; border-bottom-width: 3px; border-left-width: 3px; border-right-width: 3px; border-top-color: rgb(217, 184, 250); border-bottom-color: rgba(0, 0, 0, 0.4); border-left-color: rgba(0, 0, 0, 0.4); border-right-color: rgba(0, 0, 0, 0.4); border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; background-attachment: scroll; background-clip: border-box; background-color: rgba(0, 0, 0, 0); background-image: none; background-origin: padding-box; background-position-x: 0%; background-position-y: 0%; background-repeat: no-repeat; background-size: auto; width: auto; height: 1px;',
      strong:
        'color: rgb(145, 109, 213); font-weight: bold; background-attachment: scroll; background-clip: border-box; background-color: rgba(0, 0, 0, 0); background-image: none; background-origin: padding-box; background-position-x: 0%; background-position-y: 0%; background-repeat: no-repeat; background-size: auto; width: auto; height: auto; margin-top: 0px; margin-bottom: 0px; margin-left: 0px; margin-right: 0px; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; border-top-style: none; border-bottom-style: none; border-left-style: none; border-right-style: none; border-top-width: 3px; border-bottom-width: 3px; border-left-width: 3px; border-right-width: 3px; border-top-color: rgba(0, 0, 0, 0.4); border-bottom-color: rgba(0, 0, 0, 0.4); border-left-color: rgba(0, 0, 0, 0.4); border-right-color: rgba(0, 0, 0, 0.4); border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;',
      em: 'color: rgb(89, 89, 89); font-style: italic; background-attachment: scroll; background-clip: border-box; background-color: rgb(246, 238, 255); background-image: none; background-origin: padding-box; background-position-x: 0%; background-position-y: 0%; background-repeat: no-repeat; background-size: auto; width: auto; height: auto; margin-top: 0px; margin-bottom: 0px; margin-left: 0px; margin-right: 0px; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; border-top-style: none; border-bottom-style: none; border-left-style: none; border-right-style: none; border-top-width: 3px; border-bottom-width: 3px; border-left-width: 3px; border-right-width: 3px; border-top-color: rgba(0, 0, 0, 0.4); border-bottom-color: rgba(0, 0, 0, 0.4); border-left-color: rgba(0, 0, 0, 0.4); border-right-color: rgba(0, 0, 0, 0.4); border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;',
      strongEm:
        'margin-top: 0px; margin-bottom: 0px; margin-left: 0px; margin-right: 0px; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; border-top-style: none; border-bottom-style: none; border-left-style: none; border-right-style: none; border-top-width: 3px; border-bottom-width: 3px; border-left-width: 3px; border-right-width: 3px; border-top-color: rgba(0, 0, 0, 0.4); border-bottom-color: rgba(0, 0, 0, 0.4); border-left-color: rgba(0, 0, 0, 0.4); border-right-color: rgba(0, 0, 0, 0.4); border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; color: rgb(89, 89, 89); font-weight: bold; font-style: italic; background-attachment: scroll; background-clip: border-box; background-color: rgba(0, 0, 0, 0); background-image: none; background-origin: padding-box; background-position-x: 0%; background-position-y: 0%; background-repeat: no-repeat; background-size: auto; width: auto; height: auto;',
      del: 'color: rgb(145, 109, 213); font-style: italic;',
      table: 'display: table; text-align: left;',
      tableContainer:
        'margin-top: 0px; margin-bottom: 0px; margin-left: 0px; margin-right: 0px; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; overflow-x: auto;',
      thead: '',
      th: 'color: rgb(89, 89, 89); font-size: 14px; line-height: 1.5em; letter-spacing: 0em; text-align: left; font-weight: bold; background-attachment: scroll; background-clip: border-box; background-color: rgb(240, 240, 240); background-image: none; background-origin: padding-box; background-position-x: 0%; background-position-y: 0%; background-repeat: no-repeat; background-size: auto; width: auto; height: auto; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-width: 1px; border-top-color: rgba(204, 204, 204, 0.4); border-bottom-color: rgba(204, 204, 204, 0.4); border-left-color: rgba(204, 204, 204, 0.4); border-right-color: rgba(204, 204, 204, 0.4); border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; padding-top: 5px; padding-right: 10px; padding-bottom: 5px; padding-left: 10px; min-width: 85px;',
      tbody:
        'font-size: 14px; line-height: 1.5em; letter-spacing: 0em; text-align: left; font-weight: normal; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: initial; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial;',
      tr: 'color: rgb(89, 89, 89); background-attachment: scroll; background-clip: border-box; background-color: rgb(255, 255, 255); background-image: none; background-origin: padding-box; background-position-x: 0%; background-position-y: 0%; background-repeat: no-repeat; background-size: auto; width: auto; height: auto;',
      trAlt:
        'color: rgb(89, 89, 89); background-attachment: scroll; background-clip: border-box; background-color: rgb(248, 248, 248); background-image: none; background-origin: padding-box; background-position-x: 0%; background-position-y: 0%; background-repeat: no-repeat; background-size: auto; width: auto; height: auto;',
      td: 'padding-top: 5px; padding-right: 10px; padding-bottom: 5px; padding-left: 10px; min-width: 85px; border-top-style: solid; border-bottom-style: solid; border-left-style: solid; border-right-style: solid; border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-width: 1px; border-top-color: rgba(204, 204, 204, 0.4); border-bottom-color: rgba(204, 204, 204, 0.4); border-left-color: rgba(204, 204, 204, 0.4); border-right-color: rgba(204, 204, 204, 0.4); border-top-left-radius: 0px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;',
      img_figure:
        'margin-top: 15px; margin-bottom: 15px; margin-left: 0px; margin-right: 0px; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;',
      img_inline:
        'display: block; margin-top: 0px; margin-right: auto; margin-bottom: 0px; margin-left: auto; max-width: 100%; width: auto; height: auto; border-radius: 8px; object-fit: contain; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);',
      prefix: 'display: none;',
      suffix: 'display: none;',
    }

    // 使用 markdown-it 库创建渲染器
    const md = new MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
    })

    // 覆盖段落渲染规则
    md.renderer.rules.paragraph_open = () => {
      return `<p data-tool="mdnice编辑器" style="${themeStyles.p}">`
    }

    md.renderer.rules.paragraph_close = () => {
      return '</p>'
    }

    // 覆盖标题渲染规则
    md.renderer.rules.heading_open = (tokens, idx) => {
      const level = tokens[idx].tag.slice(1)
      if (level === '1') {
        return `<h1 data-tool="mdnice编辑器" style="${themeStyles.h1}"><span class="prefix" style="${themeStyles.prefix}"></span><span class="content" style="${themeStyles.h1Content}">`
      } else if (level === '2') {
        return `<h2 data-tool="mdnice编辑器" style="${themeStyles.h2}"><span class="prefix" style="${themeStyles.prefix}"></span><span class="content" style="${themeStyles.h2Content}">`
      } else if (level === '3') {
        return `<h3 data-tool="mdnice编辑器" style="${themeStyles.h3}"><span class="prefix" style="${themeStyles.prefix}"></span><span class="content" style="${themeStyles.h3Content}">`
      }
      return `<h${level}>`
    }

    md.renderer.rules.heading_close = (tokens, idx) => {
      const level = tokens[idx].tag.slice(1)
      if (['1', '2', '3'].includes(level)) {
        return `<span class="suffix" style="${themeStyles.suffix}"></span></h${level}>`
      }
      return `</h${level}>`
    }

    // 覆盖强调渲染规则
    md.renderer.rules.em_open = () => {
      return `<em style="${themeStyles.em}">`
    }

    md.renderer.rules.strong_open = () => {
      return `<strong style="${themeStyles.strong}">`
    }

    // 覆盖删除线渲染规则
    md.renderer.rules.s_open = () => {
      return `<s style="${themeStyles.del}">`
    }

    // 覆盖代码块渲染规则
    md.renderer.rules.code_block = (tokens, idx) => {
      const code = tokens[idx].content
      return `<pre class="custom" data-tool="mdnice编辑器" style="${themeStyles.pre}"><span style="${themeStyles.preHeader}"></span><code class="hljs" style="${themeStyles.codeBlock}">${code}</code></pre>`
    }

    md.renderer.rules.fence = (tokens, idx) => {
      const code = tokens[idx].content
      return `<pre class="custom" data-tool="mdnice编辑器" style="${themeStyles.pre}"><span style="${themeStyles.preHeader}"></span><code class="hljs" style="${themeStyles.codeBlock}">${code}</code></pre>`
    }

    // 覆盖行内代码渲染规则
    md.renderer.rules.code_inline = (tokens, idx) => {
      return `<code style="${themeStyles.code}">${tokens[idx].content}</code>`
    }

    // 覆盖图片渲染规则
    md.renderer.rules.image = (tokens, idx) => {
      const src = tokens[idx].attrs.find((attr) => attr[0] === 'src')?.[1] || ''
      const alt = tokens[idx].attrs.find((attr) => attr[0] === 'alt')?.[1] || ''
      return `<figure data-tool="mdnice编辑器" style="${themeStyles.img_figure}"><img src="${src}" alt="${alt}" style="${themeStyles.img_inline}"></figure>`
    }

    // 覆盖无序列表渲染规则
    md.renderer.rules.bullet_list_open = () => {
      return `<ul data-tool="mdnice编辑器" style="${themeStyles.ul}">`
    }

    md.renderer.rules.ordered_list_open = () => {
      return `<ol data-tool="mdnice编辑器" style="${themeStyles.ol}">`
    }

    md.renderer.rules.list_item_open = () => {
      return `<li>`
    }

    md.renderer.rules.list_item_close = () => {
      return `</li>`
    }

    // 覆盖引用渲染规则
    md.renderer.rules.blockquote_open = () => {
      return `<blockquote class="custom-blockquote multiquote-1" data-tool="mdnice编辑器" style="${themeStyles.blockquote}"><span style="${themeStyles.blockquoteSign}">❝</span>`
    }

    md.renderer.rules.blockquote_close = () => {
      return `</blockquote>`
    }

    // 覆盖水平线渲染规则
    md.renderer.rules.hr = () => {
      return `<hr data-tool="mdnice编辑器" style="${themeStyles.hr}">`
    }

    // 覆盖表格渲染规则
    md.renderer.rules.table_open = () => {
      return `<section class="table-container" data-tool="mdnice编辑器" style="${themeStyles.tableContainer}"><table style="${themeStyles.table}">`
    }

    md.renderer.rules.table_close = () => {
      return '</table></section>'
    }

    md.renderer.rules.thead_open = () => {
      return `<thead${themeStyles.thead ? ` style="${themeStyles.thead}"` : ''}>`
    }

    md.renderer.rules.tbody_open = () => {
      return `<tbody style="${themeStyles.tbody}">`
    }

    md.renderer.rules.tr_open = (tokens, idx, options, env, self) => {
      const isEven = env.rowIndex % 2 === 0
      env.rowIndex = (env.rowIndex || 0) + 1
      return `<tr style="${isEven ? themeStyles.tr : themeStyles.trAlt}">`
    }

    md.renderer.rules.th_open = () => {
      return `<th style="${themeStyles.th}">`
    }

    md.renderer.rules.td_open = () => {
      return `<td style="${themeStyles.td}">`
    }

    // 渲染Markdown
    let html = md.render(processedMarkdown, { rowIndex: 0 })

    // 处理引用内的段落样式
    html = html.replace(/<blockquote[^>]*>[\s\S]*?<p/g, (match) => {
      return match.replace(/<p/, `<p style="${themeStyles.blockquoteContent}"`)
    })

    // 处理列表项样式
    html = html.replace(/<li>([\s\S]*?)<\/li>/g, (match, content) => {
      return `<li><section style="${themeStyles.li}">${content}</section></li>`
    })

    // 处理HTML标签
    html = html.replace(/<image([^>]*)>/gi, (match, attrs) => {
      const src = attrs.match(/src="([^"]*)"/)?.[1] || ''
      return `<img src="${src}" data-tool="mdnice编辑器" style="${themeStyles.img_inline}">`
    })

    // 处理图片标签样式
    html = html.replace(/<img([^>]*)>/gi, (match, attrs) => {
      if (match.includes('style=')) {
        return match
      }
      return `<img${attrs} style="${themeStyles.img_inline}">`
    })

    // 处理代码块的代码高亮
    html = html.replace(/<code class="hljs" style="[^"]*">([^<]*)<\/code>/g, (match, code) => {
      if (code.includes('function')) {
        // 简单的JavaScript语法高亮示例
        return match.replace('<code class="hljs"', '<code class="hljs"').replace(
          code,
          code
            .replace(
              /function/g,
              '<span class="hljs-function" style="line-height: 26px;"><span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">function</span>&nbsp;<span class="hljs-title" style="color: #61aeee; line-height: 26px;">sayHello</span>(<span class="hljs-params" style="line-height: 26px;"></span>)&nbsp;</span>',
            )
            .replace(
              /console/g,
              '<span class="hljs-built_in" style="color: #e6c07b; line-height: 26px;">console</span>',
            )
            .replace(/log\(/g, 'log(')
            .replace(
              /"([^"]*)"/g,
              '<span class="hljs-string" style="color: #98c379; line-height: 26px;">"$1"</span>',
            )
            .replace(
              /return/g,
              '<span class="hljs-keyword" style="color: #c678dd; line-height: 26px;">return</span>&nbsp;',
            )
            .replace(
              /true/g,
              '<span class="hljs-literal" style="color: #56b6c2; line-height: 26px;">true</span>',
            ),
        )
      }
      return match
    })

    // 处理带有颜色属性的font标签
    html = html.replace(
      /<strong[^>]*><font color="([^"]*)">([^<]*)<\/font><\/strong>/g,
      (match, color, text) => {
        return `<strong style="font-weight: bold; color: ${color};">${text}</strong>`
      },
    )

    // 包装HTML并返回
    return `<section id="nice" data-tool="mdnice编辑器" data-website="https://www.mdnice.com" style="${themeStyles.wrapper}">${html}</section>`
  },
}
