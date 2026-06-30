/* @ds-bundle: {"format":3,"namespace":"ElianaLinoDesignSystem_6994f2","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Avatar","sourcePath":"components/content/Avatar.jsx"},{"name":"Card","sourcePath":"components/content/Card.jsx"},{"name":"StatCard","sourcePath":"components/content/StatCard.jsx"},{"name":"Tag","sourcePath":"components/content/Tag.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Divider","sourcePath":"components/typography/Divider.jsx"},{"name":"SectionHeading","sourcePath":"components/typography/SectionHeading.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"1028a6b5844e","components/actions/IconButton.jsx":"052e0708f0c0","components/brand/Logo.jsx":"1dc7d3aa193a","components/content/Avatar.jsx":"bf55be8c3138","components/content/Card.jsx":"fc3eaa9c3951","components/content/StatCard.jsx":"a5833c61e07d","components/content/Tag.jsx":"6aad5702e589","components/forms/Input.jsx":"2629d13db9be","components/typography/Divider.jsx":"bfbeea56436c","components/typography/SectionHeading.jsx":"1a57b0d0f0f1","ui_kits/landing/About.jsx":"6ac04a16381b","ui_kits/landing/Atuacao.jsx":"a7c492b5e0e4","ui_kits/landing/Contact.jsx":"564629305ca7","ui_kits/landing/Footer.jsx":"43f8ee40de70","ui_kits/landing/Hero.jsx":"8d0f20cb1c39","ui_kits/landing/Navbar.jsx":"abb99c255791","ui_kits/landing/Quote.jsx":"ea5354bc65eb","ui_kits/landing/Testimonials.jsx":"b923da991378","ui_kits/landing/helpers.jsx":"781547db0b92","ui_kits/landing/icons.jsx":"1430ef192626"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ElianaLinoDesignSystem_6994f2 = window.ElianaLinoDesignSystem_6994f2 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Button — Eliana Lino's primary call to action.
 * Uppercase, letter-spaced sans label. Soft terracotta gradient (primary),
 * or a quiet outline (secondary/ghost). Lifts gently on hover.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  tone = 'dark',
  icon = null,
  iconPosition = 'left',
  href,
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const sizes = {
    sm: {
      padding: '10px 22px',
      fontSize: '0.72rem'
    },
    md: {
      padding: '13px 30px',
      fontSize: '0.78rem'
    },
    lg: {
      padding: '15px 38px',
      fontSize: '0.8rem'
    }
  };

  // On dark surfaces the outline/ghost use cream; on light, terracotta.
  const cream = 'rgba(235,220,200,0.85)';
  const onDark = tone === 'dark';
  const base = {
    fontFamily: 'var(--font-sans)',
    fontWeight: variant === 'primary' ? 500 : 400,
    letterSpacing: 'var(--tracking-label)',
    textTransform: 'uppercase',
    textDecoration: 'none',
    borderRadius: 'var(--radius-sm)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: fullWidth ? '100%' : 'auto',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.35s var(--ease-out-expo)',
    whiteSpace: 'nowrap',
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: disabled ? 'var(--color-sand-300)' : hover ? 'linear-gradient(135deg, #cd9655, #a57341)' : 'var(--grad-cta)',
      color: disabled ? 'var(--color-warm-600)' : '#f5efe8',
      border: '1px solid rgba(192,160,110,0.3)',
      transform: hover && !disabled ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: hover && !disabled ? 'var(--shadow-cta)' : 'none'
    },
    secondary: {
      background: hover ? onDark ? 'rgba(255,255,255,0.06)' : 'var(--color-terra-400)' : 'transparent',
      color: onDark ? hover ? '#fff' : cream : hover ? '#fff' : 'var(--color-terra-600)',
      border: `1px solid ${onDark ? hover ? 'rgba(235,220,200,0.55)' : 'rgba(235,220,200,0.28)' : 'var(--color-terra-400)'}`,
      transform: 'translateY(0)'
    },
    ghost: {
      background: hover ? 'rgba(154,115,80,0.08)' : 'transparent',
      color: 'var(--color-terra-600)',
      border: '1px solid transparent',
      transform: 'translateY(0)'
    }
  };
  const composed = {
    ...base,
    ...variants[variant],
    ...style
  };
  const inner = /*#__PURE__*/React.createElement(React.Fragment, null, icon && iconPosition === 'left' ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, icon) : null, children, icon && iconPosition === 'right' ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, icon) : null);
  const handlers = {
    onMouseEnter: () => !disabled && setHover(true),
    onMouseLeave: () => setHover(false)
  };
  if (href && !disabled) {
    return /*#__PURE__*/React.createElement("a", _extends({
      href: href,
      style: composed
    }, handlers, rest), inner);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    onClick: onClick,
    disabled: disabled,
    style: composed
  }, handlers, rest), inner);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * IconButton — round, outlined control used for carousel navigation,
 * social links and other icon-only actions. Fills with terracotta on hover.
 */
