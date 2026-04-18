# Compass — 2-Minute Demo Script

---

NARRATOR:
It's Tuesday morning. You've got five products in production.

[SCREEN: Five browser tabs — Pinned, Dash, LocalGenius, Shipyard, Great Minds]

NARRATOR:
And you have no idea which one is dying.

[SCREEN: All tabs fade except one — Pinned. Usage graph trending down]

NARRATOR:
Pinned. You built it six months ago. You've been "fixing onboarding" for three months.

[SCREEN: GitHub commits — "fix onboarding flow," "improve onboarding," "onboarding tweaks"]

NARRATOR:
You don't know if it's working. You're guessing.

[SCREEN: Black screen. Fade in: "Compass — Portfolio Analytics Foundation"]

---

NARRATOR:
This is Compass. It's a truth machine.

[SCREEN: Terminal window. Command runs: `php compass/src/report.php`]

NARRATOR:
Every morning, one text summary. No dashboard, no login, no charts.

[SCREEN: Text output appears line by line]

```
Pinned: 12 DAU (-40%). 7d retention: 8%. Diagnosis: Dead. Decision: Kill or pivot.
Dash: 47 DAU (+12%). 7d retention: 34%. Diagnosis: Healthy growth. Decision: Double down.
LocalGenius: 89 DAU (+5%). 7d retention: 41%. Diagnosis: Stable. Decision: Maintain.
Shipyard: 3 DAU (-75%). 7d retention: 0%. Diagnosis: DOA. Decision: Archive.
Great Minds: 124 DAU (+23%). 7d retention: 58%. Diagnosis: Breakout. Decision: 2x resources.
```

NARRATOR:
Seven seconds. You know which product to kill.

[SCREEN: Close-up on "Pinned: 12 DAU (-40%). 7d retention: 8%. Diagnosis: Dead. Decision: Kill or pivot."]

---

NARRATOR:
Here's what happened behind the scenes.

[SCREEN: Split screen — Pinned app on left, terminal on right]

NARRATOR:
User creates a note in Pinned.

[SCREEN: User types note in Pinned. Right side shows: `POST /compass/src/ingest.php`]

NARRATOR:
Event tracked. No PII. Just outcome: "note_created."

[SCREEN: JSON payload — `{"product": "pinned", "event": "note_created", "user_hash": "a1b2c3...", "timestamp": "..."}`]

NARRATOR:
Goes straight into SQLite. One table. Six columns. $0 infrastructure cost.

[SCREEN: SQLite database visualization — events table with rows populating]

NARRATOR:
Every event from all five products. Same place.

[SCREEN: Events from different products flowing into same database]

---

NARRATOR:
Next morning. Cron job runs.

[SCREEN: Terminal — `daily-summary.sh` executes]

NARRATOR:
Compass calculates three numbers per product.

[SCREEN: Text appears]

```
DAU: Who showed up?
7d retention: Who came back?
Revenue per user: What's it worth?
```

NARRATOR:
No jargon. No corporate-speak. Just: "This is dead. Kill it."

[SCREEN: Return to full report output]

---

NARRATOR:
Week one. SQLite + Pinned integrated. First summary delivered.

[SCREEN: Email inbox — "Compass Daily Summary — April 16, 2026"]

NARRATOR:
Week four. All five products tracked. You make your first data-driven decision.

[SCREEN: Slack message — "Based on Compass: killing Shipyard, doubling down on Great Minds."]

NARRATOR:
Week twelve. Dashboard goes live. One screen. No customization. Brutal clarity.

[SCREEN: Minimal dashboard — 5 products, 3 metrics each, traffic light colors]

---

NARRATOR:
No more guessing which product to fix.

[SCREEN: Pinned tab closes]

NARRATOR:
No more three-month pivots on hunches.

[SCREEN: GitHub — branch deleted: "onboarding-fixes"]

NARRATOR:
Just truth. Every morning.

[SCREEN: Return to Compass terminal output]

```
Great Minds: 124 DAU (+23%). 7d retention: 58%. Diagnosis: Breakout. Decision: 2x resources.
```

NARRATOR:
You know which product is breaking out.

[SCREEN: Fade to black]

NARRATOR:
That's Compass.

[SCREEN: Logo + tagline: "Compass — Know which product to kill before you waste another month."]

---
