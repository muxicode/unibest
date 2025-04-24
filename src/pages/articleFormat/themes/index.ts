// 导入姹紫主题
import { defaultThemeParser } from './default'

// 主题解析器接口
export interface ThemeParser {
  // 解析函数：接收markdown内容和md实例，返回解析后的HTML
  parse: (markdown: string, md?: any, hljs?: any) => string
  // 主题名称
  name: string
  // 主题描述
  description: string
}

// 所有可用主题的映射
const themeParsers: Record<string, ThemeParser> = {
  'theme-default': defaultThemeParser,
}

/**
 * 获取指定名称的主题解析器
 * @param themeName 主题名称
 * @returns 对应的主题解析器，如果找不到则返回默认主题解析器
 */
export function getThemeParser(themeName: string): ThemeParser {
  return themeParsers[themeName] || defaultThemeParser
}

/**
 * 获取所有可用的主题
 * @returns 所有可用主题的数组，包含名称和描述
 */
export function getAllThemes(): { label: string; value: string }[] {
  return Object.entries(themeParsers).map(([value, parser]) => ({
    label: parser.description,
    value,
  }))
}
