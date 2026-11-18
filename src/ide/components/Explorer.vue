<script setup>
import { reactive, ref } from 'vue'
import FileIcon from './FileIcon.vue'

defineProps({
  title: String,
  rootName: String,
  tree: { type: Array, required: true },
  activeId: String,
})
defineEmits(['open'])

const rootOpen = ref(true)
const expanded = reactive({ projects: true })
</script>

<template>
  <div class="explorer">
    <div class="heading">{{ title }}</div>

    <button type="button" class="section" :aria-expanded="rootOpen" @click="rootOpen = !rootOpen">
      <svg class="chev" :class="{ open: rootOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="m9 18 6-6-6-6" /></svg>
      {{ rootName }}
    </button>

    <ul v-show="rootOpen" class="tree" role="tree">
      <template v-for="node in tree" :key="node.id">
        <li v-if="node.type === 'file'" role="none">
          <button
            type="button"
            role="treeitem"
            class="row"
            :class="{ active: node.id === activeId }"
            :aria-selected="node.id === activeId"
            @click="$emit('open', node.id)"
          >
            <span class="chev-space" />
            <FileIcon :type="node.icon" />
            <span class="name">{{ node.name }}</span>
          </button>
        </li>

        <li v-else role="none">
          <button
            type="button"
            role="treeitem"
            class="row folder"
            :aria-expanded="!!expanded[node.id]"
            @click="expanded[node.id] = !expanded[node.id]"
          >
            <svg class="chev" :class="{ open: expanded[node.id] }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="m9 18 6-6-6-6" /></svg>
            <svg class="folder-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
            <span class="name">{{ node.name }}</span>
          </button>
          <ul v-show="expanded[node.id]" class="tree nested" role="group">
            <li v-for="child in node.children" :key="child.id" role="none">
              <button
                type="button"
                role="treeitem"
                class="row"
                :class="{ active: child.id === activeId }"
                :aria-selected="child.id === activeId"
                @click="$emit('open', child.id)"
              >
                <span class="chev-space" />
                <FileIcon :type="child.icon" />
                <span class="name">{{ child.name }}</span>
              </button>
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped>
.explorer { display: flex; flex-direction: column; min-height: 0; overflow-y: auto; height: 100%; }

.heading {
  padding: 11px 20px 9px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.section {
  display: flex;
  align-items: center;
  gap: 2px;
  width: 100%;
  padding: 3px 8px 3px 4px;
  border: none;
  background: none;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text);
  cursor: pointer;
  text-align: left;
}
.section:hover { background: var(--ide-hover); }

.chev { flex: none; transition: transform 0.12s ease; color: var(--text-dim); }
.chev.open { transform: rotate(90deg); }

.tree { list-style: none; margin: 0; padding: 0; }

.row {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  height: 24px;
  padding: 0 8px 0 18px;
  border: none;
  background: none;
  font-size: 13px;
  color: var(--text);
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
}
.row:hover { background: var(--ide-hover); }
.row.active { background: var(--ide-select); }
.row.folder { padding-left: 8px; }
.nested .row { padding-left: 34px; }

.chev-space { width: 0; }
.folder-icon { color: var(--text-faint); flex: none; }

.name { overflow: hidden; text-overflow: ellipsis; }
</style>
