#!/usr/bin/env node
/**
 * check-tool-links.mjs — authoritative /tools/ link checker.
 *
 * Two hard-won rules baked in:
 *  1. Tool links appear in BOTH markdown `](/tools/x)` AND raw HTML `href="/tools/x"`
 *     embedded inside the same .md files. A markdown-only regex silently misses ~40 links.
 *  2. Source scans are not authoritative — some blog pages are generated at build time by
 *     sync-harbor-blogs.mjs and never exist in git. Validate dist/ instead.
 *
 * Usage:
 *   node scripts/check-tool-links.mjs            # dist/ (authoritative) — run after build
 *   node scripts/check-tool-links.mjs --src      # also scan src/ as an early warning
 *
 * Exits 1 if any dead link is found, so it can gate a deploy.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'fs'
import { join, relative } from 'path'

const ROOT = join(import.meta.dirname, '..')
const DIST = join(ROOT, 'dist')
const SRC = join(ROOT, 'src', 'pages')
const TOOLS_DIR = join(DIST, 'tools')

const MD_LINK = /\]\(\/tools\/([^)#?]+)\)/g
const HTML_LINK = /href="\/tools\/([^"#?]+)"/g

/** Recursively collect files under `dir` whose basename satisfies `test`. */
function walk(dir, test, out = []) {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    let s
    try {
      s = statSync(p)
    } catch {
      continue // broken symlink or unreadable entry — not our concern
    }
    if (s.isDirectory()) walk(p, test, out)
    else if (test(entry)) out.push(p)
  }
  return out
}

/** Every /tools/<slug> referenced in `text`, from both link syntaxes. */
function extractSlugs(text) {
  const slugs = []
  for (const re of [MD_LINK, HTML_LINK]) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(text))) slugs.push(m[1].replace(/\/+$/, ''))
  }
  return slugs
}

/**
 * Scan files for tool links and report any whose target page was not built.
 * @returns {{slugs: Set<string>, dead: number}} distinct slugs seen, and dead-link count
 */
function scan(files, built, label, pathBase) {
  const slugs = new Set()
  let dead = 0
  for (const file of files) {
    for (const slug of new Set(extractSlugs(readFileSync(file, 'utf8')))) {
      slugs.add(slug)
      if (!built.has(slug)) {
        dead++
        console.error(`DEAD(${label}) /tools/${slug}  in  ${relative(pathBase, file)}`)
      }
    }
  }
  return { slugs, dead }
}

if (!existsSync(TOOLS_DIR)) {
  console.error(
    existsSync(DIST)
      ? 'dist/tools/ is missing — the build produced no tool pages (check the Supabase fetch).'
      : 'dist/ not found — run `npm run build` first. dist is the authoritative check.'
  )
  process.exit(1)
}

const built = new Set(
  readdirSync(TOOLS_DIR).filter(d => statSync(join(TOOLS_DIR, d)).isDirectory())
)
console.log(`tool pages built: ${built.size}`)

const dist = scan(walk(DIST, f => f === 'index.html'), built, 'dist', DIST)
console.log(`dist: ${dist.slugs.size} distinct slugs referenced, ${dist.dead} dead`)
let dead = dist.dead

if (process.argv.includes('--src')) {
  const src = scan(walk(SRC, f => f.endsWith('.md') || f.endsWith('.astro')), built, 'src', ROOT)
  console.log(`src:  ${src.slugs.size} distinct slugs referenced, ${src.dead} dead`)
  dead += src.dead
}

console.log(dead === 0 ? 'PASS — no dead /tools/ links' : `FAIL — ${dead} dead link(s)`)
process.exit(dead === 0 ? 0 : 1)
