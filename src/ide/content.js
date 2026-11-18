import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'
import { translations } from '../i18n'
import { projects as rawProjects } from '../data/projects'
import { skillGroups } from '../data/skills'
import { education as rawEducation } from '../data/education'
import { ui as uiStrings } from './strings'

export const DISCORD_USERNAME = 'abyssalt_'
export const GITHUB_PROFILE = 'https://github.com/Abyssalt'
export const GITHUB_REPO = 'https://github.com/Abyssalt/portfolio'
export const EMAIL = 'melvynpauldev@proton.me'

const LANG_BY_ICON = { md: 'Markdown', json: 'JSON', kt: 'Kotlin', cs: 'C#', java: 'Java', pdf: 'PDF' }

function iconOf(fileName) {
  const ext = fileName.split('.').pop()
  return LANG_BY_ICON[ext] ? ext : 'file'
}

const { locale } = useLocale()

const fr = computed(() => locale.value === 'fr')
const t = computed(() => translations[locale.value])
const ui = computed(() => uiStrings[locale.value])

const projects = computed(() =>
  rawProjects.map((p) => ({
    id: p.id,
    fileName: p.fileName,
    language: p.language,
    name: p.name[locale.value],
    statuses: p.status.map((key) => ({ key, label: t.value.status[key] })),
    stack: p.stack[locale.value],
    summary: p.summary[locale.value],
    tasks: p.tasks[locale.value],
    link: p.link,
    linkType: p.linkType,
    linkLabel: p.linkType === 'playStore' ? t.value.projectCard.viewPlayStore : t.value.projectCard.viewRepo,
    articleLink: p.articleLink,
    articleLabel: t.value.projectCard.readArticle,
    screenshots: p.screenshots,
    screenshotsLayout: p.screenshotsLayout,
    screenshotsFeatured: p.screenshotsFeatured,
  }))
)

const skills = computed(() =>
  skillGroups.map((g) => ({ key: g.key, label: g.label[locale.value], items: g.items }))
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

const resume = computed(() => {
  const name = fr.value ? 'CV_MelvynPaul_FR.pdf' : 'CV_MelvynPaul_EN.pdf'
  return { name, url: `${import.meta.env.BASE_URL}cv/${name}` }
})

const contactLinks = computed(() => [
  { key: 'email', href: `mailto:${EMAIL}`, label: t.value.contact.email, icon: 'mail' },
  { key: 'github', href: GITHUB_PROFILE, label: t.value.contact.github, icon: 'https://cdn.simpleicons.org/github' },
  { key: 'linkedin', href: 'https://www.linkedin.com/in/melvyn-paul-4a584b42a/', label: t.value.contact.linkedin, icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/linkedin.svg' },
  { key: 'instagram', href: 'https://www.instagram.com/melvyn.paul/', label: t.value.contact.instagram, icon: 'https://cdn.simpleicons.org/instagram' },
])

// ---- l'arborescence de fichiers : chaque "page" du site est un fichier ----
function file(id, name, extra = {}) {
  const icon = iconOf(name)
  return { type: 'file', id, name, icon, lang: LANG_BY_ICON[icon] ?? 'Plain Text', ...extra }
}

const tree = computed(() => {
  const dir = fr.value ? 'projets' : 'projects'
  const root = 'portfolio'
  const f = (id, name, extra) => file(id, name, { path: [root, name], ...extra })
  return [
    f('readme', 'README.md'),
    f('about', fr.value ? 'a-propos.md' : 'about.md'),
    f('education', fr.value ? 'formation.json' : 'education.json'),
    {
      type: 'folder',
      id: 'projects',
      name: dir,
      children: projects.value.map((p) =>
        file(p.id, p.fileName, { path: [root, dir, p.fileName], project: p, lang: p.language })
      ),
    },
    f('skills', fr.value ? 'competences.json' : 'skills.json'),
    f('contact', 'contact.md'),
    f('cv', resume.value.name),
  ]
})

const files = computed(() => tree.value.flatMap((n) => (n.type === 'folder' ? n.children : [n])))

const byId = computed(() => Object.fromEntries(files.value.map((x) => [x.id, x])))

export function useContent() {
  return { locale, fr, t, ui, projects, skills, education, resume, contactLinks, tree, files, byId }
}
