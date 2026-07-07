#!/usr/bin/env node

/**
 * Design System Linter for AI Tools HQ
 * =====================================
 * Layer 3 of the 5-layer enforcement model (docs → skill → LINT → pre-commit → CI).
 *
 * Checks .astro files in src/ for design system violations:
 *   - no-hardcoded-hex:  Ban raw hex colors outside :root definitions
 *   - no-hardcoded-rgba: Ban raw rgba/rgb/hsl outside :root definitions
 *   - no-hardcoded-font: Ban hardcoded font-family (use var(--font-*))
 *   - no-generic-easing: Ban CSS generic easings (use var(--ease-*))
 *
 * Usage:
 *   node scripts/lint-design-system.mjs              # All src/ .astro files
 *   node scripts/lint-design-system.mjs --staged      # Staged .astro files only
 *
 * Exception marker: Add  /* ds-exception: <reason> *\/  on the line to suppress.
 *
 * Config constants are at the top of this file for easy tuning.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative, dirname } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// --- Paths ---

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = join(__dirname, '..');
const SRC_DIR = join(SITE_ROOT, 'src');
const GIT_ROOT = join(SITE_ROOT, '..'); // toolscout-business/

// --- Config ---

const EXCEPTION_MARKER = 'ds-exception';

/** Files where :root token definitions live — exempt from hardcoded-color checks inside :root */
const TOKEN_DEFINITION_FILES = new Set(['Layout.astro']);

/** Hex values allowed everywhere (CSS gradient masks) */
const ALLOWED_HEX = new Set(['#fff', '#000']);

// --- Pre-compiled Regexes (avoid allocation in hot loop) ---

const RE_HEX_JS = /['"]#[0-9a-fA-F]{3,8}['"]/;
const RE_HEX_CSS = /:\s*[^;]*?(#[0-9a-fA-F]{3,8})/;
const RE_COLOR_FN = /:\s*[^;]*?(rgba?\(|hsla?\()/;
const RE_FONT = /font-family:\s*(?!\s*var\()/;
const RE_TRANSITION = /transition:/;
const RE_GENERIC_EASING = /\b(ease|ease-in|ease-out|ease-in-out|linear)\b/;
const RE_HTML_TAG = /^\s*</;
const RE_STYLE_OPEN = /<style(\s|>|$)/;
const RE_STYLE_CLOSE = /<\/style>/;
const RE_SCRIPT_OPEN = /<script(\s|>|$)/;
const RE_SCRIPT_CLOSE = /<\/script>/;
const RE_BLOCK_COMMENT_OPEN = /\/\*/;
const RE_BLOCK_COMMENT_CLOSE = /\*\//;

// --- Rules ---

const rules = [
  {
    id: 'no-hardcoded-hex',
    description: 'Use CSS variables instead of hardcoded hex colors',
    context: 'style',
    allowInScript: true, // also checks JS color maps in <script>
    test(line, ctx) {
      if (ctx.isTokenDefinition) return null;

      // JS object literals (e.g. categoryColors map) — warn, not error
      if (ctx.inScript && RE_HEX_JS.test(line) && !ctx.hasException) {
        return { message: 'Hardcoded hex in JS — migrate to CSS variable', severity: 'warning' };
      }

      // CSS property values
      const match = line.match(RE_HEX_CSS);
      if (match && !ALLOWED_HEX.has(match[1].toLowerCase()) && !ctx.hasException) {
        return { message: `Hardcoded hex "${match[1]}" — use a CSS variable (see design-system/TOKENS.md)`, severity: 'error' };
      }
      return null;
    }
  },
  {
    id: 'no-hardcoded-rgba',
    description: 'Use CSS variables instead of inline rgba/rgb/hsl',
    context: 'style',
    test(line, ctx) {
      if (ctx.isTokenDefinition) return null;

      if (RE_COLOR_FN.test(line) && !ctx.hasException) {
        return { message: 'Inline color function — use a CSS variable', severity: 'error' };
      }
      return null;
    }
  },
  {
    id: 'no-hardcoded-font',
    description: 'Use var(--font-display) or var(--font-body) for font-family',
    context: 'style',
    test(line, ctx) {
      if (RE_FONT.test(line) && !ctx.hasException) {
        return { message: 'Hardcoded font-family — use var(--font-display) or var(--font-body)', severity: 'error' };
      }
      return null;
    }
  },
  {
    id: 'no-generic-easing',
    description: 'Use var(--ease-out-expo) or var(--ease-out-back) for transitions',
    context: 'style',
    test(line, ctx) {
      if (RE_TRANSITION.test(line) && RE_GENERIC_EASING.test(line) && !line.includes('var(--ease') && !ctx.hasException) {
        return { message: 'Generic CSS easing — use var(--ease-out-expo) or var(--ease-out-back)', severity: 'warning' };
      }
      return null;
    }
  }
];

// --- Helpers ---

/**
 * Build a Set of 1-indexed line numbers inside :root { ... } blocks.
 * Used to exempt token definitions from hardcoded-color rules.
 */
function findRootLines(lines) {
  const rootLines = new Set();
  let inRoot = false;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(':root')) {
      inRoot = true;
      braceDepth = 0;
    }
    if (inRoot) {
      for (const ch of lines[i]) {
        if (ch === '{') braceDepth++;
        else if (ch === '}') braceDepth--;
      }
      rootLines.add(i + 1);
      if (braceDepth <= 0 && rootLines.size > 1) inRoot = false;
    }
  }
  return rootLines;
}

// --- File Discovery ---

function getAstroFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory() && entry !== 'node_modules' && entry !== 'dist') {
      for (const f of getAstroFiles(fullPath)) files.push(f);
    } else if (extname(entry) === '.astro') {
      files.push(fullPath);
    }
  }
  return files;
}

function getStagedAstroFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      cwd: GIT_ROOT,
      encoding: 'utf-8'
    });
    return output
      .trim()
      .split('\n')
      .filter(f => f.endsWith('.astro') && f.startsWith('site/src/'))
      .map(f => join(GIT_ROOT, f));
  } catch {
    return [];
  }
}

// --- Linter ---

function lint(files) {
  let errorCount = 0;
  let warningCount = 0;
  const results = [];

  for (const filePath of files) {
    const fileName = filePath.split(/[/\\]/).pop();
    const isTokenFile = TOKEN_DEFINITION_FILES.has(fileName);
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // Pre-compute :root line ranges once per file (only for token files)
    const rootLines = isTokenFile ? findRootLines(lines) : new Set();

    let inStyleBlock = false;
    let inScriptBlock = false;
    let inBlockComment = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      // Track block context (style/script open/close)
      if (RE_STYLE_OPEN.test(line)) inStyleBlock = true;
      if (RE_STYLE_CLOSE.test(line)) { inStyleBlock = false; continue; }
      if (RE_SCRIPT_OPEN.test(line)) inScriptBlock = true;
      if (RE_SCRIPT_CLOSE.test(line)) { inScriptBlock = false; continue; }

      // Only lint inside <style> and <script> blocks
      if (!inStyleBlock && !inScriptBlock) continue;

      // Track multi-line block comments (/* ... */)
      if (inBlockComment) {
        if (RE_BLOCK_COMMENT_CLOSE.test(line)) inBlockComment = false;
        continue; // skip entire line while inside block comment
      }
      if (RE_BLOCK_COMMENT_OPEN.test(line) && !RE_BLOCK_COMMENT_CLOSE.test(line)) {
        inBlockComment = true;
        continue; // skip lines that open a block comment without closing it
      }

      // Skip single-line comments and HTML tags (computed once, shared via ctx)
      const trimmed = line.trim();
      const isComment = trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*');
      const isHtmlTag = RE_HTML_TAG.test(line) && !line.includes('style=');

      if (isComment || isHtmlTag) continue;

      // Build context object once per line
      const ctx = {
        inStyle: inStyleBlock,
        inScript: inScriptBlock,
        isTokenDefinition: isTokenFile && rootLines.has(lineNum),
        hasException: line.includes(EXCEPTION_MARKER)
      };

      for (const rule of rules) {
        // Skip style-only rules when in script blocks (unless rule opts in)
        if (rule.context === 'style' && !inStyleBlock && !rule.allowInScript) continue;

        const result = rule.test(line, ctx);
        if (result) {
          results.push({
            file: relative(SITE_ROOT, filePath),
            line: lineNum,
            rule: rule.id,
            ...result
          });
          if (result.severity === 'error') errorCount++;
          else warningCount++;
        }
      }
    }
  }

  // --- Output ---

  if (results.length === 0) {
    console.log('\x1b[32m\u2713 Design system: all checks passed\x1b[0m');
    return 0;
  }

  console.log('\n\x1b[1mDesign System Lint Results\x1b[0m\n');

  for (const r of results) {
    const icon = r.severity === 'error' ? '\x1b[31m\u2717\x1b[0m' : '\x1b[33m\u26a0\x1b[0m';
    console.log(`  ${icon} ${r.file}:${r.line}`);
    console.log(`    ${r.message} (${r.rule})\n`);
  }

  console.log(`  \x1b[31m${errorCount} error(s)\x1b[0m, \x1b[33m${warningCount} warning(s)\x1b[0m\n`);
  return errorCount > 0 ? 1 : 0;
}

// --- Entry Point ---

const isStaged = process.argv.includes('--staged');
const files = isStaged ? getStagedAstroFiles() : getAstroFiles(SRC_DIR);

if (files.length === 0) {
  console.log(isStaged ? 'No staged .astro files to check.' : 'No .astro files found.');
  process.exit(0);
}

console.log(`Checking ${files.length} file(s)${isStaged ? ' (staged)' : ''}...\n`);
process.exit(lint(files));
