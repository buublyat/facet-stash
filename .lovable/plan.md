

# Add Hacker Meme Images to Start Screen

Generate and integrate additional hacker-themed meme images with neon green matrix aesthetic to enhance the immersive landing page experience.

## Overview

Generate 2-3 additional hacker-themed meme images using AI image generation, then position them around the start screen with staggered floating animations and glowing effects to match the existing hacker cat.

## Visual Layout

```text
+--------------------------------------------------+
|  ┌──[ SYSTEM READY ]     [ CONNECTION: SECURE ]──┐|
|                                                  |
|    [HACKER PEPE]           (matrix rain falls)   |
|      (top-left)                                  |
|                                                  |
|              ┌─────────────────┐                 |
|              │  DATA_MANAGER_  │                 |
|              │   [ ENTER ]     │                 |
|              └─────────────────┘                 |
|                                                  |
|  [HACKERMAN]                      [HACKER CAT]   |
|  (bottom-left)                    (bottom-right) |
|  └──[ v1.0.0 ]            [ ENCRYPTED ]──┘       |
+--------------------------------------------------+
```

## Meme Images to Generate

| Image | Description | Position |
|-------|-------------|----------|
| Hackerman | Classic "Hackerman" meme in neon green matrix style | Bottom-left corner |
| Hacker Pepe | Pepe the frog in a hoodie with matrix code | Top-left area |
| Anonymous Mask | Guy Fawkes/Anonymous mask with green glow | Floating mid-left |

## Animation Details

- Each meme will have a unique float animation with different timing to create depth
- Staggered appearance: 0.3s, 0.7s, 1.0s delays
- Different opacity levels (40-60%) to not overwhelm the main content
- Matching green glow drop-shadow effect

---

## Technical Details

### New Assets
Generate and save to `src/assets/`:
- `hackerman.png` - Hackerman meme with neon green matrix styling
- `hacker-pepe.png` - Pepe hacker in matrix aesthetic
- `anonymous-mask.png` - Anonymous mask with green glow (optional 3rd image)

### File Changes

**`src/pages/Start.tsx`**
- Import new meme images
- Add state variables for staggered reveal: `showMeme1`, `showMeme2`, `showMeme3`
- Add useEffect timers for staggered appearance
- Position images in fixed corners with floating animations
- Apply varying animation delays and opacities

**`src/index.css`**
- Add `animate-float-slow` keyframe (6s duration, slower than cat)
- Add `animate-float-delayed` with animation-delay offset
- Add different float heights for visual variety

### Animation Keyframes

```css
@keyframes floatSlow {
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

@keyframes floatReverse {
  0%, 100% { transform: translateY(-10px); }
  50% { transform: translateY(10px); }
}
```

### Component Structure

```tsx
// Bottom-left meme
<div className={`fixed bottom-20 left-4 z-15 ${showMeme1 ? 'opacity-50' : 'opacity-0'}`}>
  <img src={hackerman} className="w-48 md:w-64 animate-float-slow" />
</div>

// Top-left meme  
<div className={`fixed top-20 left-4 z-15 ${showMeme2 ? 'opacity-40' : 'opacity-0'}`}>
  <img src={hackerPepe} className="w-40 md:w-56 animate-float-reverse" />
</div>
```

### Dependencies
- Uses Lovable's built-in AI image generation API (`google/gemini-2.5-flash-image`)
- No external dependencies needed

