# DRO Campaign Website — Handoff

**Read this first** when resuming work on cherylfordro.com after a session
reset. Last updated 2026-07-31.

## What this is

The public campaign website for **Cheryl Parker's Del Rey Oaks, CA city
council campaign** — a single self-contained `index.html` (vanilla HTML/CSS/
JS, no build step, no framework) at the repo root. One-page scrolling design:
hero → intro → "Why Cheryl for City Council?" → Meet Cheryl → On The Issues
(8-card checkerboard grid) → Contact/volunteer form.

## Where things live

| Path | What |
|---|---|
| `C:\DRO\Website\` | The git working copy — **this is the repo root**, tracks `origin` at `https://github.com/jparkerpe-afk/DRO.git`, branch `main` |
| `C:\DRO\Website\index.html` | The entire site — all CSS and JS live inline in `<style>`/`<script>`. **It loads no external CSS or JS whatsoever.** |
| `C:\DRO\Website\assets\img\` | Web-optimized (resized, EXIF-stripped) images. Only 6 of the 17 are actually referenced — see **Images** below |
| `C:\DRO\Website\assets\css\style.css`, `assets\js\main.js` | **Dead files.** Left over from before the CSS/JS were inlined; `index.html` does not load them. Editing these will not change the site |
| `C:\DRO\Website\_config.yml` | Jekyll config whose only job is keeping `HANDOFF.md`/`README.md` off the public site — see **Internal docs** below. **Don't delete it** |
| `C:\DRO\Website\favicon-32.png` / `favicon-180.png` / `favicon-512.png` | Tab icon / apple-touch-icon / master — solid white background |
| `C:\DRO\Website\fav_header.png` | Same tree mark but **transparent background** — used in the nav bar next to the brand text, not the solid-white favicon files |
| `C:\DRO\Logos\` | Source/original brand asset files (not all committed to the repo — pull from here if you need to regenerate a crop) |
| `C:\DRO\Pictures\`, `C:\DRO\*.jpg/.JPG` | Raw/original campaign photos, largely unsorted — **also the archive** holding the 17 unused originals removed from the repo on 2026-07-31. User has flagged wanting a cleaner `Images` folder eventually — not done yet, low priority |
| `C:\Stocks\.claude\launch.json` | Local preview server config (see below) — lives under `C:\Stocks` (the fixed Claude Code working-directory root for this environment) even though the actual site moved to `C:\DRO\Website` |

**Note:** the site used to live at `C:\Stocks\DRO` — it was moved to
`C:\DRO\Website` on 2026-07-23 (plain filesystem move, `.git` intact, nothing
about the GitHub repo changed). If you see any stale references to
`C:\Stocks\DRO` anywhere, they're leftover and wrong.

## Hosting & deployment

- **GitHub Pages**, deploying from `main` branch root, on the public repo
  `jparkerpe-afk/DRO`.
- **Custom domain**: `cherylfordro.com` (apex is primary; `www` redirects to
  it). DNS is at **Namecheap**: 4 A records on `@` → GitHub Pages IPs
  (185.199.108/109/110/111.153), one CNAME on `www` → `jparkerpe-afk.github.io.`
  HTTPS is enforced (free GitHub-issued cert).
- **The old host was Google Sites** — fully migrated away. The original
  Google Sites page's custom-domain mapping was removed and the page itself
  unpublished (confirmed via incognito check) — verified as a genuine dead
  end, not just DNS pointing elsewhere.
- Standard deploy loop: `git add`, commit, `git push origin main`.

### ⚠️ GitHub Pages deployment sometimes gets stuck

This has happened multiple times this project: a push succeeds and the
commit is genuinely on GitHub (confirms via
`https://raw.githubusercontent.com/jparkerpe-afk/DRO/main/index.html`, which
bypasses Pages' build step entirely and always reflects the true repo
state) — but the live site at `cherylfordro.com` keeps serving an old
cached/built version, sometimes for many minutes, occasionally overnight.

**Always verify a push actually went live** — don't just trust that pushing
= live:
1. `curl -s https://raw.githubusercontent.com/jparkerpe-afk/DRO/main/index.html | grep "<something new>"` — confirms the repo has it.
2. `curl -s https://cherylfordro.com/ | grep "<something new>"` — confirms it's actually served.
3. If (1) succeeds but (2) doesn't, it's a stuck Pages build, not a bad push. Fix: push a trivial no-op commit (e.g. append a blank line) to nudge the deploy pipeline — this has reliably fixed it every time so far.
4. Poll (e.g. with the `Monitor` tool, 15-20s interval) until (2) matches, rather than assuming it worked.

