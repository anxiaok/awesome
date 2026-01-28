export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/Users/anxiaokai/Desktop/study/awesome/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":""} }],
  ["/blogs.html", { loader: () => import(/* webpackChunkName: "blogs.html" */"/Users/anxiaokai/Desktop/study/awesome/docs/.vuepress/.temp/pages/blogs.html.js"), meta: {"title":"blogs"} }],
  ["/linux.html", { loader: () => import(/* webpackChunkName: "linux.html" */"/Users/anxiaokai/Desktop/study/awesome/docs/.vuepress/.temp/pages/linux.html.js"), meta: {"title":"Linux"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/Users/anxiaokai/Desktop/study/awesome/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
]);
