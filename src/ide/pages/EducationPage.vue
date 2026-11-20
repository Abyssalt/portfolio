<script setup>
import { useContent } from '../content'

const { t, education, certifications } = useContent()
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
            <span class="title">{{ e.degree }}</span>
            <a v-if="e.website" :href="e.website" target="_blank" rel="noopener" class="sub link">
              {{ e.school }}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M7 17 17 7M7 7h10v10" /></svg>
            </a>
            <span v-else class="sub">{{ e.school }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- certifications : la section n'apparaît que si src/data/certifications.js en contient -->
    <section v-if="certifications.length" class="certs">
      <p class="eyebrow">{{ t.certificationsSection.eyebrow }}</p>
      <h2>{{ t.certificationsSection.title }}</h2>

      <div class="list">
        <div v-for="c in certifications" :key="c.id" class="entry">
          <span class="period">{{ c.date }}</span>
          <div class="main">
            <div class="logo">
              <img v-if="c.logo" :src="c.logo" :alt="c.issuer" />
              <svg v-else class="award" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="22" height="22" aria-hidden="true"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>
            </div>
            <div class="detail">
              <span class="title">{{ c.name }}</span>
              <span class="sub">{{ c.issuer }}</span>
              <span v-if="c.expires || c.credentialId" class="extra">
                <template v-if="c.expires">{{ t.certificationsSection.expires }} {{ c.expires }}</template>
                <template v-if="c.expires && c.credentialId"> · </template>
                <template v-if="c.credentialId">{{ t.certificationsSection.credentialId }} {{ c.credentialId }}</template>
              </span>
              <a v-if="c.url" :href="c.url" target="_blank" rel="noopener" class="verify">{{ t.certificationsSection.viewCredential }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
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
.logo .award { color: #5b6076; }

.detail { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.title { font-size: 18px; font-weight: 700; color: var(--text); }
.sub {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 15px;
  color: var(--text-dim);
  text-decoration: none;
  width: fit-content;
}
a.link:hover { color: var(--accent); }
a.link svg { color: var(--text-faint); flex: none; }
a.link:hover svg { color: var(--accent); }

.extra { font-family: var(--mono); font-size: 12px; color: var(--text-faint); }
.verify {
  width: fit-content;
  margin-top: 2px;
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
}
.verify:hover { border-color: var(--accent); }

.certs { margin-top: 64px; padding-top: 44px; border-top: 1px solid var(--border); }

@media (max-width: 560px) {
  .entry { flex-direction: column; gap: 6px; }
  .period { width: auto; }
  .certs { margin-top: 48px; padding-top: 36px; }
}
</style>
