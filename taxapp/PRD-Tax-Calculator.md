**# TaxClarity — Complete Product Specification**

**## Indian Income Tax Calculator FY 2025-26**



**> \*\*Purpose of this document:\*\* A complete, authoritative spec of the working app.**

**> Detailed enough that an LLM IDE can regenerate the identical product from scratch.**

**> Every text string, Tailwind class, layout dimension, color, font size, validation rule,**

**> and conditional logic is documented verbatim from the actual source code.**



**---**



**## 1. Overview**



**\*\*What it is:\*\* A single-page web app for salaried Indians to compare old vs new tax regime, find which saves more money, and see TDS refund/payable status for FY 2025-26.**



**\*\*Target user:\*\* Salaried employee (not freelancer, not business). Non-CA. Wants a clear answer in plain English.**



**\*\*Core output:\*\* "You should pick \[New/Old] Regime. You save ₹X. Your total tax is ₹Y."**



**\*\*Constraints:\*\***

**- No backend. All logic runs client-side.**

**- No login, no data storage, no cookies.**

**- No routing library — single page, JS-controlled step visibility.**

**- Does NOT handle: surcharge, capital gains, rental income, freelance income.**



**---**



**## 2. Tech Stack**



**| Layer | Choice | Version |**

**|---|---|---|**

**| Framework | React (via Vite) | React 18.3.1 / Vite 6.0.5 |**

**| Styling | Tailwind CSS | 3.4.17 |**

**| Font | Inter (Google Fonts) | 400, 500, 600, 700 |**

**| State | React `useState` only | — |**

**| Build | Vite + @vitejs/plugin-react 4.3.4 | — |**

**| PostCSS | autoprefixer 10.4.20 + postcss 8.4.49 | — |**

**| Routing | None — `step` integer in App state | — |**

**| Language | JSX (no TypeScript) | — |**



**---**



**## 3. Configuration Files**



**### `package.json`**

**```json**

**{**

&#x20; **"name": "indian-tax-calculator",**

&#x20; **"private": true,**

&#x20; **"version": "0.0.0",**

&#x20; **"type": "module",**

&#x20; **"scripts": {**

&#x20;   **"dev": "vite",**

&#x20;   **"build": "vite build",**

&#x20;   **"preview": "vite preview"**

&#x20; **},**

&#x20; **"dependencies": {**

&#x20;   **"react": "^18.3.1",**

&#x20;   **"react-dom": "^18.3.1"**

&#x20; **},**

&#x20; **"devDependencies": {**

&#x20;   **"@types/react": "^18.3.1",**

&#x20;   **"@types/react-dom": "^18.3.1",**

&#x20;   **"@vitejs/plugin-react": "^4.3.4",**

&#x20;   **"autoprefixer": "^10.4.20",**

&#x20;   **"postcss": "^8.4.49",**

&#x20;   **"tailwindcss": "^3.4.17",**

&#x20;   **"vite": "^6.0.5"**

&#x20; **}**

**}**

**```**



**### `vite.config.js`**

**```js**

**import { defineConfig } from 'vite'**

**import react from '@vitejs/plugin-react'**



**export default defineConfig({**

&#x20; **plugins: \[react()],**

&#x20; **server: {**

&#x20;   **allowedHosts: true,    // for Cloudflare tunnel proxying**

&#x20; **},**

**})**

**```**



**### `tailwind.config.js`**

**```js**

**export default {**

&#x20; **content: \["./index.html", "./src/\*\*/\*.{js,ts,jsx,tsx}"],**

&#x20; **theme: {**

&#x20;   **extend: {**

&#x20;     **fontFamily: {**

&#x20;       **sans: \['Inter', 'system-ui', 'sans-serif'],**

&#x20;     **},**

&#x20;   **},**

&#x20; **},**

&#x20; **plugins: \[],**

**}**

**```**



**### `postcss.config.js`**

**```js**

**export default {**

&#x20; **plugins: {**

&#x20;   **tailwindcss: {},**

&#x20;   **autoprefixer: {},**

&#x20; **},**

**}**

**```**



**### `index.html`**

**```html**

**<!doctype html>**

**<html lang="en">**

&#x20; **<head>**

&#x20;   **<meta charset="UTF-8" />**

&#x20;   **<link rel="icon" type="image/svg+xml" href="/favicon.svg" />**

&#x20;   **<meta name="viewport" content="width=device-width, initial-scale=1.0" />**

&#x20;   **<meta name="description" content="Calculate your Indian income tax for FY 2025-26. Compare old and new regime. Find out which saves you more money." />**

&#x20;   **<title>Indian Tax Calculator — FY 2025-26</title>**

&#x20;   **<link rel="preconnect" href="https://fonts.googleapis.com" />**

&#x20;   **<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />**

&#x20;   **<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700\&display=swap" rel="stylesheet" />**

&#x20; **</head>**

&#x20; **<body>**

&#x20;   **<div id="root"></div>**

&#x20;   **<script type="module" src="/src/main.jsx"></script>**

&#x20; **</body>**

**</html>**

**```**



**### `src/index.css`**

**```css**

**@tailwind base;**

**@tailwind components;**

**@tailwind utilities;**



**@layer base {**

&#x20; **body {**

&#x20;   **@apply bg-slate-50 text-gray-900 antialiased;**

&#x20;   **font-feature-settings: 'kern' 1, 'liga' 1;**

&#x20; **}**

&#x20; **\* {**

&#x20;   **@apply transition-colors duration-150;**

&#x20; **}**

&#x20; **input\[type="text"],**

&#x20; **input\[type="number"] {**

&#x20;   **@apply transition-shadow duration-150;**

&#x20; **}**

&#x20; **input\[type="text"]:focus,**

&#x20; **input\[type="number"]:focus {**

&#x20;   **@apply ring-2 ring-indigo-500/20 ring-offset-0;**

&#x20; **}**

**}**



**@layer components {**

&#x20; **.card-enter {**

&#x20;   **animation: cardEnter 0.2s ease-out forwards;**

&#x20; **}**

&#x20; **@keyframes cardEnter {**

&#x20;   **from { opacity: 0; transform: translateY(6px); }**

&#x20;   **to   { opacity: 1; transform: translateY(0); }**

&#x20; **}**

&#x20; **.reveal {**

&#x20;   **animation: reveal 0.18s ease-out forwards;**

&#x20; **}**

&#x20; **@keyframes reveal {**

&#x20;   **from { opacity: 0; transform: translateY(-4px); }**

&#x20;   **to   { opacity: 1; transform: translateY(0); }**

&#x20; **}**

**}**

**```**



**### `src/main.jsx`**

**```jsx**

**import { StrictMode } from 'react'**

**import { createRoot } from 'react-dom/client'**

**import './index.css'**

**import App from './App.jsx'**



**createRoot(document.getElementById('root')).render(**

&#x20; **<StrictMode>**

&#x20;   **<App />**

&#x20; **</StrictMode>,**

**)**

**```**



**---**



**## 4. Complete File Structure**



**```**

**TaxCalculator/**

**├── index.html**

**├── package.json**

**├── vite.config.js**

**├── tailwind.config.js**

**├── postcss.config.js**

**└── src/**

&#x20;   **├── main.jsx**

&#x20;   **├── App.jsx**

&#x20;   **├── taxEngine.js**

&#x20;   **├── constants.js**

&#x20;   **├── utils.js**

&#x20;   **├── index.css**

&#x20;   **└── components/**

&#x20;       **├── ProgressBar.jsx**

&#x20;       **├── StepWrapper.jsx**

&#x20;       **├── TaxPreviewPanel.jsx**

&#x20;       **├── CommonQuestions.jsx**

&#x20;       **├── NumberInput.jsx**

&#x20;       **├── FrequencyInput.jsx**

&#x20;       **├── ConfusedLink.jsx**

&#x20;       **├── steps/**

&#x20;       **│   ├── S01\_Landing.jsx**

&#x20;       **│   ├── S02\_FinancialYear.jsx**

&#x20;       **│   ├── S03\_AgeGroup.jsx**

&#x20;       **│   ├── S04\_SalaryDetails.jsx**

&#x20;       **│   ├── S05\_SalaryComponents.jsx**

&#x20;       **│   ├── S06\_OtherIncome.jsx**

&#x20;       **│   ├── S07\_PaysRent.jsx**

&#x20;       **│   ├── S08\_RentDetails.jsx**

&#x20;       **│   ├── S09\_TaxSavingInvestments.jsx**

&#x20;       **│   ├── S10\_HealthInsurance.jsx**

&#x20;       **│   ├── S11\_HomeLoan.jsx**

&#x20;       **│   ├── S12\_TDS.jsx**

&#x20;       **│   ├── S13\_Calculating.jsx**

&#x20;       **│   └── S14\_Results.jsx**

&#x20;       **└── results/**

&#x20;           **├── SectionA\_Verdict.jsx**

&#x20;           **├── SectionB\_TaxSummary.jsx**

&#x20;           **├── SectionC\_DetailedBreakdown.jsx**

&#x20;           **├── SectionD\_Education.jsx**

&#x20;           **└── SectionE\_NextSteps.jsx**

**```**



**---**



**## 5. Design System (Exact Tailwind Classes)**



**### Colors**

**| Purpose | Tailwind Classes |**

**|---|---|**

**| Primary accent | `indigo-600` (buttons, active states, progress dots, accents) |**

**| Secondary accent | `purple-600` (gradient CTAs: `from-indigo-600 to-purple-600`) |**

**| Page background | `bg-\[#FAFAFA]` (StepWrapper, Landing, Results) |**

**| App wrapper bg | `bg-gray-50` (App.jsx `min-h-screen`) |**

**| Form card | `bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7` |**

**| Preview panel | `bg-white rounded-2xl border border-gray-100 shadow-md shadow-gray-100` |**

**| Winner/positive | `green-500` / `green-600` / `green-50` backgrounds |**

**| Valid input state | `border-green-300 bg-green-50/30` with green checkmark SVG |**

**| Deduction amounts | `text-green-600` or `text-green-700` with `−` prefix |**

**| Old-regime-only (dimmed) | `text-gray-300`, shows `——` string |**

**| Error messages | `text-red-600`, `role="alert"` |**

**| Warning/note boxes | `bg-amber-50 border border-amber-200 text-amber-700` or `text-amber-800` |**

**| Info boxes | `bg-blue-50 border border-blue-100 text-blue-700` or `text-blue-800` |**

**| Sticky nav | `bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm` |**

**| Trust badge | `text-green-500` shield icon + `text-gray-600`/`text-gray-400` text |**



**### Typography**

**| Element | Classes |**

**|---|---|**

**| Section label above heading | `text-xs font-medium text-indigo-600 uppercase tracking-wide` |**

**| Page headings (step titles) | `text-xl font-bold text-gray-900 leading-tight` |**

**| Body descriptions | `text-sm text-gray-500` |**

**| Input labels | `text-sm font-medium text-gray-700` |**

**| Helper text / hints | `text-xs text-gray-500` or `text-xs text-gray-400` |**

**| Table/breakdown rows | `text-xs` or `text-\[11px]` |**

**| Primary CTA buttons | `text-sm font-bold` |**

**| Landing hero headline | `text-4xl sm:text-5xl font-extrabold text-gray-900 leading-\[1.1] tracking-tight` |**

**| Landing hero description | `text-base sm:text-lg text-gray-500 leading-relaxed` |**

**| Landing feature section title | `text-2xl sm:text-3xl font-bold text-gray-900` |**

**| Nav brand | `text-sm font-bold text-gray-900 tracking-tight leading-none` |**

**| Nav subtitle | `text-\[10px] text-gray-400 leading-none` |**

**| Step icon badge emoji | Emoji inside `w-6 h-6 rounded-lg bg-indigo-100` container |**



**### Button Styles**

**| Type | Classes |**

**|---|---|**

**| Primary CTA (gradient) | `w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2` |**

**| Landing hero CTA | `bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3.5 px-7 rounded-2xl text-sm transition-colors shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2` |**

**| S12 TDS CTA (green gradient) | `w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2` |**

**| Selected toggle | `border-indigo-600 bg-indigo-50 text-indigo-700` |**

**| Unselected toggle | `border-gray-200 bg-white text-gray-700 hover:border-gray-300` |**

**| Yes/No selected (InsuranceCard) | `border-indigo-600 bg-indigo-600 text-white` |**

