/**
 * WebMCP integration for ai-tools-hq.com
 * ---------------------------------------------------------------------------
 * Exposes the tools directory to an AI agent running in the visitor's browser,
 * via the W3C WebMCP draft (document.modelContext).
 *
 * CONTRACT (developer.chrome.com/docs/ai/webmcp/imperative-api):
 *   document.modelContext.registerTool({ name, description, inputSchema, execute })
 *   execute(args, { signal }) MUST resolve to a STRING - not an MCP
 *   {content:[{type:'text'}]} envelope, which is the server-side MCP shape.
 *
 * DATA SOURCE: /tools-index.json, baked at build time by
 * scripts/build-tools-index.mjs. The site is Astro SSG - Supabase is only
 * reached during the build - so there is no runtime endpoint to call, and
 * shipping a Supabase key to the browser would be worse than a static file.
 * Regenerate the index after publishing tools.
 *
 * DESIGN RULE - read before adding a tool:
 * This site earns on affiliate links, and those live on /tools/<slug>. Every
 * tool here returns the ai-tools-hq URL and NEVER the vendor's own website -
 * handing an agent the destination URL routes the visitor around the only page
 * that pays. `website` and `affiliate_link` are deliberately absent from the
 * index for the same reason. Results are also capped: the directory's value is
 * the directory.
 */
