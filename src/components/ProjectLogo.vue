<script setup>
import kinestatLogo from '../assets/logos/kinestat.png'

defineProps({
  id: String,
})
</script>

<template>
  <div class="project-logo">
    <img v-if="id === 'kinestat'" :src="kinestatLogo" alt="Logo KineStat" />

    <svg v-else-if="id === 'cyberquiz'" viewBox="0 0 108 108" role="img" aria-label="Logo CyberQuiz">
      <rect width="108" height="108" rx="24" fill="#232C71" />
      <path fill="#A5D6E8" d="M38,28 L64,54 L38,80 L30,80 L52,54 L30,28 Z" />
    </svg>

    <svg v-else viewBox="0 0 108 108" role="img" aria-label="Logo générique">
      <rect width="108" height="108" rx="24" fill="#3a3f4b" />
      <path fill="#e4e7ec" d="M54 26 L88 40 L54 54 L20 40 Z" />
      <path fill="none" stroke="#e4e7ec" stroke-width="3" d="M35 47 v16 c0 6 8 11 19 11 s19 -5 19 -11 v-16" />
      <path fill="none" stroke="#e4e7ec" stroke-width="3" stroke-linecap="round" d="M82 42 v20" />
    </svg>
  </div>
</template>

<style scoped>
.project-logo {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--bg-alt);
  border: 1px solid var(--border);
}

.project-logo img,
.project-logo svg {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
</style>
