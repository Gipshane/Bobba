# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**Lykke** — a single-file PWA ADHD assistant for Camilla Kuhn. The companion character is **Bobba** (a large pink/magenta pulsing ball). Language is Norwegian throughout. Tone is always warm and non-punishing.

## Running the app

```bash
python -m http.server 3000
# then open http://localhost:3000/hjem-appen.html
```

Alternatively: `npx serve -p 3000 .`

**Preview cache busting:** append `?v=N` (increment N) to the URL when testing changes. The browser and service worker cache aggressively.

**Service worker:** after any change to `hjem-appen.html`, bump the cache version in `sw.js`:
```js
const CACHE = 'lykke-v9'; // increment this
```

## File structure

| File | Purpose |
|------|---------|
| `hjem-appen.html` | Entire app — ~8100 lines of CSS + HTML + JS in one file |
| `sw.js` | Service worker: caches hjem-appen.html, handles push notifications |
| `index.html` | Instant redirect to hjem-appen.html — do not edit |
| `manifest.json` | PWA manifest |

There is no build step, no npm, no bundler. Everything is vanilla HTML/CSS/JS.

## Architecture

### Screen system
The app uses a single-page layout with `position: absolute` screens inside a `390px max-width` body. Navigation between screens:
```js
showScreen('home')   // home, brett, fokus, meg
```
Each screen is a `.screen` div that fades in/out via `.active` class. Overlays (Bobbas rom, romkart, help, surprise engine) sit above the screens as `position: fixed` with high z-index.

### State / persistence
All state goes through the `store` wrapper (safe localStorage with in-memory fallback):
```js
store.get('key')       // returns string | null
store.set('key', val)  // val must be string
store.del('key')
```
Complex objects are JSON-stringified. Key localStorage entries:

| Key | Content |
|-----|---------|
| `currentTheme`, `fixedTheme`, `themeDate` | Daily theme rotation |
| `filledCount`, `bonusOrbs`, `bonusMode`, `orbTotal` | Brett (orb board) state |
| `helperFeed` | JSON: `{green, gold, blue, rainbow}` feed counts (0-2) |
| `weekHistory` | JSON array of last 4 weeks' completion % |
| `weekStart` | Monday date string for current week |
| `trophyData` | JSON: unlocked trophies, streak, stats |
| `capturedTasks` | JSON array of captured task objects |
| `lifetimeOrbs` | Cumulative orb count for Bobbas rom currency |
| `roomItems` | JSON array of purchased item IDs |
| `rooms` | JSON array of romkart room objects |
| `customClusters` | JSON array of custom task clusters (slenger) |
| `rutiner`, `storeGreier` | Routines and big tasks from Meg screen |
| `focusSoundType` | Selected ambient sound ID |
| `userName` | User's display name |

### JS sections (in order in the file)
Sections are delimited by `// ══...══` banners. Line numbers are approximate:

| Section | ~Line | Responsible for |
|---------|-------|-----------------|
| THEMES | 3350 | `THEMES` const, `applyTheme()`, daily rotation |
| ORB BOARD | 3561 | `initBoard()`, `addOrb()`, orbit animation configs |
| CELEBRATION | 3921 | Full-board celebration screen and animations |
| NAVIGATION | 4074 | `showScreen()`, `showBrettTab()`, nav button logic |
| TIMER | 4465 | Pomodoro timer (setup/running/done states) |
| BOBBA MESSAGES | 4865 | `bobbaTap()` tap responses |
| DEMO | 4933 | Auto-demo sequence for first-time users |
| SOUND | 5113 | Web Audio ambient/focus sounds |
| FEEDING MECHANIC | 5226 | `feedHelper()`, 3-feeds→1-orb logic |
| BOARD STATE PERSISTENCE | 5539 | `saveBoardState()`, `loadBoardState()` |
| BONUS MODE | 5591 | Stars after full board |
| WEEKLY RESET | 5675 | `checkWeeklyReset()`, `doWeeklyReset()`, summary modal |
| BOBBAS ROM | 5777 | Room overlay, shop, `ROOM_ITEMS`, lifetime orbs |
| ADAPTIVE DIFFICULTY | 5910 | Pusterom/normal/full-giv switching |
| BOBBA FORESLÅR | 5965 | `TASKS_DB`, `TASK_STEP_RULES`, `_generateSuggestion()`, energy/time filter |
| FOKUS MED BOBBA | 6432 | 3-state focus screen (setup → running → done) |
| SURPRISE ENGINE | ~6811 | `_SURPRISE_POOL`, `_fireSurprise()`, 8 surprise functions |
| TROFÉSIDE | ~6903 | `TROPHY_DEFS`, unlock logic, trophy UI |
| ROMKART | 7395 | Room map with status scores, `loadRooms()`, `getRoomScore()` |
| REDIGER KJERNEOPPGAVER | 7966 | Core tasks editor for each room |
| INIT | 8087 | `(function init())` — bootstraps everything on page load |

