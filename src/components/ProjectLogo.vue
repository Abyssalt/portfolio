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
      <defs>
        <linearGradient id="cyberquiz-logo-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2C3687" />
          <stop offset="1" stop-color="#1A2058" />
        </linearGradient>
      </defs>
      <rect width="108" height="108" rx="24" fill="url(#cyberquiz-logo-bg)" />
      <path
        d="M42,32 L66,54 L42,76"
        fill="none"
        stroke="#A5D6E8"
        stroke-width="11"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
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
