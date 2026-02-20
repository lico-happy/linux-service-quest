# Linux Service Quest 🎮

An interactive, game-style website to learn **Linux service management** across major distros — with IT/English term explanations built in.

**Live site:** https://lico-happy.github.io/linux-service-quest/

---

## What you'll learn

- Managing services with `systemctl` (start, stop, restart, enable, disable, mask, reload...)
- Reading logs with `journalctl`
- Differences between **Ubuntu/Debian**, **Fedora/RHEL**, **Arch**, and **openSUSE**
- Real IT English vocabulary in context

---

## How to use the website

1. **Open the site** → https://lico-happy.github.io/linux-service-quest/
2. **Click "▶ Start Playing"** on the welcome screen
3. Each **mission** has:
   - A scenario (what's broken / what needs doing)
   - An IT/English term to learn
   - A command hint showing the exact command
   - A **distro comparison** — same task, all 4 distros
   - A quiz question to check your understanding
4. Answer correctly → earn **XP**, move to the next mission
5. Wrong answer → added to your **Review list** (retry later)

### Navigation buttons (top bar)
| Button | What it does |
|--------|-------------|
| `📖 Glossary` | All IT/English terms you've unlocked so far |
| `🔄 Review (N)` | Retry questions you got wrong |
| `🎭 Scenarios` | Multi-step real-world troubleshooting incidents |
| `Reset` | Clear all progress and start over |

### XP & Levels
- Correct answer (first try) → **+100 XP**
- Correct answer (after a mistake) → **+50 XP**
- Every **300 XP** = Level up 🎉

### Progress saving
Your progress is saved automatically in your browser (`localStorage`). No account needed.

---

## Content

- **16 missions** covering core systemctl commands
- **4 scenarios** (multi-step incident walkthroughs): nginx outage, rogue SSH daemon, database disk-full recovery, broken systemd timer
- **4 distros** compared per mission and in scenarios: Ubuntu/Debian, Fedora/RHEL, Arch, openSUSE

---

## Local development

```bash
git clone https://github.com/lico-happy/linux-service-quest.git
cd linux-service-quest
npm install
npm run dev
```

Deploys automatically to GitHub Pages on every push to `main`.

---

Made with ❤️ by [Happy](https://github.com/lico-happy)
