**Button** — the brand's call to action; use for the single most important action in a view (primary) and quieter alternatives (secondary / ghost).

```jsx
<Button variant="primary" size="lg" href="#contato">Agendar Consulta</Button>
<Button variant="secondary" tone="dark">Conheça meu trabalho</Button>
<Button variant="primary" icon={<MessageCircle size={16} />}>Agendar via WhatsApp</Button>
```

- **variant**: `primary` (terracotta gradient, lifts + shadow on hover), `secondary` (outline — set `tone="dark"` on hero/dark sections so the border reads as warm cream, `tone="light"` on sand backgrounds), `ghost` (text-only).
- **size**: `sm` · `md` · `lg`. Labels are always UPPERCASE with 0.14em tracking — pass normal-case text, the component transforms it.
- Renders an `<a>` when `href` is set, otherwise a `<button>` (`type="submit"` for forms).
