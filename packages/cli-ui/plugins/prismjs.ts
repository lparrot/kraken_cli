import Prism from "prismjs";

export default defineNuxtPlugin(async nuxt => {

  // @ts-ignore
  await import('prismjs/plugins/toolbar/prism-toolbar')
  // @ts-ignore
  await import('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace')
  // @ts-ignore
  await import('prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard')

  Prism.plugins.NormalizeWhitespace.setDefaults({
    'remove-trailing': true,
    'remove-indent': true,
    'left-trim': true,
    'right-trim': true,
    'remove-initial-line-feed': true,
    'tabs-to-spaces': 4,
    'spaces-to-tabs': 4
  })
})
