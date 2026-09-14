#!/usr/bin/env node
/**
 * sync-harbor-blogs.mjs
 * Scans public/blog/*.html for Harbor SEO posts,
 * converts to Astro-compatible markdown in src/pages/blog/.
 * Runs automatically before `astro build`.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, basename } from 'path'
import * as cheerio from 'cheerio'

const BLOG_DIR = join(import.meta.dirname, '..', 'public', 'blog')
const OUTPUT_DIR = join(import.meta.dirname, '..', 'src', 'pages', 'blog')
const IGNORE = new Set(['index.html', 'rss.xml'])

function extractPost(filePath) {
  const html = readFileSync(filePath, 'utf-8')
  const $ = cheerio.load(html)
  const slug = basename(filePath, '.html')
  const title = $('article header h1').text().trim()
  const description = $('.blog-article-intro').text().trim()
  const dateRaw = $('article time').attr('datetime') || ''
  const date = dateRaw ? dateRaw.split('T')[0] : ''
  const author = $('article address').text().trim() || 'AI Tools HQ'
  const keywords = $('meta[name="keywords"]').attr('content') || ''
  const tags = keywords ? keywords.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5) : ['AI Tools']
  const introHtml = $('.blog-article-intro').html() || ''
  const bodyHtml = $('.blog-article-body').html() || ''
  const content = (introHtml ? introHtml + '\n\n' : '') + bodyHtml
  if (!title || !content) { console.warn(`⚠️  Skipping ${slug}`); return null }
  return { slug, title, description, date, author, tags, content, canonical: canonicalElsewhere(html, slug) }
}

// A Harbor page that canonicalises to a DIFFERENT article (a duplicate topic) must
// hand that on to its /blog/<slug>/ twin, or the twin declares itself canonical and
// ends up in the sitemap. Returns the target's /blog/<other>/ URL, or ''.
function canonicalElsewhere(html, slug) {
  const m = html.match(/<link[^>]+rel="canonical"[^>]*href="([^"]+)"/i)
  const target = m && m[1].match(/\/blog\/([\w-]+?)(?:\.html|\/)?$/)
  return target && target[1] !== slug ? `https://www.ai-tools-hq.com/blog/${target[1]}/` : ''
}

function toMarkdownFile(post) {
  const tagsJson = JSON.stringify(post.tags)
  // Escape double quotes in title/description for frontmatter
  const safeTitle = post.title.replace(/"/g, '\\"')
  const safeDesc = post.description.replace(/"/g, '\\"').slice(0, 300)
  return `---
layout: ../../layouts/BlogPost.astro
title: "${safeTitle}"
description: "${safeDesc}"
pubDate: ${post.date}
author: "${post.author}"
tags: ${tagsJson}
harbor: true${post.canonical ? `\ncanonical: "${post.canonical}"` : ''}
---

${post.content}
`
}

function main() {
  if (!existsSync(BLOG_DIR)) { console.log('No public/blog/ — skipping'); return }
  const files = readdirSync(BLOG_DIR).filter(f => f.endsWith('.html') && !IGNORE.has(f))
  let created = 0, skipped = 0
  for (const file of files) {
    const post = extractPost(join(BLOG_DIR, file))
    if (!post) continue
    const mdPath = join(OUTPUT_DIR, `${post.slug}.md`)
    if (existsSync(mdPath)) {
      console.log(`⏭️  ${post.slug} (already exists)`)
      skipped++
      continue
    }
    writeFileSync(mdPath, toMarkdownFile(post))
    console.log(`✅ ${post.slug} (${post.date})`)
    created++
  }
  console.log(`\n📝 Created ${created}, skipped ${skipped} existing`)
}

main()
