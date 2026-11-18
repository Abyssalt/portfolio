<script setup>
import { useContent } from '../content'

const { ui, resume } = useContent()
</script>

<template>
  <article class="cv">
    <div class="bar">
      <div class="info">
        <strong>{{ ui.cvTitle }}</strong>
        <span>{{ resume.name }}</span>
      </div>
      <a :href="resume.url" :download="resume.name" class="btn primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
        {{ ui.cvDownload }}
      </a>
    </div>

    <object :data="resume.url" type="application/pdf" class="pdf">
      <p>{{ ui.cvFallback }} <a :href="resume.url" :download="resume.name">{{ resume.name }}</a></p>
    </object>
  </article>
</template>

<style scoped>
.cv { display: flex; flex-direction: column; height: 100%; min-height: 420px; }

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 28px;
  border-bottom: 1px solid var(--border);
}
.info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.info strong { font-size: 16px; }
.info span { font-family: var(--mono); font-size: 12.5px; color: var(--text-faint); }

.pdf { flex: 1; width: 100%; min-height: 0; border: 0; background: var(--bg-alt); }
.pdf p { padding: 28px; color: var(--text-dim); }
.pdf a { color: var(--accent); }
</style>
