# Logo Integration Guide

## 📁 Logo File Placement

Place your logo file in this folder with one of these names:
- `logo.png` (recommended)
- `logo.svg` (scalable vector)
- `logo.jpg` or `logo.jpeg`

## 🎨 Logo Design Recommendations

For the dark purple and neon theme:

### Colors that work well:
- **Primary**: Dark purple (#6366f1, #4f46e5, #3730a3)
- **Accent**: Neon colors (#00ff88, #00d4ff, #b347d9, #ff006e)
- **Background**: Transparent or dark (#0a0a0f, #1a1a2e)

### Size recommendations:
- **Width**: 200-400px
- **Height**: 48-96px (will auto-scale to 48px in header)
- **Format**: PNG with transparent background preferred

### Design elements that fit the theme:
- Geometric shapes with neon outlines
- Circuit board patterns
- Tech/digital aesthetic
- Gradient effects with purple/neon colors
- Glowing effects

## 🔧 Technical Notes

The logo will:
- Display at 48px height in the header
- Have a neon purple drop-shadow effect applied via CSS
- Hide gracefully if the file doesn't exist
- Work responsively on mobile devices

## 🎯 Current Integration

The HTML references: `icon/logo.png`
If your logo has a different name, either:
1. Rename your file to `logo.png`, or
2. Update the src in `index.html` line 17

The logo appears in the header next to the application title with a glowing effect that matches the dark purple and neon theme.
