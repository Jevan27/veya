---
name: frontend-development
description: >-
  Architectural and development conventions for the Veya mobile app.
  Use when building or modifying React Native screens, components, custom hooks,
  Expo Router navigation, context providers, API client integration, forms, and token storage.
---

# Frontend Development Skill for Veya

This skill defines the technical standards, component architecture, state management rules, API integration practices, and mobile engineering workflows for Veya's mobile application (`app/`), built with React Native 0.86, Expo 57, Expo Router, and TypeScript.

This skill is **exclusively responsible for application/frontend implementation**.

---

## 1. Core Architecture & Data Flow

Mobile frontend code in `app/` strictly separates presentation, state coordination, and data fetching. UI components must never own backend business logic or issue unmediated network requests.

### The 5-Layer Data Flow:

```text
Screen (app/app/)
   ↓
Feature Component / Custom Hook (app/features/<feature>/)
   ↓
Feature API Service (app/services/api/<feature>.api.ts)
   ↓
API Client (app/services/api/client.ts)
   ↓
Backend REST API (/api/v1)
```

### Layer Responsibilities:

1. **Screen (`app/app/`)**: High-level page routing, authentication guards, safe area wrappers, and delegating rendering to feature components.
2. **Feature Components (`app/features/<feature>/components/`)**: Pure or controlled UI presentation. Receives state via props or feature hooks; renders buttons, cards, and inputs.
3. **Feature Hooks (`app/features/<feature>/hooks/`)**: Owns local form state, input validation, media pickers, and orchestrates calls to feature API services.
4. **Feature API Services (`app/services/api/`)**: Strongly typed endpoint wrappers (e.g. `cardsApi.getCards()`, `usersApi.updateProfile()`).
5. **API Client (`app/services/api/client.ts`)**: Central HTTP dispatcher providing LAN host discovery, Bearer token injection, token refresh queuing, and error normalization.

---

## 2. When to Use & Skill Boundaries

### Activate this skill when:

- Adding or modifying screens in `app/app/` using Expo Router.
- Creating or editing components inside `app/features/<feature>/components/`.
- Building custom hooks in `app/features/<feature>/hooks/` or `app/hooks/`.
- Integrating REST API endpoints via `app/services/api/`.
- Managing authentication state, secure storage, and user session lifecycles.
- Building interactive forms, validation schemas, or camera/media picker integrations.

### Cross-Skill Boundaries:

- **Visual Styling & UI Tokens (`frontend-development + ui-design`)**:
  When authoring new UI layouts, theme colors, button designs, typography hierarchies, card aesthetics, or animations, coordinate with `ui-design`. Defer design token definitions to `ui-design`.
- **Automated Testing (`frontend-development + testing`)**:
  When writing component unit tests, hook tests, or mocking the API client with Jest, coordinate with `testing`. Defer test runner conventions to `testing`.
