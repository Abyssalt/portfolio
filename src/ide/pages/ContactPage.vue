<script setup>
import { ref } from 'vue'
import { useContent, DISCORD_USERNAME } from '../content'

const { t, contactLinks } = useContent()

const copied = ref(false)
function copyDiscord() {
  navigator.clipboard?.writeText(DISCORD_USERNAME).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  })
}
</script>

<template>
  <article class="doc">
    <p class="eyebrow">{{ t.contact.eyebrow }}</p>
    <h2>{{ t.contact.title }}</h2>
    <p class="lead">{{ t.contact.text }}</p>

    <div class="links">
      <a
        v-for="c in contactLinks"
        :key="c.key"
        :href="c.href"
        class="pill"
        :target="c.key === 'email' ? null : '_blank'"
        :rel="c.key === 'email' ? null : 'noopener'"
      >
        <span class="icon">
          <svg v-if="c.icon === 'mail'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></svg>
          <img v-else :src="c.icon" :alt="c.label" />
        </span>
        {{ c.label }}
      </a>

      <button type="button" class="pill" :class="{ copied }" @click="copyDiscord">
        <span class="icon"><img src="https://cdn.simpleicons.org/discord" alt="Discord" /></span>
        {{ copied ? t.contact.discordCopied : DISCORD_USERNAME }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.links { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 28px; }

.pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px 10px 10px;
  border: 1px solid var(--border-light);
  border-radius: 30px;
  background: none;
  color: var(--text);
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}
.pill:hover { border-color: var(--accent); background: var(--accent-tint); }
.pill.copied { border-color: var(--ok); background: var(--ok-tint); color: var(--ok); }

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ffffff;
  color: #14161f;
  flex: none;
  overflow: hidden;
}
.icon img { width: 20px; height: 20px; object-fit: contain; }
</style>