**| Start Over (ghost) | `text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors border border-gray-300 rounded-xl px-5 py-2 hover:bg-gray-100` |**

**| Back button (pill) | `flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors shrink-0` |**



**### Spacing Pattern**

**| Element | Value |**

**|---|---|**

**| Top-level step stack | `space-y-4` |**

**| CTA button padding | `py-3` |**

**| Number inputs | `py-2.5` |**

**| Card labels/checklist items | `p-3` |**

**| Sub-sections | `space-y-3` |**

**| StepWrapper content padding | `py-6` |**

**| Form card padding | `p-5 sm:p-7` |**



**### Two-Column Layout (StepWrapper — steps 2-12)**

**```**

**min-h-screen bg-\[#FAFAFA] flex flex-col**

**├── sticky top-0 z-10 nav bar (always shown)**

**│   ├── Logo (TaxClarity + "India Tax Calculator" subtitle)**

**│   ├── Back pill button (when canGoBack)**

**│   ├── Dot-based ProgressBar (when showProgress)**

**│   └── Trust badge "100% Private" (hidden md:flex)**

**├── flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6**

**│   └── grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8**

**│       ├── main lg:col-span-7 → white card (bg-white rounded-2xl border shadow-sm p-5 sm:p-7)**

**│       │   └── {children}**

**│       └── div hidden lg:block lg:col-span-5 → sticky top-20 TaxPreviewPanel**

**└── footer text-xs text-center text-gray-300**

**```**



**### Two-Column Layout (S14 Results)**

**```**

**min-h-screen bg-\[#FAFAFA] flex flex-col**

**├── sticky top-0 z-10 nav bar ("Your Tax Result" + "FY 2025-26" badge)**

**└── flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-4**

&#x20;   **└── grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8**

&#x20;       **├── lg:col-span-7 space-y-4 ← verdict, next steps, education, disclaimer, start over**

&#x20;       **└── lg:col-span-5 sticky top-16 space-y-4 ← tax summary, detailed breakdown, trust strip**

**```**



**### Custom Radio Button Style**

**```**

**Container: p-4 rounded-xl border-2 cursor-pointer transition-all**

**Selected: border-indigo-600 bg-indigo-50**

**Unselected: border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50**

**Radio circle: w-5 h-5 rounded-full border-2**

&#x20; **Selected: border-indigo-600 bg-indigo-600 with w-2 h-2 rounded-full bg-white center dot**

&#x20; **Unselected: border-gray-300 bg-white**

**```**



**### Custom Checkbox Style**

**```**

**Container: rounded-xl border-2 overflow-hidden transition-all**

**Selected: border-indigo-600, label bg-indigo-50**

**Unselected: border-gray-200, label bg-white hover:bg-gray-50**

**Checkbox: w-5 h-5 rounded border-2**

&#x20; **Selected: border-indigo-600 bg-indigo-600 with white checkmark SVG (w-3 h-3)**

&#x20; **Unselected: border-gray-300 bg-white**

**```**



**---**



**## 6. Global State (`App.jsx`)**



**### INITIAL\_STATE (exported constant)**

**```js**

**export const INITIAL\_STATE = {**

&#x20; **fy: '2025-26',**

&#x20; **ageGroup: null,              // 'below60' | 'senior' | 'superSenior'**

&#x20; **basicSalaryMonthly: '',**

&#x20; **takeHomeSalaryMonthly: '',**

&#x20; **hasBonus: null,              // boolean | null**

&#x20; **bonus: '',                   // annual figure (FrequencyInput handles conversion)**

&#x20; **hasHRA: false,**

&#x20; **hraMonthly: '',**

&#x20; **hasProfTax: false,**

&#x20; **professionalTax: '',         // annual, capped at 2500 in engine**

&#x20; **hasEmployerNPS: false,**

&#x20; **employerNPS: '',             // annual, capped at 14% of basic in engine**

&#x20; **hasOtherIncome: null,        // boolean | null**

&#x20; **fdInterest: '',**

&#x20; **savingsInterest: '',**

&#x20; **paysRent: null,              // boolean | null**

&#x20; **monthlyRent: '',**

&#x20; **cityType: null,              // 'metro' | 'nonMetro'**

&#x20; **hasHRAInSalary: null,        // boolean | null**

&#x20; **investments80C: {**

&#x20;   **epf: '',**

&#x20;   **lic: '',**

&#x20;   **ppf: '',**

&#x20;   **elss: '',**

&#x20;   **tuition: '',**

&#x20;   **homeLoanPrincipal: '',**

&#x20;   **nsc: '',**

&#x20; **},**

&#x20; **has80CItems: \[],             // array of selected 80C keys e.g. \['epf', 'ppf']**

&#x20; **hasPersonalNPS: null,        // boolean | null**

&#x20; **personalNPS: '',             // annual**

&#x20; **hasSelfInsurance: null,      // boolean | null**

&#x20; **selfInsurancePremium: '',    // annual**

&#x20; **hasParentInsurance: null,    // boolean | null**

&#x20; **parentInsurancePremium: '',  // annual**

&#x20; **parentsAbove60: null,        // boolean | null**

&#x20; **hasHomeLoan: null,           // boolean | null**

&#x20; **loanOwnership: null,         // 'own' | 'joint' | 'other'**

&#x20; **homeLoanInterest: '',        // annual**

&#x20; **hasTDS: null,                // boolean | null**

&#x20; **tdsDeducted: '',             // employer TDS for the year**

&#x20; **bankTDS: '',                 // bank TDS on FD interest**

**}**

**```**



**### App.jsx Structure**

**```jsx**

**export default function App() {**

&#x20; **const \[step, setStep] = useState(1)       // 1–14**

&#x20; **const \[data, setData] = useState(INITIAL\_STATE)**

&#x20; **const \[results, setResults] = useState(null)**



&#x20; **function update(fields) { setData(prev => ({ ...prev, ...fields })) }**

&#x20; **function goNext() { setStep(s => s + 1) }**

&#x20; **function goBack() { setStep(s => Math.max(1, s - 1)) }**

&#x20; **function skipTo(targetStep) { setStep(targetStep) }**

&#x20; **function reset() { setData(INITIAL\_STATE); setResults(null); setStep(1) }**



&#x20; **const PROGRESS\_STEPS = \[3, 4, 5, 6, 7, 8, 9, 10, 11, 12]  // steps shown in progress**

&#x20; **const TOTAL\_PROGRESS = 10**

&#x20; **const progressStep = PROGRESS\_STEPS.indexOf(step) + 1**

&#x20; **const showProgress = PROGRESS\_STEPS.includes(step)**



&#x20; **const sharedProps = { data, update, goNext, goBack, skipTo, step, progressStep, showProgress, TOTAL\_PROGRESS }**



&#x20; **// Wrapper: min-h-screen bg-gray-50 flex flex-col**

&#x20; **// Steps 1-12: {...sharedProps}**

&#x20; **// Step 13: {...sharedProps, setResults}**

&#x20; **// Step 14: {...sharedProps, results, reset}**

**}**

**```**



**---**



**## 7. Shared Components**



**### `ProgressBar.jsx` — Dot-Based Progress Indicator**

**\*\*Props:\*\* `{ current, total, stepName }`**



**\*\*Layout:\*\* `flex items-center gap-3 w-full`**

**- Left side: `flex items-center gap-2 shrink-0`**

&#x20; **- Step counter: `text-xs font-semibold text-gray-700` — "Step {current} of {total}"**

&#x20; **- Separator (hidden on mobile): `text-gray-300 hidden sm:inline` — "|"**

&#x20; **- Step name (hidden on mobile): `text-xs text-gray-500 truncate max-w-\[160px] hidden sm:inline` — "{stepName}"**

**- Right side — dot indicators: `flex items-center gap-1.5 flex-1 justify-end`**

&#x20; **- Each dot: `rounded-full transition-all duration-300`**

&#x20;   **- Completed (i < current): `w-2 h-2 bg-indigo-600`**

&#x20;   **- Current (i === current): `w-2 h-2 bg-indigo-300`**

&#x20;   **- Upcoming: `w-1.5 h-1.5 bg-gray-200`**

&#x20; **- Each dot has `role="progressbar"` with `aria-valuenow`, `aria-valuemin=0`, `aria-valuemax=100`**



**### `StepWrapper.jsx` — Layout Shell with Card Wrapper**

**\*\*Props:\*\* `{ children, goBack, reset, showProgress, progressStep, TOTAL\_PROGRESS, step, data, stepName }`**



**\*\*Structure:\*\***

**1. \*\*Sticky nav\*\* (always shown):**

&#x20;  **- `sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm`**

&#x20;  **- Inner: `max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center gap-3`**

&#x20;  **- \*\*Logo\*\* (always visible, clickable → `reset()`):**

&#x20;    **- `w-8 h-8 bg-indigo-600 rounded-lg` with calculator SVG `w-4 h-4 text-white`**

&#x20;    **- Brand text: "TaxClarity" (`text-sm font-bold text-gray-900 tracking-tight leading-none`)**

&#x20;    **- Subtitle: "India Tax Calculator" (`text-\[10px] text-gray-400 leading-none mt-0.5 hidden sm:block`)**

&#x20;  **- \*\*Back button\*\* (pill style, only when `step > 1`):**

&#x20;    **- `flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors shrink-0`**

&#x20;    **- Chevron left SVG `w-3.5 h-3.5` + "Back" text**

&#x20;  **- \*\*ProgressBar\*\* (when `showProgress`): `flex-1 min-w-0`**

&#x20;  **- \*\*Trust badge\*\* (desktop only): `hidden md:flex items-center gap-1.5 shrink-0 ml-auto`**

&#x20;    **- Green shield SVG `w-4 h-4 text-green-500`**

&#x20;    **- "100% Private" (`text-\[10px] font-semibold text-gray-600 leading-none`)**

&#x20;    **- "Data stays in your browser" (`text-\[10px] text-gray-400 leading-none mt-0.5`)**



**2. \*\*Content area:\*\* `flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6`**

&#x20;  **- Grid: `grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8`**

&#x20;  **- Left: `main.lg:col-span-7` → \*\*White card wrapper\*\*: `bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7` → `{children}`**

&#x20;  **- Right (only when `data` provided): `div.hidden.lg:block.lg:col-span-5` → `div.sticky.top-20` → `<TaxPreviewPanel data={data} />`**



**3. \*\*Footer:\*\* `max-w-7xl mx-auto w-full px-4 sm:px-8 pb-4`**

&#x20;  **- `text-xs text-center text-gray-300` — "Salaried individuals · FY 2025-26 · No data saved"**



**### `NumberInput.jsx` — Numeric Input with Green Validation**

**\*\*Props:\*\* `{ id, label, value, onChange, placeholder='0', hint, note, required=false, max, prefix='₹' }`**



**\*\*Behavior:\*\***

**- `type="text" inputMode="numeric" pattern="\[0-9]\*"`**

**- `handleChange`: strips non-digits (`/\[^0-9]/g`), calls `onChange(Number(raw))` or `onChange('')`**

**- `formatINR(val)`: returns `num.toLocaleString('en-IN')` or `''` for 0/empty**

**- `isValid`: `value !== '' \&\& value !== null \&\& value !== undefined \&\& Number(value) > 0`**

**- `aria-describedby={hint ? `${id}-hint` : undefined}`**



**\*\*Layout:\*\* `space-y-1.5`**

**- Label: `block text-sm font-medium text-gray-700` with optional red `\*`**

**- Input wrapper: `relative rounded-xl` (no shadow-sm)**

&#x20; **- Prefix: `pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3` → `text-gray-400 text-sm font-medium`**

&#x20; **- Input: `block w-full rounded-xl border py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none placeholder:text-gray-400`**

&#x20;   **- Valid state: `border-green-300 bg-green-50/30`**

&#x20;   **- Normal state: `border-gray-200`**

&#x20;   **- Padding: `pl-8 pr-9` (with prefix) or `px-3` (without)**

&#x20; **- \*\*Green checkmark\*\* (when `isValid`): `absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none`**

&#x20;   **- SVG: `w-4 h-4 text-green-500` checkmark with `strokeWidth={2.5}`**

**- Note (if present): `text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1`**

**- Hint (if present): `text-xs text-gray-500` with `id={id}-hint`**



