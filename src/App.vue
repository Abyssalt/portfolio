<script setup>
import { computed } from 'vue'
import ProjectCard from './components/ProjectCard.vue'
import TechChip from './components/TechChip.vue'
import { useTheme } from './composables/useTheme'
import { useLocale } from './composables/useLocale'
import { translations } from './i18n'
import { projects as rawProjects } from './data/projects'
import { skillGroups } from './data/skills'
import { education as rawEducation } from './data/education'

const { theme, toggleTheme } = useTheme()
const { locale, toggleLocale } = useLocale()

const t = computed(() => translations[locale.value])

const resumeUrl = computed(
  () => `${import.meta.env.BASE_URL}cv/${locale.value === 'fr' ? 'CV_MelvynPaul_FR.pdf' : 'CV_MelvynPaul_EN.pdf'}`
)

const projects = computed(() =>
  rawProjects.map((p) => ({
    id: p.id,
    name: p.name[locale.value],
    status: p.status,
    statusLabel: t.value.status[p.status],
    stack: p.stack[locale.value],
    summary: p.summary[locale.value],
    tasks: p.tasks[locale.value],
    link: p.link,
    linkLabel: t.value.projectCard.viewRepo,
    articleLink: p.articleLink,
    articleLabel: t.value.projectCard.readArticle,
    screenshots: p.screenshots,
    screenshotsLabel: t.value.projectCard.viewScreenshots,
    backLabel: t.value.projectCard.back,
  }))
)

const skills = computed(() =>
  skillGroups.map((g) => ({
    key: g.key,
    label: g.label[locale.value],
    items: g.items,
  }))
)

const education = computed(() =>
  rawEducation.map((e) => ({
    id: e.id,
    period: e.period[locale.value],
    school: e.school,
    website: e.website,
    logo: e.logo,
    degree: e.degree[locale.value],
  }))
)

const contactLinks = computed(() => [
  { key: 'email', href: 'mailto:melvynpauldev@proton.me', label: t.value.contact.email, icon: 'mail' },
  { key: 'github', href: 'https://github.com/Abyssalt', label: t.value.contact.github, icon: 'https://cdn.simpleicons.org/github' },
  { key: 'linkedin', href: 'https://www.linkedin.com/in/melvyn-paul-4a584b42a/', label: t.value.contact.linkedin, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/linkedin.svg' },
  { key: 'instagram', href: 'https://www.instagram.com/melvyn.paul/', label: t.value.contact.instagram, icon: 'https://cdn.simpleicons.org/instagram' },
])
</script>

<template>
  <header class="nav">
    <div class="container nav-inner">
      <span class="nav-brand">Melvyn Paul</span>
      <nav class="nav-links">
        <a href="#apropos">{{ t.nav.about }}</a>
        <a href="#formation">{{ t.nav.formation }}</a>
        <a href="#projets">{{ t.nav.projects }}</a>
        <a href="#competences">{{ t.nav.skills }}</a>
        <a href="#contact">{{ t.nav.contact }}</a>
      </nav>
      <div class="nav-controls">
        <button type="button" class="control-btn lang-btn" :aria-label="t.nav.langToggle" @click="toggleLocale">
          {{ locale === 'fr' ? 'EN' : 'FR' }}
        </button>
        <button type="button" class="control-btn theme-btn" :aria-label="t.nav.themeToggle" @click="toggleTheme">
          <svg v-if="theme === 'light'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" /></svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
        </button>
      </div>
    </div>
  </header>

  <section class="hero">
    <div class="container">
      <p class="eyebrow">{{ t.hero.eyebrow }}</p>
      <h1>{{ t.hero.title1 }}<br>{{ t.hero.title2 }}</h1>
      <p class="hero-sub">{{ t.hero.sub }}</p>
      <div class="hero-actions">
        <a href="#projets" class="btn-primary">{{ t.hero.ctaProjects }}</a>
        <a href="#contact" class="btn-ghost">{{ t.hero.ctaContact }}</a>
        <a :href="resumeUrl" download class="btn-ghost btn-resume">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="17" height="17"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
          {{ t.hero.ctaResume }}
        </a>
      </div>
    </div>
  </section>

  <section class="about">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">{{ t.about.eyebrow }}</p>
        <h2>{{ t.about.title }}</h2>
      </div>
      <p class="about-text">{{ t.about.text }}</p>
    </div>
  </section>

  <section id="formation">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">{{ t.formationSection.eyebrow }}</p>
        <h2>{{ t.formationSection.title }}</h2>
      </div>
      <div class="education-list">
        <div v-for="e in education" :key="e.id" class="education-entry">
          <span class="education-period">{{ e.period }}</span>
          <div class="education-main">
            <div class="education-logo">
              <img v-if="e.logo" :src="e.logo" :alt="e.school" />
            </div>
            <div class="education-detail">
              <span class="education-degree">{{ e.degree }}</span>
              <a v-if="e.website" :href="e.website" target="_blank" rel="noopener" class="education-school">
                {{ e.school }}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M7 17 17 7M7 7h10v10" /></svg>
              </a>
              <span v-else class="education-school">{{ e.school }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="projets">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">{{ t.projectsSection.eyebrow }}</p>
        <h2>{{ t.projectsSection.title }}</h2>
      </div>
      <div class="grid">
        <ProjectCard v-for="p in projects" :key="p.id" v-bind="p" />
      </div>
    </div>
  </section>

  <section id="competences">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">{{ t.skillsSection.eyebrow }}</p>
        <h2>{{ t.skillsSection.title }}</h2>
      </div>
      <div class="skills">
        <div v-for="g in skills" :key="g.key" class="skill-group">
          <h3>{{ g.label }}</h3>
          <div class="skill-chips">
            <TechChip v-for="s in g.items" :key="s" :name="s" large />
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer id="contact">
    <div class="container">
      <p class="eyebrow">{{ t.contact.eyebrow }}</p>
      <h2>{{ t.contact.title }}</h2>
      <p class="contact-text">{{ t.contact.text }}</p>
      <div class="contact-links">
        <a
          v-for="c in contactLinks"
          :key="c.key"
          :href="c.href"
          class="contact-link"
          :target="c.key === 'email' ? null : '_blank'"
          :rel="c.key === 'email' ? null : 'noopener'"
        >
          <span class="contact-icon">
            <svg v-if="c.icon === 'mail'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 6-10 7L2 6" />
            </svg>
            <img v-else :src="c.icon" :alt="c.label" />
          </span>
          {{ c.label }}
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  height: 68px;
}

.nav-brand {
  font-weight: 800;
  font-size: 17px;
  letter-spacing: -0.01em;
  flex-shrink: 0;
}

.nav-links { display: flex; gap: 26px; margin-right: auto; margin-left: 40px; }
.nav-links a {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-dim);
  text-decoration: none;
}
.nav-links a:hover { color: var(--text); }

