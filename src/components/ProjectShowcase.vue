<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import ProjectLogo from './ProjectLogo.vue'
import Lightbox from './Lightbox.vue'

const props = defineProps({
  projects: { type: Array, required: true }, // see App.vue for the shape of each project
  tabsLabel: String,
})

const activeId = ref(props.projects[0]?.id)
const activeShot = ref(0)
const lightboxOpen = ref(false)
const tabButtons = ref([])

const activeIndex = computed(() => Math.max(0, props.projects.findIndex((p) => p.id === activeId.value)))
const active = computed(() => props.projects[activeIndex.value])

watch(activeId, () => {
  activeShot.value = 0
})

function select(id) {
  activeId.value = id
}

// Arrow keys, Home and End move between the tabs, as in an editor.
function onTabKeydown(event, index) {
  const last = props.projects.length - 1
  let target = null
  if (event.key === 'ArrowRight') target = index === last ? 0 : index + 1
  else if (event.key === 'ArrowLeft') target = index === 0 ? last : index - 1
  else if (event.key === 'Home') target = 0
  else if (event.key === 'End') target = last
  if (target === null) return
  event.preventDefault()
  select(props.projects[target].id)
  nextTick(() => tabButtons.value[target]?.focus())
}

function openShot(index) {
  activeShot.value = index
  lightboxOpen.value = true
}

// A project can feature a subset of its screenshots (e.g. three phone screens side by side).
function featuredShots(project) {
  const indexes = project.screenshotsFeatured ?? project.screenshots.map((_, i) => i)
  return indexes.map((i) => ({ index: i, src: project.screenshots[i] }))
}

function statusLine(project) {
  return [project.language, ...project.statuses.map((s) => s.label)].join(' · ')
}
</script>

<template>
  <div class="showcase">
    <div class="tabs" role="tablist" :aria-label="tabsLabel">
      <button
        v-for="(p, i) in projects"
        :id="`tab-${p.id}`"
        :key="p.id"
        :ref="(el) => (tabButtons[i] = el)"
        type="button"
        role="tab"
        class="tab"
        :class="{ active: p.id === activeId }"
        :aria-selected="p.id === activeId"
        :aria-controls="`panel-${p.id}`"
        :tabindex="p.id === activeId ? 0 : -1"
        @click="select(p.id)"
        @keydown="onTabKeydown($event, i)"
      >
        <span class="tab-dot" aria-hidden="true" />
        {{ p.fileName }}
      </button>
    </div>

    <section
      v-for="p in projects"
      :id="`panel-${p.id}`"
      :key="p.id"
      role="tabpanel"
      class="panel"
      :class="{ 'has-visual': p.screenshots.length }"
      :aria-labelledby="`tab-${p.id}`"
      :hidden="p.id !== activeId"
    >
      <div class="detail">
        <header class="head">
          <ProjectLogo :id="p.id" />
          <div class="title">
            <h3>{{ p.name }}</h3>
            <div class="meta">
              <span v-for="s in p.statuses" :key="s.key" :class="{ live: s.key === 'deployed' }">
                <template v-if="s.key === 'deployed'">● </template>{{ s.label }}
              </span>
            </div>
          </div>
        </header>

        <p class="summary">{{ p.summary }}</p>

        <ul v-if="p.tasks && p.tasks.length" class="tasks">
          <li v-for="(task, i) in p.tasks" :key="i">{{ task }}</li>
        </ul>

        <p class="stack">{{ p.stack.join(' · ') }}</p>

        <div v-if="p.link || p.articleLink" class="links">
          <a v-if="p.link" :href="p.link" target="_blank" rel="noopener">{{ p.linkLabel }}</a>
          <a v-if="p.articleLink" :href="p.articleLink" target="_blank" rel="noopener">{{ p.articleLabel }}</a>
        </div>
      </div>

      <div v-if="p.screenshots.length" class="visual">
        <div v-if="p.screenshotsLayout === 'phones'" class="phones">
          <button
            v-for="shot in featuredShots(p)"
            :key="shot.index"
            type="button"
            class="phone"
            :aria-label="`${p.name} — ${shot.index + 1}/${p.screenshots.length}`"
            @click="openShot(shot.index)"
          >
            <img :src="shot.src" :alt="`${p.name} — ${shot.index + 1}/${p.screenshots.length}`" loading="lazy" />
          </button>
        </div>

        <div v-else class="gallery">
          <button type="button" class="gallery-main" @click="openShot(activeShot)">
            <img :src="p.screenshots[activeShot]" :alt="`${p.name} — ${activeShot + 1}/${p.screenshots.length}`" />
          </button>
          <div v-if="p.screenshots.length > 1" class="gallery-dots">
            <button
              v-for="(s, i) in p.screenshots"
              :key="i"
              type="button"
              class="dot"
              :class="{ current: i === activeShot }"
              :aria-label="`${i + 1}/${p.screenshots.length}`"
              @click="activeShot = i"
            />
          </div>
        </div>
      </div>
    </section>

    <div class="status-bar" aria-hidden="true">
      <span>{{ statusLine(active) }}</span>
      <span>{{ activeIndex + 1 }} / {{ projects.length }}</span>
    </div>

    <Lightbox
      v-if="lightboxOpen"
      v-model:active-index="activeShot"
      :images="active.screenshots"
      :alt="active.name"
      @close="lightboxOpen = false"
    />
  </div>
