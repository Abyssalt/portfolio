<script setup>
import { useContent } from '../content'

const { t, education } = useContent()
</script>

<template>
  <article class="doc">
    <p class="eyebrow">{{ t.formationSection.eyebrow }}</p>
    <h2>{{ t.formationSection.title }}</h2>

    <div class="list">
      <div v-for="e in education" :key="e.id" class="entry">
        <span class="period">{{ e.period }}</span>
        <div class="main">
          <div class="logo"><img v-if="e.logo" :src="e.logo" :alt="e.school" /></div>
          <div class="detail">
            <span class="degree">{{ e.degree }}</span>
            <a v-if="e.website" :href="e.website" target="_blank" rel="noopener" class="school">
              {{ e.school }}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M7 17 17 7M7 7h10v10" /></svg>
            </a>
            <span v-else class="school">{{ e.school }}</span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.list { display: flex; flex-direction: column; margin-top: 26px; }

.entry {
  display: flex;
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid var(--border);
}
.entry:first-child { padding-top: 0; }
.entry:last-child { border-bottom: none; }

.period {
  font-family: var(--mono);
  font-size: 13.5px;
  color: var(--text-dim);
  width: 150px;
  flex: none;
  padding-top: 3px;
}

.main { display: flex; align-items: center; gap: 14px; min-width: 0; }

.logo {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #ffffff;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.logo img { width: 42px; height: 42px; object-fit: contain; }

.detail { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.degree { font-size: 18px; font-weight: 700; color: var(--text); }
.school {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 15px;
  color: var(--text-dim);
  text-decoration: none;
  width: fit-content;
}
a.school:hover { color: var(--accent); }
a.school svg { color: var(--text-faint); flex: none; }
a.school:hover svg { color: var(--accent); }

@media (max-width: 560px) {
  .entry { flex-direction: column; gap: 6px; }
  .period { width: auto; }
}
</style>
