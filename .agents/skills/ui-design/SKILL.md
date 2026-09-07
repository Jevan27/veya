---
name: ui-design
description: >-
  Production-quality UI/UX design system and mobile styling for Veya.
  Use when designing, styling, or refining React Native components, screens, modals,
  bottom sheets, forms, color themes, cards, animations, and touch interactions.
---

# UI Design Skill for Veya

This skill governs visual design, user experience (UX), interaction design, layout, styling, mobile accessibility, responsive behavior, animation, and touch interactions for the Veya mobile application (`app/`). All UI decisions must maintain seamless visual consistency with Veya's minimal, dark-and-light modern aesthetic while strictly adhering to established design tokens and component patterns.

---

## 1. Skill Boundary & Invariants

This skill is **exclusively responsible** for:

- **Visual Design**: Color harmony, typographic hierarchy, elevation, borders, iconography, and card themes.
- **UX Architecture**: User flows, screen states (the 8 core UX states), form ergonomics, and feedback loops.
- **Interaction & Motion**: Touch feedback, gesture-driven bottom sheets, sheet dismissals, and subtle state transitions.
- **Layout & Responsiveness**: Safe areas, notch and dynamic island handling, keyboard avoidance, and multi-device adaptation.
- **UI Accessibility**: Touch target sizing (minimum 44 × 44 dp), accessibility roles, labels, and color contrast.

### Cross-Skill Collaboration

```text
┌─────────────────────────────────────────────────────────────┐
│                       ui-design                             │
│ (Visual hierarchy, styling tokens, UX states, interaction)  │
└──────────────────────┬──────────────────────┬───────────────┘
                       │                      │
                       ▼                      ▼
    ┌──────────────────────────────┐  ┌──────────────────────────────┐
    │     frontend-development     │  │           testing            │
    │ (Component logic, state,     │  │ (Component rendering tests,  │
    │  hooks, API client, storage) │  │  interaction & a11y tests)   │
    └──────────────────────────────┘  └──────────────────────────────┘
```

- **Implementation Boundary**: `ui-design + frontend-development`
  `ui-design` specifies the layout, styles, tokens, and interaction behavior. `frontend-development` implements state management, custom hooks, network queries, and storage wiring.
- **Testing Boundary**: `ui-design + testing`
  `ui-design` specifies accessibility roles, labels, and state transitions. `testing` implements automated component tests, accessibility assertions, and regression coverage.

---

## 2. Core Design Principles

Every UI decision in Veya must optimize:

1. **Clarity**: Visual elements must communicate their purpose immediately without visual noise or ambiguity.
2. **Usability**: High-frequency workflows (card sharing, QR scanning, profile editing) must be effortless and require minimal taps.
3. **Consistency**: Colors, typography, spacing, radii, and shadows must come exclusively from established tokens. Never introduce ad-hoc values.
4. **Accessibility**: Every interactive control must provide adequate touch targets (>= 44 × 44 dp), clear labels, and accessible contrast.
5. **Visual Hierarchy**: Typographic scale, weight, and contrast must clearly guide the user's eye from primary headings to secondary details and metadata.
6. **Platform Appropriateness**: Feel native and responsive on both iOS (subtle spring sheets, soft shadows, iOS safe areas) and Android (proper elevation, hardware back handling).

> **Axiom**: Do not add visual complexity or ornamental animations merely because they look impressive. Every animation, shadow, and transition must serve usability or communicate state.

---

## 3. Pre-Design Inspection & Component Reuse Decision Tree

Before introducing any new UI component, modal, or style rule:

