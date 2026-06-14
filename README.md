# redDoz

> **Find posts/comments of someone on reddit if the profile is disabled or hidden**


🌐 **Live:** [prajwal-56.github.io/redDoz](https://prajwal-56.github.io/redDoz)

---

## Why?

coz why not ?

---

## Features

- 🔎 **Username search** — enter any Reddit username _(for instance `u/spez` or just `spez`)_
- 🗂️ **Filter by type** — All, Posts, or Comments
- 🕐 **Time filters** — Any time, Last 24h, Week, Month, or Year
- 📌 **Subreddit scope** — narrow results to a specific subreddit
- 📋 **Copy shareable link** — share a direct redDoz URL for any user
- 🕙 **Recent searches** — last 5 searches stored locally in your browser
- 🔗 **Deep linking** — open `prajwal-56.github.io/redDoz/username` to auto-search on load

---

## How It Works

redDoz simply constructs a [Google dork](https://www.recordedfuture.com/threat-intelligence-101/threat-analysis-techniques/google-dorks) query with the username and opens it in a new tab:

```
site:reddit.com "username"
site:reddit.com/r/privacy "username"
site:reddit.com "submitted by username"   ← Posts mode
```

No backend, no tracking. Everything runs in the browser.

---

## Running Locally

Just open `index.html` in your browser — no build step needed.

```bash
git clone https://github.com/prajwal-56/redDoz.git
cd redDoz
open index.html   # or: xdg-open index.html on Linux
```

---

## Disclaimer

redDoz doesn't access Reddit's API or store any data. All searches are redirected to Google Search. Use responsibly.