function IconButton({
  children,
  size = 'md',
  variant = 'outline',
  tone = 'light',
  'aria-label': ariaLabel,
  href,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const dims = {
    sm: 38,
    md: 44,
    lg: 56
  }[size];
  const onDark = tone === 'dark';
  const palettes = {
    outline: {
      idleBg: onDark ? 'rgba(192,169,130,0.06)' : 'transparent',
      idleBorder: onDark ? 'rgba(192,169,130,0.2)' : 'var(--color-terra-300)',
      idleColor: onDark ? 'rgba(192,169,130,0.6)' : 'var(--color-terra-500)',
      hoverBg: onDark ? 'rgba(192,169,130,0.15)' : 'var(--color-terra-400)',
      hoverColor: onDark ? 'rgba(192,169,130,0.9)' : '#fff',
      hoverBorder: onDark ? 'rgba(192,169,130,0.4)' : 'var(--color-terra-400)'
    },
    soft: {
      idleBg: 'var(--color-terra-100)',
      idleBorder: 'var(--color-terra-200)',
      idleColor: 'var(--color-terra-500)',
      hoverBg: 'var(--color-terra-400)',
      hoverColor: '#fff',
      hoverBorder: 'var(--color-terra-400)'
    }
  };
  const p = palettes[variant];
  const composed = {
    width: dims,
    height: dims,
    borderRadius: variant === 'soft' ? 'var(--radius-sm)' : '50%',
    border: `1px solid ${hover ? p.hoverBorder : p.idleBorder}`,
    background: hover ? p.hoverBg : p.idleBg,
    color: hover ? p.hoverColor : p.idleColor,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    flexShrink: 0,
    transition: 'all 0.3s ease',
    ...style
  };
  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  };
  if (href) {
    return /*#__PURE__*/React.createElement("a", _extends({
      href: href,
      "aria-label": ariaLabel,
      style: composed
    }, handlers, rest), children);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": ariaLabel,
    onClick: onClick,
    style: composed
  }, handlers, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The three nested rings — terracotta, olive, sand-gold — that form the Ilê
   mark. Recreated as clean vector so it scales and recolors. Bottoms converge,
   tops fan open: layers of consciousness nesting inward. */
function RingMark({
  size = 88,
  mono = null,
  style = {}
}) {
  const terra = mono || 'var(--color-terra-400)';
  const olive = mono || 'var(--color-olive-500)';
  const gold = mono || 'var(--color-terra-300)';
  const w = size;
  const h = size * (230 / 300);
  return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h,
    viewBox: "0 0 300 230",
    fill: "none",
    style: style,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "150",
    cy: "112",
    r: "100",
    stroke: terra,
    strokeWidth: "2.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "150",
    cy: "146",
    r: "67",
    stroke: olive,
    strokeWidth: "2.6"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "150",
    cy: "162",
    rx: "46",
    ry: "52",
    stroke: gold,
    strokeWidth: "2.6"
  }));
}

/**
 * Logo — the Ilê brand mark. Three nested rings (terracotta/olive/sand) over the
 * "Ilê" serif wordmark and the "Psicologia e Consciência" tagline.
 */
function Logo({
  variant = 'full',
  size = 120,
  tone = 'light',
  mono = null,
  showTagline = true,
  style = {},
  ...rest
}) {
  const onDark = tone === 'dark';
  const ringColor = mono || (onDark ? 'rgba(192,169,130,0.9)' : null);
  const wordColor = onDark ? 'rgba(240,225,205,0.95)' : 'var(--color-terra-500)';
  const tagColor = onDark ? 'var(--color-gold-soft)' : 'var(--color-olive-500)';
  const lineColor = onDark ? 'rgba(192,169,130,0.45)' : 'var(--color-olive-300)';
  const dotColor = onDark ? 'var(--color-gold)' : 'var(--color-terra-400)';
  const Word = ({
    fs
  }) => /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontWeight: 500,
      fontSize: fs,
      lineHeight: 0.9,
      color: wordColor,
      letterSpacing: '0.01em'
    }
  }, "Il\xEA");
  const Tagline = ({
    fs
  }) => /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      fontSize: fs,
      letterSpacing: '0.26em',
      textTransform: 'uppercase',
      color: tagColor,
      whiteSpace: 'nowrap'
    }
  }, "Psicologia e Consci\xEAncia");
  const Divider = ({
    w
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      width: w
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: '1px',
      background: lineColor
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      background: dotColor
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: '1px',
      background: lineColor
    }
  }));

  // Inline — compact horizontal lockup for nav bars
  if (variant === 'inline') {
    return /*#__PURE__*/React.createElement("div", _extends({
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: size * 0.18,
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement(RingMark, {
      size: size,
      mono: ringColor
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1
      }
    }, /*#__PURE__*/React.createElement(Word, {
      fs: `${size * 0.5}px`
    }), showTagline && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
        fontSize: `${size * 0.1}px`,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        color: tagColor,
        marginTop: '4px'
      }
    }, "Psicologia e Consci\xEAncia")));
  }

  // Mark only
  if (variant === 'mark') {
    return /*#__PURE__*/React.createElement("div", _extends({
      style: style
    }, rest), /*#__PURE__*/React.createElement(RingMark, {
      size: size,
      mono: ringColor
    }));
  }

  // Wordmark only (no rings)
  if (variant === 'wordmark') {
    return /*#__PURE__*/React.createElement("div", _extends({
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: size * 0.14,
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement(Word, {
      fs: `${size * 0.62}px`
    }), showTagline && /*#__PURE__*/React.createElement(Tagline, {
      fs: `${size * 0.12}px`
    }), showTagline && /*#__PURE__*/React.createElement(Divider, {
      w: `${size * 1.7}px`
    }));
  }

  // Stacked (rings + wordmark) and Full (+ tagline + divider) — the canonical vertical lockup
  const full = variant !== 'stacked';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(RingMark, {
    size: size,
    mono: ringColor,
    style: {
      marginBottom: -size * 0.06
    }
  }), /*#__PURE__*/React.createElement(Word, {
    fs: `${size * 0.62}px`
  }), full && showTagline && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: size * 0.1,
      marginTop: size * 0.12
    }
  }, /*#__PURE__*/React.createElement(Tagline, {
    fs: `${size * 0.12}px`
  }), /*#__PURE__*/React.createElement(Divider, {
    w: `${size * 1.9}px`
  })));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/content/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Avatar — a terracotta gradient circle holding initials (or an image).
 * Used beside testimonials and contact identities.
 */
function Avatar({
  initials,
  src,
  alt = '',
  size = 48,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--color-terra-300), var(--color-terra-400))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      overflow: 'hidden',
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: Math.round(size * 0.32) / 16 + 'rem',
      fontWeight: 600,
      color: '#fff',
      letterSpacing: '0.05em'
    }
  }, initials));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/content/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Card — the brand's signature surface. Sand ground with a hairline border
 * that warms to terracotta on hover, lifting with a soft shadow and revealing
 * a thin terracotta→olive accent bar along the top edge.
 */
function Card({
  children,
  accentBar = true,
  interactive = true,
  padding = '40px 32px',
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const active = interactive && hover;
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: active ? 'var(--surface-raised)' : 'var(--surface-card)',
      border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border-soft)'}`,
      borderRadius: 'var(--radius-lg)',
      padding,
      boxShadow: active ? 'var(--shadow-card)' : 'none',
      transform: active ? 'translateY(-4px)' : 'translateY(0)',
      transition: 'all 0.4s var(--ease-out-expo)',
      ...style
    }
  }, rest), accentBar && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: 'linear-gradient(90deg, var(--color-terra-300), var(--color-olive-300))',
      opacity: active ? 1 : 0,
      transition: 'opacity 0.4s ease'
    }
  }), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Card.jsx", error: String((e && e.message) || e) }); }