1. **Inspect Existing Reference Components**:
   - Primary business card renderer: `app/features/cards/components/VeyaCard/VeyaCard.tsx`
   - Business card subcomponents: `app/features/cards/components/VeyaCard/` (`CardAvatar.tsx`, `CardHeader.tsx`, `CardContactGrid.tsx`, `CardModal.tsx`)
   - Modal bottom sheets and form inputs: `app/features/cards/components/EditCardModal/EditCardModal.tsx`
   - Navigation and tab layouts: `app/components/navigation/BottomNavBar.tsx` and `app/app/index.tsx`
   - Settings, rows, and section groups: `app/features/settings/components/SettingsTab.tsx`
   - Common buttons & inputs: `app/features/auth/components/AuthButton.tsx`, `app/features/auth/components/AuthInput.tsx`
   - Branded icons: `app/components/icons/QrScannerIcon.tsx`
2. **Inspect Existing Design Tokens**:
   - Curated card color presets: `app/features/cards/utils/card-colors.ts`
   - Global stylesheet conventions across `app/features/` and `app/components/`

### Component Reuse Decision Tree

```text
New UI Need Identified
│
├── 1. Does an existing component in app/components/ or app/features/ solve this?
│   └── YES ──> REUSE IT DIRECTLY without duplicating layout or styles.
│
├── 2. Can an existing component support this via an optional prop or variant?
│   └── YES ──> EXTEND THE EXISTING COMPONENT while preserving backwards compatibility.
│
├── 3. Is the component exclusive to a single feature domain?
│   └── YES ──> CREATE in app/features/<feature>/components/<ComponentName>.tsx
│
└── 4. Is the component shared across two or more distinct features?
    └── YES ──> CREATE in app/components/<ComponentName>.tsx
```

---

## 4. Design System Tokens (The Single Source of Truth)

Never invent arbitrary colors, font sizes, margins, or radii. Use the frozen token values below:

### 4.1 Color Palette

#### Core Neutrals & Backgrounds

| Token / Name           | Hex Value | Usage                                                  |
| :--------------------- | :-------- | :----------------------------------------------------- |
| **Pure White**         | `#FFFFFF` | Default screen background, card surfaces, modal sheets |
| **Pure Black**         | `#111111` | Primary text, primary dark buttons, primary icons      |
| **Slate Dark**         | `#0F172A` | Primary dark buttons, dark card surfaces, modal titles |
| **Slate Medium**       | `#1E293B` | Secondary dark surfaces, dark mode cards               |
| **Section Group Fill** | `#FAFAFA` | Grouped list backgrounds, secondary containers         |
| **Muted Surface**      | `#F8FAFC` | Light card preset background, input disabled fill      |
| **Pill / Badge Fill**  | `#F1F5F9` | Tab pills, close button circles, chip backgrounds      |

#### Borders & Dividers

| Token / Name         | Hex Value | Usage                                              |
| :------------------- | :-------- | :------------------------------------------------- |
| **Light Border**     | `#E8E8E8` | Card borders, section group borders, input borders |
| **Hairline Divider** | `#EEF2F6` | Card separators, internal row dividers             |
| **Dark Border**      | `#334155` | Borders on dark card presets                       |
| **Drag Handle**      | `#CBD5E1` | Bottom sheet drag indicators                       |

#### Text & Typography Colors

| Token / Name             | Hex Value             | Usage                                         |
| :----------------------- | :-------------------- | :-------------------------------------------- |
| **Text Primary (Dark)**  | `#111111` / `#0F172A` | Screen titles, card names, section values     |
| **Text Primary (Light)** | `#FFFFFF`             | Text on dark buttons, dark cards, dark badges |
| **Text Muted**           | `#6B6B6B`             | Secondary body, company names, descriptions   |
| **Text Caption / Meta**  | `#9CA3AF`             | Form field hints, version text, timestamps    |
| **Text Slate Subtle**    | `#64748B`             | Sheet subtitles, inactive tab button labels   |

#### Functional & Feedback Colors

| Context                 | Text      | Background | Border    | Usage                                                    |
| :---------------------- | :-------- | :--------- | :-------- | :------------------------------------------------------- |
| **Destructive / Error** | `#DC2626` | `#FEF2F2`  | `#FEE2E2` | Delete account button, inline field errors, error alerts |
| **Success**             | `#10B981` | `#ECFDF5`  | `#A7F3D0` | "Copied!" feedback, checkmark icons, saved toast         |
| **Informational**       | `#0284C7` | `#F0F9FF`  | `#BAE6FD` | Guidance banners, QR instructions                        |

