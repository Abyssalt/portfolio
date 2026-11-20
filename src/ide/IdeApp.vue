<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useLocale } from '../composables/useLocale'
import { useContent, GITHUB_PROFILE, GITHUB_REPO } from './content'
import { buildSource } from './source'
import FileIcon from './components/FileIcon.vue'
import Explorer from './components/Explorer.vue'
import CodeView from './components/CodeView.vue'
import QuickOpen from './components/QuickOpen.vue'
import HomePage from './pages/HomePage.vue'
import EducationPage from './pages/EducationPage.vue'
import SkillsPage from './pages/SkillsPage.vue'
import ContactPage from './pages/ContactPage.vue'
import CvPage from './pages/CvPage.vue'
import ProjectPage from './pages/ProjectPage.vue'
import WelcomePage from './pages/WelcomePage.vue'

const { theme, toggleTheme } = useTheme()
const { locale, toggleLocale } = useLocale()
const content = useContent()
const { t, ui, tree, files, byId, resume } = content

const PAGES = { readme: HomePage, education: EducationPage, skills: SkillsPage, contact: ContactPage, cv: CvPage }
const isMac = /Mac|iPhone|iPad/.test(navigator.platform)
const mod = isMac ? '⌘' : 'Ctrl'

// ---- état ----
const isDesktop = () => window.matchMedia('(min-width: 761px)').matches
const sidebarOpen = ref(isDesktop())
const openTabs = ref([])
const activeId = ref(null)
const views = reactive({}) // id -> 'preview' | 'code'
const palette = ref(null) // null | 'files' | 'commands'
const body = ref(null)

const active = computed(() => byId.value[activeId.value] ?? null)
const view = computed(() => views[activeId.value] ?? 'preview')
const hasCode = computed(() => !!active.value && active.value.icon !== 'pdf')
const pageComponent = computed(() => {
  if (!active.value) return null
  return active.value.project ? ProjectPage : PAGES[active.value.id]
})
const codeLines = computed(() => (active.value && hasCode.value && view.value === 'code' ? buildSource(active.value.id, content) : []))