**### `FrequencyInput.jsx` — Monthly/Annual Toggle Input**

**\*\*Props:\*\* Same as NumberInput plus inherits monthly/annual toggle**



**\*\*Internal state:\*\* `const \[freq, setFreq] = useState('annual')`**



**\*\*Behavior:\*\***

**- \*\*Always calls `onChange(annualValue)`\*\* — parent state always stores annual**

**- `displayValue`: if `freq === 'monthly'` → `Math.round(annualValue / 12)`, else `annualValue`**

**- `handleInput`: strips non-digits, if monthly → `num \* 12` before calling onChange**

**- `isValid`: same as NumberInput**

**- `annualEquivalent`: shown when monthly mode and value exists**



**\*\*Layout:\*\* `space-y-1.5`**

**- Top row: `flex items-center justify-between gap-2 flex-wrap`**

&#x20; **- Label on left**

&#x20; **- Frequency pill toggle on right: `flex rounded-full border border-gray-200 overflow-hidden bg-gray-50 p-0.5 gap-0.5 shrink-0`**

&#x20;   **- Active pill: `bg-indigo-600 text-white shadow-sm` (`px-3 py-1 text-xs font-semibold transition-all rounded-full`)**

&#x20;   **- Inactive pill: `text-gray-500 hover:text-gray-700`**

&#x20;   **- Labels: "Monthly" / "Per year"**

**- Input: same as NumberInput (rounded-xl, green validation, green checkmark)**

**- Annual equivalent hint (when monthly + value > 0): `text-xs text-indigo-600 font-medium reveal` — "= ₹{X} per year (auto-calculated)"**

**- Note and hint below (hint uses `text-xs text-gray-400`)**



**### `CommonQuestions.jsx` — Collapsible FAQ Accordion**

**\*\*Props:\*\* `{ questions: \[{q, a}] }` — uses `forwardRef`**



**\*\*Internal state:\*\* `open` (outer accordion), `openIndex` (which inner Q is expanded, null = none)**



**\*\*Exposed ref method:\*\* `openAndScroll()` — sets `open=true`, then after 80ms scrolls into view with `{ behavior: 'smooth', block: 'nearest' }`**



**\*\*Layout:\*\***

**- Outer: `border border-gray-200 rounded-xl overflow-hidden`**

**- Toggle button: `w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left`**

&#x20; **- Left: `text-sm font-medium text-gray-600 flex items-center gap-2`**

&#x20;   **- SVG question-mark circle icon (`w-4 h-4 text-indigo-500`) — NOT emoji**

&#x20;   **- "Common questions about this"**

&#x20; **- Right: chevron SVG `w-4 h-4 text-gray-400 transition-transform duration-200` (rotates 180 when open)**

**- Inner questions: `divide-y divide-gray-100`**

&#x20; **- Each Q wrapper: `bg-white`**

&#x20; **- Q button: `w-full flex items-start justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors`**

&#x20;   **- Q text: `text-sm font-medium text-gray-700 pr-4 leading-snug`**

&#x20;   **- Chevron: same as outer (with `flex-shrink-0 mt-0.5`)**

&#x20; **- Answer (when openIndex matches): `px-4 pb-3 reveal` → `text-sm text-gray-600 leading-relaxed`**

&#x20; **- Only one Q open at a time**



**### `ConfusedLink.jsx` — Inline Help Link**

**\*\*Props:\*\* `{ faqRef, label='Not sure? See examples' }`**



**\*\*Renders:\*\***

**- `button type="button"` with `className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 underline decoration-dotted underline-offset-2 transition-colors"`**

**- `?` circle SVG icon (`w-3 h-3`)**

**- `{label}` text**

**- On click: `faqRef?.current?.openAndScroll()`**



**---**



**## 8. TaxPreviewPanel.jsx (Live Right-Column Preview)**



**\*\*Props:\*\* `{ data }`**



**\*\*Critical variable ordering (to avoid temporal dead zone):\*\***

**```js**

**const \[userPickedRegime, setUserPickedRegime] = useState(null)  // null = auto**



**// Compute income components**

**const takeHomeSalary = (Number(data.takeHomeSalaryMonthly) || 0) \* 12**

**const bonus = (data.hasBonus \&\& Number(data.bonus) > 0) ? (Number(data.bonus) || 0) : 0**

**const fdInterest = (data.hasOtherIncome \&\& Number(data.fdInterest) > 0) ? (Number(data.fdInterest) || 0) : 0**

**const savingsInterest = (data.hasOtherIncome \&\& Number(data.savingsInterest) > 0) ? (Number(data.savingsInterest) || 0) : 0**

**const hasIncome = takeHomeSalary > 0**



**// Try compute — graceful fallback**

**let newRegimeData = { ...EMPTY\_REGIME }**

**let oldRegimeData = { ...EMPTY\_REGIME }**

**let computeSuccess = false**

**if (hasIncome) {**

&#x20; **try { const results = computeTax(data); newRegimeData = results.newRegime; oldRegimeData = results.oldRegime; computeSuccess = true }**

&#x20; **catch { /\* incomplete data — use zeroes \*/ }**

**}**



**// MUST define these BEFORE activeData (temporal dead zone otherwise)**

**const newTotal = newRegimeData.totalTax || 0**

**const oldTotal = oldRegimeData.totalTax || 0**

**const savings = Math.abs(newTotal - oldTotal)**

**const betterRegime = newTotal <= oldTotal ? 'new' : 'old'**

**const regime = userPickedRegime !== null ? userPickedRegime : (computeSuccess ? betterRegime : 'new')**



**// NOW safe to use regime**

**const activeData = regime === 'new' ? newRegimeData : oldRegimeData**

**const slabs = regime === 'new' ? NEW\_REGIME\_SLABS : getOldSlabs(data.ageGroup)**

**const slabRows = computeSuccess ? computeSlabRows(activeData.taxableIncome, slabs) : \[]**

**```**



**\*\*EMPTY\_REGIME constant:\*\***

**```js**

**const EMPTY\_REGIME = {**

&#x20; **grossIncome: 0, taxableIncome: 0, standardDeduction: 0,**

&#x20; **professionalTaxDeduction: 0, hraExemption: 0, deduction80C: 0,**

&#x20; **deduction80D: 0, deductionPersonalNPS: 0, employerNPSDeduction: 0,**

&#x20; **deductionHomeLoanInterest: 0, deduction80TTA\_TTB: 0,**

&#x20; **slabTax: 0, rebate: 0, marginalRelief: 0, cess: 0, totalTax: 0,**

**}**

**```**



**\*\*Helper functions:\*\***

**- `fmtN(n)` → `Number(n).toLocaleString('en-IN')` (number only)**

**- `fmt(n)` → `₹${fmtN(n)}` (with rupee symbol)**

**- `getOldSlabs(ageGroup)` → returns correct old regime slab array based on age**

**- `slabLabel(prevLimit, upTo)` → "Up to ₹4,00,000", "₹4,00,001 – ₹8,00,000", "Above ₹24,00,000"**

**- `computeSlabRows(taxableIncome, slabs)` → array of `{ label, rate, incomeInBand, tax, active }`**

&#x20; **- `incomeInBand`: calculated as `max(0, min(taxableIncome, upper) - prev)` per slab**

&#x20; **- `active`: `taxableInBand > 0 \&\& slab.rate > 0`**



**\*\*Helper components:\*\***

**- `SectionLabel({ letter, text })`: `flex items-center gap-2 mb-2`**

&#x20; **- Lettered badge: `w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-\[10px] font-bold flex items-center justify-center shrink-0`**

&#x20; **- Label: `text-xs font-semibold text-gray-500 uppercase tracking-wide`**

**- `LineRow({ label, amount, green, muted })`: `flex justify-between items-center py-0.5`**

&#x20; **- Label: `text-xs` + `text-gray-400` (muted) or `text-gray-600`**

&#x20; **- Amount: `text-xs font-semibold` + `text-green-600` (green) or `text-gray-400` (muted) or `text-gray-700`**

**- `ResultBox({ label, amount, indigo })`: `flex justify-between items-center rounded-lg px-3 py-2 mt-1.5`**

&#x20; **- If indigo: `bg-indigo-50 border border-indigo-100`, label `text-indigo-700`, amount `text-sm font-bold text-indigo-800`**

&#x20; **- Else: `bg-gray-100 border border-gray-200`, label `text-gray-500`, amount `text-sm font-bold text-gray-800`**

&#x20; **- Label prefixed with "= "**



**\*\*Layout (top to bottom):\*\***



**1. \*\*Outer wrapper:\*\* `bg-white rounded-2xl border border-gray-100 shadow-md shadow-gray-100 overflow-hidden`**



**2. \*\*Header:\*\* `flex items-center justify-between px-5 py-3.5 border-b border-gray-100`**

&#x20;  **- Left: `text-sm font-bold text-gray-900` — "Your Live Tax Estimate"**

&#x20;  **- Right: `text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5` — "FY 2025-26"**



**3. \*\*Regime toggle:\*\* `px-4 py-2.5 border-b border-gray-100 flex items-center justify-between gap-2`**

&#x20;  **- Pill container: `flex rounded-full border border-gray-200 bg-gray-50 p-0.5 gap-0.5`**

&#x20;  **- Each tab: `py-1.5 px-3 text-xs font-semibold transition-all rounded-full`**

&#x20;    **- Active: `bg-white text-indigo-700 shadow-sm`**

&#x20;    **- Inactive: `text-gray-500 hover:text-gray-700`**

&#x20;  **- Better regime gets "Best" suffix: `<span className="ml-1 text-green-600 text-\[10px] font-bold">Best</span>` (replaces old checkmark)**

&#x20;  **- "Compare X regime" link: `text-\[11px] text-indigo-500 hover:text-indigo-700 underline decoration-dotted underline-offset-2 shrink-0`**

&#x20;  **- On click: `setUserPickedRegime(val)` (explicit override of auto mode)**



**4. \*\*Empty state\*\* (when `!hasIncome`):**

&#x20;  **- `px-4 py-8 text-center`**

&#x20;  **- Calculator icon: `w-10 h-10 bg-gray-100 rounded-xl` with `w-5 h-5 text-gray-400` SVG**

&#x20;  **- Text: `text-xs text-gray-400 leading-relaxed` — "Enter your salary to\\nsee a live tax estimate"**



**5. \*\*Content area\*\* (when `hasIncome`): `space-y-1`**



&#x20;  **\*\*Hero gradient card\*\* (when `computeSuccess`):**

&#x20;  **- `mx-4 mt-3 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-4 text-white`**

&#x20;  **- "Estimated Tax Payable" (`text-xs text-indigo-200 font-medium mb-1`)**

&#x20;  **- Amount: `text-2xl font-black tracking-tight` — `fmt(activeData.totalTax)`**

&#x20;  **- "On annual income of {fmt(grossIncome)}" (`text-xs text-indigo-300 mt-1`)**



&#x20;  **\*\*Breakdown heading:\*\***

&#x20;  **- `px-4 pt-3 pb-1`**

&#x20;  **- "BREAKDOWN" (`text-xs font-bold text-gray-800 uppercase tracking-wider`)**



&#x20;  **\*\*Section A — Your Income:\*\***

&#x20;  **- `SectionLabel letter="A" text="Your Income"`**

&#x20;  **- `LineRow` items in `space-y-0.5`:**

&#x20;    **- "Annual salary (take-home)" → `fmt(takeHomeSalary)`**

&#x20;    **- "Bonus / incentive" → `fmt(bonus)` (if > 0)**

&#x20;    **- "FD interest" → `fmt(fdInterest)` (if > 0)**

&#x20;    **- "Savings account interest" → `fmt(savingsInterest)` (if > 0)**

&#x20;  **- `ResultBox label="Gross Income" amount={fmt(activeData.grossIncome || 0)}` (gray bg)**



&#x20;  **\*\*Section B — Deductions (−):\*\***

&#x20;  **- `SectionLabel letter="B" text="Deductions (−)"`**

&#x20;  **- Standard deduction: always shown, `green` prop, `− ₹75,000` (new) or `− ₹50,000` (old)**

&#x20;  **- Professional tax: only if `activeData.professionalTaxDeduction > 0` (always 0 in new regime)**

&#x20;  **- Employer NPS: if `activeData.employerNPSDeduction > 0` (both regimes)**

