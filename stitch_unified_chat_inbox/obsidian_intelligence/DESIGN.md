---
name: Obsidian Intelligence
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#908fa1'
  outline-variant: '#464556'
  surface-tint: '#c1c1ff'
  primary: '#c1c1ff'
  on-primary: '#1500a8'
  primary-container: '#5d5cff'
  on-primary-container: '#fdf9ff'
  inverse-primary: '#4643e9'
  secondary: '#cebdff'
  on-secondary: '#381385'
  secondary-container: '#4f319c'
  on-secondary-container: '#bea8ff'
  tertiary: '#ffb691'
  on-tertiary: '#552000'
  tertiary-container: '#bf5200'
  on-tertiary-container: '#fff9f7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1dfff'
  primary-fixed-dim: '#c1c1ff'
  on-primary-fixed: '#09006b'
  on-primary-fixed-variant: '#2b20d2'
  secondary-fixed: '#e8ddff'
  secondary-fixed-dim: '#cebdff'
  on-secondary-fixed: '#21005e'
  on-secondary-fixed-variant: '#4f319c'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb691'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#793100'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 24px
  gutter: 16px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
  max-width-content: 1200px
---

## Brand & Style

The design system is engineered for high-performance productivity, blending the focus of a professional code editor with the elegance of a luxury lifestyle brand. It targets power users who value cognitive clarity and streamlined workflows. 

The aesthetic is **Premium Dark-Mode Minimalism** with **Glassmorphic** accents. It leverages deep charcoal surfaces to reduce eye strain, using vibrant "electric" highlights to denote AI-driven insights and primary actions. The emotional response should be one of calm control, precision, and technological sophistication. High-contrast typography ensures legibility, while generous whitespace creates a sense of "digital breathing room," preventing the information density of email from becoming overwhelming.

## Colors

The palette is rooted in deep blacks and charcoals to establish depth and hierarchy without relying on traditional borders.

- **Base Background (#0A0A0A):** Used for the primary application canvas.
- **Surface (#121212):** Used for cards, sidebars, and elevated containers.
- **Primary Electric Blue (#5D5CFF):** Reserved for core CTAs and active states.
- **AI Violet (#A78BFA):** A signature accent specifically for AI-generated content, summaries, and predictive features.
- **Semantic Colors:** Success (Emerald 400), Warning (Amber 400), and Error (Rose 500) are used sparingly in desaturated tones to maintain the dark-mode harmony.

## Typography

This design system utilizes **Inter** for its systematic, neutral, and highly legible qualities across all UI and body text. For technical labels, metadata, and AI-assistant status indicators, **Geist** is employed to provide a precise, developer-adjacent aesthetic.

The type hierarchy prioritizes clarity. Body text uses a slightly increased line height (1.5x) to ensure long-form emails remain readable. Large headlines utilize tight letter spacing to maintain a "locked-in" premium feel.

## Layout & Spacing

The layout follows a **fluid grid** model with strict 8px increments. 

- **Desktop:** A 12-column grid with a fixed-width sidebar (280px). Content is centered in a 1200px container to prevent excessive line lengths in emails.
- **Tablet:** An 8-column grid. The sidebar collapses into a drawer.
- **Mobile:** A 4-column grid with 16px horizontal margins.

Spacing is generous to promote a minimalist feel. Threaded conversations (chat-style) utilize asymmetrical padding—wider on the trailing side to mimic modern messaging apps.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Glassmorphism**, rather than traditional heavy shadows.

1.  **Level 0 (Base):** Background color (#0A0A0A).
2.  **Level 1 (Cards/Panels):** Surface color (#121212) with a subtle 1px border (#ffffff10).
3.  **Level 2 (Modals/Overlays):** Semi-transparent background (Surface color at 80% opacity) with a `backdrop-filter: blur(20px)`. 
4.  **Shadows:** When used, shadows are "Ambient Shadows"—ultra-diffused, 0% spread, and tinted with the primary blue or violet to create a soft glow rather than a dark void.

## Shapes

The shape language is organic yet structured. 
- **Buttons and Inputs:** Use a 0.5rem (8px) radius.
- **Cards and Modals:** Use a 1rem (16px) radius for a softer, premium feel.
- **AI-Features:** Use a "Pill-shape" (full rounding) to differentiate human-generated content from machine-generated content.
- **Avatars:** Strictly circular to contrast against the rectangular grid of the inbox.

## Components

- **Buttons:** Primary buttons use a solid gradient (Primary to Secondary) with white text. Secondary buttons are "Ghost" style with a 1px white-alpha border.
- **Chat Bubbles:** In email threads, "Me" bubbles are subtle charcoal (#1E1E1E), and "Them" bubbles are transparent with a thin outline. AI-assistant bubbles feature a soft violet glow.
- **Inputs:** Focused states remove the border and use a 2px outer glow of the primary color. Labels are always positioned above the input in `label-md` style.
- **Chips:** Used for email tags and calendar categories. They should be low-height (24px) with `body-sm` typography and a light background tint matching the tag color.
- **Icons:** All icons must be 1.5px or 2px stroke weight, outlined, and never filled unless in an "active" navigation state.
- **AI Summary Card:** A specific component with a `linear-gradient` border and a micro-shimmer animation to indicate "active thinking" or "freshly generated" status.