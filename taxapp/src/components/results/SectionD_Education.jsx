import React, { useState } from 'react'
import { fmt } from '../../utils'

export default function SectionD_Education({ results, data }) {
  const [open, setOpen] = useState(false)

  const rows = []
  
  rows.push({
    what: "Salary income", taxName: "Income from Salary",
    treatment: "Taxable in both regimes."
  })

  if (data.hasHRA && Number(data.hraMonthly) > 0) {
    if (data.paysRent) {
      rows.push({
        what: "HRA from your company", taxName: "Part of Salary / Section 10(13A)",
        treatment: `Partially exempt under old regime based on your rent and city. Your exemption calculated: ${fmt(results.oldRegime.hraExemption)}.`
      })
    } else {
      rows.push({
        what: "HRA from your company", taxName: "Part of Salary",
        treatment: "Fully taxable because you selected that you do not pay rent."
      })
    }
  }

  if (data.hasBonus && Number(data.bonus) > 0) {
    rows.push({
      what: "Bonus / incentive", taxName: "Income from Salary",
      treatment: "Fully taxable in both regimes."
    })
  }

  if (data.hasOtherIncome && Number(data.fdInterest) > 0) {
    rows.push({
      what: "FD interest", taxName: "Income from Other Sources",
      treatment: (data.ageGroup === 'senior' || data.ageGroup === 'superSenior') 
        ? "Fully taxable in new regime. In old regime, eligible for deduction under 80TTB." 
        : "Fully taxable in both regimes. No deduction available for FD interest below age 60."
    })
  }

  if (data.hasOtherIncome && Number(data.savingsInterest) > 0) {
    rows.push({
      what: "Savings account interest", taxName: "Section 80TTA / 80TTB",
      treatment: (data.ageGroup === 'senior' || data.ageGroup === 'superSenior')
        ? "Included under 80TTB cap of ₹50,000 in old regime."
        : "Eligible for deduction up to ₹10,000 under 80TTA in old regime."
    })
  }

  rows.push({
    what: "Standard deduction", taxName: "Section 16(ia)",
    treatment: "Auto-applied. ₹75,000 in new regime, ₹50,000 in old regime."
  })

  if (data.hasProfTax && Number(data.professionalTax) > 0) {
    rows.push({
      what: "Professional tax", taxName: "Section 16(iii)",
      treatment: "Old regime only. Deductible up to ₹2,500."
    })
  }

  if (data.has80CItems && data.has80CItems.length > 0) {
    rows.push({
      what: "EPF, LIC, PPF, ELSS, and other 80C investments", taxName: "Section 80C",
      treatment: `Old regime only. Capped at ₹1,50,000. Your eligible deduction: ${fmt(results.oldRegime.deduction80C)}.`
    })
  }

  if (data.hasPersonalNPS && Number(data.personalNPS) > 0) {
    rows.push({
      what: "Your personal NPS investment", taxName: "Section 80CCD(1B)",
      treatment: `Old regime only. Deductible up to ₹50,000 over and above 80C limit. Your deduction: ${fmt(results.oldRegime.deductionPersonalNPS)}.`
    })
  }

  if (data.hasEmployerNPS && Number(data.employerNPS) > 0) {
    rows.push({
      what: "Employer's NPS contribution", taxName: "Section 80CCD(2)",
      treatment: `Available in both regimes. Capped at 14% of basic salary. Your deduction: ${fmt(results.newRegime.employerNPSDeduction)}.`
    })
  }

  if (data.hasSelfInsurance || data.hasParentInsurance) {
    rows.push({
      what: "Health insurance premium", taxName: "Section 80D",
      treatment: `Old regime only. Your eligible deduction: ${fmt(results.oldRegime.deduction80D)} based on age limits.`
    })
  }

  if (data.hasHomeLoan && data.loanOwnership !== 'other' && Number(data.homeLoanInterest) > 0) {
    rows.push({
      what: "Home loan interest", taxName: "Section 24(b)",
      treatment: `Old regime only. Capped at ₹2,00,000 for self-occupied property. Your deduction: ${fmt(results.oldRegime.deductionHomeLoanInterest)}.`
    })
  }

  rows.push({
    what: "Government tax rebate", taxName: "Section 87A",
    treatment: "New: Up to ₹60K if income ≤ ₹12L. Old: Up to ₹12.5K if income ≤ ₹5L."
  })

  rows.push({
    what: "4% Health & Education Cess", taxName: "Finance Act",
    treatment: "Applied to tax after rebate in both regimes."
  })

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm mt-4">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors focus:outline-none"
      >
        <span className="text-sm font-semibold text-gray-800">How did we calculate this?</span>
        <svg className={`w-5 h-5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-500 mt-3 mb-4">Only items that apply to you are shown here based on your inputs.</p>
          <div className="space-y-2">
            {rows.map((row, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></div>
                  <span className="text-sm font-semibold text-gray-800">{row.what}</span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium ml-1 shrink-0">{row.taxName}</span>
                </div>
                <div className="text-xs text-gray-600 leading-relaxed ml-3">
                  {row.treatment}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
