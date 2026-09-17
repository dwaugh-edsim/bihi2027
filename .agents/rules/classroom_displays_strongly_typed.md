# Classroom Displays Design System: Strongly Typed (Room 8 Default)

## Purpose & Scope
This rule establishes HTML5 UP's **"Strongly Typed"** design system as the **mandatory default design template** for all Room 8 classroom projector displays, live submission dashboards, Smartboard presentations, and student portals across Grade 8 and Grade 9.

---

## 1. Core Typography
Always import and use Google Fonts:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Arvo:ital,wght@0,400;0,700;1,400;1,700&family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
```

* **Headings & Titles (`h1`, `h2`, `h3`, brand labels):**  
  `font-family: 'Arvo', Georgia, serif; font-weight: 700;`  
  Add subtle text shadow on major display titles: `text-shadow: 0.04em 0.06em 0 rgba(0, 0, 0, 0.08);`
* **Body & UI Text:**  
  `font-family: 'Source Sans 3', 'Source Sans Pro', -apple-system, sans-serif;`
* **PINs, Timers, Telemetry, and Code:**  
  `font-family: 'JetBrains Mono', monospace; font-weight: 700;`

---

## 2. Color Palette & CSS Variables
The default view must ALWAYS be **High-Contrast Projector Light Mode** (not dark mode).

```css
:root {
    /* Backgrounds & Surfaces */
    --bg-page: #f0f2f5;          /* Warm light paper */
    --bg-surface: #ffffff;       /* Pure white panels */
    --bg-card: #ffffff;
    --bg-card-hover: #f8fafc;
    
    /* Borders & Rules */
    --border-card: #d5dbe3;
    --border-subtle: #e5e9f0;
    --border-highlight: #ed786a;

    /* High-Contrast Inks (near-black on white for projectors) */
    --text-main: #1e2530;
    --text-heading: #181f2b;
    --text-muted: #475569;
    --text-dim: #64748b;

    /* Signature Strongly Typed Coral Accent */
    --coral: #ed786a;
    --coral-hover: #fd887a;
    --coral-dark: #d65b4c;
    --coral-bg: #fff1f0;
    --coral-border: #fecdd3;

    /* Structured Accents */
    --blue: #1d4ed8;
    --blue-bg: #eff6ff;
    --blue-border: #bfdbfe;

    --emerald: #15803d;
    --emerald-bg: #dcfce7;
    --emerald-border: #86efac;

    --amber: #b45309;
    --amber-bg: #fef3c7;
    --amber-border: #fde68a;

    --purple: #6d28d9;
    --purple-bg: #f5f3ff;
    --purple-border: #ddd6fe;

    /* Font Families */
    --font-heading: 'Arvo', Georgia, serif;
    --font-body: 'Source Sans 3', 'Source Sans Pro', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
}
```

---

## 3. Signature Strongly Typed Styling Elements

1. **Layered Double Rules:**
   Use the signature HTML5 UP double line on headers and key divider bars:
   ```css
   .double-rule-bottom {
       border-bottom: 2px solid var(--border-subtle);
       box-shadow: inset 0 -4px 0 0 #ffffff, inset 0 -6px 0 0 var(--border-card);
   }
   ```
2. **Room 8 Brand Badge:**
   ```css
   .badge-room {
       background: var(--coral);
       color: #ffffff;
       font-family: var(--font-heading);
       font-weight: 700;
       border-radius: 6px;
       padding: 4px 12px;
       letter-spacing: 0.5px;
       box-shadow: 0 2px 6px rgba(237, 120, 106, 0.3);
   }
   ```
3. **Card Presentation:**
   Cards must be crisp white boxes with a solid 1px border (`#d5dbe3`), rounded corners (`8px`), and a subtle elevation shadow (`box-shadow: 0 2px 6px rgba(0,0,0,0.05);`).
4. **Single-Screen 1080p Layout Rule:**
   For class rosters (28 students), format into a **two-column layout** (14 students per column) so all students remain visible simultaneously on the front classroom projector without teacher scrolling.
5. **Classroom-Safe Data Display:**
   Student rosters show `First Name`, `Last Initial/Name`, and `3-Letter PIN`. Never display private teacher notes, student passwords, or sensitive medical comments on open projector screens.
