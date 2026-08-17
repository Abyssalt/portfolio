<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  images: { type: Array, required: true },
  activeIndex: { type: Number, required: true },
  alt: String,
})

const emit = defineEmits(['close', 'update:activeIndex'])

const root = ref(null)

function prev() {
  emit('update:activeIndex', (props.activeIndex - 1 + props.images.length) % props.images.length)
}
function next() {
  emit('update:activeIndex', (props.activeIndex + 1) % props.images.length)
}
function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowLeft' && props.images.length > 1) prev()
  else if (e.key === 'ArrowRight' && props.images.length > 1) next()
}

const previousOverflow = document.body.style.overflow
onMounted(() => {
  document.body.style.overflow = 'hidden'
  root.value?.focus()
})
onUnmounted(() => {
  document.body.style.overflow = previousOverflow
})
</script>

<template>
  <Teleport to="body">
    <div ref="root" class="lightbox" tabindex="-1" @click.self="$emit('close')" @keydown="onKeydown">
      <button type="button" class="lightbox-close" aria-label="Fermer" @click="$emit('close')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>

      <button v-if="images.length > 1" type="button" class="lightbox-nav prev" aria-label="Précédent" @click="prev">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="26" height="26"><path d="m15 18-6-6 6-6" /></svg>
      </button>

      <img :src="images[activeIndex]" :alt="alt" class="lightbox-img" />

      <button v-if="images.length > 1" type="button" class="lightbox-nav next" aria-label="Suivant" @click="next">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="26" height="26"><path d="m9 18 6-6-6-6" /></svg>
      </button>

      <div v-if="images.length > 1" class="lightbox-dots">
        <button
          v-for="(s, i) in images"
          :key="i"
          type="button"
          class="lightbox-dot"
          :class="{ active: i === activeIndex }"
          :aria-label="`${i + 1}/${images.length}`"
          @click="$emit('update:activeIndex', i)"
        />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(8, 9, 12, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  outline: none;
}

.lightbox-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.6);
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
}
.lightbox-close:hover { background: rgba(255, 255, 255, 0.18); }

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
}
.lightbox-nav:hover { background: rgba(255, 255, 255, 0.18); }
.lightbox-nav.prev { left: 16px; }
.lightbox-nav.next { right: 16px; }

.lightbox-dots {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.lightbox-dot {
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lightbox-dot::before {
  content: '';
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  transition: background-color 0.15s ease, transform 0.15s ease;
}
.lightbox-dot.active::before { background: #fff; transform: scale(1.2); }

@media (max-width: 640px) {
  .lightbox-nav.prev { left: 6px; }
  .lightbox-nav.next { right: 6px; }
}
</style>
