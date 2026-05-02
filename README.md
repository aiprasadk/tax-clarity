# 🧾 TaxClarity — Indian Income Tax Calculator (FY 2025–26)

A modern, step-by-step **income tax calculator web app** designed for salaried individuals in India to **compare Old vs New tax regimes** and make a clear decision.

---

## 🚀 Live Demo

> *(Add your Vercel/Netlify link here after deployment)*
> 🔗 https://your-app-link.vercel.app

---

## 💡 Problem

Most tax calculators:

* Ask for confusing inputs like CTC
* Provide raw numbers without guidance
* Don’t clearly tell which tax regime is better

---

## ✅ Solution — TaxClarity

TaxClarity simplifies tax calculation into a **guided experience**:

* 📊 Step-by-step input flow (no jargon)
* ⚡ Real-time tax calculation
* 🔍 Old vs New regime comparison
* 💡 Clear recommendation:

  > “Choose this regime. You save ₹X”
* 🔒 100% client-side — no data stored

---

## 🧠 Key Features

* Multi-step interactive UI (14 steps)
* Live tax preview panel
* Covers major deductions:

  * 80C (EPF, PPF, ELSS, etc.)
  * 80D (Health Insurance)
  * HRA exemption
  * Home loan interest (Section 24)
* TDS adjustment (refund / payable)
* Age-based tax slabs
* Edge case handling:

  * Rebate 87A
  * Marginal relief
* Shareable state via URL

---

## 🛠 Tech Stack

| Layer      | Technology                     |
| ---------- | ------------------------------ |
| Frontend   | React (Vite)                   |
| Styling    | Tailwind CSS                   |
| State      | React useState                 |
| Logic      | Custom tax engine (JavaScript) |
| Deployment | Vercel / Netlify               |

---

## 📂 Project Structure

```
TaxCalculator/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── taxEngine.js
    ├── constants.js
    ├── utils.js
    ├── index.css
    └── components/
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/tax-clarity.git
cd tax-clarity
```

### 2. Install dependencies

```
npm install
```

### 3. Run development server

```
npm run dev
```

### 4. Build for production

```
npm run build
```

---

## 📌 How It Works

1. User enters salary and income details
2. App calculates:

   * Gross Income
   * Deductions (based on regime)
   * Taxable Income
3. Applies slab-wise tax rules
4. Compares both regimes
5. Displays:

   * Best regime
   * Tax payable
   * Savings

---

## 🎯 Design Philosophy

> Users don’t want calculations.
> They want **clarity and decisions**.

This app focuses on:

* Simplifying complexity
* Guiding user flow
* Providing actionable output

---

## 🔐 Privacy First

* No backend
* No login
* No cookies
* No data storage

All calculations run **entirely in the browser**.

---

## 📈 Future Improvements

* Support for freelancers & business income
* Capital gains handling
* Advanced tax planning suggestions
* Export PDF report
* Multi-language support

---

## 🙌 Acknowledgements

Built as part of an **AI-powered learning journey**, combining:

* Real-world problem solving
* UI/UX thinking
* Financial logic implementation

---

## 📬 Feedback

If you have suggestions or found a bug, feel free to open an issue or connect!

---

## ⭐ If you found this useful

Give it a ⭐ on GitHub — it helps!

---
