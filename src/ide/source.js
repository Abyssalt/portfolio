// Génère le "code source" de chaque fichier à partir des vraies données du portfolio.
// Une ligne = un tableau de jetons { c: classe de coloration, s: texte, href?: lien }.
import { DISCORD_USERNAME } from './content'

const tok = (c, s, href) => ({ c, s, href })
const P = (s) => tok('p', s)
const K = (s) => tok('kw', s)
const Y = (s) => tok('type', s)
const N = (s) => tok('prop', s)
const F = (s) => tok('fn', s)
const C = (s) => tok('com', s)
const quote = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
const S = (s) => tok('str', quote(s), /^(https?:|mailto:)/.test(s) ? s : undefined)
const sp = P(' ')
const ind = (n) => P('    '.repeat(n))

// ---------- Markdown ----------
function mdInline(text) {
  const out = []
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(P(text.slice(last, m.index)))
    out.push(P('['), tok('str', m[1]), P(']('), tok('link', m[2], m[2]), P(')'))
    last = re.lastIndex
  }
  if (last < text.length) out.push(P(text.slice(last)))
  return out
}

function markdown(rows) {
  return rows.map((row) => {
    if (row === '') return []
    if (/^#{1,6} /.test(row)) return [tok('head', row)]
    if (row.startsWith('> ')) return [C(row)]
    if (row.startsWith('- ')) return [K('- '), ...mdInline(row.slice(2))]
    return mdInline(row)
  })
}

// ---------- JSON ----------
function jsonLines(value) {
  const out = []
  const walk = (v, depth, prefix, comma) => {
    const pad = ind(depth)
    if (Array.isArray(v)) {
      const inline = v.every((x) => typeof x === 'string') && v.join(', ').length < 60
      if (!v.length || inline) {
        const items = []
        v.forEach((x, i) => items.push(S(x), ...(i < v.length - 1 ? [P(', ')] : [])))
        out.push([pad, ...prefix, P('['), ...items, P(']' + comma)])
        return
      }
      out.push([pad, ...prefix, P('[')])
      v.forEach((x, i) => walk(x, depth + 1, [], i < v.length - 1 ? ',' : ''))
      out.push([pad, P(']' + comma)])
    } else if (v && typeof v === 'object') {
      out.push([pad, ...prefix, P('{')])
      const keys = Object.keys(v)
      keys.forEach((k, i) => walk(v[k], depth + 1, [N(quote(k)), P(': ')], i < keys.length - 1 ? ',' : ''))
      out.push([pad, P('}' + comma)])
    } else {
      out.push([pad, ...prefix, typeof v === 'number' ? tok('num', String(v)) : S(v), P(comma)])
    }
  }
  walk(value, 0, [], '')
  return out
}

// ---------- fichiers de projet (Kotlin / C# / Java) ----------
function docComment(p, open, mid, close) {
  const status = p.statuses.map((s) => s.label).join(' · ')
  const rows = [`${p.name} · ${status}`, '', p.summary]
  return [[C(open)], ...rows.map((r) => [C(r ? `${mid} ${r}` : mid.trimEnd())]), [C(close)]]
}

function links(p, style) {
  const rows = []
  const pushLink = (name, value) => rows.push([ind(1), ...style(name, value)])
  if (p.link) pushLink(p.linkType === 'playStore' ? 'playStore' : 'repository', p.link)
  if (p.articleLink) pushLink('article', p.articleLink)
  return rows
}

function kotlin(p, cls) {
  const list = (name, items) => [
    [ind(1), K('val'), sp, N(name), P(' = '), F('listOf'), P('(')],
    ...items.map((x) => [ind(2), S(x), P(',')]),
    [ind(1), P(')')],
  ]
  const lines = [
    ...docComment(p, '/**', ' *', ' */'),
    [K('object'), sp, Y(cls), P(' {')],
    ...list('stack', p.stack),
    [],
    ...list('tasks', p.tasks),
  ]
  const ls = links(p, (n, v) => [K('const val'), sp, N(n), P(' = '), S(v)])
  if (ls.length) lines.push([], ...ls)
  lines.push([P('}')])
  return lines
}

function csharp(p, cls) {
  const list = (name, items) => [
    [ind(1), K('public static readonly'), sp, Y('string'), P('[]'), sp, N(name)],
    [ind(1), P('{')],
    ...items.map((x) => [ind(2), S(x), P(',')]),
    [ind(1), P('};')],
  ]
  const cap = (n) => n[0].toUpperCase() + n.slice(1)
  const lines = [
    ...docComment(p, '/// <summary>', '///', '/// </summary>'),
    [K('public static class'), sp, Y(cls)],
    [P('{')],
    ...list('Stack', p.stack),
    [],
    ...list('Tasks', p.tasks),
  ]
  const ls = links(p, (n, v) => [K('public const'), sp, Y('string'), sp, N(cap(n)), P(' = '), S(v), P(';')])
  if (ls.length) lines.push([], ...ls)
  lines.push([P('}')])
  return lines
}

function java(p, cls) {
  const list = (name, items) => [
    [ind(1), K('public static final'), sp, Y('String'), P('[]'), sp, N(name), P(' = {')],
    ...items.map((x) => [ind(2), S(x), P(',')]),
    [ind(1), P('};')],
  ]
  const upper = (n) => n.replace(/([A-Z])/g, '_$1').toUpperCase()
  const lines = [
    ...docComment(p, '/**', ' *', ' */'),
    [K('public final class'), sp, Y(cls), P(' {')],
    ...list('STACK', p.stack),
    [],
    ...list('TASKS', p.tasks),
  ]
  const ls = links(p, (n, v) => [K('public static final'), sp, Y('String'), sp, N(upper(n)), P(' = '), S(v), P(';')])
  if (ls.length) lines.push([], ...ls)
  lines.push([P('}')])
  return lines
}

function projectSource(p) {
  const cls = p.fileName.replace(/\.[^.]+$/, '')
  const ext = p.fileName.split('.').pop()
  if (ext === 'kt') return kotlin(p, cls)
  if (ext === 'cs') return csharp(p, cls)
  return java(p, cls)
}

// ---------- point d'entrée ----------
export function buildSource(id, c) {
  const t = c.t.value

  if (c.byId.value[id]?.project) return projectSource(c.byId.value[id].project)

  switch (id) {
    case 'readme':
      return markdown([
        `> ${t.hero.eyebrow}`,
        '',
        `# ${t.hero.title1}`,
        `## ${t.hero.title2}`,
        '',
        t.hero.sub,
        '',
        `[${t.hero.ctaProjects}](#/${c.projects.value[0].id}) · [${t.hero.ctaContact}](#/contact) · [${t.hero.ctaResume}](${c.resume.value.url})`,
      ])
    case 'about':
      return markdown([`> ${t.about.eyebrow}`, '', `# ${t.about.title}`, '', t.about.text])
    case 'education':
      return jsonLines(
        c.education.value.map((e) => ({ period: e.period, degree: e.degree, school: e.school, website: e.website }))
      )
    case 'skills':
      return jsonLines(Object.fromEntries(c.skills.value.map((g) => [g.key, g.items])))
    case 'contact':
      return markdown([
        `> ${t.contact.eyebrow}`,
        '',
        `# ${t.contact.title}`,
        '',
        t.contact.text,
        '',
        ...c.contactLinks.value.map((l) => `- [${l.label}](${l.href})`),
        `- ${t.contact.discord} : \`${DISCORD_USERNAME}\``,
      ])
    default:
      return null
  }
}
