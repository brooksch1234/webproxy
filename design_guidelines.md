# Web Proxy Design Guidelines

## Design Approach
**Design System**: Material Design-inspired utility interface
**Justification**: This is a function-first tool where clarity, usability, and performance are paramount. The design should minimize distractions and maximize the browsing experience.

## Core Design Elements

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Headings**: font-semibold, text-lg for toolbar elements
- **Body**: font-normal, text-base for UI labels
- **URL Input**: font-mono, text-sm for better URL readability

### Layout System
**Spacing Units**: Use Tailwind units of 2, 4, and 6 consistently
- Toolbar padding: p-4
- Component gaps: gap-4
- Input padding: px-4 py-2
- Content margins: m-0 (full viewport utilization)

**Structure**:
- Fixed top toolbar (h-16) with search/navigation
- Full-height content area below (calc(100vh - 4rem))
- No sidebar - maximize content display area

### Component Library

**Primary Components**:

1. **Top Toolbar**
   - Full-width sticky header (sticky top-0)
   - Contains: URL input field (flex-1), navigation controls, settings icon
   - Shadow: shadow-md for depth separation
   - URL input: Rounded (rounded-lg), with search icon prefix
   - Action buttons: Icon-only, rounded-md, p-2

2. **URL Input Field**
   - Large, prominent search bar taking 60% of toolbar width
   - Placeholder: "Enter URL to browse through proxy..."
   - Auto-focus on page load
   - Enter key submits, clear button (×) when populated
   - Icons: Search/globe icon (left), clear icon (right when active)

3. **Navigation Controls**
   - Back/Forward arrows (disabled state when not applicable)
   - Reload button
   - Home button (resets to blank state)
   - Grouped together with gap-2

4. **Content Display Area**
   - Full viewport minus toolbar height
   - iframe implementation for proxied content
   - Loading state: Centered spinner with "Loading..." text
   - Error state: Centered message with retry button
   - Empty state: Welcome message with usage instructions

5. **Empty/Welcome State**
   - Centered vertically and horizontally
   - Icon: Large globe/network icon (h-20 w-20)
   - Heading: "Web Proxy Browser"
   - Subtext: "Enter any URL above to browse through secure proxy"
   - Example URLs as clickable suggestions (optional quick start)

### Accessibility
- Focus states on all interactive elements (ring-2 ring-offset-2)
- Keyboard navigation support (Tab, Enter, Escape)
- ARIA labels for icon buttons
- Screen reader announcements for loading/error states

### No Images Required
This is a pure utility application - no hero images, no decorative graphics. The interface should be clean, fast, and focused entirely on function.

### Animations
**Minimal & Purposeful Only**:
- Loading spinner rotation
- Smooth transitions on toolbar shadow (transition-shadow)
- No page transitions, no scroll effects, no decorative animations

### Key Design Principles
1. **Maximum Content Display**: Every pixel serves the browsing experience
2. **Instant Clarity**: User knows exactly what to do upon landing
3. **Zero Friction**: Minimal steps from URL entry to content display
4. **Performance First**: Lightweight, fast-loading interface that doesn't compete with proxied content