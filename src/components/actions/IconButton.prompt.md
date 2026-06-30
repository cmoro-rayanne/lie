**IconButton** — icon-only control for carousel arrows, social links and floating actions; always pass `aria-label`.

```jsx
<IconButton aria-label="Próximo depoimento"><ChevronRight size={18} /></IconButton>
<IconButton variant="soft" aria-label="Instagram" href="https://www.instagram.com/eliana_lino/" target="_blank"><InstagramIcon /></IconButton>
```

- **size**: `sm` (38px, social) · `md` (44px, carousel nav) · `lg` (56px, FAB).
- **variant**: `outline` (round ring, fills terracotta on hover) · `soft` (rounded-square tinted chip).
- **tone**: `dark` on footer/hero, `light` on sand sections.