&#x20;  **- HRA exemption: if `regime === 'old' \&\& activeData.hraExemption > 0`**

&#x20;  **- 80C: if `regime === 'old' \&\& activeData.deduction80C > 0`**

&#x20;  **- 80D: if `regime === 'old' \&\& activeData.deduction80D > 0`**

&#x20;  **- Personal NPS: if `regime === 'old' \&\& activeData.deductionPersonalNPS > 0`**

&#x20;  **- Home loan: if `regime === 'old' \&\& activeData.deductionHomeLoanInterest > 0`**

&#x20;  **- Savings interest: if `regime === 'old' \&\& activeData.deduction80TTA\_TTB > 0`**

&#x20;  **- Note (when new regime + no employer NPS): info box `flex items-start gap-1.5 mt-1.5 p-2 bg-gray-50 rounded-lg`**

&#x20;    **- Info SVG `w-3 h-3 text-gray-400 mt-0.5 shrink-0`**

&#x20;    **- `text-\[11px] text-gray-400 leading-relaxed` — "New regime: only standard deduction applies."**

&#x20;  **- `ResultBox label="Taxable Income" amount={fmt(activeData.taxableIncome)} indigo` (indigo bg)**



&#x20;  **\*\*Section C — Tax on Slabs:\*\***

&#x20;  **- `SectionLabel letter="C" text="Tax on Slabs"`**

&#x20;  **- \*\*4-column slab table:\*\* `bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-2`**

&#x20;    **- Header row: `grid grid-cols-4 gap-1 px-2.5 py-2 border-b border-gray-200 bg-gray-100/50`**

&#x20;      **- "Income Slab" / "Rate" (center) / "Your Income" (right) / "Tax" (right)**

&#x20;      **- All: `text-\[10px] font-semibold text-gray-500 uppercase`**

&#x20;    **- Rows: `divide-y divide-gray-100`**

&#x20;      **- Each: `grid grid-cols-4 gap-1 px-2.5 py-1.5 text-\[11px]`**

&#x20;      **- Active: `bg-indigo-50/60 text-indigo-700 font-medium`**

&#x20;      **- Inactive: `text-gray-400`**

&#x20;      **- Columns: label (`truncate`), rate (`text-center`), incomeInBand (`text-right`), tax (`text-right`)**

&#x20;  **- Adjustments (`space-y-0.5`):**

&#x20;    **- 87A rebate: `LineRow` with green, `− ₹X` (if > 0)**

&#x20;    **- Marginal relief: `LineRow` with green, `− ₹X` (if > 0)**

&#x20;    **- Cess: `LineRow` "Health \& Education Cess (4%)" → `+ ₹X` or `₹0` (muted when 0)**

&#x20;  **- \*\*Total Tax bar:\*\* `mt-2 flex justify-between items-center bg-indigo-600 rounded-xl px-3 py-2.5`**

&#x20;    **- Left: `text-xs font-bold text-indigo-200` — "Total Tax Payable"**

&#x20;    **- Right: `text-lg font-black text-white` — `fmt(activeData.totalTax)`**



**6. \*\*Savings banner\*\* (if `computeSuccess \&\& savings > 0`):**

&#x20;  **- `mx-4 mb-3 flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5`**

&#x20;  **- Green checkmark SVG `w-4 h-4 text-green-600 flex-shrink-0`**

&#x20;  **- Line 1: `text-xs font-bold text-green-800` — "{Regime} Regime saves you ₹X"**

&#x20;  **- Line 2: `text-xs text-green-600 mt-0.5` — "vs {Other} Regime (₹Y)"**



**7. \*\*Privacy footer:\*\* `flex items-center justify-center gap-2 px-4 py-3 border-t border-gray-100 bg-gray-50/50`**

&#x20;  **- Green shield SVG `w-3.5 h-3.5 text-green-500`**

&#x20;  **- `text-\[11px] text-gray-400` — "100% Private \& Secure · Data never leaves your browser"**



**---**



**## 9. Step Screens (S01–S14) — Verbatim Specification**



**### Common Step Patterns (Post-Redesign)**

**Every step (S02-S12) follows these patterns:**

**- \*\*StepWrapper call\*\* includes `stepName="..."` prop and `reset={reset}`**

**- \*\*Icon badge\*\* before section label: emoji inside `w-6 h-6 rounded-lg bg-indigo-100` container**

**- \*\*Section label:\*\* `text-xs font-medium text-indigo-600 uppercase tracking-wide`**

**- \*\*CTA button:\*\* gradient style `bg-gradient-to-r from-indigo-600 to-purple-600 ...` with `font-bold py-3`, `shadow-md shadow-indigo-200`**

**- \*\*Button text:\*\* "Continue →" (except S12: green gradient "Calculate My Tax →")**



**\*\*Step names \& icons:\*\***

**| Step | stepName | Icon |**

**|------|----------|------|**

**| S02 | "Financial Year" | 📅 |**

**| S03 | "Your Age Group" | 🎂 |**

**| S04 | "Salary Details" | 💰 |**

**| S05 | "Salary Components" | 📋 |**

**| S06 | "Other Income" | 💵 |**

**| S07 | "Housing" | 🏠 |**

**| S08 | "Rent Details" | 🏠 |**

**| S09 | "Investments" | 📊 |**

**| S10 | "Health Insurance" | 🏥 |**

**| S11 | "Home Loan" | 🏡 |**

**| S12 | "TDS Deducted" | 🧾 |**



**---**



**### S01 — Landing Page**

**\*\*File:\*\* `S01\_Landing.jsx`**

**\*\*Props used:\*\* `{ goNext }`**

**\*\*No StepWrapper. No TaxPreviewPanel.\*\***



**\*\*Outer:\*\* `min-h-screen bg-\[#FAFAFA] flex flex-col`**



**\*\*Header:\*\* `w-full max-w-6xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between`**

**- Logo: `w-8 h-8 bg-indigo-600 rounded-lg` with calculator SVG `w-4 h-4 text-white`**

**- Brand: `text-sm font-bold text-gray-900 tracking-tight` — "TaxClarity"**

**- FY badge: `text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-3 py-1` — "FY 2025-26"**



**\*\*Hero:\*\* `flex-1 w-full max-w-6xl mx-auto px-6 sm:px-10 py-10 lg:py-16`**

**- Grid: `grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center`**



**\*\*Left column:\*\***

**- Badge pill: `inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 w-fit mb-6`**

&#x20; **- Green dot `w-1.5 h-1.5 rounded-full bg-indigo-500`**

&#x20; **- Text: "Know. Compare. Save."**

**- \*\*H1:\*\* `text-4xl sm:text-5xl font-extrabold text-gray-900 leading-\[1.1] tracking-tight mb-5`**

&#x20; **- "Find out \*\*which tax regime\*\* saves you more money this year."**

&#x20; **- "which tax regime" wrapped in `<span className="text-indigo-600 underline decoration-indigo-200 decoration-4 underline-offset-4">`**

**- \*\*Description:\*\* `text-base sm:text-lg text-gray-500 leading-relaxed mb-8 max-w-md`**

&#x20; **- "Answer a few simple questions about your salary and expenses. We'll compare both tax regimes and show you which one saves you more money — with a clear rupee-by-rupee estimate."**

**- \*\*Trust bullets:\*\* `flex flex-wrap gap-4 mb-10` — three items:**

&#x20; **- ⏱ "2 min" / "Quick"**

&#x20; **- 🔒 "100% Free" / "No sign-up"**

&#x20; **- 🛡 "Private" / "No data stored"**

**- \*\*CTAs:\*\* `flex flex-col sm:flex-row items-start sm:items-center gap-3`**

&#x20; **- Primary: "Start calculation" + arrow SVG → `goNext()` — rounded-2xl py-3.5 px-7**

&#x20; **- Secondary: "See how it works" with play circle SVG → also `goNext()` — ghost style**

**- Footer text: `mt-4 text-xs text-gray-400` — "Built for salaried individuals only · FY 2025-26"**



**\*\*Right column — mock result card:\*\***

**- Soft glow: `absolute inset-0 bg-indigo-100 rounded-3xl blur-3xl opacity-40 scale-95 translate-y-4`**

**- Card: `relative bg-white rounded-3xl shadow-xl shadow-gray-200/80 border border-gray-100 p-6 sm:p-8`**

**- Static demo showing: "Your Tax Summary" + "You Save ₹18,540" + winner verdict + side-by-side regime cards**



**\*\*Feature cards:\*\* `mt-24 lg:mt-28`**

**- 4 cards in `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`**

**- Cards: "Old vs New Regime Comparison" / "Exact Amount You Save" / "Refund or Tax Due" / "Plain English, No CA Jargon"**



**\*\*Bottom trust strip + Footer\*\***



**---**



**### S02 — Financial Year**

**\*\*Section label icon:\*\* 📅 | \*\*Heading:\*\* "Which financial year are you calculating tax for?"**



**- Pre-selected locked option: `p-4 bg-indigo-50 border-2 border-indigo-600 rounded-xl`**

&#x20; **- "FY 2025-26" / "April 2025 to March 2026"**

**- Info text about yearly rules**

**- Gradient "Continue →" button**

**- \*\*No validation needed\*\* (always pre-selected)**



**---**



**### S03 — Age Group**

**\*\*Section label icon:\*\* 🎂 | \*\*Section label:\*\* "About You"**

**\*\*Heading:\*\* "Which age group do you fall in?"**



**\*\*3 AGE\_OPTIONS:\*\***

**| value | label | tag | description |**

**|---|---|---|---|**

**| `below60` | "Below 60 years" | — | "Basic exemption: ₹2,50,000 under old regime" |**

**| `senior` | "60 to 79 years" | "Senior Citizen" | "Basic exemption: ₹3,00,000 under old regime" |**

**| `superSenior` | "80 years or above" | "Super Senior Citizen" | "Basic exemption: ₹5,00,000 under old regime" |**



**- Custom radio button style**

**- \*\*Validation:\*\* Must select age group**

**- \*\*CommonQuestions:\*\* 3 items**



**---**



**### S04 — Salary Details**

**\*\*Section label icon:\*\* 💰 | \*\*Section label:\*\* "Your Salary"**

**\*\*Heading:\*\* "What does your salary look like?"**



**\*\*Side-by-side layout:\*\* `grid grid-cols-1 sm:grid-cols-2 gap-4`**

**- Left: Take-home monthly (`NumberInput`)**

**- Right: Basic Pay monthly (`NumberInput` + `ConfusedLink`)**



**\*\*Take-home hint:\*\* "The amount credited to your bank account each month — not your CTC or gross salary."**



**\*\*Live annual preview:\*\* `reveal px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between`**



**\*\*Inline warnings (amber boxes, shown conditionally):\*\***

**- \*\*Basic > take-home warning:\*\* Shown when `basicSalaryMonthly > takeHomeSalaryMonthly`. Warns user that basic pay should always be lower than take-home and asks them to re-check their salary slip.**

**- \*\*Surcharge warning:\*\* Shown when `annualTakeHome > ₹50,00,000`. Warns that incomes above ₹50 lakh may attract surcharge, which this calculator does not cover, and suggests consulting a tax professional.**



**\*\*Bonus section:\*\***

**- "Do you get any extra money apart from your fixed monthly salary?" — Yes/No toggle buttons**

**- If Yes: `FrequencyInput` for bonus amount inside blue info box (`bg-blue-50 border-blue-100`)**

&#x20; **- "Not sure of the exact amount?" helper inside white sub-card**

&#x20; **- "Don't include: your fixed monthly salary..." clarification**

**- If No: gray confirmation — "Got it — we'll use only your fixed monthly salary"**

**- Combined annual preview (salary + bonus) shown in green box when both present**



**\*\*Validation:\*\* takeHome required, basic required, hasBonus must not be null, bonus required if yes**

**\*\*CommonQuestions:\*\* 5 items**



**---**



**### S05 — Salary Components**

**\*\*Section label icon:\*\* 📋 | \*\*Section label:\*\* "Salary Components"**

**\*\*Heading:\*\* "Does your salary slip show any of these?"**

**\*\*Description:\*\* "Tick all that appear on your slip. Leave the rest blank." + `ConfusedLink faqRef label="What are these?"`**



**\*\*3 COMPONENTS array (checkbox cards):\*\***

