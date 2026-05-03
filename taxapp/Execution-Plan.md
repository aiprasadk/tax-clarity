# TaxClarity — Phased Execution Plan

This plan breaks down the Tax Calculator development into 8 manageable phases. After each phase, the app will remain in a fully runnable state, allowing you to preview the progress visually and functionally before moving on.

### Phase 1: Project Scaffolding & Design System Foundation
**Goal:** Set up the basic environment and global styles.
* **Tasks:**
  * Initialize Vite React project with Tailwind CSS.
  * Configure `tailwind.config.js`, `postcss.config.js`, and `vite.config.js`.
  * Define global styles and custom animations in `index.css`.
  * Create an empty `App.jsx` skeleton with the `INITIAL_STATE` configuration.
* **Runnable State:** You can open the app and see a blank page with the correct background color, font (Inter), and Tailwind loaded.

### Phase 2: Core Routing & Shared Components
**Goal:** Build the form shell and establish navigation between steps.
* **Tasks:**
  * Implement the state machine in `App.jsx` (`step`, `data`, `goNext`, `goBack`, etc.).
  * Create shared UI components: `ProgressBar`, `StepWrapper`, `NumberInput`, `FrequencyInput`, `CommonQuestions`, and `ConfusedLink`.
  * Stub out empty components for `S01` to `S14` just to allow routing.
* **Runnable State:** You can click "Next" and "Back" to navigate through all 14 empty steps. The progress bar updates, and the layout shell is visible.

### Phase 3: Landing & User Profile (Steps 1–3)
**Goal:** Build the entry point and initial data gathering steps.
* **Tasks:**
  * Implement `S01_Landing` with hero section, feature cards, and "Start" button.
  * Implement `S02_FinancialYear` (Static locked option).
  * Implement `S03_AgeGroup` (Age selection buttons).
* **Runnable State:** A fully styled, functional landing page. You can click "Start" and complete the first few profile questions.

### Phase 4: Income & Salary Entry (Steps 4–6)
**Goal:** Capture the user's earnings.
* **Tasks:**
  * Implement `S04_SalaryDetails` (Basic vs Take-home).
  * Implement `S05_SalaryComponents` (Bonus, HRA, Professional Tax, Employer NPS).
  * Implement `S06_OtherIncome` (FD & Savings Interest).
* **Runnable State:** You can enter all income streams, toggling between Monthly and Per Year frequencies, with real-time green validation checkmarks appearing.

### Phase 5: Deductions & Real Estate (Steps 7–11)
**Goal:** Capture all tax-saving investments and expenses.
* **Tasks:**
  * Implement `S07_PaysRent` and `S08_RentDetails`.
  * Implement `S09_TaxSavingInvestments` (80C items like EPF, LIC, PPF).
  * Implement `S10_HealthInsurance` (80D for self/parents).
  * Implement `S11_HomeLoan` (Section 24 interest).
* **Runnable State:** You can complete the entire data entry form covering all major Indian tax deduction categories.

### Phase 6: Tax Engine & Preview Panel Integration
**Goal:** Bring the calculator to life with real-time math.
* **Tasks:**
  * Build `constants.js` with all tax slabs and limits.
  * Build `taxEngine.js` containing the core logic (`computeTax`, `calculateOldRegime`, `calculateNewRegime`).
  * Implement `TaxPreviewPanel` to show the sticky, live-updating breakdown on the right side of the screen.
  * Integrate the panel into `StepWrapper`.
* **Runnable State:** As you fill out steps 4–11, you will see your tax estimate and "Best Regime" recommendation update instantly on the side.

### Phase 7: TDS & Calculation Simulator (Steps 12–13)
**Goal:** Capture already paid taxes and build suspense before the reveal.
* **Tasks:**
  * Implement `S12_TDS` (Taxes already deducted by employer/bank).
  * Implement `S13_Calculating` (A timed animation that pretends to "crunch the numbers" before setting the final results).
* **Runnable State:** The full data entry flow is complete, and clicking "Calculate My Tax" shows a loading animation before moving to the final step.

### Phase 8: Final Results Page (Step 14)
**Goal:** Present the final verdict cleanly.
* **Tasks:**
  * Implement `S14_Results`.
  * Break down the results into sections: `SectionA_Verdict`, `SectionB_TaxSummary`, `SectionC_DetailedBreakdown`, `SectionD_Education`, and `SectionE_NextSteps`.
* **Runnable State:** End-to-end functionality completed. You can run through the entire app and receive a beautifully formatted, print-ready tax breakdown and recommendation.