#### Card Accent & Background Presets (from `card-colors.ts`)

```typescript
// Primary Accent Presets
PRIMARY_COLORS: [
  { name: 'Pure Black', hex: '#111111' },
  { name: 'Indigo', hex: '#4F46E5' },
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Sky Cyan', hex: '#0284C7' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Purple', hex: '#7C3AED' },
  { name: 'Rose', hex: '#E11D48' },
  { name: 'Amber', hex: '#D97706' },
  { name: 'Slate Gray', hex: '#64748B' },
  { name: 'Obsidian', hex: '#0F172A' },
];

// Card Background Presets
BACKGROUND_COLORS: [
  { name: 'Pure White', hex: '#FFFFFF', isDark: false },
  { name: 'Cool Slate', hex: '#F8FAFC', isDark: false },
  { name: 'Warm Cream', hex: '#FAF8F5', isDark: false },
  { name: 'Obsidian Black', hex: '#0F172A', isDark: true },
  { name: 'Midnight Navy', hex: '#0B132B', isDark: true },
  { name: 'Deep Indigo', hex: '#1E1B4B', isDark: true },
  { name: 'Pure Black', hex: '#000000', isDark: true },
];
```

### 4.2 Typography Scale

Veya uses the platform system font with precise tracking and weight:

| Role                        | Font Size | Line Height | Weight            | Letter Spacing | Color Token           |
| :-------------------------- | :-------- | :---------- | :---------------- | :------------- | :-------------------- |
| **Display Brand**           | `32–36`   | `40`        | `'800'`           | `-1.0`         | `#111111`             |
| **Screen / Sheet Title**    | `20`      | `26`        | `'800'`           | `-0.5`         | `#0F172A`             |
| **Card Heading / Name**     | `18–20`   | `24`        | `'700'`           | `-0.3`         | `#111111`             |
| **Button / Primary Action** | `15`      | `20`        | `'600'` / `'700'` | `-0.2`         | `#FFFFFF`             |
| **Body / Input Text**       | `14–15`   | `20`        | `'500'`           | `0`            | `#111111`             |
| **Secondary / Subtitle**    | `12.5–13` | `18`        | `'400'` / `'500'` | `0`            | `#64748B` / `#6B6B6B` |
| **Section Header (Caps)**   | `11`      | `14`        | `'700'`           | `0.8`          | `#9CA3AF` (uppercase) |
| **Meta / Tag / Toast**      | `11–12`   | `16`        | `'600'`           | `0`            | `#9CA3AF` / `#FFFFFF` |

### 4.3 Spacing Grid & Border Radii

- **Spacing Grid**: Multiples of 4 and 8 pt:
  `4` (hairline spacing), `8` (icon gaps, tag padding), `12` (row gaps, inner card padding), `16` (standard content padding, field gaps), `20` (screen gutters, modal horizontal padding), `24` (section margins), `32` (screen bottom offsets).
- **Border Radii**:
  - `8`: Icon badges, small tags, drag handles (`borderRadius: 2`).
  - `10–12`: Action buttons (`AuthButton`), text input fields (`AuthInput`), photo change buttons.
  - `14`: Section groups (`SettingsTab`), save buttons in modal footers.
  - `16–22`: Modal card containers (`CardModal`), business card surfaces (`aspectRatio: 1.72`).
  - `20` / `9999`: Tab pills, circular avatar containers, floating action buttons.

### 4.4 Elevation & Shadows

Always use cross-platform elevation helpers via `Platform.select`:

```typescript
// Standard Card / Modal Shadow
const shadowStyles = {
  ...Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 18,
    },
    android: {
      elevation: 4,
    },
  }),
};

// Subtle Button Shadow
const buttonShadowStyles = {
  ...Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },
    android: {
      elevation: 3,
    },
  }),
};
```

