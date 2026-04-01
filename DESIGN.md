# Design System Document

## 1. Overview & Visual Character: Clinical Data Dashboard

This design system is derived from the actual product mockup. The aesthetic is a **clean, data-dense clinical dashboard** — not editorial. It prioritizes scannable information hierarchy, clear status communication, and a precise instrument-control feel. The dominant influence is modern SaaS tooling for life sciences: think Illumina BaseSpace, not a science magazine.

Key characteristics observed in the mockup:
- Pure white surfaces with very subtle separation (no warm off-whites)
- Bright cyan as the single accent color — used sparingly for active/live state only
- ALL-CAPS metadata labels paired with regular-weight values
- Underline tabs, not pill tabs
- Icon-only vertical left nav on a near-black sidebar
- 3-step linear workflow stepper as a core navigation metaphor

---

## 2. Colors

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#00b0f0` | Active tab underline, progress bar fill, CTA button, active status dot |
| `--on-primary` | `#ffffff` | Text on primary backgrounds |
| `--background` | `#ffffff` | Page and card backgrounds |
| `--surface-alt` | `#f4f6f8` | Instrument illustration panel, recessed areas |
| `--foreground` | `#111827` | Primary text, headings, run IDs |
| `--text-secondary` | `#6b7280` | Body copy, descriptions |
| `--label` | `#9ca3af` | Metadata labels (ALL CAPS, small) |
| `--border` | `rgba(0, 0, 0, 0.07)` | Card outlines, dividers |
| `--progress-track` | `#e5e7eb` | Progress bar background |
| `--success` | `#22c55e` | Completed step checkmark icon |
| `--nav-bg` | `#1e2533` | Left sidebar background |
| `--nav-icon` | `#9ca3af` | Inactive nav icons |
| `--nav-icon-active` | `#ffffff` | Active nav icon |

### Status Badge Colors

| Status | Background | Text | Icon |
|--------|-----------|------|------|
| In Progress / Active | `rgba(0, 176, 240, 0.12)` | `#007ab8` | Animated `···` |
| Completed | `rgba(34, 197, 94, 0.12)` | `#15803d` | `✓` checkmark |
| Pending | `rgba(0, 0, 0, 0.05)` | `#6b7280` | Circle outline |
| Reserved | `rgba(0, 0, 0, 0.05)` | `#6b7280` | — |

### Rule: Cyan is reserved for "live/active" state only
Do not use `--primary` for decorative purposes. Every instance of cyan signals something is happening now or is interactive. This creates an instinctive visual scan path — the eye goes to cyan first.

---

## 3. Typography

Single font: **Inter** (or system `-apple-system, BlinkMacSystemFont, 'Inter', sans-serif`).

### Scale

| Role | Size | Weight | Transform | Color | Usage |
|------|------|--------|-----------|-------|-------|
| `page-title` | 18px | 600 | none | `--foreground` | "Instrument Overview" |
| `section-header` | 16px | 700 | none | `--foreground` | "Liquid handling", "Sequencers used" |
| `run-id` | 14px | 600 | none | `--foreground` | Run ID values, bold identifiers |
| `body` | 14px | 400 | none | `--text-secondary` | Descriptions, body copy |
| `value-bold` | 14px | 600 | none | `--foreground` | ETA times, key metric values |
| `metadata-label` | 11px | 500 | UPPERCASE | `--label` | "RUN ID", "SAMPLE COUNT", "ASSAY" |
| `badge-text` | 12px | 500 | none | varies | Status badges |

### The Metadata Label Pattern
The most distinctive typographic pattern: a small, ALL-CAPS, gray label stacked **above** its value.

```
Tomorrow 12:45 PM      ← value: 14px, regular, --foreground
ESTIMATED LP COM...    ← label: 11px, medium, uppercase, --label
```

This pattern is used everywhere data is presented. Labels always sit below their values in the DOM but appear above visually — the value gets the optical weight.

---

## 4. Layout

### Shell
```
┌─────┬────────────────────────────────────────────┐
│ Nav │                                            │
│ 48px│           Main Content Area               │
│     │                                            │
└─────┴────────────────────────────────────────────┘
```

- **Left Nav**: 48px wide, `--nav-bg` background, icon-only
- **Main Area**: White, full remaining width
- **Top Bar**: Inline title + right-aligned CTA button, no dedicated header bar background — content sits directly on white

### Two-Panel Content Split
Report/detail pages use a ~55/45 split (not enforced as exact):
- **Left**: Primary content, visualizations, lists
- **Right**: Detail panel, status cards, run breakdowns

Panels are not boxed with heavy chrome — they are separated by the column gap alone.

### Spacing Scale
Base unit: **8px**

| Token | Value | Usage |
|-------|-------|-------|
| `space-2` | 8px | Tight element spacing (label-to-value) |
| `space-3` | 12px | Within-card padding (rows) |
| `space-4` | 16px | Between elements in a section |
| `space-6` | 24px | Card internal padding |
| `space-8` | 32px | Between sections |

---

## 5. Components