**| key | label | tag | emoji | description |**

**|---|---|---|---|---|**

**| `hasHRA` | "HRA — House Rent Allowance" | "Section 10(13A)" | 🏠 | "A part of your salary meant for rent. Can be partially tax-free if you pay rent." |**

**| `hasProfTax` | "Professional Tax" | "Section 16(iii)" | 🏛️ | "State govt tax deducted monthly from your salary. Usually ₹200/month (max ₹2,400/year)." |**

**| `hasEmployerNPS` | "Employer NPS contribution" | "Section 80CCD(2)" | 🏦 | "Your company puts money into your NPS retirement account as part of your pay package." |**



**\*\*Sub-inputs when checked (inside `px-4 pb-4 bg-indigo-50 border-t border-indigo-100`):\*\***

**- `hasHRA`: `NumberInput` — label "How much HRA do you receive per month?", placeholder "e.g. 15,000", hint "Find it on your salary slip under Earnings."**

**- `hasProfTax`: `FrequencyInput` — label "How much Professional Tax is deducted?", placeholder "200", note "Usually ₹200/month = ₹2,400/year. Maximum is ₹2,500 per year."**

**- `hasEmployerNPS`: `FrequencyInput` — label "How much does your employer contribute to NPS?", placeholder "0", hint "Check your CTC breakdown or salary slip. This is your employer's contribution, not yours."**



**\*\*Toggle behavior:\*\* `toggleComponent(key)` → `update({ \[key]: !data\[key] })`, clears error for that key**

**\*\*Bottom text:\*\* `text-xs text-gray-400 text-center` — "If none of these appear on your slip, leave them all unticked and continue."**

**\*\*Validation:\*\* Each checked item must have amount > 0**

**\*\*CommonQuestions:\*\* 5 items (HRA, Professional Tax, Employer NPS, HRA without rent, Employer EPF)**



**---**



**### S06 — Other Income**

**\*\*Section label icon:\*\* 💵 | \*\*Section label:\*\* "Other Income"**

**\*\*Heading:\*\* "Did your bank pay you any interest this year?"**

**\*\*Description:\*\* "Interest from Fixed Deposits (FD) and Savings accounts is added to your income and taxed. Many people forget this." + `ConfusedLink faqRef label="What counts as interest income?"`**



**\*\*Explainer cards\*\* (`grid grid-cols-1 sm:grid-cols-2 gap-3`):**

**- Card 1: 🏦 "Fixed Deposit (FD)" — "Interest earned on money locked in an FD for 1–5 years..."**

**- Card 2: 💳 "Savings Account" — "The small interest your bank pays on the balance in your regular account..."**



**\*\*Yes/No question:\*\* "Did you earn any interest from FDs or savings accounts in FY 2025-26?" (with red `\*`)**

**- On click: `update({ hasOtherIncome: val }); setErrors({})` — clears ALL errors**



**\*\*If Yes\*\* (`reveal space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100`):**

**- `FrequencyInput` for FD interest — hint "Add all FDs together. Enter 0 if you have no FDs."**

**- `FrequencyInput` for savings interest — hint "Usually a small amount. Check your annual bank statement. Enter 0 if negligible."**

**- Tip: `text-xs text-blue-700` — 'Tip: open your bank app → Statements → search for "Interest Credit" entries.'**



**\*\*If No:\*\* clears fdInterest and savingsInterest on handleNext**

**\*\*Validation:\*\* hasOtherIncome must not be null**

**\*\*CommonQuestions:\*\* 6 items (FD interest, savings interest, TDS on FD, spouse/parent FD, PPF interest, unknown amount)**



**---**



**### S07 — Pays Rent**

**\*\*Section label icon:\*\* 🏠 | \*\*Section label:\*\* "Housing"**

**\*\*Heading:\*\* "Do you live in a rented house and personally pay the rent?"**



**- Yes/No toggle (`py-2.5`)**

**- If No: amber warning + skipTo(9)**

**- If Yes: goNext() to S08**

**- \*\*Validation:\*\* paysRent must not be null**

**- \*\*CommonQuestions:\*\* 3 items**



**---**



**### S08 — Rent Details**

**\*\*Section label icon:\*\* 🏠 | \*\*Heading:\*\* "Tell us about your rent"**



**- Monthly rent (`NumberInput`)**

**- City type (metro/non-metro radio buttons)**

**- Has HRA in salary (Yes/No toggle)**

**- \*\*Validation:\*\* All fields required**

**- \*\*CommonQuestions:\*\* 4 items**



**---**



**### S09 — Tax Saving Investments**

**\*\*Section label icon:\*\* 📊 | \*\*Section label:\*\* "Tax Saving Investments"**

**\*\*Heading:\*\* "Do you make any of these investments?"**

**\*\*Description:\*\* "These reduce your tax under the old regime only. Tick all that apply." + `ConfusedLink faqRef label="What are these?"`**



**\*\*FREQ\_DEFAULTS constant\*\* (items that support monthly/annual toggle):**

**```js**

**const FREQ\_DEFAULTS = { epf: 'monthly', elss: 'monthly', homeLoanPrincipal: 'monthly', ppf: 'annual', lic: 'annual' }**

**```**

**Items NOT in FREQ\_DEFAULTS (tuition, nsc) show "Enter the annual total." instead of a frequency toggle.**



**\*\*7 INVESTMENT\_ITEMS array (checkbox cards):\*\***

**| key | label | emoji | tag | description |**

**|---|---|---|---|---|**

**| `epf` | "EPF — money deducted from my salary every month" | 💼 | 80C | "Employee Provident Fund. Your employer deducts \~12% of your basic pay every month..." |**

**| `lic` | "LIC or other life insurance premiums" | 🛡️ | 80C | "Premiums you personally pay for a term plan, endowment plan, or any life insurance policy..." |**

**| `ppf` | "PPF — Public Provident Fund" | 📮 | 80C | "A government savings scheme with a 15-year lock-in..." |**

**| `elss` | "ELSS — Tax saving mutual funds (SIP)" | 📈 | 80C | "Equity Linked Savings Scheme. A type of mutual fund with a 3-year lock-in..." |**

**| `tuition` | "Children's school or college tuition fees" | 🎓 | 80C | "Tuition fees you paid for up to 2 children..." |**

**| `homeLoanPrincipal` | "Home loan — principal repayment" | 🏡 | 80C | "The principal portion of your home loan EMI..." |**

**| `nsc` | "NSC or Post Office time deposit" | 📬 | 80C | "National Savings Certificate (NSC) or Post Office Fixed Deposits (5-year)..." |**



**\*\*FreqToggle component (local to file):\*\***

**```jsx**

**function FreqToggle({ freq, onChange }) {**

&#x20; **// Container: inline-flex rounded-lg border border-indigo-200 overflow-hidden bg-indigo-50/50 p-0.5 gap-0.5**

&#x20; **// Options: \[{ val: 'monthly', label: 'Per month' }, { val: 'annual', label: 'Per year' }]**

&#x20; **// Active pill: bg-white text-indigo-700 shadow-sm (px-3 py-1 text-xs font-semibold rounded-md)**

&#x20; **// Inactive: text-indigo-400 hover:text-indigo-600**

**}**

**```**



**\*\*Per-item local frequency state:\*\***

**```js**

**const \[frequencies, setFrequencies] = useState(() => {**

&#x20; **const init = {}**

&#x20; **INVESTMENT\_ITEMS.forEach(({ key }) => { init\[key] = FREQ\_DEFAULTS\[key] || 'annual' })**

&#x20; **return init**

**})**

**const \[npsFreq, setNpsFreq] = useState('annual')**

**```**



**\*\*Value conversion logic (critical for replication):\*\***

**- `displayVal(key)`: if freq is 'monthly' → `Math.round(storedAnnual / 12)`, else stored annual value**

**- `handleItemChange(key, v)`: if freq is 'monthly' → `num \* 12` before storing in state**

**- State (`data.investments80C\[key]`) ALWAYS stores the annual value**



**\*\*Sub-input area when checked\*\* (`px-3 pb-3 bg-indigo-50 border-t border-indigo-100`):**

**- If item has freq option: `FreqToggle` with label "How are you entering this?" (`text-xs text-indigo-600 font-medium`)**

**- If item has NO freq option: text "Enter the annual total." (`text-xs text-indigo-600 font-medium`)**

**- `NumberInput` with dynamic label: "Amount per month" or "Amount per year"**

**- Annual equivalent hint (when monthly + value > 0): `text-xs text-indigo-600` — "= ₹{X} per year (what we use for tax calculation)"**



**\*\*Running 80C total\*\* (shown when `has80CItems.length > 0`):**

**```**

**reveal p-4 bg-white border-2 border-gray-200 rounded-xl space-y-2**

**├── flex justify-between: "Your 80C total" ↔ "₹{cappedTotal} / ₹1,50,000"**

**│   Amount color: text-green-600 when hit cap, else text-gray-900**

**├── Progress bar: w-full bg-gray-200 rounded-full h-2**

**│   Inner: bg-green-500 (hit cap) or bg-indigo-600 (not hit), transition-all duration-300**

**│   Width = min(100, round(total80C / 150000 \* 100))%**

**└── Cap message:**

&#x20;   **Hit cap → text-xs text-green-700 font-medium: "You've hit the ₹1,50,000 cap..."**

&#x20;   **Not hit → text-xs text-gray-500: "₹{remaining} more can still earn a tax benefit."**

**```**



**\*\*Personal NPS section\*\* (below `pt-2 border-t border-gray-100` divider):**

**- Question: "Do you personally invest in NPS?" (`text-sm font-semibold text-gray-800`)**

**- Sub-description: "NPS = National Pension System. A government retirement scheme..." (`text-xs text-gray-500`)**

**- Yes/No toggle buttons (same style as other steps)**

**- If Yes (`reveal space-y-2`): `FreqToggle` + `NumberInput` + annual hint**

&#x20; **- Note: "Capped at ₹50,000 for deduction. Any extra doesn't reduce tax further."**

&#x20; **- NPS uses same monthly/annual conversion as 80C items but with separate `npsFreq` state**



**\*\*Back navigation:\*\* If `!data.paysRent` → `skipTo(7)`, else `goBack()`**

**\*\*Validation:\*\* Each checked 80C item must have amount > 0; hasPersonalNPS must not be null; personalNPS required if yes**

**\*\*CommonQuestions:\*\* 5 items (80C limit, EPF share, NPS vs EPF, principal vs interest, over-limit)**



**---**



**### S10 — Health Insurance**

**\*\*Section label icon:\*\* 🏥 | \*\*Section label:\*\* "Health Insurance"**

**\*\*Heading:\*\* "Do you pay for health insurance?"**

**\*\*Description:\*\* "There are \*\*two separate tax benefits\*\* here — one for insuring yourself and one for insuring your parents. Answer both cards below." + `text-xs text-gray-400` "Section 80D — old regime only"**



**\*\*InsuranceCard component (local to file):\*\***

**\*\*Props:\*\* `{ title, subtitle, cap, checked, onToggle, amount, onAmountChange, amountError, children }`**

**```**

**rounded-xl border-2 overflow-hidden**

**├── Header: px-4 py-3 (bg-indigo-50 when checked, bg-gray-50 when not)**

**│   ├── title: text-sm font-semibold**

**│   └── subtitle: text-xs text-gray-500**

**├── Yes/No toggle: px-4 py-3 bg-white border-t border-gray-100**

**│   ├── Prompt: "Do you personally pay a premium for this group?"**

**│   └── Buttons: FILLED style (different from other steps!)**

**│       Selected: border-indigo-600 bg-indigo-600 text-white**

**│       Unselected: border-gray-200 bg-white text-gray-600**

**│       Labels: "Yes, I pay" / "No"**

**└── Amount area (when Yes): px-4 pb-4 bg-indigo-50 border-t border-indigo-100**

&#x20;   **├── NumberInput: label "How much do you pay per year?"**

&#x20;   **│   note: "Tax benefit capped at ₹{cap} per year"**

&#x20;   **└── {children} slot (used for parent age question)**

**```**



**\*\*Card 1 — Self (numbered badge "1", "Your policy"):\*\***

**- Title: "For you, your spouse or children"**

**- Subtitle: "Any health insurance policy that covers you or your immediate family"**

**- Cap: 50K if senior/superSenior, else 25K**

