---
layout: ../../layouts/BlogPost.astro
title: "20 Best MCP Servers 2026 — The Definitive Setup Guide for Claude & Cursor"
description: "Model Context Protocol servers let your AI tools read databases, control browsers, search the web, and access any API. We tested 20+ MCP servers and ranked the most useful ones."
pubDate: 2026-06-28
author: "AI Tools HQ"
tags: ["mcp", "model context protocol", "claude", "cursor", "ai tools", "developer tools", "2026"]
faqs:
  - question: "What is an MCP server?"
    answer: "An MCP (Model Context Protocol) server is a lightweight service that gives AI assistants like Claude, Cursor, and Windsurf access to external tools and data sources — databases, APIs, file systems, web browsers, and more. Instead of copy-pasting data into chat windows, your AI can directly query your database, browse websites, or manage your GitHub repos."
  - question: "Are MCP servers free?"
    answer: "Most MCP servers are open-source and free to self-host. The underlying API services they connect to (GitHub, Supabase, Stripe, etc.) have their own pricing. Anthropic maintains a growing set of official reference servers on GitHub at no cost."
  - question: "Which AI tools support MCP?"
    answer: "Claude (via Claude.ai and Claude Desktop), Cursor, Windsurf, and any tool built with Anthropic's SDK supports MCP. The protocol is open and growing — expect broader adoption across AI coding tools throughout 2026."
  - question: "Do I need coding experience to use MCP servers?"
    answer: "The official MCP servers come with clear setup guides. Basic familiarity with config files (JSON) is helpful but not required. Many servers are being packaged into Claude Desktop with one-click install. If you can edit a JSON file, you can set up most MCP servers."
  - question: "Can I build my own MCP server?"
    answer: "Yes — Anthropic's MCP SDK (available in TypeScript and Python) makes it straightforward to wrap any API as an MCP server. The pattern is: define tools, implement handlers, expose them. A basic custom server can be built in an afternoon."
---

If you're using Claude, Cursor, or any modern AI coding assistant and haven't set up MCP servers yet, you're leaving most of the capability on the table.

Model Context Protocol (MCP) is Anthropic's open standard that lets AI tools connect to external data sources — your database, your GitHub repos, your browser, your Slack — without you having to paste anything into a chat window. Set it up once, and your AI assistant can actually *do things* instead of just telling you what to do.

We tested 20+ MCP servers across databases, developer tools, productivity apps, and automation platforms. Here's what's worth installing.

<div style="background:linear-gradient(135deg,#0f172a,#1a1f3a);border:1px solid #3b4a6b;border-radius:12px;padding:1.5rem 2rem;margin:1.5rem 0;">
  <p style="color:#94a3b8;font-size:0.85rem;margin:0 0 0.75rem;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;">Quick Setup</p>
  <p style="color:#e2e8f0;margin:0 0 0.5rem;">MCP servers are configured in <code style="background:rgba(255,255,255,0.1);padding:0.1rem 0.4rem;border-radius:4px;">~/.claude/claude_desktop_config.json</code> (Claude Desktop) or your Cursor/Windsurf settings. Each server entry looks like:</p>
  <pre style="background:rgba(0,0,0,0.3);padding:1rem;border-radius:8px;margin-top:0.75rem;font-size:0.85rem;color:#a5b4fc;overflow-x:auto;">{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token" }
    }
  }
}</pre>
</div>

---

## Quick Comparison: Top 20 MCP Servers

| Server | Category | Install | Best For |
|--------|----------|---------|----------|
| filesystem | Core | Official | Read/write local files |
| github | Dev Tools | Official | Repos, PRs, issues |
| postgres | Database | Official | Query Postgres databases |
| brave-search | Web | Official | Real-time web search |
| puppeteer | Browser | Official | Automation & scraping |
| memory | AI | Official | Persistent knowledge graph |
| sequential-thinking | AI | Official | Complex reasoning tasks |
| fetch | Web | Official | HTTP requests & APIs |
| sqlite | Database | Official | Local SQLite databases |
| slack | Communication | Official | Read/send Slack messages |
| google-maps | Location | Official | Maps, places, directions |
| supabase | Database | Community | Supabase full-stack access |
| linear | Dev Tools | Community | Issues, projects, sprints |
| notion | Productivity | Community | Pages, databases, search |
| stripe | Finance | Community | Payments, customers, invoices |
| n8n | Automation | Community | Execute n8n workflows |
| cloudflare | Infrastructure | Official | Workers, KV, R2, DNS |
| playwright | Browser | Community | Browser automation (typed) |
| vercel | Dev Tools | Community | Deploy, logs, env vars |
| jira | Dev Tools | Community | Tickets, sprints, boards |

---

## The Must-Install MCP Servers

### 1. filesystem — Read & Write Local Files

**Source:** Official Anthropic | **Install:** `npx @modelcontextprotocol/server-filesystem`

The foundation. filesystem gives Claude or Cursor the ability to read any file on your machine, create new files, move them, and search through directories. Without this, your AI only sees what you paste.

