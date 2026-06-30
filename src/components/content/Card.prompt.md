**Card** — the brand's signature surface for services, specialties and feature content. Compose an icon, serif title, light body copy and `Tag`s inside.

```jsx
<Card>
  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-terra-400)', marginBottom: 20 }}>◎</div>
  <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '1.35rem', color: 'var(--text-strong)' }}>Ansiedade & Estresse</h3>
  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, color: 'var(--text-muted)' }}>Ferramentas para regular emoções…</p>
</Card>
```

- `accentBar` (default true): thin terracotta→olive bar fades in along the top on hover.
- `interactive` (default true): hover lifts the card, warms the border and casts a soft shadow. Set `false` for static panels.
- Decorative card icons in this brand are serif geometric glyphs: ◎ ◈ ◇ ◉ ◐ ◑ in `--color-terra-400`.
