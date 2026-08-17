<script setup>
import { techIconUrl } from '../data/techIcons'

const props = defineProps({
  name: String,
  large: { type: Boolean, default: false },
})

const iconUrl = techIconUrl(props.name)
</script>

<template>
  <span class="tech-chip" :class="{ large }">
    <span v-if="iconUrl" class="tech-icon">
      <img :src="iconUrl" :alt="name" />
    </span>
    <span class="tech-name">{{ name }}</span>
  </span>
</template>

<style scoped>
.tech-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px 6px 7px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-dim);
  white-space: nowrap;
}

.tech-chip:has(.tech-icon) { padding-left: 6px; }

.tech-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  background: #ffffff;
  flex-shrink: 0;
  overflow: hidden;
}

.tech-icon img {
  width: 15px;
  height: 15px;
  object-fit: contain;
}

.tech-chip.large {
  gap: 9px;
  padding: 9px 16px 9px 9px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}
.tech-chip.large:has(.tech-icon) { padding-left: 9px; }

.tech-chip.large .tech-icon {
  width: 32px;
  height: 32px;
}
.tech-chip.large .tech-icon img {
  width: 21px;
  height: 21px;
}
</style>