### Navigation (Left Sidebar)
- Fixed, `48px` wide, `--nav-bg` (`#1e2533`) background
- Icon-only; no labels
- Active icon: white; inactive: `--nav-icon` gray
- Bottom area: notification badge, settings icon, avatar circle

### Page Title Bar
- No background — floats on the white page
- Left: `page-title` weight heading + parenthetical context (e.g., `(BBL13)`)
- Right: Primary CTA button
- No border-bottom — separation achieved by `space-8` margin before content

### Tabs (Underline style)
```
Devices 4    Runs 2
             ──────   ← 2px solid --primary underline, only on active
```
- Inactive: `--text-secondary`, no underline
- Active: `--foreground`, 2px `--primary` bottom border
- No pill/chip background on tabs
- Tab label includes count inline: "Runs 2" not "Runs (2)"

### Data Row (Metadata Pattern)
```html
<div class="flex flex-col">
  <span class="value">Tomorrow 10:45 PM</span>
  <span class="label">ETA RUN COMPLETION</span>
</div>
```
Value first in DOM, label second. In multi-column grids, 2–3 columns of these.

### Run List Card
Horizontal card with 4 zones:
1. **Run ID** (left, `run-id` typography)
2. **Metadata columns** (flex row of 2–3 data rows)
3. **Status badge** (inline pill)
4. **Chevron** `›` (right edge, navigate to detail)

Styling: white bg, `1px solid --border`, `border-radius: 8px`, `padding: 16px`, subtle `box-shadow: 0 1px 3px rgba(0,0,0,0.06)`.

### Workflow Stepper
3-step linear stepper: `Library Preparation → Sequencing → Analyzing`

```
[●] Library Preparation  ›  [···] Sequencing  ›  [○] Analyzing
 ↑ completed (green ✓)        ↑ in progress         ↑ pending
```

- Step circle: 20px, `border-radius: full`
- Completed: `--success` fill + white checkmark
- In Progress: light gray fill + animated `···` (3 dots)
- Pending: white fill + `--border` 1px stroke
- Arrow separator: `›` in `--label` color
- Step label: 13px, `--text-secondary`; active step label: `--foreground`, font-medium

### Status Badge (Pill)
```
[···] Library Prep      ← in-progress
[✓]  Library Prep      ← completed
[ ]  Sequencing        ← pending
```
- Height: 28px, `border-radius: full`
- Padding: `px-3`
- Icon: 14px, left of text
- Background/text color per status table in Section 2

### Progress Bar
```
━━━━━━━━░░░░░░░░░░░░  50%
```
- Height: 4px
- Track: `--progress-track` (`#e5e7eb`)
- Fill: `--primary` (`#00b0f0`)
- Percentage label: 12px, `--foreground`, font-medium, right-aligned
- Full width of its container
- `border-radius: full` on both track and fill

### Cards / Panels
- Background: `#ffffff`
- Border: `1px solid rgba(0, 0, 0, 0.07)`
- Border radius: `8px`
- Shadow: `0 1px 3px rgba(0, 0, 0, 0.06)`
- Internal padding: `24px`
- **No decorative divider lines inside cards.** Sub-sections separated by `space-6` vertical gap.

### Instrument Tooltip Card (3D View)
Small white floating card overlaid on the instrument illustration:
- White bg, `border-radius: 6px`, subtle shadow
- Format: `[status-indicator] Instrument Name    Status`
- Left edge accent: 3px `--primary` left border-radius on the container, OR a colored dot

### CTA Button ("Start New Run")
- Background: `--primary` (`#00b0f0`), solid
- Text: white, 14px, font-medium
- Shape: `border-radius: full` (pill)
- Padding: `px-5 py-2`
- No gradient — flat fill
- Hover: `brightness(0.92)` darkens slightly
- Icon: `+` prefix, 16px

---

## 6. Iconography
- Library: **Lucide** (already in project)
- Size conventions:
  - Nav icons: `20px`
  - Inline content icons: `14–16px`
  - Status step icons: `12px`
- Color: inherit from parent context (never hardcoded)

---

## 7. Do's and Don'ts

### Do
- **Do** use the ALL-CAPS label + value stacking pattern consistently for every piece of metadata
- **Do** use cyan (`--primary`) only for interactive and active-state elements
- **Do** use underline tabs, not pill tabs
- **Do** use `border-radius: 8px` for cards and `border-radius: full` for badges and buttons
- **Do** keep the left nav icon-only and dark

### Don't
- **Don't** use warm off-white backgrounds (`#fbf9f8`) — background is pure white
- **Don't** use glassmorphism — surfaces are flat and opaque
- **Don't** use gradients on buttons — CTA is solid `--primary` fill
- **Don't** use the deep teal `#00658c` as a primary color — the primary is the bright cyan `#00b0f0`
- **Don't** replace tab underlines with pill-shaped tab indicators
- **Don't** use drop shadows larger than `0 1px 3px rgba(0,0,0,0.06)` — keep elevation minimal
- **Don't** use more than two font weights per view (regular + semi-bold)
