# Obsidian Vault Setup for oktolog

## How it works

```
Write in Obsidian → push to GitHub main → auto-deploys to oktolog.github.io
```

GitHub Actions builds Hugo + Pagefind search automatically on every push.

---

## One-time setup

### 1. Clone the repo

```bash
git clone https://github.com/oktolog/oktolog.github.io.git
cd oktolog.github.io
```

### 2. Open as Obsidian vault

- Open Obsidian → **Open folder as vault**
- Select the cloned `oktolog.github.io` folder

### 3. Install Obsidian Git plugin (one-click push)

- Settings → Community plugins → Browse → search **Obsidian Git** → Install → Enable
- Recommended settings:
  - Auto pull interval: `10` (minutes)
  - Auto push interval: `0` (manual, so you control when it goes live)
  - Commit message: `content: {{date}} {{hostname}}`

### 4. Set up templates

- Settings → Core plugins → **Templates** → Enable
- Templates folder: `_obsidian/templates`
- Date format: `YYYY-MM-DDTHH:mm:ss+00:00`

---

## Writing content

| What you're writing | Save file to | Template to use |
|---|---|---|
| Blog post | `content/posts/my-title.md` | `post` |
| Note / digital garden | `content/notes/my-title.md` | `note` |
| Research / deep-dive | `content/research/my-title.md` | `research` |
| CTF writeup | `content/ctf/ctfname-challenge.md` | `ctf-writeup` |
| Project README | `content/projects/my-project.md` | `project` |

### Using a template

1. Create a new note in the right folder
2. Open command palette (`Ctrl+P`) → **Templates: Insert template**
3. Pick the template — frontmatter fills in automatically
4. Fill in `title`, `description`, `tags`, then write

---

## Publishing

### Publish now (Obsidian Git)

Command palette → **Obsidian Git: Commit all changes and push**

Or use the hotkey you assign in the plugin settings.

### Publish a draft

Change `draft: true` → `draft: false` in the frontmatter, then push.

### See it live

`https://oktolog.github.io` — GitHub Actions usually deploys within ~1 minute of push.

---

## Frontmatter reference

### All content types
| Field | Type | Notes |
|---|---|---|
| `title` | string | Shown as page title |
| `date` | ISO date | Publication date |
| `lastmod` | ISO date | Last edited — update when you revise |
| `draft` | bool | `true` = hidden on live site, visible in dev |
| `description` | string | Shown in lists and meta tags |
| `tags` | list | e.g. `[linux, networking]` |
| `toc` | bool | Show table of contents |
| `math` | bool | Enable KaTeX rendering |
| `mermaid` | bool | Enable Mermaid diagrams |
| `series` | string | Groups posts — adds prev/next nav |

### Notes only
| Field | Values |
|---|---|
| `status` | `seedling` · `growing` · `evergreen` |

### CTF writeups only
| Field | Values |
|---|---|
| `ctf` | Event name e.g. `"picoCTF 2025"` |
| `difficulty` | `easy` · `medium` · `hard` |
| `category` | `web` · `pwn` · `crypto` · `forensics` · `rev` · `misc` |

---

## Tips

- Set Obsidian's **new file location** to the relevant `content/` subfolder so files land in the right place automatically
- Use `draft: true` while writing — flip to `false` only when ready to publish
- Images go in `static/images/` — reference them as `/images/my-image.png` in markdown
- The `_obsidian/` folder is ignored by Hugo — safe to store anything here
