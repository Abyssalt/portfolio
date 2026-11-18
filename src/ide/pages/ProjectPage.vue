<script setup>
import { computed, ref } from 'vue'
import ProjectLogo from '../../components/ProjectLogo.vue'
import Lightbox from '../../components/Lightbox.vue'
import TechChip from '../../components/TechChip.vue'

const props = defineProps({ project: { type: Object, required: true } })

const activeShot = ref(0)
const lightboxOpen = ref(false)

// Un projet peut mettre en avant seulement une partie de ses captures (le reste reste dans la visionneuse).
const featured = computed(() => {
  const p = props.project
  const indexes = p.screenshotsFeatured ?? p.screenshots.map((_, i) => i)
  return indexes.map((i) => ({ index: i, src: p.screenshots[i] }))
})

function openShot(index) {
  activeShot.value = index
  lightboxOpen.value = true
}
</script>

<template>
  <article class="project" :class="{ 'has-visual': project.screenshots.length }">
    <div class="detail">
      <header class="head">
        <ProjectLogo :id="project.id" />
        <div class="title">
          <h3>{{ project.name }}</h3>
          <div class="meta">
            <span v-for="s in project.statuses" :key="s.key" :class="{ live: s.key === 'deployed' }">
              <template v-if="s.key === 'deployed'">● </template>{{ s.label }}
            </span>
          </div>
        </div>
      </header>

      <p class="summary">{{ project.summary }}</p>

      <ul v-if="project.tasks && project.tasks.length" class="tasks">
        <li v-for="(task, i) in project.tasks" :key="i">{{ task }}</li>
      </ul>

      <div class="stack">
        <TechChip v-for="s in project.stack" :key="s" :name="s" />
      </div>

      <div v-if="project.link || project.articleLink" class="links">
        <a v-if="project.link" :href="project.link" target="_blank" rel="noopener">{{ project.linkLabel }}</a>
        <a v-if="project.articleLink" :href="project.articleLink" target="_blank" rel="noopener">{{ project.articleLabel }}</a>
      </div>
    </div>

    <div v-if="project.screenshots.length" class="visual">
      <div v-if="project.screenshotsLayout === 'phones'" class="phones">
        <button
          v-for="shot in featured"
          :key="shot.index"
          type="button"
          class="phone"
          :aria-label="`${project.name} — ${shot.index + 1}/${project.screenshots.length}`"
          @click="openShot(shot.index)"
        >
          <img :src="shot.src" :alt="`${project.name} — ${shot.index + 1}/${project.screenshots.length}`" loading="lazy" />
        </button>
      </div>

      <div v-else class="gallery">
        <button type="button" class="gallery-main" @click="openShot(activeShot)">
          <img :src="project.screenshots[activeShot]" :alt="`${project.name} — ${activeShot + 1}/${project.screenshots.length}`" />
        </button>
        <div v-if="project.screenshots.length > 1" class="dots">
          <button
            v-for="(s, i) in project.screenshots"
            :key="i"
            type="button"
            class="dot"
            :class="{ current: i === activeShot }"
            :aria-label="`${i + 1}/${project.screenshots.length}`"
            @click="activeShot = i"
          />
        </div>
      </div>
    </div>

    <Lightbox
      v-if="lightboxOpen"
      v-model:active-index="activeShot"
      :images="project.screenshots"
      :alt="project.name"
      @close="lightboxOpen = false"
    />
  </article>
</template>

<style scoped>
.project {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-height: 100%;
}

/* Quand l'éditeur est assez large, texte à gauche et captures à droite. */
@container editor (min-width: 940px) {
  .project.has-visual { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
  .visual { border-left: 1px solid var(--border); border-top: none; }
}

.detail { display: flex; flex-direction: column; gap: 18px; padding: 40px 44px 56px; max-width: 780px; }

.head { display: flex; align-items: center; gap: 14px; }
.title { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.title h3 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.15; }

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  font-family: var(--mono);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-faint);
}
.meta .live { color: var(--ok); }

.summary { margin: 0; color: var(--text-dim); font-size: 16.5px; line-height: 1.65; }

.tasks { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
.tasks li {
  position: relative;
  padding-left: 18px;
  font-size: 15.5px;
  line-height: 1.55;
  color: var(--text);
}
.tasks li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 11px;
  width: 7px;
  height: 1.5px;
  background: var(--accent);
}

.stack { display: flex; flex-wrap: wrap; gap: 8px; }

.links { display: flex; flex-wrap: wrap; gap: 8px 24px; padding-top: 4px; }
.links a {
  font-size: 15px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
}
.links a:hover { border-color: var(--accent); }

/* ---- captures ---- */
.visual {
  background: var(--bg-alt);
  border-top: 1px solid var(--border);
  min-width: 0;
}

.phones {
  height: 100%;
  min-height: 340px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 12px;
  padding: 36px 26px 0;
  overflow: hidden;
}
.phone { width: 31%; max-width: 230px; padding: 0; border: none; background: none; cursor: zoom-in; display: block; }
.phone:nth-child(2) { width: 34%; max-width: 250px; transform: translateY(-14px); }
.phone img {
  display: block;
  width: 100%;
  border-radius: 14px 14px 0 0;
  border: 1px solid var(--border-light);
  border-bottom: none;
  transition: transform 0.2s ease;
}
.phone:hover img { transform: translateY(-4px); }
.phone:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 14px; }

.gallery { height: 100%; min-height: 340px; display: flex; flex-direction: column; padding: 28px; gap: 14px; }
.gallery-main {
  flex: 1;
  min-height: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gallery-main img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid var(--border-light);
}

.dots { display: flex; justify-content: center; gap: 4px; }
.dot { width: 26px; height: 26px; padding: 0; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.dot::before {
  content: '';
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--border-light);
  transition: background-color 0.15s ease, transform 0.15s ease;
}
.dot:hover::before { background: var(--text-faint); }
.dot.current::before { background: var(--accent); transform: scale(1.2); }

@media (max-width: 760px) {
  .detail { padding: 26px 20px 36px; }
  .gallery-main img { max-height: 320px; }
  .phones, .gallery { min-height: 0; }
}
</style>