### Key constants to know

- **`ROOM_ITEMS`** — array of shop items for Bobbas rom. Each: `{id, emoji, name, price, zone:'floor'|'wall'}`. Add `stackable: true` for items that can be bought multiple times.
- **`TASKS_DB`** — 48 household tasks, each `{text, helper, time, energy}`. Energy: `'lav'|'middels'|'høy'`. Time: 5/15/30/60.
- **`TASK_STEP_RULES`** — regex rules mapping task text to micro-step arrays for the "Bryt ned" breakdown feature.
- **`_SURPRISE_POOL`** — array of surprise name strings. Add new surprises here + add a `case` in `_runSurprise()` + write `_surprise_NAME()` function.
- **`TROPHY_DEFS`** — array of trophy definitions. Each: `{id, cat, emoji, name, desc, css?}`.
- **`THEMES`** — object of theme keys → CSS variable overrides. Rotation order in `ROTATION_ORDER`.
- **`ORB_TOTAL`** — read from `store.get('orbTotal')`, default 12. Controls board size (6/12/18).

### CSS architecture
All CSS is in one `<style>` block at the top of `hjem-appen.html`. CSS variables (defined on `:root`, overridden per theme):
- `--bg`, `--surface`, `--surface-hi` — backgrounds
- `--accent`, `--accent-light` — primary colour
- `--glow-a`, `--glow-b` — RGB values used in `rgba(var(--glow-a), 0.x)` for glows
- `--gold`, `--cream`, `--cream-dim` — neutral/text colours
- `--bobba-hi`, `--bobba-mid`, `--bobba-lo` — Bobba ball gradient stops

Body is capped at `max-width: 390px` and centered. The app is portrait-only mobile.

## Design rules — never break

- **Always Norwegian** — all UI text, comments where user-facing
- **Warm and non-punishing** — no guilt, always "det er OK"
- **ADHD-first** — one step at a time, clear labels, dopamine rewards on completion
- **Bobba is a ball** — large pink/magenta sphere, not a horse (Lunda is a separate character)
- **Lunda** (white fjord horse from Camilla's children's book) — planned for Bobbas rom, PNG files drawn by Camilla
- **Never remove** the surprise engine, advent calendar, or existing trophy definitions

## Adding new features — patterns to follow

**New surprise:** add name to `_SURPRISE_POOL`, add `case` in `_runSurprise()`, write `function _surprise_NAME()`. Use `document.getElementById('surpriseLayer')` for particle effects, or create a new fixed overlay.

**New shop item:** add to `ROOM_ITEMS` array with unique `id`. Use `stackable: true` if it can be bought multiple times. PNG support: set `img: 'filename.png'` and handle in `_renderRoom()`.

**New trophy:** add to `TROPHY_DEFS` and add unlock condition in `checkAndUnlockTrophies()`.

**New screen:** add a `.screen` div with `id="screen-NAME"`, add a nav button calling `showScreen('NAME')`, add any init logic inside `showScreen()`.
