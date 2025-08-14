# MercuryOne Divine Theme Specification (CRITICAL)

## Navigation
- For system overview: [MercuryOne_System_Overview.md](../Overviews/MercuryOne_System_Overview.md)
- For technical architecture: [MercuryOne_Technical_Architecture.md](MercuryOne_Technical_Architecture.md)
- For agents/protocol: [MercuryOne_Agent_Protocol.md](MercuryOne_Agent_Protocol.md)
- For business logic: [MercuryOne_Core_Business_Logic.md](../Business_Logic/MercuryOne_Core_Business_Logic.md)
- For suppliers: [MercuryOne_Supplier_Architecture_Guide.md](../Suppliers/MercuryOne_Supplier_Architecture_Guide.md)
- For integrations: [Morpheus_Integration_Guide.md](../Integrations/Morpheus_Integration_Guide.md)
- For roadmaps: [MercuryOne_Development_Roadmap.csv](../Roadmaps/MercuryOne_Development_Roadmap.csv)
- For compliance: [MercuryOne_UK_Compliance_Guide.md](../Compliance/MercuryOne_UK_Compliance_Guide.md)

---

**Status:** ✅ CRITICAL BUSINESS DOCUMENTATION — Protected from deletion
**Version:** v2.2  
**Last Updated:** August 11, 2025  
**Theme Enforcement:** Enforced by Athena Agent with zero tolerance policy

---

## CHANGE LOG
- **2025-07-31**: Initial master documentation creation in /Documentation folder

---

## 🚫 ZERO TOLERANCE VISUAL DRIFT POLICY

Any deviation from these rules triggers immediate agent enforcement:
- **Athena**: Detects violations and reports to system logs
- **Vulcan**: Generates automatic repair proposals  
- **Hercules**: Blocks patch deployment if theme violations detected
- **Mars**: Prevents unauthorized component modifications

---

## 🎯 EXACT COLOR SPECIFICATIONS (NO VARIATIONS)

### Primary Divine Colors (HSL Values - MANDATORY)
```css
--divine-amber: hsl(45, 93%, 58%)     /* Exact amber - no substitutions */
--divine-purple: hsl(271, 81%, 56%)   /* Exact purple - no substitutions */
--divine-indigo: hsl(243, 75%, 59%)   /* Exact indigo - no substitutions */
```

### Complete CSS Variables (EXACT IMPLEMENTATION)
```css
:root {
  --background: hsl(222, 84%, 5%);
  --foreground: hsl(210, 40%, 98%);
  --muted: hsl(217, 33%, 17%);
  --muted-foreground: hsl(215, 20%, 65%);
  --popover: hsl(222, 47%, 11%);
  --popover-foreground: hsl(210, 40%, 98%);
  --card: hsl(222, 84%, 5%);
  --card-foreground: hsl(210, 40%, 98%);
  --border: hsl(217, 33%, 17%);
  --input: hsl(217, 33%, 17%);
  --primary: hsl(207, 90%, 54%);
  --primary-foreground: hsl(222, 84%, 5%);
  --secondary: hsl(217, 33%, 17%);
  --secondary-foreground: hsl(210, 40%, 98%);
  --accent: hsl(217, 33%, 17%);
  --accent-foreground: hsl(210, 40%, 98%);
  --destructive: hsl(0, 62.8%, 30.6%);
  --destructive-foreground: hsl(210, 40%, 98%);
  --ring: hsl(212, 92%, 45%);
  --radius: 1rem;

  /* Divine theme colors */
  --divine-amber: hsl(45, 93%, 58%);
  --divine-purple: hsl(271, 81%, 56%);
  --divine-indigo: hsl(243, 75%, 59%);
  
  /* Glass morphism colors */
  --glass-bg: hsl(222, 84%, 5%, 0.8);
  --glass-border: hsl(215, 27%, 32%, 0.5);
}
```

