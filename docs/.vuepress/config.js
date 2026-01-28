import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { searchPlugin } from '@vuepress/plugin-search'

export default defineUserConfig({
  base: '/awesome/',
  bundler: viteBundler(),
  theme: defaultTheme({
    navbar: require('./links/nav.js'),
  }),
  lang: 'zh-CN',
  title: '持续学习',
  plugins: [searchPlugin()],
})