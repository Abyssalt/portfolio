<script setup>
import { useContent } from '../content'

defineEmits(['open'])
const { t, projects, resume } = useContent()
</script>

<template>
  <article class="doc">
    <!-- accueil -->
    <p class="eyebrow">{{ t.hero.eyebrow }}</p>
    <h1>{{ t.hero.title1 }}<br />{{ t.hero.title2 }}<span class="caret" aria-hidden="true" /></h1>
    <p class="lead">{{ t.hero.sub }}</p>
    <div class="actions">
      <button type="button" class="btn primary" @click="$emit('open', projects[0].id)">{{ t.hero.ctaProjects }}</button>
      <button type="button" class="btn" @click="$emit('open', 'contact')">{{ t.hero.ctaContact }}</button>
      <a :href="resume.url" :download="resume.name" class="btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
        {{ t.hero.ctaResume }}
      </a>
    </div>

    <!-- à propos -->
    <section class="block">
      <p class="eyebrow">{{ t.about.eyebrow }}</p>
      <h2>{{ t.about.title }}</h2>
      <p>{{ t.about.text }}</p>
    </section>
  </article>
</template>

<style scoped>
.doc { padding-top: 72px; }
.doc h1 { max-width: 22ch; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }

.caret {
  display: inline-block;
  width: 0.09em;
  height: 0.9em;
  margin-left: 0.12em;
  vertical-align: -0.1em;
  background: var(--accent);
  animation: blink 1.1s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0; } }

.block { margin-top: 64px; padding-top: 44px; border-top: 1px solid var(--border); }

@media (max-width: 560px) {
  .block { margin-top: 48px; padding-top: 36px; }
}
</style>