**Setup:** Specify which directories to expose (sandboxes access):
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects", "/Users/you/Documents"]
  }
}
```

**Best for:** Any workflow where you want your AI to read existing code, config files, or docs without manual copy-paste.

---

### 2. github — Full GitHub Access

**Source:** Official Anthropic | **Install:** `npx @modelcontextprotocol/server-github`

This is the one that changes workflows. With the GitHub MCP server, you can ask Claude to "create a PR for this change," "comment on issue #142," "check what CI is failing," or "list all open issues assigned to me" — without touching the GitHub UI.

**What it can do:**
- Create, read, update repositories
- File and comment on issues and PRs
- Search code across your org
- Read and create GitHub Actions workflows
- Manage branches, commits, releases

**Setup:** Requires a GitHub Personal Access Token with the repo scope.

**Best for:** Developers who want AI that can actually close the loop on GitHub tasks, not just suggest code.

---

### 3. postgres — Direct Database Queries

**Source:** Official Anthropic | **Install:** `npx @modelcontextprotocol/server-postgres`

Describe what you want in plain English, Claude writes and runs the SQL. The postgres server can read your schema, execute queries, and return results — turning natural language into data analysis.

**Setup:** Pass your database connection string:
```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
  }
}
```

**Best for:** Data analysis, debugging production issues, writing complex queries with schema context.

**Note:** For production databases, use a read-only connection string unless you explicitly want write access.

---

### 4. brave-search — Real-Time Web Search

**Source:** Official Anthropic | **Install:** `npx @modelcontextprotocol/server-brave-search`

Gives your AI access to current web search results — not training data from a year ago, but what's actually on the web right now. Also includes news search.

**Setup:** Requires a free Brave Search API key.

**Best for:** Research tasks, checking if docs/APIs have changed, finding current pricing or product info.

---

### 5. puppeteer — Browser Automation

**Source:** Official Anthropic | **Install:** `npx @modelcontextprotocol/server-puppeteer`

Launches a real headless browser controlled by your AI. It can navigate to any URL, click buttons, fill forms, take screenshots, and extract content from JavaScript-heavy pages.

**What it can do:**
- Screenshot any webpage
- Click through multi-step web flows
- Extract data from SPAs (JavaScript-rendered content)
- Fill and submit forms
- Test your own web app

**Best for:** Web scraping, automated testing, research that requires navigating pages, verifying UI changes.

---

### 6. memory — Persistent Knowledge Graph

**Source:** Official Anthropic | **Install:** `npx @modelcontextprotocol/server-memory`

MCP sessions don't persist by default — each new conversation starts blank. The memory server maintains a knowledge graph that persists between sessions. Your AI can store facts, relationships, and context that carry forward.

**Use cases:**
- Remember your project architecture decisions
- Track people, orgs, and relationships in research
- Store preferences and context across sessions
- Build up a knowledge base that grows with use

**Best for:** Power users who want Claude to actually remember things.

---

### 7. sequential-thinking — Better Reasoning

**Source:** Official Anthropic | **Install:** `npx @modelcontextprotocol/server-sequentialthinking`

Forces Claude to reason through problems step-by-step using a structured thought process, with the ability to revise earlier steps. For complex problems, this consistently outperforms default reasoning.

**Best for:** Architecture decisions, debugging complex issues, any task where reasoning quality matters more than speed.

---

### 8. fetch — HTTP Requests

**Source:** Official Anthropic | **Install:** `npx @modelcontextprotocol/server-fetch`

Makes HTTP requests from within your AI session. Read any URL, call any API, check API documentation, verify endpoints. Also intelligently converts HTML to markdown so Claude can read web pages cleanly.

**Best for:** Reading API docs in-context, testing your own APIs, fetching any web content.

---

### 9. supabase — Full Supabase Stack

**Source:** Community | **Install:** `npm install @supabase/mcp-server-supabase`

Goes beyond raw SQL — gives Claude access to Supabase's full management API: database tables, storage buckets, edge functions, auth users, and project settings.

**Best for:** Supabase users who want AI that can read schema, write migrations, manage storage, and query data without leaving the AI interface.

---

### 10. linear — Project Management

**Source:** Community | **Install:** Via Linear's official integration

Query and create Linear issues, update statuses, manage cycles, and search your project backlog from Claude. Great for dev workflows where you want AI to create tickets for bugs it finds.

**Best for:** Engineering teams using Linear who want their AI coding assistant to also manage the work queue.

---

## Category Deep Dives

### Databases

| Server | Best For |
|--------|----------|
| postgres | PostgreSQL — most mature, official |
| sqlite | Local SQLite databases |
| supabase | Supabase full-stack projects |
| mysql | MySQL/MariaDB databases |

### Developer Tools

| Server | Best For |
|--------|----------|
| github | GitHub repos, PRs, CI |
| linear | Linear project management |
| jira | Atlassian Jira |
| vercel | Vercel deployments & logs |
| cloudflare | Cloudflare Workers, KV, R2 |

### Productivity

| Server | Best For |
|--------|----------|
| notion | Notion pages & databases |
| google-drive | Google Drive files |
| slack | Slack channels & messages |
| google-calendar | Calendar scheduling |

---

## How to Set Up MCP in Claude Desktop

**Step 1:** Find your config file:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Step 2:** Add servers to `mcpServers`:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here" }
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": { "BRAVE_API_KEY": "your_brave_api_key" }
    }
  }
}
```

**Step 3:** Restart Claude Desktop. You'll see the MCP tools available in new conversations.

---

## Recommended Starter Stack

**For developers:**
- `filesystem` + `github` + `brave-search` + `postgres` (or `sqlite`)

**For power users:**
- `filesystem` + `brave-search` + `memory` + `fetch` + `sequential-thinking`

**For Supabase projects:**
- `supabase` + `github` + `brave-search` + `sequential-thinking`

**For research:**
- `brave-search` + `fetch` + `memory` + `sequential-thinking`

---

## What's Coming in MCP

The MCP ecosystem is growing fast. Expect to see:
- **One-click installs** — more servers packaged for frictionless setup
- **Hosted MCP** — server-side MCP with OAuth, no local install required
- **More official servers** — Anthropic is adding new reference implementations monthly
- **Marketplace** — centralized discovery is coming; directories like [mcp-servers.directory](https://mcp-servers.directory) are emerging

---

*Have an MCP server that should be on this list? [Suggest it here](/contact)*

*Browse all AI developer tools → [AI Coding Tools](/category/coding)*
