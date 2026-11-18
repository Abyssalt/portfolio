<script setup>
import TechChip from '../../components/TechChip.vue'
import { useContent } from '../content'

const { t, skills } = useContent()
</script>

<template>
  <article class="doc">
    <p class="eyebrow">{{ t.skillsSection.eyebrow }}</p>
    <h2>{{ t.skillsSection.title }}</h2>

    <div class="groups">
      <div v-for="g in skills" :key="g.key" class="group">
        <h3>{{ g.label }}</h3>
        <div class="chips">
          <TechChip v-for="s in g.items" :key="s" :name="s" large />
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.groups { display: flex; flex-direction: column; gap: 30px; margin-top: 26px; }
.group h3 { font-size: 14.5px; font-weight: 700; color: var(--text-dim); margin-bottom: 14px; letter-spacing: 0; }
.chips { display: flex; flex-wrap: wrap; gap: 10px; }
</style>