(function () {
  'use strict';

  // --- origin trial ----------------------------------------------------------
  // The registered token is THIRD-PARTY (isThirdParty:true). Chrome requires
  // third-party tokens to be delivered from an external JavaScript file via a
  // <script> element - "Third-party tokens don't work in a meta tag, inline
  // script or HTTP header" - so injecting it here is the only valid path.
  // https://developer.chrome.com/docs/web-platform/third-party-origin-trials
  //
  // Injected BEFORE the API is probed: the feature only appears once a valid
  // token is registered, so probing first would always miss.
  // Expires 2026-11-17 (trial runs Chrome 149-156).
  var OT_TOKEN = 'AxtdqJPiIj2tM8T9YwaXTfz3FoSQlWMYzlgMriiLT3bv1WPM3WY73NX8YbQAtCojKQwt9gs0/Xwa7tA4c9xCTAwAAAB2eyJvcmlnaW4iOiJodHRwczovL2FpLXRvb2xzLWhxLmNvbTo0NDMiLCJmZWF0dXJlIjoiV2ViTUNQIiwiZXhwaXJ5IjoxNzk0ODczNjAwLCJpc1N1YmRvbWFpbiI6dHJ1ZSwiaXNUaGlyZFBhcnR5Ijp0cnVlfQ==';

  try {
    var otMeta = document.createElement('meta');
    otMeta.httpEquiv = 'origin-trial';
    otMeta.content = OT_TOKEN;
    (document.head || document.documentElement).appendChild(otMeta);
  } catch (e) {
    console.warn('[webmcp] origin-trial token injection failed:', e);
  }

  var mc = (typeof document !== 'undefined' && document.modelContext) ||
           (typeof navigator !== 'undefined' && navigator.modelContext) ||
           null;

  var hasApi = !!(mc && typeof mc.registerTool === 'function');

  var MAX_RESULTS = 12;
  var SITE = 'https://www.ai-tools-hq.com';

  var indexPromise = null;
  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch('/tools-index.json')
        .then(function (r) {
          if (!r.ok) throw new Error('index unavailable (HTTP ' + r.status + ')');
          return r.json();
        })
        .catch(function (e) { indexPromise = null; throw e; });
    }
    return indexPromise;
  }

  function clampLimit(n) {
    var v = parseInt(n, 10);
    if (isNaN(v) || v < 1) return 5;
    return Math.min(v, MAX_RESULTS);
  }

  /** Always the ai-tools-hq page - never the vendor's site. See DESIGN RULE. */
  function slim(t) {
    return {
      name: t.name,
      category: t.category,
      pricing: t.pricing || undefined,
      summary: t.summary,
      url: SITE + '/tools/' + t.slug
    };
  }

  function scoreMatch(t, q) {
    var name = String(t.name || '').toLowerCase();
    var cat = String(t.category || '').toLowerCase();
    var sum = String(t.summary || '').toLowerCase();
    if (name === q) return 100;
    if (name.indexOf(q) === 0) return 80;
    if (name.indexOf(q) !== -1) return 60;
    if (cat.indexOf(q) !== -1) return 40;
    if (sum.indexOf(q) !== -1) return 20;
    return 0;
  }

  // --- tools -----------------------------------------------------------------

  async function searchTools(args) {
    args = args || {};
    var q = String(args.query || '').trim().toLowerCase();
    var category = args.category ? String(args.category).trim().toLowerCase() : '';
    if (!q && !category) return 'Provide a query, a category, or both.';
    if (q.length > 120) return 'Query too long (max 120 characters).';

    var limit = clampLimit(args.limit);
    var data;
    try { data = await loadIndex(); } catch (e) { return 'Tool index unavailable: ' + e.message; }

    var pool = data.tools;
    if (category) {
      pool = pool.filter(function (t) { return String(t.category || '').toLowerCase() === category; });
      if (!pool.length) {
        return 'No category "' + args.category + '". Known categories: ' + data.categories.join(', ');
      }
    }

    var hits = pool;
    if (q) {
      hits = pool
        .map(function (t) { return { t: t, s: scoreMatch(t, q) }; })
        .filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .map(function (x) { return x.t; });
    }

    if (!hits.length) {
      return 'No AI tools on ai-tools-hq.com match "' + (args.query || args.category) +
             '". Try a broader term or call list_ai_tool_categories.';
    }

    return JSON.stringify({
      query: args.query || undefined,
      category: args.category || undefined,
      returned: Math.min(hits.length, limit),
      total_matched: hits.length,
      capped_at: MAX_RESULTS,
      tools: hits.slice(0, limit).map(slim)
    }, null, 2);
  }

  async function getTool(args) {
    args = args || {};
    var key = String(args.name_or_slug || '').trim().toLowerCase();
    if (!key) return 'name_or_slug is required.';

    var data;
    try { data = await loadIndex(); } catch (e) { return 'Tool index unavailable: ' + e.message; }

    var hit = data.tools.filter(function (t) {
      return String(t.slug).toLowerCase() === key || String(t.name).toLowerCase() === key;
    })[0];

    if (!hit) {
      return 'No tool named "' + args.name_or_slug + '" on ai-tools-hq.com. ' +
             'Call search_ai_tools first to find the right name.';
    }
    return JSON.stringify(slim(hit), null, 2);
  }

  async function listCategories() {
    var data;
    try { data = await loadIndex(); } catch (e) { return 'Tool index unavailable: ' + e.message; }
    var counts = {};
    data.tools.forEach(function (t) {
      if (t.category) counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return JSON.stringify({
      total_tools: data.count,
      categories: data.categories.map(function (c) { return { category: c, tools: counts[c] || 0 }; })
    }, null, 2);
  }

  var PUBLIC_TOOLS = [
    {
      name: 'search_ai_tools',
      description:
        'Search the AI Tools HQ directory of reviewed AI tools by keyword and/or category. ' +
        'Use when the visitor asks which AI tool does something, or wants options in a category. ' +
        'Returns at most ' + MAX_RESULTS + ' tools with a summary, pricing, and the review page URL.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Keyword, e.g. "video editing" or a tool name. Max 120 characters.' },
          category: { type: 'string', description: 'Restrict to one category. See list_ai_tool_categories.' },
          limit: { type: 'number', description: 'Max results, 1-' + MAX_RESULTS + '. Default 5.' }
        }
      },
      execute: searchTools
    },
    {
      name: 'get_ai_tool',
      description:
        'Get the AI Tools HQ entry for one specific tool by name or slug - summary, category, ' +
        'pricing, and the review page URL. Use after search_ai_tools has identified a name.',
      inputSchema: {
        type: 'object',
        properties: {
          name_or_slug: { type: 'string', description: 'Exact tool name or URL slug, e.g. "ElevenLabs" or "elevenlabs".' }
        },
        required: ['name_or_slug']
      },
      execute: getTool
    },
    {
      name: 'list_ai_tool_categories',
      description:
        'List the AI tool categories on ai-tools-hq.com and how many reviewed tools are in each. ' +
        'Call this before passing a category to search_ai_tools.',
      inputSchema: { type: 'object', properties: {} },
      execute: listCategories
    }
  ];

  var registered = [];

  async function register(tool) {
    try {
      await mc.registerTool(tool);
      registered.push(tool.name);
    } catch (e) {
      console.warn('[webmcp] failed to register ' + tool.name + ':', e);
    }
  }

  /**
   * Always exposed so "is the trial live?" is answerable from the console.
   * call() returns exactly what execute() returns - no unwrapping, or this
   * harness would diverge from what the browser actually receives.
   */
  window.__webmcp = {
    apiAvailable: hasApi,
    apiSurface: hasApi ? (document.modelContext ? 'document.modelContext' : 'navigator.modelContext') : null,
    registered: registered,
    tools: PUBLIC_TOOLS.map(function (t) { return t.name; }),
    call: async function (name, args) {
      var tool = PUBLIC_TOOLS.filter(function (t) { return t.name === name; })[0];
      if (!tool) throw new Error('No such tool: ' + name);
      return tool.execute(args || {});
    }
  };

  (async function boot() {
    if (!hasApi) {
      console.info('[webmcp] document.modelContext unavailable - site works normally. ' +
                   'Tools still callable for tests via window.__webmcp.call().');
      return;
    }
    for (var i = 0; i < PUBLIC_TOOLS.length; i++) await register(PUBLIC_TOOLS[i]);
    console.info('[webmcp] registered ' + registered.length + ' tools: ' + registered.join(', '));
  })();
})();
