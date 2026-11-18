<script setup>
import { useContent } from '../content'

const { t } = useContent()
</script>

<template>
  <article class="doc">
    <p class="eyebrow">{{ t.about.eyebrow }}</p>
    <h2>{{ t.about.title }}</h2>
    <p class="lead">{{ t.about.text }}</p>
  </article>
</template>