// ---- navigation (le hash garde l'URL partageable : /#/cyberquiz) ----
function idFromHash() {
  const m = location.hash.match(/^#\/([\w-]+)/)
  return m && byId.value[m[1]] ? m[1] : null
}

function setHash(id) {
  if (id) {
    if (location.hash !== `#/${id}`) location.hash = `/${id}`
  } else if (location.hash) {
    history.replaceState(null, '', location.pathname + location.search)
  }
}

function open(id) {
  if (!byId.value[id]) return
  if (!openTabs.value.includes(id)) openTabs.value.push(id)
  activeId.value = id
  setHash(id)
  if (!isDesktop()) sidebarOpen.value = false
}

function close(id) {
  const i = openTabs.value.indexOf(id)
  if (i < 0) return
  openTabs.value.splice(i, 1)
  if (activeId.value === id) {
    const next = openTabs.value[i] ?? openTabs.value[i - 1] ?? null
    activeId.value = next
    setHash(next)
  }
}

function closeAll() {
  openTabs.value = []
  activeId.value = null
  setHash(null)
}

function onTabKeydown(e, id) {
  const i = openTabs.value.indexOf(id)
  let target = null
  if (e.key === 'ArrowRight') target = openTabs.value[(i + 1) % openTabs.value.length]
  else if (e.key === 'ArrowLeft') target = openTabs.value[(i - 1 + openTabs.value.length) % openTabs.value.length]
  if (!target) return
  e.preventDefault()
  open(target)
  nextTick(() => document.querySelector('.tab-main[aria-selected="true"]')?.focus())
}

watch(activeId, () => nextTick(() => body.value?.scrollTo(0, 0)))
watch(view, () => nextTick(() => body.value?.scrollTo(0, 0)))

// ---- commandes ----
function downloadCv() {
  const a = document.createElement('a')
  a.href = resume.value.url
  a.download = resume.value.name
  a.click()
}

const commands = computed(() => [
  { id: 'theme', label: ui.value.cmd.theme, run: toggleTheme },
  { id: 'lang', label: ui.value.cmd.lang, run: toggleLocale },
  { id: 'cv', label: ui.value.cmd.cv, run: downloadCv },
  { id: 'github', label: ui.value.cmd.github, run: () => window.open(GITHUB_PROFILE, '_blank', 'noopener') },
  { id: 'sidebar', label: ui.value.cmd.sidebar, run: () => (sidebarOpen.value = !sidebarOpen.value) },
  { id: 'closeAll', label: ui.value.cmd.closeAll, run: closeAll },
  { id: 'home', label: ui.value.cmd.home, run: () => open('readme') },
])

function runCommand(c) {
  palette.value = null
  c.run()
}

function openFromPalette(f) {
  palette.value = null
  open(f.id)
}

function onKey(e) {
  const key = e.key.toLowerCase()
  const meta = e.ctrlKey || e.metaKey
  if (meta && key === 'p') {
    e.preventDefault()
    palette.value = e.shiftKey ? 'commands' : 'files'
  } else if (e.key === 'F1') {
    e.preventDefault()
    palette.value = 'commands'
  } else if (meta && key === 'b') {
    e.preventDefault()
    sidebarOpen.value = !sidebarOpen.value
  }
}

function onHash() {
  const id = idFromHash()
  if (id && id !== activeId.value) open(id)
}

// Quand on passe du téléphone au bureau (ou l'inverse), le panneau latéral prend l'état par défaut de la taille.
const desktopQuery = window.matchMedia('(min-width: 761px)')
const onBreakpoint = (e) => (sidebarOpen.value = e.matches)

onMounted(() => {
  open(idFromHash() ?? 'readme')
  window.addEventListener('keydown', onKey)
  window.addEventListener('hashchange', onHash)
  desktopQuery.addEventListener('change', onBreakpoint)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('hashchange', onHash)
  desktopQuery.removeEventListener('change', onBreakpoint)
})

// Le titre de l'onglet du navigateur suit le fichier ouvert, comme une vraie fenêtre d'IDE.
watch([active, locale], () => {
  document.title = active.value ? `${active.value.name} — Melvyn Paul` : 'Melvyn Paul — Portfolio'
})
</script>

<template>
  <div class="ide">
    <!-- ===== barre de titre ===== -->
    <header class="titlebar">
      <div class="tb-left">
        <button type="button" class="icon-btn menu-btn" :aria-label="ui.sidebarToggle" @click="sidebarOpen = !sidebarOpen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <span class="app-mark" aria-hidden="true">{ }</span>
      </div>

      <button type="button" class="command-center" :aria-label="ui.quickOpenTitle" @click="palette = 'files'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
        <span class="cc-label">Melvyn Paul — {{ ui.root }}</span>
        <kbd class="cc-keys">{{ mod }} P</kbd>
      </button>

      <div class="tb-right">
        <button type="button" class="icon-btn text-btn" :aria-label="ui.langToggle" @click="toggleLocale">{{ locale === 'fr' ? 'EN' : 'FR' }}</button>
        <button type="button" class="icon-btn" :aria-label="ui.themeToggle" @click="toggleTheme">
          <svg v-if="theme === 'light'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" /></svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
        </button>
      </div>
    </header>

    <div class="workbench">
      <!-- ===== barre d'activité ===== -->
      <nav class="activity" aria-label="Navigation">
        <div class="act-group">
          <button type="button" class="act" :class="{ on: sidebarOpen }" :aria-label="ui.explorer" :title="`${ui.explorer} (${mod}+B)`" @click="sidebarOpen = !sidebarOpen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          </button>
          <button type="button" class="act" :aria-label="ui.quickOpenTitle" :title="`${ui.quickOpenTitle} (${mod}+P)`" @click="palette = 'files'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </button>
          <a class="act" :href="GITHUB_REPO" target="_blank" rel="noopener" :aria-label="ui.github" :title="ui.github">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>
          </a>
        </div>
        <div class="act-group">
          <button type="button" class="act" :aria-label="ui.account" :title="ui.account" @click="open('contact')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </button>
          <button type="button" class="act" :aria-label="ui.settings" :title="ui.commandsTitle" @click="palette = 'commands'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
          </button>
        </div>
      </nav>

      <!-- ===== explorateur ===== -->
      <div v-if="sidebarOpen" class="scrim" @click="sidebarOpen = false" />
      <aside v-show="sidebarOpen" class="sidebar" :aria-label="ui.explorer">
        <Explorer :title="ui.explorer" :root-name="ui.root" :tree="tree" :active-id="activeId" @open="open" />
      </aside>

      <!-- ===== éditeur ===== -->
      <main class="editor">
        <div class="tabs" role="tablist" :aria-label="ui.openEditors">
          <div
            v-for="id in openTabs"
            :key="id"
            class="tab"
            :class="{ active: id === activeId }"
            role="presentation"
            @auxclick.middle.prevent="close(id)"
          >
            <button
              type="button"
              role="tab"
              class="tab-main"
              :aria-selected="id === activeId"
              :tabindex="id === activeId ? 0 : -1"
              @click="open(id)"
              @keydown="onTabKeydown($event, id)"
            >
              <FileIcon :type="byId[id].icon" />
              <span>{{ byId[id].name }}</span>
            </button>
            <button type="button" class="tab-close" tabindex="-1" :aria-label="`${ui.close} ${byId[id].name}`" @click="close(id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div v-if="active" class="crumbs">
          <div class="path">
            <template v-for="(part, i) in active.path" :key="i">
              <svg v-if="i" class="sep" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><path d="m9 18 6-6-6-6" /></svg>
              <span :class="{ current: i === active.path.length - 1 }">{{ part }}</span>
            </template>
          </div>
          <div v-if="hasCode" class="view-toggle" role="group" :aria-label="ui.viewToggle">
            <button type="button" :class="{ on: view === 'preview' }" :aria-pressed="view === 'preview'" @click="views[activeId] = 'preview'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
              <span>{{ ui.preview }}</span>
            </button>
            <button type="button" :class="{ on: view === 'code' }" :aria-pressed="view === 'code'" @click="views[activeId] = 'code'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></svg>
              <span>{{ ui.code }}</span>
            </button>
          </div>
        </div>

        <div ref="body" class="editor-body">
          <template v-if="active">
            <CodeView v-if="hasCode && view === 'code'" :key="`code-${activeId}`" :lines="codeLines" />
            <component :is="pageComponent" v-else :key="activeId" :project="active.project" @open="open" />
          </template>
          <WelcomePage v-else @open="open" @palette="palette = $event" />
        </div>
      </main>
    </div>

    <!-- ===== barre d'état ===== -->
    <footer class="statusbar">
      <div class="sb-group">
        <a class="sb-item" :href="GITHUB_REPO" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>
          main
        </a>
        <span class="sb-item avail"><span class="dot" aria-hidden="true" />{{ t.facts.availabilityValue }}</span>
      </div>
      <div class="sb-group">
        <span v-if="active" class="sb-item hide-sm">{{ view === 'code' && hasCode ? ui.code : ui.preview }}</span>
        <span v-if="active" class="sb-item">{{ active.lang }}</span>
        <span class="sb-item hide-sm">UTF-8</span>
      </div>
    </footer>

    <QuickOpen
      v-if="palette"
      :key="palette"
      :mode="palette"
      :files="files"
      :commands="commands"
      :ui="ui"
      @close="palette = null"
      @open-file="openFromPalette"
      @run-command="runCommand"
    />
  </div>
</template>

<style scoped>
.ide {
  display: grid;
  grid-template-rows: 36px minmax(0, 1fr) 24px;
  height: 100vh;
  height: 100dvh;
  background: var(--bg);
  color: var(--text);
}

/* ---------- barre de titre ---------- */
.titlebar {
  display: grid;
  grid-template-columns: 1fr minmax(0, 560px) 1fr;
  align-items: center;
  gap: 12px;
  padding: 0 8px;
  background: var(--ide-title);
  border-bottom: 1px solid var(--border);
}

.tb-left { display: flex; align-items: center; gap: 6px; }
.tb-right { display: flex; align-items: center; justify-content: flex-end; gap: 2px; }

.app-mark {
  font-family: var(--mono);
  font-weight: 700;
  font-size: 14px;
  color: var(--accent);
  padding: 0 8px;
  user-select: none;
}

.menu-btn { display: none; }

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  min-width: 28px;
  padding: 0 6px;
  border: none;
  border-radius: 5px;
  background: none;
  color: var(--text-dim);
  cursor: pointer;
}
.icon-btn:hover { background: var(--ide-hover); color: var(--text); }
.text-btn { font-family: var(--mono); font-size: 12px; font-weight: 600; }

