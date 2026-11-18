<script setup>
import { computed } from 'vue'

const props = defineProps({ type: String })

const GLYPHS = {
  md: ['M↓', '#519aba'],
  json: ['{}', '#cbcb41'],
  kt: ['Kt', '#a97bff'],
  cs: ['C#', '#68c06a'],
  java: ['Jv', '#f08a24'],
  pdf: ['PDF', '#e5534b'],
  file: ['•', '#8b8fa3'],
}

const glyph = computed(() => GLYPHS[props.type] ?? GLYPHS.file)
</script>

<template>
  <span class="ficon" :style="{ '--ic': glyph[1] }" aria-hidden="true">{{ glyph[0] }}</span>
</template>