## Analytics & SEO

- **Google Analytics (GA4)**, tag `G-85B5EETW4G`, installed via `gtag.js`
  directly in `<head>`.
- Meta keywords, Open Graph tags, and JSON-LD `Person` structured data are
  all in `<head>` — og:image points at `assets/img/closeup.jpg`.
- Canonical URL is `https://cherylfordro.com/` (bare domain, no `www`) —
  matches the actual GitHub Pages redirect direction. There was a prior bug
  where `og:url`/JSON-LD pointed at the `www` version while the site actually
  redirects `www` → bare domain; fixed 2026-07-2x, don't reintroduce it.
- No `robots.txt` or `sitemap.xml` exists yet — flagged as a possible future
  addition, not done.
- Referrer spam in Analytics (e.g. hits from `compfight.com`, `sysoon.com`)
  is normal/expected — bots hitting the public GA tag ID directly, not real
  traffic, not a security issue. No action needed beyond optionally adding a
  GA4 hostname data filter if it becomes annoying.

## Brand identity (keep any related app/material consistent with this)

- **Colors**: `--navy:#203864` (primary), `--navy-dk:#16264a` (darkest,
  footer), `--rust:#8B371A` (accent), `--rust-lt:#A6431F` (rust hover),
  `--cream:#F7ECE8` (soft callout background). No other colors — this is the
  entire palette.
- **Fonts**: Montserrat (600/700/800 — headings, nav, buttons, always bold+)
  / Open Sans (400/600 — body). Loaded from Google Fonts.
- **Logo**: navy live-oak tree silhouette, single color. `fav_header.png`
  (transparent) for on-page use, `favicon-*.png` (solid white bg) for
  browser tab/bookmarks only — don't mix these up, a solid-white logo placed
  on a non-pure-white background will show a visible seam.
- **Nav brand lockup** (logo + "CHERYL PARKER · DEL REY OAKS"): responsive —
  single line with a fluid `clamp()` font-size on desktop (>700px), stacked
  two-line ("CHERYL PARKER" / "DEL REY OAKS", centered) on mobile. This took
  real trial and error — see the CSS gotchas below before touching it again.

### CSS gotchas already debugged — don't re-break these

