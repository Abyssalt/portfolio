<script setup>
import { ref } from 'vue'
import ProjectLogo from './ProjectLogo.vue'
import TechChip from './TechChip.vue'
import Lightbox from './Lightbox.vue'

const props = defineProps({
  id: String,
  name: String,
  status: String, // 'deployed' | 'progress' | 'school'
  statusLabel: String,
  stack: Array,
  summary: String,
  tasks: Array,
  link: String,
  linkLabel: String,
  articleLink: String,
  articleLabel: String,
  screenshots: { type: Array, default: () => [] },
  screenshotsLabel: String,
  backLabel: String,
})

const flipped = ref(false)
const activeShot = ref(0)
const lightboxOpen = ref(false)

function openScreenshots() {
  activeShot.value = 0
  flipped.value = true
}
</script>

<template>
  <div class="card-flip" :class="{ flipped }">
    <div class="card-flip-inner">
      <article class="card-face card-front">
        <header class="card-head">
          <ProjectLogo :id="id" />
          <div class="card-title">
            <h3>{{ name }}</h3>
            <span class="status" :class="status">{{ statusLabel }}</span>
          </div>
        </header>

        <p class="summary">{{ summary }}</p>

        <ul v-if="tasks && tasks.length" class="tasks">
          <li v-for="(t, i) in tasks" :key="i">{{ t }}</li>
        </ul>

        <div class="stack">
          <TechChip v-for="s in stack" :key="s" :name="s" />
        </div>

        <div class="card-footer">
          <div class="card-links">
            <a v-if="link" :href="link" class="link" target="_blank" rel="noopener">{{ linkLabel }}</a>
            <a v-if="articleLink" :href="articleLink" class="link" target="_blank" rel="noopener">{{ articleLabel }}</a>
          </div>
          <button v-if="screenshots.length" type="button" class="screenshots-btn" @click="openScreenshots">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><rect x="2" y="6" width="20" height="14" rx="2" /><circle cx="12" cy="13" r="3" /><path d="M8 6l1.5-2h5L16 6" /></svg>
            {{ screenshotsLabel }}
          </button>
        </div>
      </article>

      <article class="card-face card-back">
        <button type="button" class="back-btn" @click="flipped = false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          {{ backLabel }}
        </button>

        <button type="button" class="shot-viewer" :disabled="!screenshots.length" @click="lightboxOpen = true">
          <img v-if="screenshots.length" :src="screenshots[activeShot]" :alt="`${name} — ${activeShot + 1}/${screenshots.length}`" />
          <span v-if="screenshots.length" class="shot-zoom-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3M11 8v6M8 11h6" /></svg>
          </span>
        </button>

        <div v-if="screenshots.length > 1" class="shot-dots">
          <button
            v-for="(s, i) in screenshots"
            :key="i"
            type="button"
            class="shot-dot"
            :class="{ active: i === activeShot }"
            :aria-label="`${i + 1}/${screenshots.length}`"
            @click="activeShot = i"
          />
        </div>
      </article>
    </div>

    <Lightbox
      v-if="lightboxOpen"
      v-model:active-index="activeShot"
      :images="screenshots"
      :alt="name"
      @close="lightboxOpen = false"
    />
  </div>
</template>

<style scoped>
.card-flip {
  perspective: 1600px;
}

.card-flip-inner {
  position: relative;
  transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform-style: preserve-3d;
}

.card-flip.flipped .card-flip-inner {
  transform: rotateY(180deg);
}

.card-face {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 26px 24px 24px;
  backface-visibility: hidden;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}

.card-flip:not(.flipped) .card-front:hover {
  border-color: var(--border-light);
  box-shadow: 0 12px 32px -16px rgba(20, 22, 31, 0.18);
  transform: translateY(-2px);
}

.card-back {
  position: absolute;
  inset: 0;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
}

.card-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.card-title {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.card-title h3 {
  font-size: 20px;
}

.status {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.03em;
  font-weight: 600;
  align-self: flex-start;
  padding: 3px 9px;
  border-radius: 20px;
}

.status.deployed { color: var(--ok); background: var(--ok-tint); }
.status.progress { color: var(--warn); background: var(--warn-tint); }
.status.school { color: var(--text-faint); background: var(--bg-alt); border: 1px solid var(--border); }

.summary {
  margin: 0 0 16px;
  color: var(--text-dim);
  font-size: 16px;
}

.tasks {
  margin: 0 0 18px;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tasks li {
  font-size: 15px;
  color: var(--text);
  padding-left: 17px;
  position: relative;
  line-height: 1.5;
}

.tasks li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
}

.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.card-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.card-links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.link {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
}
.link:hover { border-color: var(--accent); }

.screenshots-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-dim);
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 6px 12px;
  cursor: pointer;
  margin-left: auto;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.screenshots-btn:hover { border-color: var(--accent); color: var(--accent); }

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-dim);
  background: none;
  border: none;
  padding: 0;
  margin-bottom: 14px;
  cursor: pointer;
}
.back-btn:hover { color: var(--accent); }

.shot-viewer {
  position: relative;
  flex: 1;
  min-height: 0;
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  cursor: zoom-in;
}
.shot-viewer:disabled { cursor: default; }
.shot-viewer img { width: 100%; height: 100%; object-fit: contain; }

.shot-zoom-hint {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.shot-viewer:hover .shot-zoom-hint,
.shot-viewer:focus-visible .shot-zoom-hint { opacity: 1; }

.shot-dots {
  display: flex;
  justify-content: center;
  gap: 4px;
  padding-top: 14px;
}
.shot-dot {
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
.shot-dot::before {
  content: '';
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--border-light);
  transition: background-color 0.15s ease, transform 0.15s ease;
}
.shot-dot:hover::before { background: var(--text-faint); }
.shot-dot.active::before { background: var(--accent); transform: scale(1.2); }

@media (prefers-reduced-motion: reduce) {
  .card-flip-inner { transition: none; }
}
</style>