.nav-controls { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.control-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-dim);
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.control-btn:hover { border-color: var(--accent); color: var(--accent); }

.lang-btn {
  font-family: var(--mono);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.03em;
  padding: 7px 10px;
}

.theme-btn { padding: 7px; }

.hero { padding: 80px 0 88px; background: var(--bg-alt); }

h1 {
  font-size: clamp(32px, 4.6vw, 48px);
  letter-spacing: -0.025em;
  margin-bottom: 22px;
  max-width: 18ch;
}

.hero-sub {
  font-size: 19px;
  max-width: 100ch;
  margin-bottom: 30px;
}

.hero-actions { display: flex; flex-wrap: wrap; gap: 14px; }

.btn-primary, .btn-ghost {
  font-size: 15.5px;
  font-weight: 600;
  padding: 13px 24px;
  border-radius: 8px;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
}
.btn-primary:hover { background: var(--accent-hover); }

.btn-ghost {
  border: 1px solid var(--border-light);
  color: var(--text);
  background: var(--bg);
}
.btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

.btn-resume { display: inline-flex; align-items: center; gap: 8px; }

.about { padding: 80px 0 88px; background: var(--bg-alt); }

.about-text { max-width: 100ch; }

.education-list { display: flex; flex-direction: column; }
.education-entry {
  display: flex;
  gap: 24px;
  padding: 18px 0;
  border-bottom: 1px solid var(--border);
}
.education-entry:first-child { padding-top: 0; }
.education-entry:last-child { border-bottom: none; }

.education-period {
  font-family: var(--mono);
  font-size: 14px;
  color: var(--text-black);
  width: 130px;
  flex-shrink: 0;
  padding-top: 2px;
}

.education-main { display: flex; align-items: center; gap: 14px; }

.education-logo {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #ffffff;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.education-logo img { width: 40px; height: 40px; object-fit: contain; }

.education-detail { display: flex; flex-direction: column; gap: 3px; justify-content: center; }
.education-degree { font-size: 18px; font-weight: 700; color: var(--text); }
.education-school {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 15px;
  color: var(--text-dim);
  text-decoration: none;
  width: fit-content;
}
a.education-school:hover { color: var(--accent); }
a.education-school svg { color: var(--text-faint); flex-shrink: 0; }
a.education-school:hover svg { color: var(--accent); }

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.skills { display: flex; flex-direction: column; gap: 32px; }
.skill-group h3 {
  font-size: 15.5px;
  font-weight: 700;
  color: var(--text-dim);
  margin-bottom: 14px;
}
.skill-chips { display: flex; flex-wrap: wrap; gap: 10px; }

footer { padding: 60px 0 60px; }
.contact-text { max-width: 100ch; margin-bottom: 28px; }
.contact-links {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}
.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px 10px 10px;
  border: 1px solid var(--border);
  border-radius: 30px;
  color: var(--text);
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}
.contact-link:hover { border-color: var(--accent); background: var(--accent-tint); }

.contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ffffff;
  color: #14161f;
  flex-shrink: 0;
  overflow: hidden;
}
.contact-icon img { width: 20px; height: 20px; object-fit: contain; }

@media (max-width: 800px) {
  .grid { grid-template-columns: 1fr; }
  .nav-links { display: none; }
}

@media (max-width: 480px) {
  .education-entry { flex-direction: column; gap: 4px; }
  .education-period { width: auto; }
}
</style>