- **Web Application Boundary (Rule #29 of `AGENTS.md`)**:
  `frontend/` is strictly reserved for the future Next.js web application. **NEVER** add or modify files in `frontend/`. All active mobile code lives in `app/`.

---

## 3. Pre-Implementation Inspection Protocol

Before writing or updating mobile code, execute this inspection sequence:

1. **Locate the Target Feature**:
   - Cards domain: `app/features/cards/` (`components/`, `hooks/`, `types/`, `utils/`)
   - Authentication domain: `app/features/auth/` (`components/`, `context/`, `hooks/`)
   - Scanner domain: `app/features/scanner/` (`components/QuickScanModal.tsx`)
   - Settings domain: `app/features/settings/` (`components/SettingsTab.tsx`)
   - Onboarding domain: `app/features/onboarding/` (`components/`, `context/`)
2. **Inspect Shared Contracts**:
   - Inspect `packages/shared/src/` (`CardDto`, `CreateCardDto`, `UpdateCardDto`, `UserDto`, auth types). Never declare duplicate DTO interfaces in `app/`.
3. **Inspect API Layer**:
   - Check `app/services/api/` to see if an API method already exists before authoring a new one.
4. **Inspect Secure Storage**:
   - Check `app/services/storage/token.storage.ts` for established token lifecycle methods.
5. **Inspect Package Dependencies**:
   - Check `app/package.json` to verify installed Expo modules before proposing new libraries.

---

## 4. State Management Hierarchy

Avoid unnecessary global state. Manage state at the lowest appropriate layer using this hierarchy:

| State Tier               | Purpose & Scope                                                                       | Implementation Pattern                                                                                                      |
| :----------------------- | :------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------- |
| **Local State**          | Transient component-only UI (e.g. modal visibility, active accordion, dropdown open). | `useState` or `useReducer` inside the component.                                                                            |
| **Form State**           | Controlled inputs, draft values, dirty states, validation errors.                     | Encapsulated in custom feature hooks (e.g. `useCardForm`). Sync on modal open; isolate drafts from server entities.         |
| **Derived State**        | Values computed purely from existing props or state (e.g. initials, filtered cards).  | Compute inline during render or wrap in `useMemo`. **NEVER** duplicate derived state into separate `useState`.              |
| **Feature State**        | State shared across multiple components within a single feature.                      | Feature-level hooks or scoped feature context (e.g. `OnboardingContext`).                                                   |
| **Global Session State** | Authenticated user profile, token status, login/logout transitions.                   | `AuthContext` only (`useAuth()`). Keep global state minimal.                                                                |
| **Server State**         | Business entities fetched from backend (cards list, current user).                    | Fetch through feature API services. Keep server state single-source; update via re-fetch or optimistic updates on mutation. |

---

## 5. API Integration & Lifecycle Handling

All network communication must route through `app/services/api/` using `apiClient<T>()`.

### 5.1 Comprehensive Lifecycle States

Every screen or feature component that communicates with the API must explicitly handle these states:

1. **Loading State**:
   - Render clear visual feedback: `ActivityIndicator`, skeleton loader, or disabled button state with a spinner.
   - Never leave users wondering if a tap registered.
2. **Success State**:
   - Update local/server state immediately.
   - Dismiss modals or trigger navigation transitions.
   - Display a lightweight confirmation message or toast where appropriate.
3. **Empty State**:
   - Render dedicated empty state illustrations and instructional copy when collection is empty (e.g. zero cards).
   - Always include an actionable button (e.g. "Create your first card").
4. **Validation Error (`400 Bad Request`)**:
   - Parse backend validation errors (handling both string messages and array formats `data.message[0]`).
   - Display error text inline below the invalid input field.
5. **Unauthorized (`401 Unauthorized`)**:
   - Automatically intercepted by `apiClient`.
   - Queues concurrent requests and calls `refreshAuthTokens()`.
   - If token refresh succeeds, retries original requests transparently.
   - If token refresh fails, clears `TokenStorage` and redirects to `/(auth)/login`.
6. **Forbidden (`403 Forbidden`)**:
   - Display an alert or banner explaining insufficient permissions without crashing.
7. **Network Failure (`statusCode: 0`)**:
   - Catch connection failures (e.g., unreachable LAN IP on physical devices running Expo Go).
   - Display a user-friendly error banner with a "Retry" button.
8. **Retry Mechanism**:
   - Provide user-triggered re-fetch mechanisms on failed loads rather than failing silently.

### 5.2 Canonical Feature API Service Example:

```typescript
import { apiClient } from './client';
import { CardDto, CreateCardDto, UpdateCardDto } from '@veya/shared';

export const cardsApi = {
  getCards: () => apiClient<CardDto[]>('/cards'),
  getCardById: (id: string) => apiClient<CardDto>(`/cards/${id}`),
  createCard: (dto: CreateCardDto) =>
    apiClient<CardDto>('/cards', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
  updateCard: (id: string, dto: UpdateCardDto) =>
    apiClient<CardDto>(`/cards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),
  deleteCard: (id: string) =>
    apiClient<void>(`/cards/${id}`, {
      method: 'DELETE',
    }),
};
```

---

## 6. Authentication & Secure Token Storage

Authentication security is non-negotiable across mobile environments.

- **Storage Abstraction**: All access and refresh tokens must be managed through `TokenStorage` (`app/services/storage/token.storage.ts`).
- **Keychain Security**: Uses `expo-secure-store` with `KeychainAccessibility.AFTER_FIRST_UNLOCK` to ensure tokens are encrypted on iOS/Android hardware keychains.
- **Prohibition**: **NEVER** store JWT access tokens, refresh tokens, or passwords in plain `AsyncStorage` or unencrypted local files.
- **Session Cleanup**: On logout or unrecoverable session expiry, call `TokenStorage.clearTokens()` before redirecting.

---

## 7. Navigation & Route Protection (Expo Router)

The application uses file-based routing inside `app/app/`.

### 7.1 Route Architecture

- **Root Layout (`app/app/_layout.tsx`)**: Sets up `SafeAreaProvider`, `AuthProvider`, status bar styling, and the root `Stack`.
- **Public / Unauthenticated Group (`app/app/(auth)/`)**: `login.tsx`, `signup.tsx`, `forgot-password.tsx`.
- **Onboarding Wizard Group (`app/app/(onboarding)/`)**: Multi-step setup screens with linear progression.
- **Authenticated Root (`app/app/index.tsx`)**: Tab orchestrator hosting `CardsTab`, `SettingsTab`, and `QuickScanModal`.

### 7.2 Navigation Loop Prevention

- **Redirects**: Always use `router.replace()` for authentication redirects to prevent users from navigating backward into logged-out or splash screens:
  ```typescript
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/login');
    } else if (!isLoading && isAuthenticated && user && !user.onboardingCompleted) {
      router.replace('/(onboarding)/welcome');
    }
  }, [isLoading, isAuthenticated, user, router]);
  ```
- **Forward Pushes**: Use `router.push()` only for nested child screens where the user explicitly expects the hardware or header back button to return to the parent.

---

## 8. Form Engineering Standards

Forms must be resilient, user-friendly, and protected against double-submits.

### 8.1 Form Standards & Lifecycle

- **Validation**: Validate inputs client-side before dispatching API requests to mirror backend DTO validation (e.g. required name, email syntax, phone format).
- **Submission Guarding**: Always maintain an `isSubmitting` / `isSaving` boolean state. Disable submit buttons and display an `ActivityIndicator` while an async operation is pending.
- **Double-Tap Protection**: Prevent double-tap race conditions by disabling the submission trigger immediately upon initial press.
- **Keyboard Handling**:
  - Always wrap scrollable forms in `KeyboardAvoidingView` with platform-specific behavior:
    ```typescript
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* Form content */}
      </ScrollView>
    </KeyboardAvoidingView>
    ```
- **Unsaved Changes**: Track dirty form state. When closing an editing modal with unsaved modifications, confirm dismissal or reset form fields cleanly to avoid stale drafts.
- **Reset Behavior**: Reset form fields to server values on cancellation.

---

## 9. Performance & Optimization

Do not optimize prematurely, but strictly adhere to these mobile rendering practices:

- **List Virtualization (`FlatList`)**:
  - Never render unbounded collections using `.map()` inside a plain `ScrollView`. Use `FlatList`.
  - Always supply a unique `keyExtractor={(item) => item.id}`.
  - Tune performance properties for large lists:
    ```typescript
    <FlatList
      data={cards}
      keyExtractor={(item) => item.id}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={Platform.OS === 'android'}
      renderItem={renderCardItem}
    />
    ```
- **Component Memoization**:
  - Wrap pure list item components (e.g. `VeyaCard`) in `React.memo` to prevent re-renders when parent scroll or unrelated state changes.
  - Wrap callback handlers passed to memoized children in `useCallback`.
- **Image Optimization**:
  - Enforce max 5 MB upload limits before uploading images to Cloudflare R2 (`fileSize <= 5 * 1024 * 1024`).
  - Resize/crop images on the device before upload using `expo-image-picker` (`allowsEditing: true`, `quality: 0.8`).
- **Animations**:
  - Always configure `useNativeDriver: true` when using the React Native `Animated` API to execute animations on the UI thread.

---

## 10. Accessibility Standards

Every user-facing screen must support basic accessibility:

- **Touch Targets**: All interactive elements (buttons, icons, chips) must have a minimum touch target of **44 × 44 dp**.
- **Accessibility Labels**:
  - Mandatory `accessibilityLabel` on all icon-only buttons (e.g. QR scan button, close modal button):
    ```typescript
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Scan QR Code"
      accessibilityHint="Opens camera to scan a business card"
      onPress={onOpenScanner}
    >
      <QrScannerIcon />
    </TouchableOpacity>
    ```
- **Accessibility Roles**: Specify `accessibilityRole="button"`, `accessibilityRole="header"`, or `accessibilityRole="link"`.
- **Accessibility States**: Use `accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}`.
- **Dynamic Text Support**: Never fix text container heights with strict pixel limits without handling overflow. Use `numberOfLines` and `ellipsizeMode="tail"` when truncation is intentional.

---

## 11. Platform Adaptations (iOS, Android & Physical Devices)

Always account for operating system quirks and deployment targets:

- **Safe Area Insets**:
  - Use `SafeAreaView` from `react-native-safe-area-context` with explicit edge configurations:
    ```typescript
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
    ```
  - For custom headers or bottom bars, consume `useSafeAreaInsets()`.
- **Shadows vs. Elevation**:
  - iOS uses shadow properties; Android uses `elevation`. Standardize via `Platform.select`:
    ```typescript
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
    ```
- **Physical Devices & LAN Host Discovery**:
  - Physical phones running Expo Go cannot connect to `http://localhost:3000`.
  - `getBaseApiUrl()` in `app/services/api/client.ts` automatically discovers the host workstation LAN IP via `Constants.expoConfig?.hostUri`.
  - Ensure local network permission is granted on iOS.
- **Hardware Permissions**:
  - Always verify permission status before invoking camera (`expo-camera`) or photo library (`expo-image-picker`):
    ```typescript
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Access to your photo library is needed.');
      return;
    }
    ```

---

## 12. Verification Protocol

Before completing any frontend task, verify the application using the following commands:

### 1. App Typecheck:

```bash
pnpm --filter @veya/app typecheck
```

### 2. App Linting:

```bash
pnpm --filter @veya/app lint
```

### 3. Code Formatting Check:

```bash
pnpm format:check
```

### 4. Monorepo Shared Package Build (if shared types were modified):

```bash
pnpm --filter @veya/shared build
```

Never claim a verification step passed without executing it and observing an exit code of 0.
