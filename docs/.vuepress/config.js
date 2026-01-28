// docs/.vuepress/config.js
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'

export default {
  bundler: viteBundler(), // 指定用 Vite 作为构建器
  theme: defaultTheme(),  // 使用 VuePress 默认主题
}