**- onToggle clears amount when switching to No**



**\*\*Card 2 — Parents (numbered badge "2", "Your parents' policy"):\*\***

**- Title: "For your mother or father"**

**- Subtitle: "A separate policy covering your own parents (not in-laws)"**

**- Cap: 50K if `parentsAbove60`, else 25K**

**- \*\*Children slot\*\* (inside card when Yes): parent age question**

&#x20; **- "How old are your parents?" + "This changes the cap — ₹50,000 if above 60, ₹25,000 if below 60."**

&#x20; **- Two buttons: "Above 60" / "Below 60" (same filled style)**

**- onToggle clears amount AND resets `parentsAbove60` to null when switching to No**



**\*\*Neither pays feedback\*\* (when both No + both answered): `bg-amber-50 border-amber-200` — "No 80D deduction will be applied..."**

**\*\*Validation:\*\* Both cards must be answered; amounts required if yes; parent age if parent insurance yes**

**\*\*CommonQuestions:\*\* 5 items (company group insurance, father pays, in-laws, uninsured parents above 60, no insurance at all)**



**---**



**### S11 — Home Loan**

**\*\*Section label icon:\*\* 🏡 | \*\*Section label:\*\* "Home Loan"**

**\*\*Heading:\*\* "Do you have a home loan for a house you currently live in?"**

**\*\*Description:\*\* "Home loan interest reduces taxable income under old regime only." + `text-xs text-gray-400 block mt-1` "Section 24(b) — max ₹2,00,000 for self-occupied property"**



**- Yes/No toggle — on click: resets `loanOwnership` to null and `homeLoanInterest` to '' AND clears all errors**



**\*\*If Yes\*\* (`space-y-5`):**

**- \*\*Ownership\*\* (`fieldset` + `legend`): "Is this loan in your name?" with red `\*`**

&#x20; **- 3 OWNERSHIP\_OPTIONS as radio cards (same custom radio style as S03):**

&#x20;   **| value | label |**

&#x20;   **|---|---|**

&#x20;   **| `own` | "In my name only" |**

&#x20;   **| `joint` | "Joint with spouse or co-borrower" |**

&#x20;   **| `other` | "In someone else's name" |**

&#x20; **- On change: resets `homeLoanInterest` to '' and clears errors**

&#x20; **- If `other`: `bg-amber-50 border-amber-200 rounded-lg` — "You cannot claim this deduction." + Section 24(b) explanation**

&#x20; **- If `own` or `joint`: `NumberInput` for interest**

&#x20;   **- Label: "How much interest did you pay on this home loan last year?"**

&#x20;   **- Note: "Cap: ₹2,00,000. Check your bank's home loan interest certificate."**

&#x20;   **- \*\*Conditional hint\*\* (joint only): "Enter only your share — typically 50% of total interest. Each co-borrower can claim up to ₹2,00,000."**



**\*\*Validation:\*\* hasHomeLoan not null; loanOwnership required if yes; interest required if own/joint**