### 4.5 Iconography

- **Standard Icon Set**: `@expo/vector-icons` (`Feather` family).
  - Common icons: `credit-card`, `settings`, `share-2`, `edit-2` / `edit-3`, `trash-2`, `camera`, `x`, `check`, `copy`, `external-link`, `chevron-right`.
  - Icon sizes: `16` (meta/inline), `18–20` (action buttons, row navigation), `22` (navigation tab bar).
- **Custom Branded Geometry**: Dedicated React Native SVG components in `app/components/icons/` (e.g. `QrScannerIcon.tsx`).

---

## 5. The 8 UX States Specification

Every meaningful screen, form, or interactive element must explicitly handle all 8 states:

```text
┌─────────────────────────────────────────────────────────────┐
│                    THE 8 UX STATES                         │
├──────────────┬──────────────────────────────────────────────┤
│ 1. Initial   │ Clean default presentation, empty or ready   │
│ 2. Loading   │ Centered ActivityIndicator or skeleton       │
│ 3. Success   │ Brief visual confirmation, toast, dismiss    │
│ 4. Empty     │ Icon + Title + Description + Primary CTA     │
│ 5. Error     │ Contextual banner / field error with retry   │
│ 6. Disabled  │ opacity: 0.55, pointerEvents: 'none'         │
│ 7. Submitting│ Inline spinner in button, block double-taps  │
│ 8. Offline   │ Non-blocking banner with manual retry action │
└──────────────┴──────────────────────────────────────────────┘
```

### 5.1 Initial State

- Clean, balanced visual hierarchy with all primary labels and interactive controls immediately discoverable.
- Form fields show legible placeholder text in `#9CA3AF`.

### 5.2 Loading State

- Never freeze the screen or leave a tap without visual feedback.
- Use an `ActivityIndicator` styled with `size="small"` and `color="#0F172A"` (or `#FFFFFF` on dark backgrounds).
- When loading an entire screen, center the indicator in a dedicated flex container with `accessible={true}` and `accessibilityLabel="Loading content"`.

### 5.3 Success State

- For transient actions (e.g. copying a link or saving an image), show an animated bottom toast or morphing icon:
  ```typescript
  // Copy Link Success Transition (as in CardModal.tsx)
  <View style={[styles.modalIconCircle, showCopyFeedback && styles.modalIconCircleSuccess]}>
    <Feather
      name={showCopyFeedback ? 'check' : 'copy'}
      size={20}
      color={showCopyFeedback ? '#10B981' : '#0F172A'}
    />
  </View>
  ```
- For form completions, execute a smooth downward slide dismissal of the modal.

### 5.4 Empty State

- Never show a blank, uninformative screen when data is missing (e.g. no cards created).
- Minimum structure:
  1. Subtle centered icon (size `48–64`, color `#CBD5E1`).
  2. Prominent title (`fontSize: 18`, `fontWeight: '700'`, color `#111111`).
  3. Explanatory subtitle (`fontSize: 14`, color `#64748B`, max width 280, center aligned).
  4. Primary actionable button (`"Create your first card"`).

### 5.5 Error State

- Field-level validation errors: Render immediately beneath the field with `#DC2626`, `fontSize: 12`, `fontWeight: '500'`.
- Screen-level or network errors: Render an alert banner or invoke a native `Alert.alert('Error', friendlyMessage)` with a `"Retry"` action.
- Never display raw stack traces, JSON payloads, or HTTP 500 codes to the user.

### 5.6 Disabled State

- Dim opacity to `0.55`.
- Set `disabled={true}` and `accessibilityState={{ disabled: true }}`.
- Remove elevation and shadows to visually flatten disabled buttons.

### 5.7 Submitting State

- Preserve button dimensions; replace button text with an inline `ActivityIndicator` (or display `loadingTitle || 'Please wait...'` alongside the spinner).
- Disable touch handling during submission to prevent double-submissions.

