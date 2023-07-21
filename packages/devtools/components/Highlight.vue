<script lang="ts" setup>
import Prism from 'prismjs'

interface Props {
  content: string
  lang: string
}

//@ts-ignore
const props = withDefaults(defineProps<Props>(), {
  lang: 'html'
})

const codeRef = ref()

onMounted(() => Prism.highlightElement(codeRef.value))
</script>

<template>
  <pre :class="`language-${lang}`" class="normalize-whitespace" data-prismjs-copy="Copier le code" data-prismjs-copy-success="Copié">
    <code ref="codeRef" v-text="content"></code>
  </pre>
</template>

<style scoped>

</style>
