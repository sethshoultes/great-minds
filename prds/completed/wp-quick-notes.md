# PRD: WP Quick Notes

## Overview
A WordPress plugin that adds a persistent sticky note widget to the admin dashboard. Admins leave notes for each other — handoff notes, reminders, warnings, "don't touch this until Friday" messages. Think Post-it notes on a shared monitor.

## Problem
WordPress teams communicate outside WordPress — Slack, email, text. Critical context ("the homepage is broken, waiting on DNS") gets lost. New team members log in with zero context. Handoff between shifts/freelancers is verbal.

## Solution
A draggable, color-coded sticky note widget in wp-admin:
- **Create notes** with a title, body, color, and priority
- **Pin to dashboard** — always visible on wp-admin home
- **@mention users** — notify specific admins
- **Archive** — don't delete, archive. Searchable history.
- **Roles** — admins create/edit all, editors see all, authors see notes addressed to them

## Technical Requirements
- PHP 8.0+, WordPress 6.0+
- Custom post type (`wp_quick_note`) for storage
- REST API for CRUD
- Vanilla JS + CSS (no framework)
- Drag-and-drop positioning (save per-user via user meta)
- 5 colors: yellow, blue, green, pink, orange
- Max 200 characters per note (forces brevity)

## MVP Scope
1. Note CRUD (create, read, update, archive)
2. Dashboard widget with draggable notes
3. Color picker (5 colors)
4. @mention with email notification
5. Role-based visibility
6. Archive with search

## Success Metrics
- < 50ms render time for dashboard widget
- Works with Flavor themes (Twenty Twenty-Four/Five)
- Passes WordPress Plugin Check
- < 10KB JS, < 5KB CSS