</template>

<style scoped>
.showcase {
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-card);
  overflow: hidden;
}

/* ---- tab strip, like the open files of an editor ---- */
.tabs {
  display: flex;
  overflow-x: auto;
  background: var(--bg-alt);
  border-bottom: 1px solid var(--border);
  scrollbar-width: thin;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  flex: none;
  padding: 13px 22px;
  font-family: var(--mono);
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-faint);
  background: transparent;
  border: none;
  border-right: 1px solid var(--border);
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.tab:hover { color: var(--text); }
.tab:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }

.tab-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-light);
  transition: background-color 0.15s ease;
}

.tab.active {
  color: var(--text);
  background: var(--bg-card);
  box-shadow: inset 0 -2px 0 var(--accent);
}
.tab.active .tab-dot { background: var(--accent); }

/* ---- panels ---- */
.panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-height: 460px;
}
.panel[hidden] { display: none; }
.panel.has-visual { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }

.detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 30px 32px;
}
.panel:not(.has-visual) .detail { max-width: 76ch; }

.head { display: flex; align-items: center; gap: 14px; }
.title { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.title h3 { font-size: 21px; }

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

.summary { margin: 0; color: var(--text-dim); font-size: 16px; }

.tasks {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.tasks li {
  position: relative;
  padding-left: 17px;
  font-size: 15px;
  line-height: 1.55;
  color: var(--text);
}
.tasks li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 11px;
  width: 6px;
  height: 1.5px;
  background: var(--accent);
}

.stack {
  margin: 0;
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.75;
  color: var(--text-faint);
}

.links { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: auto; padding-top: 4px; }
.links a {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
}
.links a:hover { border-color: var(--accent); }

/* ---- screenshots ---- */
.visual {
  background: var(--bg-alt);
  border-left: 1px solid var(--border);
  min-width: 0;
}

.phones {
  height: 100%;
  min-height: 360px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 12px;
  padding: 28px 26px 0;
  overflow: hidden;
}
.phone {
  width: 31%;
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;
  display: block;
}
.phone:nth-child(2) { width: 34%; transform: translateY(-14px); }
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

.gallery {
  height: 100%;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  padding: 26px;
  gap: 14px;
}
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
.gallery-main:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; border-radius: 8px; }

.gallery-dots { display: flex; justify-content: center; gap: 4px; }
.dot {
  width: 26px;
  height: 26px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
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
.dot:focus-visible { outline: 2px solid var(--accent); border-radius: 50%; }

/* ---- status bar ---- */
.status-bar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 7px 18px;
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--text-faint);
  background: color-mix(in srgb, var(--bg-alt) 70%, var(--border));
  border-top: 1px solid var(--border);
}

/* ---- small screens: text first, screenshots below ---- */
@media (max-width: 800px) {
  .panel,
  .panel.has-visual { grid-template-columns: minmax(0, 1fr); min-height: 0; }
  .detail { padding: 24px 20px; }
  .visual { border-left: none; border-top: 1px solid var(--border); }
  .phones { min-height: 0; padding-top: 24px; }
  .gallery { min-height: 0; }
  .gallery-main img { max-height: 320px; }
  .tab { padding: 12px 16px; }
}
</style>