.command-center {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  padding: 0 10px;
  border: 1px solid var(--border-light);
  border-radius: 7px;
  background: var(--bg-alt);
  color: var(--text-dim);
  cursor: pointer;
  min-width: 0;
}
.command-center:hover { border-color: var(--accent); color: var(--text); }
.cc-label { flex: 1; text-align: center; font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cc-keys { font-family: var(--mono); font-size: 10.5px; color: var(--text-faint); }

/* ---------- zone centrale ---------- */
.workbench { display: flex; min-height: 0; position: relative; }

.activity {
  width: 48px;
  flex: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--ide-activity);
  border-right: 1px solid var(--border);
}

.act {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  background: none;
  color: var(--text-faint);
  cursor: pointer;
  text-decoration: none;
}
.act:hover { color: var(--text); }
.act.on { color: var(--text); }
.act.on::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  bottom: 10px;
  width: 2px;
  background: var(--accent);
}

.sidebar {
  width: 264px;
  flex: none;
  background: var(--ide-sidebar);
  border-right: 1px solid var(--border);
  min-height: 0;
}

.scrim { display: none; }

/* ---------- éditeur ---------- */
.editor { flex: 1; min-width: 0; display: flex; flex-direction: column; background: var(--bg); }

.tabs {
  display: flex;
  flex: none;
  min-height: 35px;
  overflow-x: auto;
  overflow-y: hidden;
  background: var(--ide-tabs);
  border-bottom: 1px solid var(--border);
  scrollbar-width: none;
}
.tabs::-webkit-scrollbar { display: none; }

