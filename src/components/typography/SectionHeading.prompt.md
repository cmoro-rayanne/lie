**SectionHeading** — the header pattern atop every section. Eyebrow + thin serif headline + optional lead.

```jsx
<SectionHeading eyebrow="Sobre mim">
  Uma escuta para a <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>sua totalidade</em>
</SectionHeading>

<SectionHeading eyebrow="Abordagem Terapêutica" align="center"
  lead="Mente, corpo, emoções e espiritualidade caminham juntos.">
  O Caminho de <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Integração</em>
</SectionHeading>
```

- Emphasis is the signature move: wrap one word in `<em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>`.
- **tone="dark"** on dark sections (gold eyebrow, cream title). **align="center"** centers the block and its lead.
