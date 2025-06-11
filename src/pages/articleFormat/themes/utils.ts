/**
 * 为主题样式应用字体大小
 * @param themeStyles 主题样式对象
 * @param fontSize 字体大小（像素值，不含单位）
 * @returns 应用了字体大小的主题样式对象
 */
export function applyFontSizeToTheme(
  themeStyles: Record<string, string>,
  fontSize: string,
): Record<string, string> {
  // 深拷贝样式对象，避免修改原始对象
  const styles = { ...themeStyles }

  // 标题元素字体大小
  if (styles.h1) {
    styles.h1 = styles.h1.replace(/font-size:\s*\d+px/g, `font-size: ${fontSize}px`)
  }

  if (styles.h1Content) {
    styles.h1Content = styles.h1Content.replace(/font-size:\s*\d+px/g, `font-size: ${fontSize}px`)
  }

  if (styles.h2) {
    styles.h2 = styles.h2.replace(/font-size:\s*\d+px/g, `font-size: ${fontSize}px`)
  }

  if (styles.h2Content) {
    styles.h2Content = styles.h2Content.replace(/font-size:\s*\d+px/g, `font-size: ${fontSize}px`)
  }

  if (styles.h3) {
    styles.h3 = styles.h3.replace(/font-size:\s*\d+px/g, `font-size: ${fontSize}px`)
  }

  if (styles.h3Content) {
    styles.h3Content = styles.h3Content.replace(/font-size:\s*\d+px/g, `font-size: ${fontSize}px`)
  }

  // 主文本元素字体大小
  if (styles.p) {
    styles.p = styles.p.replace(/font-size:\s*\d+px/g, `font-size: ${fontSize}px`)
  }

  // 强调文本字体大小
  if (styles.strong) {
    styles.strong = styles.strong.replace(/font-size:\s*\d+px/g, `font-size: ${fontSize}px`)
  }

  // 列表项字体大小
  if (styles.li) {
    styles.li = styles.li.replace(/font-size:\s*\d+px/g, `font-size: ${fontSize}px`)
  }

  // 引用内容字体大小
  if (styles.blockquoteContent) {
    styles.blockquoteContent = styles.blockquoteContent.replace(
      /font-size:\s*\d+px/g,
      `font-size: ${fontSize}px`,
    )
  }

  // 行内代码字体大小
  if (styles.code) {
    // 行内代码通常比正文小2px，但最小不低于8px
    const codeFontSize = Math.max(parseInt(fontSize) - 2, 8)
    styles.code = styles.code.replace(/font-size:\s*\d+px/g, `font-size: ${codeFontSize}px`)
  }

  // 代码块字体大小
  if (styles.codeBlock) {
    // 代码块通常比正文小3px，但最小不低于8px
    const codeBlockFontSize = Math.max(parseInt(fontSize) - 3, 8)
    styles.codeBlock = styles.codeBlock.replace(
      /font-size:\s*\d+px/g,
      `font-size: ${codeBlockFontSize}px`,
    )
  }

  // 表格内容字体大小
  if (styles.tbody) {
    styles.tbody = styles.tbody.replace(/font-size:\s*\d+px/g, `font-size: ${fontSize}px`)
  }

  if (styles.td) {
    styles.td = styles.td.replace(/font-size:\s*\d+px/g, `font-size: ${fontSize}px`)
  }

  // 其他可能含有字体大小的元素
  if (styles.em) {
    styles.em = styles.em.replace(/font-size:\s*\d+px/g, `font-size: ${fontSize}px`)
  }

  return styles
}