### 5.8 Offline / Network Failure State

- Display a top-of-screen non-intrusive warning pill or banner (`backgroundColor: '#FEF2F2'`, `borderColor: '#FEE2E2'`).
- Provide an explicit `"Tap to retry"` touchable.

---

## 6. Interaction & Motion Design

### 6.1 Touch Feedback Standards

- Use `TouchableOpacity` or `Pressable` for interactive elements.
- Set `activeOpacity={0.7}` for general buttons and `activeOpacity={0.85}` for prominent action buttons (`AuthButton`, `BottomNavBar` scanner).
- Never leave a touchable element without immediate visual opacity feedback.

### 6.2 Modal Bottom Sheets & Gesture Dismissal

For all modal bottom sheets (e.g. `EditCardModal.tsx`), adhere to this interaction pattern:

- Top drag handle indicator: `width: 38`, `height: 4`, `borderRadius: 2`, `backgroundColor: '#CBD5E1'`, wrapped in a hitSlop area.
- Implement `PanResponder` attached to an `Animated.Value(translateY)`:
  - Dismiss when downward drag exceeds threshold (`gestureState.dy > 120` or velocity `vy > 0.5`).
  - Spring back to `0` when released below threshold.
- Synchronize backdrop opacity interpolation:
  ```typescript
  const backdropOpacity = translateY.interpolate({
    inputRange: [0, 500],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  ```
- Tap outside sheet on the overlay (`backdropDismissArea`) must dismiss the modal immediately.

### 6.3 Keyboard Handling & Input Focus

- Wrap form sheets in `KeyboardAvoidingView` with `behavior={Platform.OS === 'ios' ? 'padding' : undefined}`.
- Set `keyboardShouldPersistTaps="handled"` on all enclosing `ScrollView` instances so taps on buttons or outside inputs register immediately without requiring a preliminary tap to dismiss the keyboard.
- Set `autoCapitalize="none"`, `autoCorrect={false}`, and proper `keyboardType` (`email-address`, `phone-pad`) on inputs.

### 6.4 Destructive Actions & Confirmation Flows

- All irreversible actions (e.g. deleting an account or card) must follow the **Two-Tier Warning Pattern**:
  1. **Visual Tier**: Distinct danger styling (background `#FEF2F2`, border `#FEE2E2`, text `#DC2626`).
  2. **Confirmation Tier**: Native `Alert.alert` with explicit explanation of data loss and a button marked with `style: 'destructive'`.
- Never perform destructive mutations on a single tap.

### 6.5 Animation Timing & Performance

- Standard transitions: `150ms` (fade in/out), `250ms–300ms` (sheet slide up/down).
- **Native Driver Requirement**: Always specify `useNativeDriver: true` for all `opacity` and `transform` (`translateY`, `scale`) animations.
- Prohibit ornamental, slow, or looping animations that block user interaction.

---

## 7. Accessibility Requirements (UI Perspective)

Every UI element must satisfy the following accessibility invariants:

### 7.1 Minimum Touch Targets

- All interactive controls (buttons, icon taps, close icons, tab items) must be at least **44 × 44 dp** in physical dimension.
- If the visual icon is smaller (e.g. 18 × 18 pt close icon), expand the hit target using `hitSlop`:
  ```typescript
  <TouchableOpacity
    onPress={onClose}
    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    accessibilityRole="button"
    accessibilityLabel="Close modal"
  >
    <Feather name="x" size={18} color="#0F172A" />
  </TouchableOpacity>
  ```

### 7.2 Accessibility Attributes

- **Icon-Only Buttons**: Must have an explicit, concise `accessibilityLabel` (e.g. `"Edit digital card"`, `"Share digital card"`, `"Close modal"`).
- **Accessibility Roles**: Explicitly set `accessibilityRole="button"`, `accessibilityRole="header"`, or `accessibilityRole="link"`.
- **Accessibility States**: Reflect dynamic state with `accessibilityState={{ disabled: isDisabled, busy: isLoading }}`.

