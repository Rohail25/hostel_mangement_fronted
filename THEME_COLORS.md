# Light Blue Theme Colors

This project uses a beautiful light blue color scheme as the primary theme.

## Color Palette

### Primary Colors (Sky Blue)
- `primary-50`: `#f0f9ff` - Lightest blue (backgrounds)
- `primary-100`: `#e0f2fe` - Very light blue
- `primary-200`: `#bae6fd` - Light blue
- `primary-300`: `#7dd3fc` - Medium light blue
- `primary-400`: `#38bdf8` - Medium blue
- `primary-500`: `#0ea5e9` - **Main primary color**
- `primary-600`: `#0284c7` - Dark blue (hover states)
- `primary-700`: `#0369a1` - Darker blue
- `primary-800`: `#075985` - Very dark blue
- `primary-900`: `#0c4a6e` - Darkest blue
- `primary-950`: `#082f49` - Ultra dark blue

### Secondary Colors (Cyan)
- `secondary-50`: `#ecfeff`
- `secondary-100`: `#cffafe`
- `secondary-200`: `#a5f3fc`
- `secondary-300`: `#67e8f9`
- `secondary-400`: `#22d3ee`
- `secondary-500`: `#06b6d4` - **Main secondary color**
- `secondary-600`: `#0891b2`
- `secondary-700`: `#0e7490`
- `secondary-800`: `#155e75`
- `secondary-900`: `#164e63`

### Accent Colors (Blue)
- `accent-50` to `accent-900` - Traditional blue shades

## CSS Variables

Use these CSS custom properties anywhere in your styles:

```css
--color-primary: #0ea5e9
--color-primary-dark: #0284c7
--color-primary-light: #38bdf8
--color-secondary: #06b6d4
--color-accent: #3b82f6
--color-background: #f0f9ff
--color-surface: #ffffff
--color-text: #0c4a6e
--color-text-light: #075985
```

## Usage Examples

### Tailwind Classes

```tsx
// Backgrounds
<div className="bg-primary-500">Main background</div>
<div className="bg-primary-50">Light background</div>

// Text colors
<p className="text-primary-600">Primary text</p>
<p className="text-primary-500">Lighter text</p>

// Borders
<div className="border border-primary-300">Bordered element</div>

// Gradients
<div className="bg-linear-to-r from-primary-500 to-secondary-500">Gradient</div>
<div className="bg-gradient-primary">Predefined gradient</div>

// Shadows
<button className="shadow-blue-lg">Button with blue shadow</button>

// Hover states
<button className="bg-primary-600 hover:bg-primary-500">Hover button</button>
```

### CSS Custom Properties

```css
.custom-element {
  background-color: var(--color-primary);
  color: var(--color-surface);
}

.custom-text {
  color: var(--color-primary-dark);
}
```

## Predefined Utilities

Custom utility classes available globally:

- `.bg-primary` - Primary background color
- `.bg-primary-light` - Light primary background
- `.bg-gradient-blue` - Blue gradient (primary to secondary)
- `.text-primary` - Primary text color
- `.border-primary` - Primary border color

## Gradients

### Predefined Background Gradients

1. **gradient-primary**: Sky blue to cyan gradient
   ```tsx
   <div className="bg-gradient-primary">Content</div>
   ```

2. **gradient-secondary**: Light blue to cyan gradient
   ```tsx
   <div className="bg-gradient-secondary">Content</div>
   ```

3. **gradient-light**: Very light blue gradient
   ```tsx
   <div className="bg-gradient-light">Content</div>
   ```

## Blue Shadows

Special shadow utilities with blue tint:

- `shadow-blue-sm` - Small blue shadow
- `shadow-blue` - Default blue shadow
- `shadow-blue-md` - Medium blue shadow
- `shadow-blue-lg` - Large blue shadow
- `shadow-blue-xl` - Extra large blue shadow

## Tips

1. Use `primary-500` for main action buttons
2. Use `primary-600` for hover states
3. Use `primary-50` and `primary-100` for light backgrounds
4. Combine with `shadow-blue-*` classes for elevated elements
5. Use gradients for special call-to-action elements