- **`letter-spacing` adds invisible trailing space after the last character
  in a text run**, in a way that skews visual centering even when the CSS
  box model looks symmetric. This caused two separate real bugs (the nav dot
  separator's spacing, and mobile line-centering). Fix pattern: explicitly
  reset `letter-spacing: normal` on any inline text element you need to
  precisely center or space against a neighbor — don't rely on inherited
  letter-spacing being harmless.
- **An empty `::before{content:""}` pseudo-element still honors its `margin`
  even with no visible content.** When conditionally hiding a pseudo-element
  at a breakpoint (e.g. the dot separator on mobile), you must also reset
  its margin to `0` in that same rule, or it leaves invisible phantom
  spacing that throws off centering/alignment. Cost real debugging time
  twice before being caught.
- Fixed-nav-bar height must be measured (not guessed) whenever nav content
  changes, and every dependent offset (`.hero`'s `margin-top`, the mobile
  dropdown's `top` position) must be updated to match — verified via actual
  `getBoundingClientRect()` measurements at multiple widths (mobile, ~700px
  boundary, ~800px boundary, wide desktop), not just eyeballing one size.

## Content decisions worth knowing before editing further

- **Credential wording standardized** to "licensed civil engineer"
  everywhere (was "licensed Professional Engineer" / "licensed Professional
  Civil Engineer" — user found it redundant/awkward). One intentional
  exception left as-is: the generic phrase "grounded in professional
  experience" in the Why Cheryl section — that's a different word usage, not
  the credential title, user explicitly said leave it.
- **Airport Noise section is intentionally general.** Earlier drafts carried
  specific factual and regulatory assertions; those were removed because
  they hadn't been independently verified, and the user wants outside input
  before the campaign asserts specifics there. **Don't add dates, study
  references, or regulatory citations to this section without checking with
  the user first** — this is a live editorial constraint, not a one-time
  cleanup.
- Contact info shown is intentionally limited: campaign email
  (servingdro@gmail.com), phone, city+ZIP only (no street address — privacy),
  and a Facebook page link. Don't add a home address.
- No sensitive PII or GPS/EXIF metadata in any published image. **Re-verified
  2026-07-31** by reading EXIF off the files as actually served: zero GPS
  tags, no camera make/model, no capture timestamps — on both the
  `assets/img/` set and the full-size root originals. New images added later
  should still be run through EXIF stripping (see git history around
  2026-07-1x for the PowerShell pattern used) before committing, to keep
  that guarantee true.

## Internal docs are excluded from the published site

GitHub Pages serves the entire repo root, so `HANDOFF.md` and `README.md`
were being served from **`cherylfordro.com/HANDOFF.md`** — the campaign's own
domain, not just github.com. `_config.yml` exists solely to stop that:

```yaml
exclude:
  - HANDOFF.md
  - README.md
```

**Don't delete `_config.yml` on the reasoning that this site "has no build
step."** Pages still runs Jekyll, and removing it silently republishes both
docs to the public domain. Verify with:

    curl -s -o /dev/null -w "%{http_code}" https://cherylfordro.com/HANDOFF.md   # expect 404

Note this only affects the *domain*. The repo is public, so both files stay
readable on github.com, and the complete file list is enumerable by anyone
via `https://api.github.com/repos/jparkerpe-afk/DRO/git/trees/main?recursive=1`.
Git history is likewise permanent and public — deleting a file unpublishes
it, it does not erase it. Assume anything ever committed is public forever.

## Images

**Only 9 image files are used by the live site:**

- `assets/img/` — `hero.jpg`, `hero-mobile.jpg`, `flags.jpg`, `frogpond.jpg`,
  `juncture.jpg`, `welcome.jpg`, and `closeup.jpg`
- root — `fav_header.png`, `favicon-32.png`, `favicon-180.png`

Two easy-to-misread cases: **`closeup.jpg` is the `og:image`** — it never
renders on the page, so it looks unused but breaks social-share previews if
removed; and **`hero-mobile.jpg` is swapped in via `background-image` inside
the `@media(max-width:800px)` block** (it's the same 3:2 crop as `hero.jpg`
at 900×600 instead of 1920×1280, ~77% smaller — keep both in sync if the
hero photo is ever replaced).

On 2026-07-31, 17 unused originals (~29 MB) were removed from the repo root
and archived to `C:\DRO\Pictures\`. Deliberately **kept** despite being
unreferenced: `cheryl-hero-banner.png`, `del-rey-oaks-view.jpg` and
`CherylFull.png` (may be linked externally from Facebook/email — deleting
would 404 those), `favicon-512.png` (master for regenerating the favicon
set), `favicon.svg`, and the 11 unused-but-optimized files in `assets/img/`.

Before deleting any image, check references against `index.html` **and**
remember `assets/css/style.css` / `assets/js/main.js` are dead — an image
referenced only from those is not actually in use.

## Local preview

`C:\Stocks\.claude\launch.json` has a `site-preview` config: a PowerShell
static file server (`scratchpad_serve.ps1`, path varies by session — check
the launch.json for the current pointer) on port 8322, serving
`C:\DRO\Website`. Use the Claude Browser tool's `preview_start` with
`name: "site-preview"` to spin it up rather than opening `index.html` via
`file://` directly — file:// loads render as a stale one-time snapshot in
this environment's preview pane and won't reflect live edits, which has
caused confusion before.

## Outstanding / not done

- Loose photo files under `C:\DRO\` and `C:\DRO\Pictures\` are unsorted; user
  wants an `Images` folder eventually, not urgent.
- No `robots.txt` / `sitemap.xml`.
- Airport Noise section is intentionally left general pending someone else's
  review (see above) — revisit once that review happens.
- `assets/css/style.css` and `assets/js/main.js` are dead and could be
  deleted; left in place for now as a reference copy of the pre-inline CSS.
- The contact form posts to a public Formspree endpoint (`xeevonay`) that
  anyone can POST to directly. Not a breach risk — it's how Formspree works —
  but if it ever gets spammed, enable reCAPTCHA / allowed-domains in the
  Formspree dashboard.
