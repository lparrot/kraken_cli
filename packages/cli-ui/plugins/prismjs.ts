import Prism from "prismjs";

import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'

export default defineNuxtPlugin(nuxt => {
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
