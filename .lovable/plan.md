

# Matrix Rain Start Screen

Create an immersive landing page featuring the iconic falling green characters effect with a logo reveal animation, perfectly matching your existing terminal/hacker aesthetic.

## Overview

The start screen will display a full-screen Matrix-style digital rain animation with falling green characters. After a brief moment, your app logo will fade in at the center with a glowing effect, followed by a prominent "[ ENTER ]" button that navigates to the data table.

## Visual Design

```text
+--------------------------------------------------+
|  ¥ § ∑ µ ¶ ∆ ø π Ω å ß ∂ ƒ © ˙ ∆ ˚ ¬ … æ        |
|    ≈ ç √ ∫ ˜ µ ≤ ≥ ÷  (falling characters)      |
|  ∂ ƒ © ˙ ∆ ˚ ¬ … æ ≈ ç √ ∫ ˜ µ ≤ ≥ ÷           |
|                                                  |
|              ┌─────────────────┐                 |
|              │  DATA_MANAGER_  │  <-- Glowing   |
|              │                 │      logo      |
|              │   [ ENTER ]     │                 |
|              └─────────────────┘                 |
|                                                  |
|  ∂ ƒ © ˙ ∆ ˚ ¬ … æ ≈ ç √ ∫ ˜ µ ≤ ≥ ÷           |
+--------------------------------------------------+
```

## Animation Sequence

1. **Matrix Rain**: Continuous falling green characters across the entire screen
2. **Logo Fade-In** (after ~1.5s): "DATA_MANAGER_" fades in at center with glow effect and blinking cursor
3. **Button Reveal** (after ~2.5s): "[ ENTER ]" button fades in below the logo with hover glitch effect
4. **Scanlines**: Subtle scanline overlay for authentic CRT monitor feel

## Features

- **Responsive**: Works on all screen sizes
- **Performance Optimized**: Uses CSS animations where possible, efficient canvas rendering for rain
- **Interactive Button**: Glitch effect on hover, navigates to `/table` route
- **Skip Animation**: Click anywhere to skip directly to the enter button state

---

## Technical Details

### New Files
- `src/pages/Start.tsx` - The animated start screen component
- `src/components/MatrixRain.tsx` - Canvas-based falling characters animation

### Modified Files
- `src/App.tsx` - Update routes: Start screen at `/`, table moves to `/table`
- `src/index.css` - Add new animation keyframes for the logo reveal

### Route Structure
| Route | Page |
|-------|------|
| `/` | Start (new landing page) |
| `/table` | Index (data table, renamed route) |
| `/dashboard` | Dashboard (unchanged) |

### Matrix Rain Implementation
- Uses HTML5 Canvas for smooth performance
- Random characters from Katakana, Latin, and symbols
- Variable fall speeds for depth effect
- Fades at the top for seamless loop

### Animation Timing
```text
0.0s - Matrix rain starts immediately
1.5s - Logo fades in with glow
2.5s - Enter button appears
3.0s - Full interaction ready
```

### Dependencies
No new dependencies required - uses existing:
- React hooks for animation state
- Canvas API for matrix rain
- Tailwind CSS for styling
- Lucide icons (Terminal icon)

