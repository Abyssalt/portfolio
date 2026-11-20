<script setup>
import { computed } from 'vue'
import ProjectLogo from '../../components/ProjectLogo.vue'
import TechChip from '../../components/TechChip.vue'
import { useContent } from '../content'

defineEmits(['open'])
const { t, ui, projects, skills, resume } = useContent()

const languages = computed(() => skills.value[0]?.items ?? [])
const liveCount = computed(() => projects.value.filter((p) => p.statuses.some((s) => s.key === 'deployed')).length)
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

      <dl class="facts">
        <div class="fact">
          <dt>{{ ui.homeFacts.education }}</dt>
          <dd>{{ t.facts.formationValue }}</dd>
        </div>
        <div class="fact">
          <dt>{{ ui.homeFacts.availability }}</dt>
          <dd>{{ t.facts.availabilityValue }}</dd>
        </div>
        <div class="fact">
          <dt>{{ ui.homeFacts.projects }}</dt>
          <dd>{{ ui.projectsFact(projects.length, liveCount) }}</dd>
        </div>
      </dl>
    </section>

    <!-- projets -->
    <section class="block">
      <p class="eyebrow">{{ t.projectsSection.eyebrow }}</p>
      <h2>{{ ui.homeProjects }}</h2>
      <ul class="projects">
        <li v-for="p in projects" :key="p.id">
          <button type="button" class="project" @click="$emit('open', p.id)">
            <ProjectLogo :id="p.id" />
            <span class="info">
              <span class="name">{{ p.name }}</span>
              <span class="meta">
                <span v-for="s in p.statuses" :key="s.key" :class="{ live: s.key === 'deployed' }">
                  <template v-if="s.key === 'deployed'">● </template>{{ s.label }}
                </span>
                <span>{{ p.language }}</span>
              </span>
            </span>
            <span class="file">{{ p.fileName }}</span>
          </button>
        </li>
      </ul>
    </section>

    <!-- stack -->
    <section class="block">
      <p class="eyebrow">{{ t.skillsSection.eyebrow }}</p>
      <h2>{{ ui.homeStack }}</h2>
      <div class="chips">
        <TechChip v-for="s in languages" :key="s" :name="s" large />
      </div>
      <button type="button" class="more" @click="$emit('open', 'skills')">{{ ui.seeStack }}</button>
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

/* ---- à propos : chiffres clés ---- */
.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 12px;
  margin: 28px 0 0;
}
.fact {
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-card);
}
.fact dt { font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 6px; }
.fact dd { margin: 0; font-size: 15px; font-weight: 600; color: var(--text); line-height: 1.4; }

/* ---- projets ---- */
.projects { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }

.project {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 12px 16px 12px 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-card);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}
.project:hover { border-color: var(--accent); background: var(--accent-tint); }

.info { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
.name { font-size: 17px; font-weight: 700; color: var(--text); }
.meta { display: flex; flex-wrap: wrap; gap: 2px 12px; font-family: var(--mono); font-size: 12px; color: var(--text-faint); }
.meta .live { color: var(--ok); }
.file { font-family: var(--mono); font-size: 12.5px; color: var(--text-faint); white-space: nowrap; }

/* ---- stack ---- */
.chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }
.more {
  margin-top: 18px;
  padding: 0;
  border: none;
  border-bottom: 1px solid transparent;
  background: none;
  font-size: 15px;
  font-weight: 600;
  color: var(--accent);
  cursor: pointer;
}
.more:hover { border-color: var(--accent); }

@media (max-width: 560px) {
  .file { display: none; }
  .block { margin-top: 48px; padding-top: 36px; }
}
</style>