// components/content/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * StatCard — a quiet metric row: a vertical terracotta→olive accent bar,
 * a large serif number, and a two-line label. Used in proof / results blocks.
 */
function StatCard({
  value,
  label,
  sub,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-raised)',
      border: `1px solid ${hover ? 'var(--border-accent)' : 'var(--border-soft)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '28px 32px',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      boxShadow: hover ? 'var(--shadow-soft)' : 'none',
      transition: 'all 0.3s ease',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '4px',
      alignSelf: 'stretch',
      borderRadius: '2px',
      background: 'linear-gradient(180deg, var(--color-terra-300), var(--color-olive-300))',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '2rem',
      fontWeight: 500,
      color: 'var(--accent)',
      lineHeight: 1,
      marginBottom: '6px'
    }
  }, value), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.85rem',
      fontWeight: 500,
      color: 'var(--text-strong)',
      marginBottom: '2px'
    }
  }, label), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.75rem',
      fontWeight: 300,
      color: 'var(--text-muted)'
    }
  }, sub)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/content/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tag — a small olive pill for topics / modalities (TCC, Mindfulness, …).
 * Uppercase, letter-spaced, rounded full. The grounding olive accent.
 */
function Tag({
  children,
  tone = 'olive',
  style = {},
  ...rest
}) {
  const tones = {
    olive: {
      bg: 'var(--color-olive-100)',
      color: 'var(--color-olive-600)',
      border: 'var(--color-olive-200)'
    },
    terra: {
      bg: 'var(--color-terra-100)',
      color: 'var(--color-terra-600)',
      border: 'var(--color-terra-200)'
    },
    sand: {
      bg: 'var(--color-sand-100)',
      color: 'var(--color-warm-700)',
      border: 'var(--color-sand-300)'
    }
  };
  const t = tones[tone] || tones.olive;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.65rem',
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      padding: '4px 10px',
      background: t.bg,
      color: t.color,
      border: `1px solid ${t.border}`,
      borderRadius: 'var(--radius-pill)',
      display: 'inline-block',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Input — text field, textarea or select sharing one calm style:
 * sand ground, hairline border that warms to terracotta with a soft focus ring.
 */
function Input({
  as = 'input',
  label,
  error,
  id,
  options = [],
  style = {},
  children,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const fieldStyle = {
    width: '100%',
    padding: '14px 18px',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    fontWeight: 300,
    color: 'var(--text-strong)',
    background: 'var(--color-sand-50)',
    border: `1px solid ${error ? 'var(--error)' : focus ? 'var(--color-terra-400)' : 'var(--border-soft)'}`,
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    boxShadow: focus ? '0 0 0 3px rgba(192,140,80,0.1)' : 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    ...(as === 'textarea' ? {
      resize: 'vertical',
      lineHeight: 1.6
    } : {}),
    ...(as === 'select' ? {
      color: 'var(--text-body)',
      appearance: 'none',
      cursor: 'pointer'
    } : {}),
    ...style
  };
  const focusProps = {
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  };
  let field;
  if (as === 'textarea') {
    field = /*#__PURE__*/React.createElement("textarea", _extends({
      id: id,
      style: fieldStyle
    }, focusProps, rest));
  } else if (as === 'select') {
    field = /*#__PURE__*/React.createElement("select", _extends({
      id: id,
      style: fieldStyle
    }, focusProps, rest), children || options.map(o => /*#__PURE__*/React.createElement("option", {
      key: o.value,
      value: o.value
    }, o.label)));
  } else {
    field = /*#__PURE__*/React.createElement("input", _extends({
      id: id,
      style: fieldStyle
    }, focusProps, rest));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'block',
      fontFamily: 'var(--font-sans)',
      fontSize: '0.72rem',
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: '8px'
    }
  }, label), field, error && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.72rem',
      color: 'var(--error)',
      marginTop: '6px'
    }
  }, error));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/typography/Divider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Divider — the brand's thin gradient rule. `line` grows from the left under a
 * heading; `center` is a short centered fade; `ornament` is a full-width rule
 * with a centered gap. Faithful to the terracotta gradient lines used throughout.
 */
function Divider({
  variant = 'line',
  width = 48,
  tone = 'light',
  style = {},
  ...rest
}) {
  const onDark = tone === 'dark';
  if (variant === 'ornament') {
    return /*#__PURE__*/React.createElement("div", _extends({
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--color-terra-300), transparent)'
      }
    }));
  }
  const grad = onDark ? variant === 'center' ? 'linear-gradient(90deg, transparent, rgba(192,169,130,0.6), transparent)' : 'linear-gradient(90deg, rgba(192,169,130,0.8), transparent)' : variant === 'center' ? 'linear-gradient(90deg, transparent, var(--color-terra-300), transparent)' : 'var(--grad-line)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: typeof width === 'number' ? `${width}px` : width,
      height: '1px',
      background: grad,
      transformOrigin: 'left',
      margin: variant === 'center' ? '0 auto' : undefined,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/typography/Divider.jsx", error: String((e && e.message) || e) }); }

// components/typography/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SectionHeading — the consistent header for every section: a small uppercase
 * terracotta eyebrow, a thin serif headline (italic terracotta emphasis welcome),
 * and an optional lead line. Tone "dark" recolors for dark sections.
 */
function SectionHeading({
  eyebrow,
  children,
  lead,
  align = 'left',
  tone = 'light',
  style = {},
  ...rest
}) {
  const onDark = tone === 'dark';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      textAlign: align,
      ...style
    }
  }, rest), eyebrow && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 500,
      letterSpacing: 'var(--eyebrow-track)',
      textTransform: 'uppercase',
      color: onDark ? 'var(--color-gold-soft)' : 'var(--accent)',
      marginBottom: '16px'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'var(--text-h2)',
      fontWeight: 400,
      lineHeight: 'var(--leading-tight)',
      letterSpacing: 'var(--tracking-tight)',
      color: onDark ? 'var(--text-on-ink)' : 'var(--text-strong)'
    }
  }, children), lead && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      fontWeight: 300,
      lineHeight: 'var(--leading-relaxed)',
      color: onDark ? 'rgba(235,220,200,0.8)' : 'var(--text-muted)',
      maxWidth: '600px',
      margin: align === 'center' ? '20px auto 0' : '16px 0 0'
    }
  }, lead));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/typography/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/About.jsx
try { (() => {
function About() {
  const {
    SectionHeading,
    Divider
  } = window.ElianaLinoDesignSystem_6994f2;
  const {
    ref,
    inView
  } = window.useInView();
  return /*#__PURE__*/React.createElement("section", {
    id: "sobre",
    ref: ref,
    style: {
      background: 'var(--bg-page)',
      padding: 'var(--section-y) 0',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "about-grid",
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: '0 var(--gutter)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'clamp(48px,6vw,96px)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(-48px)',
      transition: 'opacity 1s ease, transform 1s var(--ease-out-expo)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '4/5',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'var(--color-sand-200)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    alt: "Eliana Lino",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      filter: 'brightness(0.96) contrast(1.04) saturate(0.9)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -16,
      left: -16,
      width: 80,
      height: 80,
      border: '1px solid var(--color-terra-200)',
      borderRadius: 'var(--radius-sm)',
      opacity: 0.7,
      zIndex: -1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: -16,
      right: -16,
      width: 120,
      height: 120,
      border: '1px solid var(--color-terra-200)',
      borderRadius: 'var(--radius-sm)',
      opacity: 0.7,
      zIndex: -1
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(48px)',
      transition: 'opacity 1s ease .2s, transform 1s var(--ease-out-expo) .2s'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Sobre mim"
  }, "Uma escuta para a ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: 'var(--accent)',
      fontStyle: 'italic'
    }
  }, "sua totalidade")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '1.05rem',
      color: 'var(--text-muted)',
      margin: '16px 0 28px'
    }
  }, "Olhar para a hist\xF3ria com presen\xE7a e acolhimento."), /*#__PURE__*/React.createElement(Divider, {
    className: inView ? 'animate-line-grow' : '',
    style: {
      marginBottom: 28
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '1rem',
      fontWeight: 300,
      lineHeight: 1.9,
      color: 'var(--text-body)',
      marginBottom: 20
    }
  }, "Sou psic\xF3loga cl\xEDnica e acompanho pessoas em processos de autoconhecimento, desenvolvimento emocional e transforma\xE7\xE3o pessoal. Acredito que cada pessoa possui uma sabedoria interna capaz de orientar seu pr\xF3prio caminho de crescimento."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '1rem',
      fontWeight: 300,
      lineHeight: 1.9,
      color: 'var(--text-body)'
    }
  }, "Meu papel \xE9 oferecer um espa\xE7o seguro de escuta, presen\xE7a e investiga\xE7\xE3o para que todas as suas dimens\xF5es sejam reconhecidas, compreendidas e integradas no seu pr\xF3prio ritmo."))));
}
window.About = About;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/About.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Atuacao.jsx
try { (() => {
const AREAS = [{
  icon: '◈',
  title: 'Desenvolvimento e Maturidade',
  text: 'Acompanhamento de adolescentes e jovens em seus processos de amadurecimento, construção da identidade e fortalecimento de vínculos consigo mesmos e com o mundo.'
}, {
  icon: '◇',
  title: 'O Despertar do Feminino',
  text: 'Espaço dedicado a acompanhar mulheres em processos de reconexão com sua essência, seus ciclos, sua potência e sua verdade interior.'
}, {
  icon: '◎',
  title: 'Jornada Individual',
  text: 'Processos terapêuticos focados na superação de bloqueios emocionais, expansão da consciência e realização pessoal.'
}];
function Atuacao() {
  const {
    Card,
    SectionHeading
  } = window.ElianaLinoDesignSystem_6994f2;
  const {
    ref,
    inView
  } = window.useInView(0.1);
  return /*#__PURE__*/React.createElement("section", {
    id: "atuacao",
    ref: ref,
    style: {
      background: 'var(--bg-warm)',
      padding: 'var(--section-y) 0',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: '0 var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 'clamp(48px,6vw,80px)',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(24px)',
      transition: 'opacity .9s ease, transform .9s ease'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "center",
    eyebrow: "\xC1reas de Atua\xE7\xE3o"
  }, "Como posso ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: 'var(--accent)',
      fontStyle: 'italic'
    }
  }, "caminhar"), " ao seu lado")), /*#__PURE__*/React.createElement("div", {
    className: "atuacao-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '32px'
    }
  }, AREAS.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: a.title,
    style: {
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(40px)',
      transition: `all .6s var(--ease-out-expo) ${0.15 * i}s`
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "48px 40px",
    style: {
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '2rem',
      color: 'var(--color-terra-400)',
      marginBottom: 24,
      lineHeight: 1
    }
  }, a.icon), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '1.5rem',
      fontWeight: 400,
      color: 'var(--text-strong)',
      marginBottom: 16,
      lineHeight: 1.3
    }
  }, a.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '1rem',
      fontWeight: 300,
      lineHeight: 1.8,
      color: 'var(--text-muted)'
    }
  }, a.text)))))));
}
window.Atuacao = Atuacao;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Atuacao.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Contact.jsx
try { (() => {
const {
  useState
} = React;
function Contact() {
  const {
    SectionHeading,
    Divider,
    Button,
    IconButton,
    Input
  } = window.ElianaLinoDesignSystem_6994f2;
  const {
    Phone,
    Mail,
    MapPin,
    MessageCircle,
    Instagram,
    Linkedin
  } = window.Icons;
  const {
    ref,
    inView
  } = window.useInView(0.1);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = e => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    }, 1100);
  };
  const INFO = [{
    icon: /*#__PURE__*/React.createElement(Phone, {
      size: 18
    }),
    label: 'Telefone / WhatsApp',
    value: '+55 (11) 99999-9999'
  }, {
    icon: /*#__PURE__*/React.createElement(Mail, {
      size: 18
    }),
    label: 'E-mail',
    value: 'contato@ile.com.br'
  }, {
    icon: /*#__PURE__*/React.createElement(MapPin, {
      size: 18
    }),
    label: 'Endereço',
    value: 'Av. Paulista, 1000 — São Paulo, SP'
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--accent-go)',
      padding: 'clamp(60px,8vw,100px) 0',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 800,
      margin: '0 auto',
      padding: '0 var(--gutter)',
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.7rem',
      fontWeight: 500,
      letterSpacing: '0.28em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.65)',
      marginBottom: 20
    }
  }, "Pronto para come\xE7ar?"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'clamp(2rem,4vw,3rem)',
      fontWeight: 400,
      lineHeight: 1.2,
      color: '#fff',
      marginBottom: 16,
      letterSpacing: '-0.01em'
    }
  }, "O primeiro passo come\xE7a com uma conversa."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '1rem',
      fontWeight: 300,
      color: 'rgba(255,255,255,0.78)',
      marginBottom: 40
    }
  }, "Agende uma conversa de acolhimento e descubra como a terapia pode caminhar com voc\xEA."), /*#__PURE__*/React.createElement("a", {
    href: "#contato",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-sans)',
      fontSize: '0.8rem',
      fontWeight: 500,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      textDecoration: 'none',
      padding: '16px 40px',
      background: '#fff',
      color: 'var(--color-olive-600)',
      borderRadius: 'var(--radius-sm)',
      transition: 'all .3s ease'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }
  }, /*#__PURE__*/React.createElement(MessageCircle, {
    size: 16
  }), " Agendar via WhatsApp"))), /*#__PURE__*/React.createElement("section", {
    id: "contato",
    ref: ref,
    style: {
      background: 'var(--bg-page)',
      padding: 'var(--section-y) 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "contact-grid",
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: '0 var(--gutter)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'clamp(48px,6vw,96px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(-32px)',
      transition: 'opacity 1s ease, transform 1s var(--ease-out-expo)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Contato"
  }, "Vamos conversar?"), /*#__PURE__*/React.createElement(Divider, {
    className: inView ? 'animate-line-grow' : '',
    style: {
      margin: '24px 0 32px'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '1rem',
      fontWeight: 300,
      lineHeight: 1.8,
      color: 'var(--text-body)',
      marginBottom: 40
    }
  }, "Preencha o formul\xE1rio ou entre em contato diretamente. Respondo todas as mensagens em at\xE9 24 horas."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      marginBottom: 40
    }
  }, INFO.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.label,
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      flexShrink: 0,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--color-terra-100)',
      color: 'var(--accent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, it.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.72rem',
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      margin: '0 0 2px'
    }
  }, it.label), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.95rem',
      fontWeight: 300,
      color: 'var(--text-strong)',
      margin: 0
    }
  }, it.value))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    variant: "soft",
    "aria-label": "Instagram",
    href: "#"
  }, /*#__PURE__*/React.createElement(Instagram, {
    size: 18
  })), /*#__PURE__*/React.createElement(IconButton, {
    variant: "soft",
    "aria-label": "LinkedIn",
    href: "#"
  }, /*#__PURE__*/React.createElement(Linkedin, {
    size: 18
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(32px)',
      transition: 'opacity 1s ease .2s, transform 1s var(--ease-out-expo) .2s'
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    className: "animate-fade-in-up",
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '60px 32px',
      background: 'var(--color-olive-100)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-olive-200)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '2.4rem',
      color: 'var(--color-olive-500)',
      marginBottom: 16
    }
  }, "\u25C7"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '1.6rem',
      fontWeight: 400,
      color: 'var(--text-strong)',
      marginBottom: 12
    }
  }, "Mensagem enviada!"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.9rem',
      fontWeight: 300,
      color: 'var(--text-muted)',
      lineHeight: 1.7
    }
  }, "Obrigada pelo contato. Retornarei em at\xE9 24 horas.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-row",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Seu nome completo",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    type: "email",
    placeholder: "Seu e-mail",
    required: true
  })), /*#__PURE__*/React.createElement(Input, {
    type: "tel",
    placeholder: "WhatsApp (opcional)"
  }), /*#__PURE__*/React.createElement(Input, {
    as: "select",
    defaultValue: "",
    required: true,
    options: [{
      value: '',
      label: 'Assunto — por onde começar?'
    }, {
      value: 'ansiedade',
      label: 'Ansiedade ou estresse'
    }, {
      value: 'autoconhecimento',
      label: 'Autoconhecimento'
    }, {
      value: 'transicao',
      label: 'Transição de vida / carreira'
    }, {
      value: 'feminino',
      label: 'O despertar do feminino'
    }, {
      value: 'outro',
      label: 'Outro assunto'
    }]
  }), /*#__PURE__*/React.createElement(Input, {
    as: "textarea",
    rows: 5,
    placeholder: "Conte um pouco sobre o que voc\xEA est\xE1 buscando\u2026",
    required: true
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    variant: "primary",
    size: "lg",
    tone: "light",
    disabled: busy,
    style: {
      alignSelf: 'flex-start'
    }
  }, busy ? 'Enviando…' : 'Enviar mensagem'))))));
}
window.Contact = Contact;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Footer.jsx
try { (() => {
const FOOTER_LINKS = [{
  label: 'Sobre',
  href: '#sobre'
}, {
  label: 'Abordagem',
  href: '#abordagem'
}, {
  label: 'Atuação',
  href: '#atuacao'
}, {
  label: 'Contato',
  href: '#contato'
}];
function Footer() {
  const {
    Logo,
    IconButton
  } = window.ElianaLinoDesignSystem_6994f2;
  const {
    Mail,
    Heart,
    Instagram,
    Linkedin
  } = window.Icons;
  const year = new Date().getFullYear();
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--color-warm-900)',
      padding: 'clamp(80px,10vw,120px) 0 32px',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: '0 var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 'clamp(56px,7vw,90px)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'clamp(1.6rem,3vw,2.4rem)',
      fontWeight: 300,
      lineHeight: 1.4,
      color: 'rgba(240,230,215,0.92)',
      fontStyle: 'italic',
      maxWidth: 800,
      margin: '0 auto'
    }
  }, "\u201CMais do que seguir uma metodologia, meu compromisso \xE9 acompanhar voc\xEA em seu processo singular de crescimento, realiza\xE7\xE3o e expans\xE3o da pr\xF3pria vida.\u201D")), /*#__PURE__*/React.createElement("div", {
    className: "footer-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr 1fr',
      gap: 48,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "#hero",
    style: {
      textDecoration: 'none',
      display: 'inline-block',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "stacked",
    tone: "dark",
    size: 70
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.88rem',
      fontWeight: 300,
      lineHeight: 1.8,
      color: 'rgba(220,205,185,0.6)',
      maxWidth: 280,
      marginTop: 16
    }
  }, "Acompanhando pessoas em processos de autoconhecimento, desenvolvimento emocional e transforma\xE7\xE3o pessoal.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.68rem',
      fontWeight: 600,
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color: 'rgba(192,169,130,0.6)',
      marginBottom: 20
    }
  }, "Navega\xE7\xE3o"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: 0,
      margin: 0
    }
  }, FOOTER_LINKS.map(l => /*#__PURE__*/React.createElement("li", {
    key: l.href
  }, /*#__PURE__*/React.createElement("a", {
    href: l.href,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.88rem',
      fontWeight: 300,
      color: 'rgba(220,205,185,0.65)',
      textDecoration: 'none',
      transition: 'color .3s ease'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'rgba(192,169,130,0.9)',
    onMouseLeave: e => e.currentTarget.style.color = 'rgba(220,205,185,0.65)'
  }, l.label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.68rem',
      fontWeight: 600,
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color: 'rgba(192,169,130,0.6)',
      marginBottom: 20
    }
  }, "Contato"), /*#__PURE__*/React.createElement("a", {
    href: "mailto:contato@ile.com.br",
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.88rem',
      fontWeight: 300,
      color: 'rgba(220,205,185,0.65)',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Mail, {
    size: 14
  }), " contato@ile.com.br"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    size: "sm",
    tone: "dark",
    "aria-label": "Instagram",
    href: "#"
  }, /*#__PURE__*/React.createElement(Instagram, {
    size: 15
  })), /*#__PURE__*/React.createElement(IconButton, {
    size: "sm",
    tone: "dark",
    "aria-label": "LinkedIn",
    href: "#"
  }, /*#__PURE__*/React.createElement(Linkedin, {
    size: 15
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'linear-gradient(90deg, transparent, rgba(192,169,130,0.15), transparent)',
      marginBottom: 24
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.75rem',
      fontWeight: 300,
      color: 'rgba(192,169,130,0.35)'
    }
  }, "\xA9 ", year, " Il\xEA \xB7 Eliana Lino \xB7 CRP XX/XXXXX. Todos os direitos reservados."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.72rem',
      fontWeight: 300,
      color: 'rgba(192,169,130,0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, "Feito com ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgba(192,130,100,0.5)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(Heart, {
    size: 11
  })), " e cuidado"))));
}
window.Footer = Footer;
function WhatsAppFab() {
  const {
    MessageCircle
  } = window.Icons;
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#contato",
    "aria-label": "Agendar pelo WhatsApp",
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      position: 'fixed',
      bottom: 32,
      right: 32,
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      textDecoration: 'none',
      transform: h ? 'translateY(-2px)' : 'translateY(0)',
      transition: 'all .4s var(--ease-out-expo)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.75rem',
      fontWeight: 500,
      letterSpacing: '0.08em',
      color: 'var(--text-strong)',
      background: '#fff',
      padding: '8px 16px',
      borderRadius: 999,
      boxShadow: 'var(--shadow-float)',
      whiteSpace: 'nowrap',
      opacity: h ? 1 : 0,
      transform: h ? 'translateX(0)' : 'translateX(12px)',
      transition: 'all .4s ease',
      pointerEvents: 'none'
    }
  }, "Agendar pelo WhatsApp"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #25d366, #128c7e)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: h ? '0 12px 40px rgba(37,211,102,0.45)' : '0 6px 24px rgba(37,211,102,0.3)',
      transition: 'box-shadow .4s ease',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(MessageCircle, {
    size: 24
  })));
}
window.WhatsAppFab = WhatsAppFab;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Hero.jsx
try { (() => {
const {
  useState,
  useEffect,
  useRef
} = React;
function Hero() {
  const {
    Button,
    Logo
  } = window.ElianaLinoDesignSystem_6994f2;
  const {
    ChevronDown
  } = window.Icons;
  const [loaded, setLoaded] = useState(false);
  const decoRef = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    const onMove = e => {
      if (!decoRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      decoRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', onMove, {
      passive: true
    });
    return () => {
      clearTimeout(t);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);
  const fade = d => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 1s ease ${d}, transform 1s var(--ease-out-expo) ${d}`
  });
  return /*#__PURE__*/React.createElement("section", {
    id: "hero",
    style: {
      position: 'relative',
      minHeight: '100svh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'var(--grad-hero)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'radial-gradient(ellipse 65% 55% at 72% 48%, rgba(170,120,75,0.22) 0%, transparent 55%), radial-gradient(ellipse 45% 60% at 15% 75%, rgba(110,130,90,0.14) 0%, transparent 50%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.4,
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")"
    }
  }), /*#__PURE__*/React.createElement("div", {
    ref: decoRef,
    style: {
      position: 'absolute',
      right: '2%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      opacity: loaded ? 0.5 : 0,
      transition: 'opacity 1.4s ease 0.8s',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 'min(460px, 42vw)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 480 480",
    style: {
      position: 'absolute',
      width: '118%',
      opacity: 0.6
    },
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "240",
    cy: "240",
    r: "230",
    stroke: "rgba(192,160,110,0.16)",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "240",
    cy: "240",
    r: "180",
    stroke: "rgba(192,160,110,0.12)",
    strokeWidth: "0.6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "240",
    y1: "10",
    x2: "240",
    y2: "470",
    stroke: "rgba(192,160,110,0.08)",
    strokeWidth: "0.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "10",
    y1: "240",
    x2: "470",
    y2: "240",
    stroke: "rgba(192,160,110,0.08)",
    strokeWidth: "0.5"
  })), /*#__PURE__*/React.createElement(Logo, {
    variant: "mark",
    size: 300,
    mono: "rgba(192,160,110,0.7)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 10,
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: '120px var(--gutter) 80px',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.68rem',
      fontWeight: 500,
      letterSpacing: '0.32em',
      textTransform: 'uppercase',
      color: 'rgba(192,160,110,0.85)',
      marginBottom: '32px',
      ...fade('0.1s')
    }
  }, "Psicologia Cl\xEDnica \xB7 Autoconhecimento \xB7 Consci\xEAncia"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'min(680px, 56vw)',
      marginBottom: '40px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'var(--text-display)',
      fontWeight: 300,
      lineHeight: 1.12,
      color: '#f5efe8',
      letterSpacing: '-0.01em',
      ...fade('0.2s')
    }
  }, "\u201CAtrav\xE9s da experi\xEAncia de vida, podemos crescer e nos aproximar de quem"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'var(--text-display)',
      fontWeight: 300,
      lineHeight: 1.12,
      color: 'transparent',
      fontStyle: 'italic',
      WebkitTextStroke: '1px rgba(192,160,110,0.75)',
      ...fade('0.38s')
    }
  }, "verdadeiramente somos.\u201D")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '72px',
      height: '1px',
      marginBottom: '32px',
      background: 'linear-gradient(90deg, rgba(192,160,110,0.8), transparent)',
      transformOrigin: 'left',
      transform: loaded ? 'scaleX(1)' : 'scaleX(0)',
      transition: 'transform 1.4s var(--ease-in-out-quint) 0.55s'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'clamp(0.9rem,1.6vw,1.05rem)',
      fontWeight: 300,
      lineHeight: 1.9,
      color: 'rgba(235,220,200,0.7)',
      maxWidth: '430px',
      marginBottom: '48px',
      ...fade('0.65s')
    }
  }, "Um espa\xE7o de escuta, presen\xE7a e investiga\xE7\xE3o para que voc\xEA reconhe\xE7a, compreenda e integre suas dimens\xF5es no seu pr\xF3prio ritmo."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      ...fade('0.82s')
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    href: "#sobre"
  }, "Conhe\xE7a meu trabalho"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    tone: "dark",
    size: "lg",
    href: "#contato"
  }, "Agendar Consulta"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      color: 'rgba(192,160,110,0.7)',
      opacity: loaded ? 0.7 : 0,
      transition: 'opacity 1s ease 1.4s'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.6rem',
      letterSpacing: '0.26em',
      textTransform: 'uppercase'
    }
  }, "Explorar"), /*#__PURE__*/React.createElement("span", {
    className: "animate-scroll-bounce",
    style: {
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(ChevronDown, {
    size: 15
  }))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Navbar.jsx
try { (() => {
const {
  useState,
  useEffect
} = React;
const NAV_LINKS = [{
  label: 'Sobre',
  href: '#sobre'
}, {
  label: 'Abordagem',
  href: '#abordagem'
}, {
  label: 'Atuação',
  href: '#atuacao'
}, {
  label: 'Contato',
  href: '#contato'
}];
function Navbar() {
  const {
    Logo,
    Button
  } = window.ElianaLinoDesignSystem_6994f2;
  const {
    Menu,
    X
  } = window.Icons;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      transition: 'background .5s ease, box-shadow .5s ease, padding .4s ease',
      background: scrolled ? 'rgba(250,248,244,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      boxShadow: scrolled ? '0 1px 0 rgba(160,130,100,0.12)' : 'none',
      padding: scrolled ? '12px 0' : '24px 0'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: '0 var(--gutter)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#hero",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "inline",
    size: scrolled ? 34 : 38,
    tone: scrolled ? 'light' : 'dark',
    showTagline: false
  })), /*#__PURE__*/React.createElement("ul", {
    className: "nav-desktop",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '36px',
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, NAV_LINKS.map(l => /*#__PURE__*/React.createElement("li", {
    key: l.href
  }, /*#__PURE__*/React.createElement("a", {
    href: l.href,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.78rem',
      fontWeight: 400,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      textDecoration: 'none',
      color: scrolled ? 'var(--text-body)' : 'rgba(255,255,255,0.82)',
      transition: 'color .3s ease'
    },
    onMouseEnter: e => e.currentTarget.style.color = scrolled ? 'var(--accent)' : '#fff',
    onMouseLeave: e => e.currentTarget.style.color = scrolled ? 'var(--text-body)' : 'rgba(255,255,255,0.82)'
  }, l.label)))), /*#__PURE__*/React.createElement("div", {
    className: "nav-desktop"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    tone: scrolled ? 'light' : 'dark',
    href: "#contato"
  }, "Agendar Consulta")), /*#__PURE__*/React.createElement("button", {
    className: "nav-burger",
    "aria-label": "Abrir menu",
    onClick: () => setOpen(!open),
    style: {
      display: 'none',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 4,
      color: scrolled ? 'var(--text-strong)' : '#fff'
    }
  }, open ? /*#__PURE__*/React.createElement(X, {
    size: 24
  }) : /*#__PURE__*/React.createElement(Menu, {
    size: 24
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mobile-menu",
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 99,
      background: 'var(--bg-page)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '32px',
      transition: 'opacity .4s ease, visibility .4s ease',
      opacity: open ? 1 : 0,
      visibility: open ? 'visible' : 'hidden'
    }
  }, NAV_LINKS.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.href,
    href: l.href,
    onClick: () => setOpen(false),
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '1.8rem',
      color: 'var(--text-strong)',
      textDecoration: 'none',
      letterSpacing: '0.06em'
    }
  }, l.label)), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    tone: "light",
    href: "#contato",
    onClick: () => setOpen(false)
  }, "Agendar Consulta")));
}
window.Navbar = Navbar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Navbar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Quote.jsx
try { (() => {
function Quote() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--grad-quote)',
      padding: 'clamp(80px,10vw,120px) 0',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      width: 600,
      height: 600,
      borderRadius: '50%',
      border: '1px solid rgba(192,169,130,0.1)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      width: 400,
      height: 400,
      borderRadius: '50%',
      border: '1px solid rgba(192,169,130,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: '0 auto',
      padding: '0 var(--gutter)',
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '3rem',
      color: 'rgba(192,169,130,0.25)',
      lineHeight: 1,
      marginBottom: -12
    }
  }, "\u201C"), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'clamp(1.4rem,3vw,2rem)',
      fontWeight: 300,
      lineHeight: 1.5,
      color: 'rgba(240,230,215,0.92)',
      fontStyle: 'italic',
      margin: '0 0 32px'
    }
  }, "O autoconhecimento \xE9 a viagem mais corajosa que um ser humano pode fazer."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'rgba(192,169,130,0.6)'
    }
  }, "\u2014 Eliana Lino \xB7 Psic\xF3loga Cl\xEDnica")));
}
window.Quote = Quote;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Quote.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Testimonials.jsx
try { (() => {
const {
  useState
} = React;
const TESTIMONIALS = [{
  text: 'A terapia foi transformadora. Aprendi a entender minha ansiedade ao invés de fugir dela. Hoje me sinto mais inteira e capaz de enfrentar os desafios do dia a dia.',
  name: 'Mariana S.',
  role: 'Consultora de Marketing',
  initials: 'MS'
}, {
  text: 'Passei por uma transição de carreira difícil e o espaço de acolhimento que encontrei aqui foi essencial. A escuta atenta me ajudou a clarear meu caminho.',
  name: 'Ricardo L.',
  role: 'Engenheiro',
  initials: 'RL'
}, {
  text: 'Nunca imaginei que teria coragem de me abrir assim. Um ambiente completamente seguro e sem julgamentos. Foi um divisor de águas na minha vida.',
  name: 'Fernanda K.',
  role: 'Professora',
  initials: 'FK'
}];
const STATS = [{
  value: '500+',
  label: 'Pessoas acompanhadas',
  sub: 'ao longo da carreira'
}, {
  value: '98%',
  label: 'Taxa de satisfação',
  sub: 'baseado em avaliações'
}, {
  value: '8+',
  label: 'Anos de experiência',
  sub: 'em psicologia clínica'
}];
function Testimonials() {
  const {
    SectionHeading,
    IconButton,
    Avatar,
    StatCard
  } = window.ElianaLinoDesignSystem_6994f2;
  const {
    ChevronLeft,
    ChevronRight,
    Quote
  } = window.Icons;
  const {
    ref,
    inView
  } = window.useInView(0.1);
  const [active, setActive] = useState(0);
  const t = TESTIMONIALS[active];
  const prev = () => setActive(a => a === 0 ? TESTIMONIALS.length - 1 : a - 1);
  const next = () => setActive(a => a === TESTIMONIALS.length - 1 ? 0 : a + 1);
  return /*#__PURE__*/React.createElement("section", {
    id: "depoimentos",
    ref: ref,
    style: {
      background: 'var(--bg-subtle)',
      padding: 'var(--section-y) 0',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: '0 var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 'clamp(48px,6vw,72px)',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(24px)',
      transition: 'opacity .9s ease, transform .9s ease'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Depoimentos"
  }, "Hist\xF3rias de ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: 'var(--accent)',
      fontStyle: 'italic'
    }
  }, "transforma\xE7\xE3o"))), /*#__PURE__*/React.createElement("div", {
    className: "testimonial-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '64px',
      alignItems: 'center',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity .9s ease .2s, transform .9s ease .2s'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-terra-300)',
      opacity: 0.7,
      display: 'inline-flex',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Quote, {
    size: 36
  })), /*#__PURE__*/React.createElement("blockquote", {
    key: active,
    className: "animate-fade-in-up",
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'clamp(1.1rem,2vw,1.4rem)',
      fontWeight: 400,
      lineHeight: 1.7,
      color: 'var(--text-strong)',
      fontStyle: 'italic',
      margin: '0 0 32px'
    }
  }, "\u201C", t.text, "\u201D"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: t.initials
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.9rem',
      fontWeight: 500,
      color: 'var(--text-strong)',
      margin: 0
    }
  }, t.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '0.8rem',
      fontWeight: 300,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, t.role))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "Depoimento anterior",
    onClick: prev
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, TESTIMONIALS.map((_, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    "aria-label": `Depoimento ${i + 1}`,
    onClick: () => setActive(i),
    style: {
      width: i === active ? 24 : 8,
      height: 8,
      borderRadius: 999,
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      background: i === active ? 'var(--color-terra-400)' : 'var(--color-terra-200)',
      transition: 'all .35s ease'
    }
  }))), /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "Pr\xF3ximo depoimento",
    onClick: next
  }, /*#__PURE__*/React.createElement(ChevronRight, {
    size: 18
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, STATS.map(s => /*#__PURE__*/React.createElement(StatCard, {
    key: s.label,
    value: s.value,
    label: s.label,
    sub: s.sub
  }))))));
}
window.Testimonials = Testimonials;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Testimonials.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/helpers.jsx
try { (() => {
// Shared reveal-on-scroll hook for the landing UI kit.
window.useInView = function useInView(threshold = 0.15) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, {
      threshold,
      rootMargin: '0px 0px -60px 0px'
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return {
    ref,
    inView
  };
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/helpers.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/icons.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Lucide-style line icons (stroke 2, round) — faithful to the lucide-react set
   the source product uses. Exposed on window.Icons for the landing UI kit. */
const Svg = ({
  size = 20,
  children,
  fill = 'none',
  ...rest
}) => /*#__PURE__*/React.createElement("svg", _extends({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: fill,
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, rest), children);
const Icons = {
  ChevronDown: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  })),
  ChevronLeft: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("polyline", {
    points: "15 18 9 12 15 6"
  })),
  ChevronRight: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("polyline", {
    points: "9 18 15 12 9 6"
  })),
  Menu: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("line", {
    x1: "4",
    y1: "6",
    x2: "20",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4",
    y1: "12",
    x2: "20",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4",
    y1: "18",
    x2: "20",
    y2: "18"
  })),
  X: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })),
  Quote: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"
  })),
  Mail: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("rect", {
    width: "20",
    height: "16",
    x: "2",
    y: "4",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
  })),
  MapPin: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3"
  })),
  Phone: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
  })),
  MessageCircle: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
  })),
  Heart: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z"
  })),
  Instagram: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "20",
    rx: "5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "17.5",
    y1: "6.5",
    x2: "17.51",
    y2: "6.5"
  })),
  Linkedin: p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
    d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "9",
    width: "4",
    height: "12"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "4",
    cy: "4",
    r: "2"
  }))
};
window.Icons = Icons;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/icons.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

})();
