<script setup>
import FileIcon from '../components/FileIcon.vue'
import { useContent } from '../content'

defineEmits(['open', 'palette'])
const { ui, files } = useContent()
const isMac = /Mac|iPhone|iPad/.test(navigator.platform)
const mod = isMac ? '⌘' : 'Ctrl'
</script>

<template>
  <div class="welcome">
    <div class="mark" aria-hidden="true">{ }</div>
    <h1>{{ ui.welcomeTitle }}</h1>
    <p class="sub">{{ ui.welcomeSub }}</p>

    <div class="cols">
      <section>
        <h2>{{ ui.welcomeStart }}</h2>
        <ul class="shortcuts">
          <li>
            <button type="button" @click="$emit('palette', 'files')">
              <span>{{ ui.shortcutOpen }}</span>
              <span class="keys"><kbd>{{ mod }}</kbd><kbd>P</kbd></span>
            </button>
          </li>
          <li>
            <button type="button" @click="$emit('palette', 'commands')">
              <span>{{ ui.shortcutCommands }}</span>
              <span class="keys"><kbd>{{ mod }}</kbd><kbd>⇧</kbd><kbd>P</kbd></span>
            </button>
          </li>
          <li>
            <span class="static">
              <span>{{ ui.shortcutSidebar }}</span>
              <span class="keys"><kbd>{{ mod }}</kbd><kbd>B</kbd></span>
            </span>
          </li>
        </ul>
      </section>

      <section>
        <h2>{{ ui.welcomeFiles }}</h2>
        <ul class="recent">
          <li v-for="f in files" :key="f.id">
            <button type="button" @click="$emit('open', f.id)">
              <FileIcon :type="f.icon" />
              <span>{{ f.name }}</span>
            </button>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.welcome {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px 80px;
  text-align: center;
}

.mark {
  font-family: var(--mono);
  font-size: 44px;
  font-weight: 600;
  color: var(--accent);
  opacity: 0.9;
  margin-bottom: 14px;
}

h1 { margin: 0; font-size: 30px; font-weight: 300; letter-spacing: -0.01em; color: var(--text); }
.sub { margin: 6px 0 36px; font-size: 15px; color: var(--text-faint); }

.cols { display: flex; flex-wrap: wrap; gap: 36px 64px; justify-content: center; text-align: left; }

h2 { margin: 0 0 10px; font-size: 16px; font-weight: 400; color: var(--text); }

ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }

.shortcuts button, .shortcuts .static, .recent button {
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;
  padding: 4px 8px;
  margin-left: -8px;
  border: none;
  border-radius: 4px;
  background: none;
  font-size: 13.5px;
  color: var(--text-dim);
  cursor: pointer;
  text-align: left;
}
.shortcuts .static { cursor: default; }
.shortcuts button:hover, .recent button:hover { background: var(--ide-hover); color: var(--text); }
.shortcuts button > span:first-child, .shortcuts .static > span:first-child { min-width: 170px; }

.recent button { gap: 6px; color: var(--accent); }

.keys { display: inline-flex; gap: 4px; }
kbd {
  min-width: 22px;
  padding: 1px 6px;
  border: 1px solid var(--border-light);
  border-bottom-width: 2px;
  border-radius: 4px;
  background: var(--bg-alt);
  color: var(--text-dim);
  font-family: var(--mono);
  font-size: 11.5px;
  text-align: center;
}
</style>