### Base Surface (MANDATORY CSS Classes)
```css
.glass-card {
  @apply bg-slate-900/80 border border-slate-700/50 backdrop-blur-sm rounded-2xl shadow-lg;
}
```

### Typography (LOCKED SPECIFICATIONS)
- **Body Text**: Tailwind Slate variants (`text-slate-400`, `text-slate-300`, `text-white`)
- **Headers**: MUST use `.divine-gradient-text` class for main headings
- **Subheadings**: `text-amber-300`, `text-purple-300`, or `text-indigo-300`
- **Muted Text**: `text-slate-400` for descriptions and secondary information
- **Font Weights**: `font-bold` for headers, `font-semibold` for emphasis, `font-medium` for navigation
- **Font Sizes**: Standard Tailwind scale (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`)
- **NO CUSTOM FONTS**: Tailwind typography stack only

---

## 🏗️ COMPONENT STRUCTURE (MANDATORY)

### Glass Morphism Pattern (EXACT IMPLEMENTATION)
```jsx
// Method 1: Use .glass-card class (PREFERRED)
<Card className="glass-card">
  <CardContent className="relative z-10">
    {/* All content here */}
  </CardContent>
</Card>

// Method 2: Manual implementation (when .glass-card unavailable)
<Card className="relative overflow-hidden bg-slate-900/80 border border-slate-700/50 backdrop-blur-sm rounded-2xl shadow-lg">
  <CardContent className="relative z-10">
    {/* All content here */}
  </CardContent>
</Card>
```

### Divine CSS Classes (MANDATORY USAGE)
```css
.divine-gradient-text {
  @apply bg-gradient-to-r from-amber-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent;
}

.divine-gradient-bg {
  @apply bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10;
}

.divine-button {
  @apply glass-card hover:shadow-xl transition-shadow duration-200;
}

.divine-button:hover {
  @apply bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20;
}

.metric-card {
  @apply relative overflow-hidden glass-card p-6 hover:shadow-xl;
}

.metric-card::before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-br opacity-10;
}

.metric-card.amber::before {
  @apply from-amber-500 to-transparent;
}

.metric-card.purple::before {
  @apply from-purple-500 to-transparent;
}

.metric-card.indigo::before {
  @apply from-indigo-500 to-transparent;
}

.metric-card.emerald::before {
  @apply from-emerald-500 to-transparent;
}
```

### Shape Rules (UNIVERSAL)
- **Border Radius**: `rounded-2xl` for cards, `rounded-xl` for smaller elements
- **Shadow**: `shadow-lg` for cards, `hover:shadow-xl` for interactive elements
- **Spacing**: Tailwind spacing scale only (`p-4`, `p-6`, `gap-3`, `gap-6`, etc.)
- **Body Background**: Must be `bg-slate-950` site-wide

---

## 🚫 FORBIDDEN ELEMENTS

### Colors (ZERO TOLERANCE)
- ❌ Clinical blue (`#0ea5e9`, `#06b6d4`, `#3b82f6`, `hsl(199, 89%, 48%)`)
- ❌ Bright cyan or cold blues (`#22d3ee`, `#0891b2`)
- ❌ Any hex colors - ONLY HSL values allowed
- ❌ Custom color variables outside divine palette
- ❌ Gray color schemes (`gray-*`, `zinc-*`, `neutral-*`)
- ❌ Bright accent colors (`red-500`, `green-500`, `yellow-500`)

### Layout & Structure (BANNED)
- ❌ `container` or `max-w-*` wrapper classes - use viewport full width
- ❌ Fixed navigation bars or sticky headers
- ❌ Card layouts without glass morphism (`card-*` without `.glass-card`)
- ❌ Traditional sidebar designs (drawer, accordion, etc.)
- ❌ Modal overlays without backdrop blur
- ❌ Grid systems outside Tailwind grid classes