### 7.3 Contrast & Readability

- Primary text on light surfaces must use `#111111` or `#0F172A` (ratio > 10:1).
- Secondary text must use `#64748B` or `#6B6B6B` (ratio > 4.5:1 against `#FFFFFF`).
- Avoid low-contrast text such as `#D1D5DB` on white backgrounds for any readable content.

---

## 8. Responsive Design & Multi-Device Adaptation

### 8.1 Safe Area Architecture

- Never hardcode fixed status bar or home indicator paddings (e.g. `paddingTop: 44` or `paddingBottom: 34`).
- Use `SafeAreaView` from `react-native-safe-area-context` at screen boundaries.
- For bottom navigation bars and floating footers, read insets dynamically:
  ```typescript
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12);
  ```

### 8.2 Dimension & Layout Invariants

- Ban hardcoded device widths (e.g. `width: 375`).
- Use percentage widths, `flex: 1`, or capped max-widths:
  ```typescript
  cardWrapper: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    aspectRatio: 1.72, // Fixed business card aspect ratio
    marginVertical: 12,
  }
  ```
- Support text scaling: Ensure text containers never have rigid fixed heights that clip wrapped text. Use `numberOfLines={1}` and `ellipsizeMode="tail"` when single-line truncation is intentional.

### 8.3 Platform-Specific Layout Adaptations

- **iOS**: Soft blurred backdrops, smooth modal slide transitions, standard keyboard avoiding padding.
- **Android**: Material elevation via `elevation: 4`, hardware back button handling via `BackHandler` or `onRequestClose` in `Modal`.

---

## 9. Performance & Styling Guardrails

- **No CSS Libraries**: Do NOT install or use Tailwind CSS, NativeWind, styled-components, or Tamagui. Veya exclusively uses React Native's standard `StyleSheet.create`.
- **Pure StyleSheet Objects**: Keep styles outside component render functions to prevent object reallocation on every render cycle.
- **Heavy Assets**: Never bundle oversized raw bitmap images. Avatars and logos must be loaded via cached remote URLs or optimized vectors.
- **Shadow Cost**: Avoid combining multiple heavy shadow layers with complex border radii on deeply nested views. Rely on clean, single-layer elevation.

---

## 10. UI Design Verification Checklist

Before considering any UI design task complete, audit every item on this checklist:

- [ ] **Token Adherence**: All colors, typography sizes, spacing, and radii match the design tokens in Section 4. Zero arbitrary hex colors or margins.
- [ ] **Component Reuse**: Checked `app/components/` and existing features before authoring new UI.
- [ ] **8 UX States**: The screen or component handles Initial, Loading, Success, Empty, Error, Disabled, Submitting, and Offline states appropriately.
- [ ] **Touch Target Size**: Every interactive control is at least 44 × 44 dp (via dimensions or `hitSlop`).
- [ ] **Touch Feedback**: Every pressable element provides active opacity feedback (`activeOpacity={0.7}` or `0.85`).
- [ ] **Safe Areas**: Verified with `useSafeAreaInsets()` or `SafeAreaView`; no overlapping with the notch, dynamic island, or home bar.
- [ ] **Keyboard Ergonomics**: Form screens wrap with `KeyboardAvoidingView` and `keyboardShouldPersistTaps="handled"`.
- [ ] **Accessibility**: All icon buttons have `accessibilityLabel`; buttons set `accessibilityRole="button"`; disabled state is reflected in `accessibilityState`.
- [ ] **Cross-Platform**: Tested on both iOS and Android styling rules (`Platform.select` used for elevation/shadows).
- [ ] **Native Driver**: All animations specify `useNativeDriver: true`.
- [ ] **Path Portability**: No machine-specific paths (e.g. `file:///`, `C:\`, `f:\`) exist in documentation or comments.
- [ ] **Zero Unrelated Edits**: Did not modify general frontend state logic, database schemas, or unrelated skills.
