<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import FileIcon from './FileIcon.vue'

const props = defineProps({
  mode: { type: String, default: 'files' }, // 'files' | 'commands'
  files: { type: Array, required: true },
  commands: { type: Array, required: true },
  ui: { type: Object, required: true },
})
const emit = defineEmits(['close', 'open-file', 'run-command'])

const query = ref(props.mode === 'commands' ? '>' : '')
const cursor = ref(0)
const input = ref(null)
const list = ref(null)

const isCommand = computed(() => query.value.startsWith('>'))
const needle = computed(() => (isCommand.value ? query.value.slice(1) : query.value).trim().toLowerCase())

function score(text, q) {
  if (!q) return 1
  const s = text.toLowerCase()
  const at = s.indexOf(q)
  if (at >= 0) return 100 - at
  let i = 0
  for (const ch of s) if (ch === q[i]) i++
  return i === q.length ? 10 : 0
}

const items = computed(() => {
  const q = needle.value
  const source = isCommand.value
    ? props.commands.map((c) => ({ kind: 'command', key: c.id, label: c.label, ref: c }))
    : props.files.map((f) => ({ kind: 'file', key: f.id, label: f.name, hint: f.path.slice(0, -1).join(' / '), icon: f.icon, ref: f }))
  return source
    .map((it) => ({ ...it, score: score(it.label, q) }))
    .filter((it) => it.score > 0)
    .sort((a, b) => b.score - a.score)
})

watch(items, () => (cursor.value = 0))

function choose(it) {
  if (!it) return
  emit(it.kind === 'file' ? 'open-file' : 'run-command', it.ref)
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (items.value.length) cursor.value = (cursor.value + 1) % items.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (items.value.length) cursor.value = (cursor.value - 1 + items.value.length) % items.value.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    choose(items.value[cursor.value])
  }
}

watch(cursor, () => nextTick(() => list.value?.querySelector('.item.active')?.scrollIntoView({ block: 'nearest' })))
onMounted(() => input.value?.focus())
</script>

<template>
  <div class="overlay" @mousedown.self="$emit('close')">
    <div class="palette" role="dialog" aria-modal="true" :aria-label="isCommand ? ui.commandsTitle : ui.quickOpenTitle" @keydown="onKeydown">
      <input
        ref="input"
        v-model="query"
        class="field"
        type="text"
        spellcheck="false"
        autocomplete="off"
        :placeholder="ui.placeholder"
        :aria-label="ui.placeholder"
      />
      <ul ref="list" class="results" role="listbox">
        <li
          v-for="(it, i) in items"
          :key="it.kind + it.key"
          role="option"
          class="item"
          :class="{ active: i === cursor }"
          :aria-selected="i === cursor"
          @mousemove="cursor = i"
          @click="choose(it)"
        >
          <FileIcon v-if="it.kind === 'file'" :type="it.icon" />
          <span v-else class="cmd-mark" aria-hidden="true">&gt;</span>
          <span class="label">{{ it.label }}</span>
          <span v-if="it.hint" class="hint">{{ it.hint }}</span>
        </li>
        <li v-if="!items.length" class="empty">{{ ui.noResults }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 52px;
}

.palette {
  width: min(600px, calc(100vw - 24px));
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  box-shadow: var(--ide-shadow);
  overflow: hidden;
}

.field {
  width: 100%;
  padding: 10px 14px;
  border: none;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  font-size: 14px;
  outline: none;
}
.field::placeholder { color: var(--text-faint); }

.results { list-style: none; margin: 0; padding: 4px 0; max-height: min(340px, 50vh); overflow-y: auto; }

.item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 14px;
  font-size: 13.5px;
  cursor: pointer;
}
.item.active { background: var(--ide-select); }

.cmd-mark { width: 18px; flex: none; text-align: center; font-family: var(--mono); color: var(--accent); font-weight: 700; }
.label { color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hint { margin-left: auto; padding-left: 14px; color: var(--text-faint); font-size: 12px; white-space: nowrap; }
.empty { padding: 10px 14px; color: var(--text-faint); font-size: 13px; }
</style>