### Typography & Content (FORBIDDEN)
- ❌ Custom fonts outside Tailwind typography stack
- ❌ Heading elements without `.divine-gradient-text`
- ❌ Bold text colors (`text-white`, `text-gray-100`) for headers
- ❌ All-caps text transformations
- ❌ Custom font weights outside Tailwind scale
- ❌ Italic text styling (`italic`, `font-italic`)

### Interactive Elements (BANNED)
- ❌ Hover color changes (background, text, border color shifts)
- ❌ Click animations or state transitions
- ❌ Loading spinners or progress animations
- ❌ Tooltip hover effects or popovers
- ❌ Smooth scrolling behaviors
- ❌ Auto-playing animations or transitions

### Icons & Assets (RESTRICTED)
- ❌ Icon libraries other than Lucide React
- ❌ Custom SVG icons or icon fonts
- ❌ Emoji or unicode symbols
- ❌ Brand logos or external graphics
- ❌ Background images or textures

---

## ✅ REQUIRED IMPLEMENTATIONS

### Essential Components (MUST USE)
```jsx
// Divine gradient text (ALL main headings)
<h1 className="text-3xl font-bold divine-gradient-text">
  {title}
</h1>

// Glass morphism cards (ALL containers)
<Card className="glass-card">
  <CardContent className="p-6">
    {content}
  </CardContent>
</Card>

// Divine metric cards with color variants
<div className="metric-card amber">
  <div className="relative z-10">
    {metricContent}
  </div>
</div>

// Divine buttons (ALL interactive elements)
<Button className="divine-button">
  {buttonText}
</Button>
```

### Layout Patterns (ENFORCED)
- **Dashboard Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- **Agents Grid**: `grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3`
- **Content Spacing**: `space-y-6` for vertical sections
- **Page Padding**: `p-6` for main content areas
- **Card Padding**: `p-6` for card content

### Color Usage (REQUIRED)
- **Amber**: Janus, Athena, Mars, Apollo agents and related UI elements
- **Purple**: Saturn, Vulcan, Neptune, Iris, Argus, Daedalus agents and related UI elements
- **Indigo**: Juno, Hercules, Minerva agents and related UI elements
- **Emerald**: Success states, positive metrics, completed statuses

---

## 🔍 ENFORCEMENT PROTOCOLS

> **Agent Building Reference**: For detailed agent implementation guidance, refer to `Critical Documentation/AGENT_COMMUNICATION_PROTOCOL.md`

**Required for All Patch Development**: Any patch that involves UI components, agent functionality, or system integration MUST reference AGENT_COMMUNICATION_PROTOCOL.md for canonical agent roles and implementation patterns.

### Athena Agent Detection
- Scans all components for divine theme compliance
- Flags color deviations, layout violations, forbidden elements
- Reports violations to system logs with component references

### Vulcan Agent Repair
- Generates automatic fixes for common violations
- Provides specific class replacements and corrections
- Suggests component restructuring for compliance

### Hercules Agent Blocking
- Prevents deployment of patches with theme violations
- Requires manual review and correction before approval
- Maintains patch quality and visual consistency

### Mars Agent Protection
- Blocks unauthorized modifications to theme components
- Enforces read-only status on critical styling files
- Prevents runtime style manipulation

---

## 📋 COMPLIANCE CHECKLIST

### Pre-Deployment Validation
- [ ] All cards use `.glass-card` class
- [ ] Headers use `.divine-gradient-text` class
- [ ] Color palette restricted to divine HSL values
- [ ] No forbidden elements or patterns present
- [ ] Responsive grid patterns implemented correctly
- [ ] Agent color assignments followed precisely

### Agent Verification
- [ ] Athena scan passes with zero violations
- [ ] Vulcan repair suggestions addressed
- [ ] Hercules deployment approval received
- [ ] Mars protection protocols active

---

## ⚖️ FINAL AUTHORITY

These rules are immutable and enforced by the MCP agent system. Any attempt to bypass, override, or gradually drift from the divine theme specifications will result in immediate intervention and correction. The divine aesthetic is foundational to the MercuryRising platform identity and must be preserved across all components and features.