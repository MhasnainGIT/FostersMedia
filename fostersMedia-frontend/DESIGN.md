# Fosters Media - Design Specifications (Stitch)

This document acts as the visual source of truth for the Fosters Media platform. All components, styling variables, and page layouts must adhere to these tokens and constraints.

---

## 1. Color Palette (Obsidian & Rose Gold Glow)

We use a high-end luxury dark color scheme to convey professionalism, premium content, and dynamic activity.

### Base Colors
- **Root Background (Obsidian Pearl)**: `#08090C`
- **Surface Elevation (Deep Slate)**: `#0E1015`
- **Muted Surface (Dark Slate)**: `#151821`
- **Text Primary (Pure White)**: `#FFFFFF`
- **Text Secondary (Ice Muted)**: `#8E94A5` (White with opacity ~`60%`)
- **Text Muted (Steel Dark)**: `#555C6D` (White with opacity ~`35%`)

### Primary Accents & Gradients
- **Primary Rose Gold**: `#FF6A88` (Main brand color)
- **Secondary Champagne**: `#FFB199`
- **Accent Coral**: `#FF8E53`
- **Brand Gradient**: `linear-gradient(135deg, #FF6A88 0%, #FF8E53 100%)`
- **Neon Pulse (Success/Active)**: `#10B981` (Emerald green for active state)
- **Alert/Danger**: `#EF4444`

---

## 2. Visual Effects & Glassmorphism

To elevate cards and sidebars from looking like "generic AI outputs", we use precise glassmorphism layers.

- **Panel Styling**:
  - `background-color`: `rgba(255, 255, 255, 0.02)`
  - `backdrop-filter`: `blur(16px)`
  - `border`: `1px solid rgba(255, 255, 255, 0.08)`
  - `border-radius`: `24px` (`rounded-3xl`)
- **Glow Highlight (On Hover)**:
  - `border-color`: `rgba(255, 106, 136, 0.3)`
  - `box-shadow`: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 106, 136, 0.05)`
  - `transform`: `translateY(-4px)`
  - `transition`: `all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`

---

## 3. Typography (Elegant & Tech-Forward)

- **Headings**:
  - Font: `Outfit` or `Inter`, sans-serif.
  - Weight: Semibold to Extra Bold.
  - Feature: Use Gradient Masking on primary words to create focal points.
  - Tracking: `tracking-tight` on page headers; `tracking-wider` on subheadings.
- **Body Text**:
  - Font: `Inter`, sans-serif.
  - Weight: Regular to Medium.
  - Line Height: Balanced (`leading-relaxed`).

---

## 4. UI Layout Rules

- **Borders & Seams**: Use thin borders (`border-white/10`) to separate sections rather than solid color blocks.
- **Grids & Layout**:
  - Use custom CSS radial dot patterns to break background monotony.
  - Ensure margins are spacious (e.g., `py-24` / `px-8` on desktops).
- **Status Indicators**:
  - Real-time elements must have a pulsing green or orange glow.
  - Data values ticking upward should use subtle transition animations.
