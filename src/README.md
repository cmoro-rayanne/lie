# Ilê — Design System

A warm, minimal-luxury design system for **Ilê · Psicologia e Consciência**, the clinical-psychology practice of **Eliana Lino** (São Paulo, Brazil). The language is calm, embodied and Brazilian-Portuguese; the surface is earthy and unhurried — thin serif headlines, generous whitespace, soft terracotta on sand.

> **Sources.** Built from the practice's own React + Vite + TypeScript landing page in the GitHub repo **`cmoro-rayanne/lie`** (folder `landing-page-psicologa/`). Aesthetic references in the same repo: `elicyon_com_des/` (layout) and `luxury_desert_r/` (luxury-minimal mood). The brand logo (`assets/logo-ile-full.png`) was supplied by the client. Explore the repo for deeper context: https://github.com/cmoro-rayanne/lie

---

## Content fundamentals

How Ilê writes — match this voice in any copy you produce.

- **Language:** Brazilian Portuguese, always. (`Agendar Consulta`, `Áreas de Atuação`, `Vamos conversar?`)
- **Person:** First person from the psychologist (`meu trabalho`, `acompanho pessoas`, `meu compromisso`) addressing the reader as **você**. Warm, never clinical-cold.
- **Tone:** Welcoming, grounded, gently elevated. Words recur around presence, listening, integration, consciousness: *escuta, acolhimento, presença, autoconhecimento, integração, totalidade, ritmo, caminhar*. Therapy is framed as a shared journey ("caminhar ao seu lado"), not a service transaction.
- **Casing:** Sentence case for headlines; UPPERCASE only for eyebrows, nav links and button labels (always letter-spaced). Titles often carry one **italic terracotta** emphasis word ("Uma escuta para a *sua totalidade*").
- **Punctuation:** Curly quotes “ ” for pull-quotes; middot · separators in eyebrows and credentials (`Psicologia Clínica · Autoconhecimento · Consciência`).
- **Emoji:** None. The brand's "icons" are abstract serif glyphs (◎ ◈ ◇), never emoji. (One leaf 🌿 appears only as a legacy favicon in the source — avoid it.)
- **Vibe in one line:** *a quiet, sunlit consulting room — paz e acolhimento.*

---

## Visual foundations

- **Color.** Four warm families: **Sand** (neutral surfaces/text ground), **Terracotta** (primary accent — CTAs, links, emphasis, focus), **Olive** (secondary/grounding — tags, the conversion banner), **Warm** browns (ink + dark sections). No cool hues, no blue-purple gradients, no harsh contrast. Default page is `sand-50`; alternating sections use `sand-100` / `terra-100`; emphasis blocks go dark.
- **Type.** Two families only: **Cormorant Garamond** (thin 300–500 serif) for all display/headings/quotes — often italic for emphasis — and **Inter** (300–600 sans) for reading copy and UI. Body copy is light-weight (300) with relaxed 1.7–1.9 line-height.
- **Spacing.** 4px base scale. The signature is *respiro* — breathing room: fluid section padding `clamp(80px,10vw,140px)`, a 1240px container, 32px gutters.
- **Backgrounds.** Light sections are flat warm neutrals. Dark sections (hero, quote blocks, footer) use warm-brown diagonal gradients layered with soft radial glows, a faint SVG grain, and thin concentric rings echoing the logo. No photos as full-bleed backgrounds; imagery sits in rounded `4/5` frames, warm-graded (`brightness .95 / saturate .9`).
- **Corners & cards.** Radii: buttons/inputs `sm` (4px), stat rows `md` (8px), cards `lg` (16px), tags `pill`. Cards are sand with a 1px hairline border that **warms to terracotta + lifts -4px with a soft warm shadow** on hover, revealing a thin terracotta→olive accent bar along the top.
- **Borders & dividers.** Hairline (1px) `sand-300`. The recurring flourish is a thin terracotta **gradient rule** that grows from the left under headings; centered variants fade at both ends.
- **Shadows.** Soft and warm-tinted (`rgba(160,120,80,…)`), never black. `shadow-soft` at rest, `shadow-card` on hover, `shadow-cta` under primary buttons.
- **Motion.** Calm and premium. Content fades-and-rises (`fadeInUp`, 0.9s) on scroll via the signature easing `cubic-bezier(0.16,1,0.3,1)`; lines grow from the left; the hero lettering reveals with a stroked-italic second line. Hover = gentle lift (-2 to -6px) + shadow + slight brighten. Press/active is not emphasized. Only subtle ambient `float`/`pulse` loop on accents. `prefers-reduced-motion` is respected.
- **Transparency & blur.** The fixed navbar is transparent over the hero, then turns to `rgba(250,248,244,0.92)` + `blur(20px)` once scrolled.

---

## Iconography

- **Primary set:** [lucide](https://lucide.dev) line icons (the source uses `lucide-react`) — 2px stroke, round caps/joins, 24px grid. In this system they're recreated as inline SVG in `ui_kits/landing/icons.jsx` (ChevronDown/Left/Right, Menu, X, Quote, Mail, MapPin, Phone, MessageCircle, Heart, Instagram, Linkedin). For new work, pull the matching glyph from lucide.
- **Decorative glyphs:** abstract serif geometric marks **◎ ◈ ◇ ◉ ◐ ◑** in `terra-400` stand in for spot icons on cards/specialties — quiet and symbolic, never literal.
- **Brand mark:** three nested rings (terracotta/olive/sand-gold) — see `Logo`. Reused, faded and gold, as hero/quote-section decoration.
- **Emoji:** not used.

---

## Index

**Foundations** — root `styles.css` (the single entry consumers link) → `tokens/`:
`fonts.css` · `colors.css` · `typography.css` · `spacing.css` (radii, shadows, motion) · `animation.css` (keyframes) · `base.css` (resets + helpers).

**Components** (`components/<group>/` — React primitives, `window.ElianaLinoDesignSystem_6994f2`):
- `actions/` — **Button**, **IconButton**
- `brand/` — **Logo**
- `content/` — **Card**, **StatCard**, **Tag**, **Avatar**
- `forms/` — **Input** (text / textarea / select)
- `typography/` — **SectionHeading**, **Divider**

**UI kit** (`ui_kits/landing/`) — full interactive recreation of the Ilê single-page site (Navbar, Hero, About, Atuação, Quote, Testimonials, Contact, Footer, WhatsApp FAB). Entry: `index.html`.

**Specimen cards** — every `*.card.html` in `guidelines/` and each component folder is tagged `@dsCard` and renders in the Design System tab (groups: Colors, Type, Spacing, Brand, Components, Landing).

**Assets** — `assets/logo-ile-full.png` (original logo lockup).

**Other** — `SKILL.md` (Agent-Skills compatible).
