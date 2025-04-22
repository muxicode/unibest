import { ThemeParser } from './index'

// 暗色主题解析器
export const darkThemeParser: ThemeParser = {
  name: 'theme-dark',
  description: '暗色主题',
  parse: (markdown: string, md: any, hljs: any): string => {
    // 保存原始渲染器
    const originalRules = { ...md.renderer.rules }

    try {
      // 主题样式对象
      const themeStyles = {
        h1: 'font-size: 24px; color: #42b983; line-height: 1.5em; font-weight: bold;',
        h2: 'font-size: 22px; color: #42b983; line-height: 1.5em; border-bottom: 1px solid #42b983; text-align: center; padding-bottom: 10px; font-weight: bold;',
        h3: 'font-size: 20px; color: #42b983; line-height: 1.5em; font-weight: bold;',
        h4: 'font-size: 18px; color: #42b983; line-height: 1.5em; font-weight: bold;',
        h5: 'font-size: 16px; color: #42b983; line-height: 1.5em; font-weight: bold;',
        h6: 'font-size: 14px; color: #42b983; line-height: 1.5em; font-weight: bold;',
        p: 'margin-top: 5px; margin-bottom: 5px; color: #b3b3b3; font-size: 15px; line-height: 1.8em; letter-spacing: 0.02em; text-align: left; font-weight: normal;',
        strong: 'color: #d2d2d2; font-weight: bold;',
        em: 'font-style: italic;',
        a: 'color: #42b983; text-decoration: none;',
        ul: 'list-style-type: disc; margin-top: 8px; margin-bottom: 8px; padding-left: 25px; color: #b3b3b3;',
        ol: 'list-style-type: decimal; margin-top: 8px; margin-bottom: 8px; padding-left: 25px; color: #b3b3b3;',
        li: 'margin-top: 5px; margin-bottom: 5px;',
        blockquote:
          'margin-top: 20px; margin-bottom: 20px; padding: 10px 20px; border-left: 3px solid #42b983; border-right: 1px solid #42b983; background-color: #1e2025;',
        code: 'background-color: #282c34; padding: 2px 4px; margin: 0 2px; border-radius: 4px; font-family: Consolas, Monaco, Menlo, monospace; word-break: break-all; color: #abb2bf;',
        img: 'display: block; margin: 0 auto; max-width: 100%;',
        hr: 'margin-top: 10px; margin-bottom: 10px; border-top: 1px solid #42b983; height: 1px;',
        wrapper:
          'font-family: Optima, PingFangSC-regular, serif; font-size: 16px; color: #b3b3b3; line-height: 1.5em; word-break: break-word; text-align: left; padding: 10px; background-color: #1a1a1a;',
        pre: 'margin-top: 10px; margin-bottom: 10px; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.65) 0px 2px 10px;',
        codeBlock:
          'overflow-x: auto; padding: 16px; color: #abb2bf; padding-top: 15px; background: #282c34; border-radius: 5px; display: block; font-family: Consolas, Monaco, Menlo, monospace; font-size: 12px; line-height: 1.5;',
        hlKeyword: 'color: #c678dd;',
        hlString: 'color: #98c379;',
        hlComment: 'color: #5c6370; font-style: italic;',
        hlFunction: 'color: #61aeee;',
        hlNumber: 'color: #d19a66;',
      }

      // 自定义渲染器以应用主题样式
      md.renderer.rules.heading_open = function (tokens, idx) {
        const token = tokens[idx]
        const tag = token.tag // h1, h2, etc.
        return `<${tag} style="${themeStyles[tag]}">`
      }

      md.renderer.rules.paragraph_open = function () {
        return `<p style="${themeStyles.p}">`
      }

      md.renderer.rules.strong_open = function () {
        return `<strong style="${themeStyles.strong}">`
      }

      md.renderer.rules.em_open = function () {
        return `<em style="${themeStyles.em}">`
      }

      md.renderer.rules.link_open = function (tokens, idx) {
        // 获取href属性
        const aIndex = tokens[idx].attrIndex('href')
        const href = aIndex >= 0 ? tokens[idx].attrs[aIndex][1] : ''

        return `<a href="${href}" style="${themeStyles.a}">`
      }

      md.renderer.rules.bullet_list_open = function () {
        return `<ul style="${themeStyles.ul}">`
      }

      md.renderer.rules.ordered_list_open = function () {
        return `<ol style="${themeStyles.ol}">`
      }

      md.renderer.rules.list_item_open = function () {
        return `<li style="${themeStyles.li}">`
      }

      md.renderer.rules.blockquote_open = function () {
        return `<blockquote style="${themeStyles.blockquote}">`
      }

      md.renderer.rules.hr = function () {
        return `<hr style="${themeStyles.hr}">`
      }

      md.renderer.rules.code_inline = function (tokens, idx) {
        return `<code style="${themeStyles.code}">${tokens[idx].content}</code>`
      }

      md.renderer.rules.image = function (tokens, idx) {
        const token = tokens[idx]
        const srcIndex = token.attrIndex('src')
        const src = srcIndex >= 0 ? token.attrs[srcIndex][1] : ''
        const altIndex = token.attrIndex('alt')
        const alt = altIndex >= 0 ? token.attrs[altIndex][1] : ''

        return `<img src="${src}" alt="${alt}" style="${themeStyles.img}">`
      }

      md.renderer.rules.fence = function (tokens, idx) {
        const token = tokens[idx]
        const code = token.content.trim()
        const lang = token.info.trim()

        let highlighted = code
        if (lang && hljs.getLanguage(lang)) {
          try {
            highlighted = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
          } catch (e) {
            // 失败时使用原始代码
            highlighted = md.utils.escapeHtml(code)
          }
        } else {
          highlighted = md.utils.escapeHtml(code)
        }

        // 替换高亮标签为带样式的标签
        highlighted = highlighted
          .replace(/<span class="hljs-keyword">/g, `<span style="${themeStyles.hlKeyword}">`)
          .replace(/<span class="hljs-string">/g, `<span style="${themeStyles.hlString}">`)
          .replace(/<span class="hljs-comment">/g, `<span style="${themeStyles.hlComment}">`)
          .replace(/<span class="hljs-function">/g, `<span style="${themeStyles.hlFunction}">`)
          .replace(
            /<span class="hljs-title function_">/g,
            `<span style="${themeStyles.hlFunction}">`,
          )
          .replace(/<span class="hljs-number">/g, `<span style="${themeStyles.hlNumber}">`)
          .replace(/<span class="hljs-operator">/g, `<span style="${themeStyles.hlFunction}">`)
          .replace(/<span class="hljs-built_in">/g, `<span style="${themeStyles.hlFunction}">`)
          .replace(/<span class="hljs-literal">/g, `<span style="${themeStyles.hlKeyword}">`)
          .replace(/<span class="hljs-subst">/g, `<span style="${themeStyles.hlKeyword}">`)
          .replace(/<span class="hljs-params">/g, `<span style="color: #abb2bf;">`)

        // 构建代码块
        return `
          <pre style="${themeStyles.pre}">
            <span style="display: block; background: url(https://files.mdnice.com/user/3441/876cad08-0422-409d-bb5a-08afec5da8ee.svg); height: 30px; width: 100%; background-size: 40px; background-repeat: no-repeat; background-color: #282c34; margin-bottom: -7px; border-radius: 5px; background-position: 10px 10px;"></span>
            <code class="hljs" style="${themeStyles.codeBlock}">${highlighted}</code>
          </pre>
        `
      }

      // 渲染 HTML
      const html = md.render(markdown)

      // 包装 HTML 并应用主题样式
      return `
        <section style="${themeStyles.wrapper}">
          ${html}
        </section>
      `
    } finally {
      // 恢复原始渲染器
      md.renderer.rules = originalRules
    }
  },
}
