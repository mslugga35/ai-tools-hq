#!/usr/bin/env node
/**
 * check-tool-links.mjs — authoritative /tools/ link checker.
 *
 * Two hard-won rules baked in:
 *  1. Tool links appear in BOTH markdown `](/tools/x)` AND raw HTML `href="/tools/x"`
 *     embedded inside .md files. A markdown-only regex silently misses ~40 links.
 *  2. Source scans are not authoritative — some pages are generated at build time
 *     (sync-harbor-blogs.mjs) and never exist in git. Validate dist/ instead.
 *
 * Usage:
 *   node scripts/check-tool-links.mjs            # dist/ (authoritative) — run after build
 *   node scripts/check-tool-links.mjs --src      # also scan src/ as an early warning
 * Exit code 1 if any dead link is found.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'fs'
import { join, relative } from 'path'

const ROOT = join(import.meta.dirname, '..')
const DIST = join(ROOT, 'dist')
const SRC  = join(ROOT, 'src', 'pages')

const MD_LINK   = /\]\(\/tools\/([^)#?]+)\)/g
const HTML_LINK = /href="\/tools\/([^"#?]+)"/g

function walk(dir, test, out = []) {
  if (!existsSync(dir)) return out
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, test, out)
    else if (test(e)) out.push(p)
  }
  return out
}

function extract(text) {
  const slugs = []
  for (const re of [MD_LINK, HTML_LINK]) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(text))) slugs.push(m[1].replace(/\/$/, ''))
  }
  return slugs
}

let dead = 0, checked = 0

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first. dist is the authoritative check.')
  process.exit(1)
}
const built = new Set(
  readdirSync(join(DIST, 'tools')).filter(d => statSync(join(DIST, 'tools', d)).isDirectory())
)
console.log(`tool pages built: ${built.size}`)

for (const file of walk(DIST, f => f === 'index.html')) {
  for (const slug of new Set(extract(readFileSync(file, 'utf8')))) {
    checked++
    if (!built.has(slug)) {
      dead++
      console.error(`DEAD  /tools/${slug}  in  ${relative(DIST, file)}`)
    }
  }
}
console.log(`dist: ${checked} distinct tool links checked, ${dead} dead`)

if (process.argv.includes('--src')) {
  let sdead = 0, schecked = 0
  for (const file of walk(SRC, f => f.endsWith('.md') || f.endsWith('.astro'))) {
    for (const slug of new Set(extract(readFileSync(file, 'utf8')))) {
      schecked++
      if (!built.has(slug)) { sdead++; console.error(`DEAD(src) /tools/${slug}  in  ${relative(ROOT, file)}`) }
    }
  }
  console.log(`src:  ${schecked} distinct tool links checked, ${sdead} dead`)
  dead += sdead
}

console.log(dead === 0 ? 'PASS — no dead /tools/ links' : `FAIL — ${dead} dead link(s)`)
process.exit(dead === 0 ? 0 : 1)