**\*\*CommonQuestions:\*\* 5 items (father's name loan, two loans, interest vs principal, under construction, HRA + home loan)**



**---**



**### S12 — TDS**

**\*\*Section label icon:\*\* 🧾 | \*\*Section label:\*\* "Almost done"**

**\*\*Heading:\*\* "Does your employer deduct income tax from your salary every month?"**



**- Blue explainer box with 4 numbered steps**

**- Yes/No toggle**

**- If Yes: `NumberInput` for employer TDS amount in blue info box**

**- If No: amber warning about full liability**



**\*\*Bank TDS (conditional):\*\* Shown only when `data.hasOtherIncome \&\& fdInterest > 0`:**

**- Blue info box (`bg-blue-50 border-blue-100`) asking "Did your bank deduct tax (TDS) on your FD interest?"**

**- Explains 10% TDS threshold (₹40K / ₹50K for seniors)**

**- `NumberInput` for bank TDS amount (optional — blank = 0)**

**- Stored as `data.bankTDS`**



**\*\*CTA button:\*\* GREEN gradient — `bg-gradient-to-r from-green-600 to-emerald-600 ...` — \*\*"Calculate My Tax →"\*\***



**\*\*Validation:\*\* hasTDS must not be null; tdsDeducted required if yes**

**\*\*CommonQuestions:\*\* 7 items**



**---**



**### S13 — Calculating (Animation Screen)**

**\*\*No StepWrapper. No TaxPreviewPanel.\*\***

**\*\*Props:\*\* `{ data, goNext, setResults }`**



**\*\*StrictMode guard:\*\* Uses `useRef(false)` to prevent double-execution in React StrictMode:**

**```js**

**const started = useRef(false)**

**useEffect(() => {**

&#x20; **if (started.current) return**

&#x20; **started.current = true**

&#x20; **// ... animation and compute logic**

**}, \[])**

**```**



**\*\*6 STEPS array (animation labels):\*\***

**1. "Adding up all your income"**

**2. "Applying your salary components"**

**3. "Computing old regime with all deductions"**

**4. "Computing new regime"**

**5. "Comparing both regimes"**

**6. "Finding the best option for you"**



**\*\*Animation timing:\*\***

**- Each step appears at `i \* 380ms` intervals**

**- `setActiveStep(i)` + mark previous step as done `setDoneSteps(prev => \[...prev, i - 1])`**

**- After all steps: `totalDelay = STEPS.length \* 380 + 300` = \~2580ms**

**- At totalDelay: mark all done → `computeTax(data)` → `setResults(results)` → `setTimeout(goNext, 400)`**



**\*\*Layout:\*\* `flex flex-col min-h-screen items-center justify-center px-4`**

**- `max-w-sm w-full space-y-8`**

**- \*\*Spinner:\*\* `w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin`**

**- \*\*Heading:\*\* `text-xl font-bold text-gray-900` — "Crunching your numbers..."**

**- \*\*Sub:\*\* `text-sm text-gray-500 mt-1` — "This will take just a moment"**

**- \*\*Step list\*\* (`space-y-3`): each step has 3 states:**

&#x20; **- \*\*Done:\*\* green circle `bg-green-500` with white checkmark, `text-green-700 font-medium`**

&#x20; **- \*\*Active:\*\* indigo circle `bg-indigo-600` with pulsing white dot `animate-pulse`, `text-indigo-700 font-medium`**

&#x20; **- \*\*Upcoming:\*\* gray circle `bg-gray-200` with gray dot, `text-gray-400`, `opacity-30`**



**---**



**### S14 — Results Page**

**\*\*No StepWrapper.\*\***

**\*\*Props:\*\* `{ results, data, reset, skipTo }`**



**\*\*Two-column layout:\*\***

**- Left: SectionA\_Verdict, SectionE\_NextSteps, SectionD\_Education, disclaimer, edit/start-over buttons**

**- Right: SectionB\_TaxSummary, SectionC\_DetailedBreakdown, trust strip**



**\*\*Disclaimer (strengthened):\*\* `bg-amber-50 border-amber-200 rounded-xl space-y-1.5`**

**- "Important disclaimer: This is an estimate based on the information you provided — not exact tax advice."**

**- Lists exclusions: surcharge (above ₹50 lakh), capital gains, rental income, other income sources**

**- Directs users to verify with a CA or incometax.gov.in**



**\*\*Edit / Start Over buttons:\*\***

**- "Go back and edit my inputs" — indigo outlined button → `skipTo(4)` (returns to salary step with data preserved)**

**- "Start Over" — gray outlined button → `reset()` (clears all data)**



**\*\*Trust strip:\*\* 3 items:**

**- "FY 2025-26 Rules" / "Based on latest tax slabs" (NOT "100% Accurate")**

**- "Your data is private" / "We don't store your data"**

**- "Takes 3-5 minutes" / "Quick \& easy process"**



**---**



**## 10. Result Components**



**### SectionA\_Verdict**

**\*\*Props:\*\* `{ results, data }`**

**\*\*Imports:\*\* `fmt` from utils**



**\*\*`getVerdictSentence(results, data)` function — 4 templates:\*\***



**1. \*\*Zero tax\*\* (`recommended === 'new' \&\& newRegime.totalTax === 0`):**

&#x20;  **"Your income falls under ₹12.75 lakh. Under the new regime you pay zero tax this year. No investments needed, no paperwork required."**



**2. \*\*Very close\*\* (`savings < 5000`):**

&#x20;  **"It's close — just {fmt(savings)} difference. {winner} edges out. But if your deductions change next year, revisit this calculation."**



**3. \*\*New regime wins\*\* (`recommended === 'new'`):**

&#x20;  **Calculates `totalOldDeductions = newRegime.grossIncome - oldRegime.taxableIncome`**

&#x20;  **"Even with {fmt(totalOldDeductions)} in deductions under the old regime, the new regime's lower slab rates still save you more..."**



**4. \*\*Old regime wins\*\* (default):**

&#x20;  **Builds dynamic `reasons` array from user data: HRA exemption, 80C investments, health insurance premium, home loan interest, NPS contribution**

&#x20;  **"{reasonText} your taxable income down significantly. The deductions outweigh the new regime's lower rates in your case."**



**\*\*Layout:\*\* `rounded-2xl p-4` — `bg-indigo-600` (new wins) or `bg-emerald-600` (old wins)**

**- \*\*Badge:\*\* `inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1`**

&#x20; **- `bg-indigo-500 text-indigo-100` or `bg-emerald-500 text-emerald-100`**

&#x20; **- Checkmark circle SVG + "Recommended for you"**

**- \*\*Regime name:\*\* `text-xl font-bold text-white mb-1` — "New Tax Regime" or "Old Tax Regime"**

**- \*\*Savings display\*\* (`mb-3`):**

&#x20; **- If zero tax: `text-3xl font-black text-white` "₹0 tax" + `text-indigo-200 text-sm` "You pay zero tax this year"**

&#x20; **- Else: "You save" label + `text-3xl font-black text-white` savings amount + "compared to the {other} regime"**

**- \*\*Verdict box:\*\* `rounded-xl p-3 bg-indigo-700/60` or `bg-emerald-700/60` → `text-sm text-white leading-relaxed`**



**### SectionB\_TaxSummary**

**\*\*Props:\*\* `{ results, data }`**



**- Side-by-side regime cards with winner badge ("Best for you" star)**

**- TDS line: shows total TDS with employer+bank breakdown when both present**

**- Regime note: "Refund or balance due is calculated against the \[New/Old] Regime (the one we recommend for you)."**

**- TDS status message (refund/payable/settled) via `TDSMessage` component**

**- \*\*Advance tax warning\*\* (conditional): Shown when user has FD income AND tds.type === 'payable'. Warns about ₹10K threshold for advance tax payments under Section 234B/234C**



**### SectionC\_DetailedBreakdown**

**\*\*Props:\*\* `{ results, data }`**

**\*\*Imports:\*\* `useState` from react, `fmt` from utils, all slab constants from constants**



**\*\*Helper functions (local to file):\*\***

**```js**

**function fmtN(n) { return Number(n).toLocaleString('en-IN') }**

**function fmtL(n) {**

&#x20; **// Formats numbers in compact lakhs: 400000 → "4L", 1250000 → "12.5L", 50000 → "50,000"**

&#x20; **if (n >= 100000) return `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`**

&#x20; **return fmtN(n)**

**}**

**function getOldSlabs(ageGroup) { /\* returns correct slab array based on age \*/ }**

**function slabLabel(prev, upTo) {**

&#x20; **// "0 – 4L", "4L – 8L", "24L+", etc.**

&#x20; **if (prev === 0) return upTo === null ? 'All' : `0 – ${fmtL(upTo)}`**

&#x20; **return upTo === null ? `${fmtL(prev)}+` : `${fmtL(prev)} – ${fmtL(upTo)}`**

**}**

**function computeSlabRows(taxableIncome, slabs) {**

&#x20; **// Returns array of { label, rate, tax, active }**

&#x20; **// tax = Math.round(taxableInBand \* slab.rate)**

&#x20; **// active = taxableInBand > 0 \&\& slab.rate > 0**

**}**

**```**



**\*\*Sub-components (local to file):\*\***



**\*\*`SectionHeader({ step, label })`:\*\***

**- `pt-4 pb-1` → `flex items-center gap-2`**

**- Step badge: `w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold`**

**- Label: `text-xs font-semibold text-gray-500 uppercase tracking-wide`**



**\*\*`Row({ label, newVal, oldVal, deduction, dimNew })`:\*\***

**- `flex` layout with 3 columns:**

&#x20; **- Label: `flex-1 py-1.5 pr-3 text-xs text-gray-600 pl-7`**

&#x20; **- New: `w-\[27%] shrink-0 py-1.5 px-2 text-xs text-right` — if `dimNew`: `text-gray-300` showing "——", if `deduction`: `text-green-700`, else `text-gray-700`**

&#x20; **- Old: `w-\[27%] shrink-0 py-1.5 pl-2 text-xs text-right` — if `deduction`: `text-green-700`, else `text-gray-700`**



**\*\*`ResultRow({ label, newVal, oldVal, isWinner, final })`:\*\***

**- `pt-2 pb-1` → `rounded-lg py-2.5 flex items-center`**

**- Background: `bg-gray-100` (final) or `bg-indigo-50`**

**- Label prefixed with "= " — `flex-1 pl-7 pr-3 text-xs font-semibold`**

**- Winner column in final row: `text-green-700 text-sm` (slightly larger), losers: `text-gray-700`**



**\*\*`SlabTable({ label, slabRows, totalTax, isWinner })`:\*\***

**- `rounded-lg border overflow-hidden flex flex-col`**

**- Winner: `border-indigo-200 bg-indigo-50/30`, loser: `border-gray-200 bg-gray-50/50`**

**- Header: label + checkmark if winner (`text-green-600`)**

**- Slab rows: `divide-y divide-gray-100`, each row is `flex items-center px-2 py-1 text-xs gap-1`**

&#x20; **- Active: `bg-indigo-50/60 text-indigo-700 font-medium`, inactive: `text-gray-400`**

&#x20; **- 3 columns: label (`flex-1 whitespace-nowrap`), rate (`w-8 text-center`), tax (`w-16 text-right` with ₹ prefix)**

**- Pinned total footer: `border-t-2` with bold total**



**\*\*Main component state:\*\* `const \[open, setOpen] = useState(false)` — collapsible accordion**



**\*\*Computed values:\*\***

**```js**

**const newTaxAfterRebate = Math.max(0, n.slabTax - n.rebate - (n.marginalRelief || 0))**

**const oldTaxAfterRebate = Math.max(0, o.slabTax - o.rebate)**

**const newSlabRows = computeSlabRows(n.taxableIncome, NEW\_REGIME\_SLABS)**

**const oldSlabRows = computeSlabRows(o.taxableIncome, getOldSlabs(data?.ageGroup))**

**```**



**\*\*Accordion toggle:\*\* `border border-gray-200 rounded-xl overflow-hidden`**

**- Button: `px-4 py-3 bg-gray-50 hover:bg-gray-100` — "See detailed comparison" + chevron (rotates 180)**



**\*\*Content when open (`px-4 pb-4`):\*\***



**1. \*\*Column headers\*\* (`flex mt-3 mb-1`):**

&#x20;  **- Empty label column (`flex-1 pl-7`)**

&#x20;  **- "New Regime" + checkmark if winner → `w-\[27%] text-right`, winner: `text-indigo-600`, loser: `text-gray-400`**

&#x20;  **- "Old Regime" + checkmark if winner → same pattern**



**2. \*\*Step 1 — "Your total income":\*\* Single Row showing gross income (both same)**



**3. \*\*Step 2 — "Subtract deductions":\*\***

&#x20;  **- Standard deduction: always shown, `deduction` prop, `− ₹75,000` / `− ₹50,000`**

&#x20;  **- Professional tax: only if `o.professionalTaxDeduction > 0`, `dimNew` (not in new regime)**

&#x20;  **- HRA exemption: always shown in old column, `dimNew`, shows `₹0` if no HRA**

&#x20;  **- 80C: always shown in old column, `dimNew`, shows `₹0` if none**

&#x20;  **- 80D: only if `o.deduction80D > 0`, `dimNew`**

&#x20;  **- Personal NPS: only if `o.deductionPersonalNPS > 0`, `dimNew`**

&#x20;  **- Employer NPS: only if either regime has it, shown in BOTH columns (not dimmed)**

&#x20;  **- Home loan: only if `o.deductionHomeLoanInterest > 0`, `dimNew`**

&#x20;  **- Savings interest 80TTA/TTB: only if `o.deduction80TTA\_TTB > 0`, `dimNew`**



**4. \*\*Step 3 — "Taxable income":\*\* `ResultRow` with indigo background**



**5. \*\*Step 4 — "Apply tax slabs":\*\***

&#x20;  **- Side-by-side `SlabTable` components: `grid grid-cols-2 gap-2 mt-2 mb-3 pl-7`**

&#x20;  **- 87A rebate row (deduction style, shows ₹0 if none)**

&#x20;  **- Marginal relief row (only if `n.marginalRelief > 0`, shows "——" for old)**

&#x20;  **- \*\*Tax after rebate row\*\* (only when rebate > 0 in either regime): custom flex row with font-semibold, zero shows "₹0 — no tax" in `text-green-600`**

&#x20;  **- Cess row: "4% Health \& Education Cess"**

&#x20;  **- \*\*Cess explanation\*\* (when either regime has zero tax after rebate): `text-xs text-gray-400 italic pl-7` — "Cess is 4% of tax after rebate — when tax is zero, cess is also zero."**

&#x20;  **- \*\*Final total:\*\* `ResultRow` with `final` prop and gray background, winner column in `text-green-700 text-sm`**



**6. \*\*Footer note:\*\* `text-xs text-gray-400 mt-3` — 'Green amounts (−) reduce your taxable income. Deduction caps already applied. "——" = not available in that regime.'**



**### SectionD\_Education**

**\*\*Props:\*\* `{ results, data }`**

**\*\*Imports:\*\* `useState` from react, `fmt`, `toNum` from utils**



**\*\*Collapsible accordion:\*\* Same pattern as SectionC — `border border-gray-200 rounded-xl overflow-hidden`**

**- Toggle text: "How did we calculate this?" + chevron**

**- Intro when open: `text-xs text-gray-500 mt-3 mb-4` — "Only items that apply to you are shown here."**



**\*\*Dynamic rows\*\* — each row is `{ what, taxName, treatment }`, built conditionally:**



**| Condition | what | taxName | treatment (summarized) |**

**|---|---|---|---|**

**| Always | "Salary income" | "Income from Salary" | "Taxable in both regimes." |**

**| `hasHRA \&\& hraMonthly > 0` | "HRA from your company" | "Part of Salary / Section 10(13A)" | If paying rent: "Partially exempt under old regime. Your exemption: {fmt}." Else: "Fully taxable..." |**

**| `hasBonus \&\& bonus > 0` | "Bonus / incentive" | "Income from Salary" | "Fully taxable in both regimes." |**

**| `hasOtherIncome \&\& fdInterest > 0` | "FD interest" | "Income from Other Sources" | Senior: included in 80TTB. Below 60: no deduction. |**

**| `hasOtherIncome \&\& savingsInterest > 0` | "Savings account interest" | Section 80TTA (below 60) or 80TTB (60+) | Deduction details per age |**

**| Always | "Standard deduction" | "Section 16(ia)" | "Auto-applied. ₹75,000 in new regime, ₹50,000 in old regime." |**

**| `hasProfTax \&\& professionalTax > 0` | "Professional tax" | "Section 16(iii)" | "Old regime only. Deductible up to ₹2,500..." |**

**| `has80CItems.length > 0` | "EPF, LIC, PPF, ELSS, and other 80C investments" | "Section 80C" | Shows entered total vs capped deduction |**

**| `hasPersonalNPS \&\& personalNPS > 0` | "Your personal NPS investment" | "Section 80CCD(1B)" | Shows deduction amount, "over and above 80C limit" |**

**| `hasEmployerNPS \&\& employerNPS > 0` | "Employer's NPS contribution" | "Section 80CCD(2)" | "Available in both regimes. Capped at 14% of basic salary." |**

**| `hasSelfInsurance \&\& selfInsurancePremium > 0` | "Health insurance premium" | "Section 80D" | Shows self + parent breakdown |**

**| `hasHomeLoan \&\& loanOwnership !== 'other' \&\& homeLoanInterest > 0` | "Home loan interest" | "Section 24(b)" | "Capped at ₹2,00,000 for self-occupied property." |**

**| Always | "Government tax rebate" | "Section 87A" | New: ₹60K if ≤₹12L. Old: ₹12.5K if ≤₹5L (not super senior). |**

**| Always | "4% Health \& Education Cess" | "Finance Act" | "Applied to tax after rebate in both regimes." |**



**\*\*Row layout:\*\* `p-3 bg-gray-50 rounded-lg border border-gray-100`**

**- Indigo dot `w-1.5 h-1.5 rounded-full bg-indigo-400` + what (`text-sm font-semibold text-gray-800`) + taxName (`text-xs text-indigo-600 font-medium`)**

**- Treatment: `text-xs text-gray-600 leading-relaxed ml-3.5`**



**### SectionE\_NextSteps**

**\*\*Props:\*\* `{ results, data }`**



**- Conditional suggestion cards (up to 9 depending on user's situation)**

**- First suggestion always highlighted (`bg-indigo-50 border-indigo-200`)**

**- \*\*Financial advice disclaimer\*\* at bottom: "These suggestions are general pointers based on your inputs — not personalised financial or tax advice. Every person's situation is different. Please consult a qualified Chartered Accountant or tax professional before making investment or filing decisions." (`text-\[11px] text-gray-400`)**



**---**



**## 11. Tax Engine (`taxEngine.js`)**



**### Helper**

**```js**

**function n(val) {**

&#x20; **const num = Number(val)**

&#x20; **return isNaN(num) ? 0 : num**

**}**

**```**



**### `applySlabs(income, slabs)` → number**

**Progressive slab calculation. Each slab: `{ upTo: number|null, rate: number }`.**

**```js**

**export function applySlabs(income, slabs) {**

&#x20; **if (income <= 0) return 0**

&#x20; **let tax = 0, prev = 0**

&#x20; **for (const { upTo, rate } of slabs) {**

&#x20;   **if (upTo === null) { tax += (income - prev) \* rate; break }**

&#x20;   **if (income <= upTo) { tax += (income - prev) \* rate; break }**

&#x20;   **tax += (upTo - prev) \* rate**

&#x20;   **prev = upTo**

&#x20; **}**

&#x20; **return Math.round(tax)**

**}**

**```**



**### `calculateGrossIncome(data)` → number**

**```js**

**= (takeHomeSalaryMonthly × 12) + bonus + fdInterest + savingsInterest**

**```**

**\*\*Note:\*\* HRA monthly is NOT added to gross — it's part of take-home already.**



**### `calculateHRAExemption(data)` → number**

**Only if `paysRent \&\& hasHRA \&\& hraMonthly > 0`:**

**```**

**Min of:**

&#x20; **(1) annualHRAReceived = hraMonthly × 12**

&#x20; **(2) hraPct × annualBasic   (50% metro, 40% non-metro)**

&#x20; **(3) annualRentPaid − (10% × annualBasic)**

**Result = max(0, min(condition1, condition2, condition3))**

**```**



**### `calculateNewRegimeTax(data)` → object**

**```**

**grossIncome = calculateGrossIncome(data)**

**annualBasic = basicSalaryMonthly × 12**

**employerNPS = hasEmployerNPS ? min(employerNPS, 14% × annualBasic) : 0**

**taxableIncome = max(0, grossIncome - 75000 - employerNPS)**

**slabTax = applySlabs(taxableIncome, NEW\_REGIME\_SLABS)**

**rebate = (taxableIncome ≤ 1200000) ? min(slabTax, 60000) : 0**

**marginalRelief = (taxableIncome > 1200000 \&\& rebate === 0 \&\& taxAfterRebate > excess) ? taxAfterRebate - excess : 0**

**cess = round(taxAfterRebate × 0.04)**

**totalTax = taxAfterRebate + cess**

**```**

**- Professional tax: ALWAYS 0 in new regime**



**### `calculateOldRegimeTax(data)` → object**

**```**

**Deductions: standardDeduction(50K) + professionalTax(cap 2.5K) + HRA + 80C(cap 1.5L)**

&#x20; **+ 80D + homeLoanInterest(cap 2L) + 80TTA/TTB + personalNPS(cap 50K) + employerNPS**

**taxableIncome = max(0, grossIncome - totalDeductions)**

**slabTax = applySlabs(taxableIncome, age-based slabs)**

**rebate = (!superSenior \&\& taxableIncome ≤ 500000) ? min(slabTax, 12500) : 0**

**cess = round(taxAfterRebate × 0.04)**

**```**



**### `compareRegimes(newResult, oldResult)` → `{ recommended, savings }`**

**Lower totalTax wins. If equal, `new` wins (≤ comparison).**



**### `calculateTDSPosition(totalTax, tdsDeducted)` → `{ type, amount }`**

**- `refund` if tdsDeducted > totalTax**

**- `payable` if tdsDeducted < totalTax**

**- `settled` if equal**



**### `computeTax(data)` → master results object**

**TDS position calculated against the \*\*recommended\*\* regime's totalTax.**

**Combines employer TDS (`data.tdsDeducted`) + bank TDS (`data.bankTDS`) into total TDS.**

**Returns: `{ newRegime, oldRegime, recommended, savings, tds, tdsDeducted, employerTDS, bankTDS }`**



**---**



**## 12. Tax Constants (`constants.js`)**



**```js**

**STANDARD\_DEDUCTION\_NEW = 75\_000**

**STANDARD\_DEDUCTION\_OLD = 50\_000**

**PROF\_TAX\_CAP = 2\_500**

**EMPLOYER\_NPS\_PCT\_OF\_BASIC = 0.14**

**CAP\_80C = 1\_50\_000**

**CAP\_80CCD1B = 50\_000**

**CAP\_80D\_SELF\_BELOW60 = 25\_000**

**CAP\_80D\_SELF\_ABOVE60 = 50\_000**

**CAP\_80D\_PARENTS\_BELOW60 = 25\_000**

**CAP\_80D\_PARENTS\_ABOVE60 = 50\_000**

**CAP\_24B = 2\_00\_000**

**CAP\_80TTA = 10\_000**

**CAP\_80TTB = 50\_000**

**REBATE\_87A\_NEW\_INCOME\_LIMIT = 12\_00\_000**

**REBATE\_87A\_NEW\_MAX = 60\_000**

**MARGINAL\_RELIEF\_THRESHOLD = 12\_00\_000**

**REBATE\_87A\_OLD\_INCOME\_LIMIT = 5\_00\_000**

**REBATE\_87A\_OLD\_MAX = 12\_500**

**CESS\_RATE = 0.04**

**HRA\_METRO\_PCT = 0.50**

**HRA\_NONMETRO\_PCT = 0.40**



**NEW\_REGIME\_SLABS = \[**

&#x20; **{ upTo: 4\_00\_000,  rate: 0.00 },**

&#x20; **{ upTo: 8\_00\_000,  rate: 0.05 },**

&#x20; **{ upTo: 12\_00\_000, rate: 0.10 },**

&#x20; **{ upTo: 16\_00\_000, rate: 0.15 },**

&#x20; **{ upTo: 20\_00\_000, rate: 0.20 },**

&#x20; **{ upTo: 24\_00\_000, rate: 0.25 },**

&#x20; **{ upTo: null,      rate: 0.30 },**

**]**



**OLD\_REGIME\_SLABS\_BELOW60 = \[**

&#x20; **{ upTo: 2\_50\_000, rate: 0.00 },**

&#x20; **{ upTo: 5\_00\_000, rate: 0.05 },**

&#x20; **{ upTo: 10\_00\_000, rate: 0.20 },**

&#x20; **{ upTo: null, rate: 0.30 },**

**]**

**OLD\_REGIME\_SLABS\_SENIOR = \[**

&#x20; **{ upTo: 3\_00\_000, rate: 0.00 },**

&#x20; **{ upTo: 5\_00\_000, rate: 0.05 },**

&#x20; **{ upTo: 10\_00\_000, rate: 0.20 },**

&#x20; **{ upTo: null, rate: 0.30 },**

**]**

**OLD\_REGIME\_SLABS\_SUPER\_SENIOR = \[**

&#x20; **{ upTo: 5\_00\_000, rate: 0.00 },**

&#x20; **{ upTo: 10\_00\_000, rate: 0.20 },**

&#x20; **{ upTo: null, rate: 0.30 },**

**]**

**```**



**---**



**## 13. Utility Functions (`utils.js`)**



**```js**

**fmt(num)           → '₹1,23,456'   // en-IN locale, rounds to integer, returns '₹0' for null/NaN**

**fmtNum(num)        → '1,23,456'    // no ₹ symbol, returns '0' for falsy**

**toNum(val)         → number        // '' or NaN → 0**

**calc80CTotal(data) → number        // sums all selected 80C items from has80CItems array**

**```**



**---**



**## 14. Navigation \& Skip Logic**



**| From | User action | Goes to | Notes |**

**|---|---|---|---|**

**| S01 | "Start calculation" | S02 | |**

**| S02 | "Continue" | S03 | |**

**| S03-S06 | "Continue" | next step | |**

**| S07 (paysRent=No) | "Continue" | S09 | Skips S08 |**

**| S07 (paysRent=Yes) | "Continue" | S08 | |**

**| S08 | "Continue" | S09 | |**

**| S09 back | — | S07 if !paysRent, else S08 | Custom handleBack |**

**| S09-S11 | "Continue" | next step | |**

**| S12 | "Calculate My Tax →" | S13 | Green button |**

**| S13 | After animation | S14 | Auto-advance after \~3s |**

**| S14 | "Go back and edit" | S04 | Preserves all data, returns to salary step |**

**| S14 | "Start Over" | S01 | Resets all state + results |**

**| Any step back | "← Back" | step - 1 | Min step 1, hidden on S01 |**



**---**



**## 15. Tax Law Correctness Notes**



**1. \*\*Professional tax in new regime:\*\* Section 16(iii) is NOT available. Only Section 16(ia) and 80CCD(2) apply.**

**2. \*\*HRA exemption:\*\* Only if paysRent AND hasHRA AND hraMonthly > 0. Three-condition minimum.**

**3. \*\*Super senior (80+) and 87A:\*\* No 87A rebate under old regime. New regime 87A is age-independent.**

**4. \*\*Cess is on tax after rebate:\*\* If 87A wipes out full slab tax → cess = 0.**

**5. \*\*Marginal relief (new regime only):\*\* Near ₹12L boundary. Tax ≤ income above ₹12L.**

**6. \*\*Employer NPS 80CCD(2):\*\* Both regimes, capped at 14% of basic salary.**

**7. \*\*80TTA vs 80TTB:\*\* Below 60 → 80TTA (savings only, ₹10K). 60+ → 80TTB (savings + FD, ₹50K). Old regime only.**

**8. \*\*Metro cities:\*\* Only Delhi, Mumbai, Kolkata, Chennai = 50% HRA.**

**9. \*\*TDS position:\*\* Against \*\*recommended\*\* regime's totalTax.**



**---**



**## 16. Verification Test Cases**



**| Scenario | Expected |**

**|---|---|**

**| Gross ₹10L, no deductions | New regime wins |**

**| Gross ₹10L, max 80C + HRA + 80D + NPS | Old regime likely wins |**

**| Gross ₹12.75L, new regime | Tax = ₹0 (75K standard → 12L taxable, 87A covers full 60K) |**

**| Gross ₹12L exactly, new regime | Tax = ₹0 |**

**| Gross ₹12.01L, new regime | Marginal relief applies |**

**| Senior (60-79), ₹3L gross old | ₹0 (within ₹3L exemption) |**

**| Super senior (80+), ₹5L gross old | ₹0 (within ₹5L exemption), no 87A needed |**

**| Super senior, ₹5.1L gross old | Tax on ₹10K at 20% = ₹2K + cess, NO 87A |**

**| FD interest ₹20K, senior, old | 80TTB covers (₹20K < ₹50K) |**

**| TDS ₹50K, totalTax ₹30K | Refund ₹20K |**

**| Professional tax ₹2,500, new regime | professionalTaxDeduction = 0 |**

**| Professional tax ₹2,500, old regime | professionalTaxDeduction = 2,500 |**

**| 80C ₹2L entered | Capped to ₹1,50,000 silently |**

**| Home loan in someone else's name | deductionHomeLoanInterest = 0 |**

**| New regime, no employer NPS | Only standard deduction ₹75K |**

**| Cess when tax = 0 (after 87A) | Cess = 0 |**

**| Equal tax both regimes | New regime recommended (≤ comparison) |**

**| Bank TDS ₹5K on FD, employer TDS ₹80K, totalTax ₹82K | Payable = ₹82K − ₹85K = refund ₹3K |**

**| FD interest ₹60K, no bank TDS, tax payable | Advance tax warning shown |**



**---**



**## 17. Known Out-of-Scope (Intentional Design Decisions)**



**These items were reviewed and deliberately excluded. They are NOT bugs — they are scope boundaries for a calculator targeting salaried individuals with straightforward tax situations.**



**### Tax Computation Scope**

**| Item | Reason for exclusion |**

**|---|---|**

**| \*\*Surcharge\*\* (10%–37% above ₹50L) | Adds significant complexity; ₹50L+ earners should consult a CA. A warning is shown on S04 when income exceeds ₹50L. |**

**| \*\*Capital gains\*\* (STCG/LTCG) | Completely different tax treatment with separate schedules; not a salaried-income concern for most users. |**

**| \*\*Rental income\*\* | Requires detailed property valuation, municipal taxes, home loan split — out of scope for a quick calculator. |**

**| \*\*Freelance / business income\*\* | Requires ITR-3/4 forms, presumptive taxation, advance tax — different product entirely. |**

**| \*\*Multiple house property income\*\* | Complex; our user is a single-salaried individual. |**

**| \*\*Loss carry-forward / set-off\*\* | Requires multi-year data; out of scope. |**

**| \*\*Section 80E (education loan)\*\* | Niche; adding every possible deduction makes the UI unwieldy. |**

**| \*\*Section 80G (donations)\*\* | Requires eligible institution verification; not core for salaried users. |**

**| \*\*Section 80EEA/80EEB (affordable housing / EV loan)\*\* | Sunset/niche provisions. |**

**| \*\*Section 10(14) LTA exemption\*\* | Requires travel proof; employer-specific. |**

**| \*\*Marginal relief for old regime\*\* | Not applicable — old regime has no equivalent boundary issue like new regime's ₹12L. |**



**### UX / Architecture Scope**

**| Item | Reason for exclusion |**

**|---|---|**

**| \*\*CTC-based salary input\*\* | CTC varies by company structure. Take-home is universally understood and directly measurable from bank statements. The UI makes this clear with hints. |**

**| \*\*Multi-year comparison\*\* | Would require maintaining slab data for multiple FYs; current scope is FY 2025-26 only. |**

**| \*\*PDF/print export\*\* | Nice-to-have; not critical for the core use case. |**

**| \*\*URL-based routing\*\* | Single-page wizard; no need for back-button history or shareable URLs. |**

**| \*\*TypeScript\*\* | Adds build complexity for a project this size; plain JSX is sufficient. |**

**| \*\*Server-side rendering\*\* | No backend needed; purely client-side. |**

**| \*\*State persistence\*\* (localStorage) | Intentionally ephemeral — privacy-first design, no data stored anywhere. |**

**| \*\*Automated test suite\*\* | Verification is done via manual test cases (Section 16). |**

**| \*\*Input sanitization beyond digits\*\* | NumberInput already strips all non-digit characters. No further sanitization needed since there is no backend. |**



**### Tax Law Assumptions**

**| Item | Assumption |**

**|---|---|**

**| \*\*Take-home ≈ gross salary\*\* | By design. The app uses take-home as a proxy. Most salaried users know their bank credit, not their gross/CTC. This is an intentional simplification documented in S04 hints. |**

**| \*\*HRA not added to gross\*\* | HRA is part of take-home salary — it's an allowance already included in what reaches the bank account. |**

**| \*\*Employer NPS cap = 14% of basic\*\* | Correct for FY 2025-26 (increased from 10% in Budget 2024). |**

**| \*\*TDS calculated against recommended regime only\*\* | By design. The app recommends a regime and shows TDS position against that recommendation. Showing TDS against both would confuse non-expert users. |**

**| \*\*No Form 16 / 26AS integration\*\* | No backend; user manually enters TDS amounts. |**