.tab {
  position: relative;
  display: flex;
  align-items: center;
  flex: none;
  border-right: 1px solid var(--border);
  background: var(--ide-tabs);
  color: var(--text-faint);
}
.tab:hover { color: var(--text-dim); }
.tab.active { background: var(--bg); color: var(--text); }
.tab.active::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 1px; background: var(--accent); }
.tab.active::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 1px; background: var(--bg); }

.tab-main {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 4px 0 12px;
  border: none;
  background: none;
  font-size: 13px;
  color: inherit;
  cursor: pointer;
  white-space: nowrap;
}

.tab-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-right: 6px;
  border: none;
  border-radius: 4px;
  background: none;
  color: var(--text-faint);
  cursor: pointer;
  opacity: 0;
}
.tab.active .tab-close, .tab:hover .tab-close { opacity: 1; }
.tab-close:hover { background: var(--ide-hover); color: var(--text); }

.crumbs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex: none;
  min-height: 28px;
  padding: 0 12px 0 16px;
  border-bottom: 1px solid var(--border);
  font-size: 12.5px;
  color: var(--text-faint);
}
.path { display: flex; align-items: center; gap: 2px; min-width: 0; white-space: nowrap; overflow: hidden; }
.path .current { color: var(--text-dim); }
.sep { flex: none; opacity: 0.7; }

.view-toggle { display: flex; flex: none; gap: 2px; padding: 2px; border-radius: 6px; background: var(--bg-alt); border: 1px solid var(--border); }
.view-toggle button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 20px;
  padding: 0 8px;
  border: none;
  border-radius: 4px;
  background: none;
  font-size: 12px;
  color: var(--text-faint);
  cursor: pointer;
}
.view-toggle button:hover { color: var(--text); }
.view-toggle button.on { background: var(--ide-select); color: var(--text); }

.editor-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  container-type: inline-size;
  container-name: editor;
}

/* ---------- barre d'état ---------- */
.statusbar {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  background: var(--ide-status);
  color: var(--ide-status-text);
  font-size: 12px;
}
.sb-group { display: flex; align-items: stretch; min-width: 0; }
.sb-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0 10px;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
}
a.sb-item:hover { background: rgba(255, 255, 255, 0.16); }
.avail { overflow: hidden; text-overflow: ellipsis; }
.avail .dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; flex: none; }

/* ---------- mobile ---------- */
@media (max-width: 760px) {
  .titlebar { grid-template-columns: auto minmax(0, 1fr) auto; gap: 6px; }
  .menu-btn { display: inline-flex; }
  .app-mark { display: none; }
  .cc-keys { display: none; }
  .activity { display: none; }

  .sidebar {
    position: absolute;
    z-index: 30;
    left: 0;
    top: 0;
    bottom: 0;
    width: min(82vw, 300px);
    box-shadow: var(--ide-shadow);
  }
  .scrim { display: block; position: absolute; inset: 0; z-index: 20; background: rgba(0, 0, 0, 0.4); }

  .crumbs { padding-left: 12px; }
  .view-toggle span { display: none; }
  .view-toggle button { padding: 0 7px; }
  .hide-sm { display: none; }
}
</style>
