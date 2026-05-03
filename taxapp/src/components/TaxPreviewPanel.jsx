import { useState } from 'react'
import { computeTax, computeSlabRows } from '../taxEngine'
import { NEW_REGIME_SLABS, getOldSlabs, EMPTY_REGIME } from '../constants'
import { fmt, fmtN } from '../utils'

function SectionLabel({ letter, text }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0">{letter}</div>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{text}</div>
    </div>
  )
}

function LineRow({ label, amount, green, muted }) {
  return (
    <div className="flex justify-between items-center py-0.5">
      <div className={`text-xs ${muted ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
      <div className={`text-xs font-semibold ${green ? 'text-green-600' : muted ? 'text-gray-400' : 'text-gray-700'}`}>{amount}</div>
    </div>
  )
}

function ResultBox({ label, amount, indigo }) {
  return (
    <div className={`flex justify-between items-center rounded-lg px-3 py-2 mt-1.5 ${indigo ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-100 border border-gray-200'}`}>
      <div className={`text-xs ${indigo ? 'text-indigo-700' : 'text-gray-500'}`}>= {label}</div>
      <div className={`text-sm font-bold ${indigo ? 'text-indigo-800' : 'text-gray-800'}`}>{amount}</div>
    </div>
  )
}

export default function TaxPreviewPanel({ data }) {
  const [userPickedRegime, setUserPickedRegime] = useState(null)

  const takeHomeSalary = (Number(data.takeHomeSalaryMonthly) || 0) * 12
  const bonus = (data.hasBonus && Number(data.bonus) > 0) ? (Number(data.bonus) || 0) : 0
  const fdInterest = (data.hasOtherIncome && Number(data.fdInterest) > 0) ? (Number(data.fdInterest) || 0) : 0
  const savingsInterest = (data.hasOtherIncome && Number(data.savingsInterest) > 0) ? (Number(data.savingsInterest) || 0) : 0
  const hasIncome = takeHomeSalary > 0

  let newRegimeData = { ...EMPTY_REGIME }
  let oldRegimeData = { ...EMPTY_REGIME }
  let computeSuccess = false

  if (hasIncome) {
    try { 
      const results = computeTax(data)
      newRegimeData = results.newRegime
      oldRegimeData = results.oldRegime
      computeSuccess = true 
    } catch { 
      /* fallback to empty */ 
    }
  }

  const newTotal = newRegimeData.totalTax || 0
  const oldTotal = oldRegimeData.totalTax || 0
  const savings = Math.abs(newTotal - oldTotal)
  const betterRegime = newTotal <= oldTotal ? 'new' : 'old'
  const regime = userPickedRegime !== null ? userPickedRegime : (computeSuccess ? betterRegime : 'new')
  
  const activeData = regime === 'new' ? newRegimeData : oldRegimeData
  const slabs = regime === 'new' ? NEW_REGIME_SLABS : getOldSlabs(data.ageGroup)
  const slabRows = computeSuccess ? computeSlabRows(activeData.taxableIncome, slabs) : []

  const grossIncome = takeHomeSalary + bonus + fdInterest + savingsInterest

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md shadow-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="text-sm font-bold text-gray-900">Your Live Tax Estimate</div>
        <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5">FY 2025-26</div>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between gap-2">
        <div className="flex rounded-full border border-gray-200 bg-gray-50 p-0.5 gap-0.5">
          <button onClick={() => setUserPickedRegime('new')} className={`py-1.5 px-3 text-xs font-semibold transition-all rounded-full ${regime === 'new' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            New {betterRegime === 'new' && <span className="ml-1 text-green-600 text-[10px] font-bold">Best</span>}
          </button>
          <button onClick={() => setUserPickedRegime('old')} className={`py-1.5 px-3 text-xs font-semibold transition-all rounded-full ${regime === 'old' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            Old {betterRegime === 'old' && <span className="ml-1 text-green-600 text-[10px] font-bold">Best</span>}
          </button>
        </div>
        <button onClick={() => setUserPickedRegime(regime === 'new' ? 'old' : 'new')} className="text-[11px] text-indigo-500 hover:text-indigo-700 underline decoration-dotted underline-offset-2 shrink-0">
          Compare {regime === 'new' ? 'Old' : 'New'} regime
        </button>
      </div>

      {!hasIncome ? (
        <div className="px-4 py-8 text-center flex flex-col items-center">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          </div>
          <div className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
            {"Enter your salary to\nsee a live tax estimate"}
          </div>
        </div>
      ) : (
        <div className="space-y-1 pb-4">
          {computeSuccess && (
            <div className="mx-4 mt-3 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-4 text-white">
              <div className="text-xs text-indigo-200 font-medium mb-1">Estimated Tax Payable</div>
              <div className="text-2xl font-black tracking-tight">{fmt(activeData.totalTax)}</div>
              <div className="text-xs text-indigo-300 mt-1">On annual income of {fmt(grossIncome)}</div>
            </div>
          )}

          <div className="px-4 pt-3 pb-1">
            <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">BREAKDOWN</div>
          </div>

          <div className="px-4 pb-2">
            <SectionLabel letter="A" text="Your Income" />
            <div className="space-y-0.5">
              <LineRow label="Annual salary (take-home)" amount={fmt(takeHomeSalary)} />
              {bonus > 0 && <LineRow label="Bonus / incentive" amount={fmt(bonus)} />}
              {fdInterest > 0 && <LineRow label="FD interest" amount={fmt(fdInterest)} />}
              {savingsInterest > 0 && <LineRow label="Savings account interest" amount={fmt(savingsInterest)} />}
            </div>
            <ResultBox label="Gross Income" amount={fmt(grossIncome)} />
          </div>

          <div className="px-4 py-2">
            <SectionLabel letter="B" text="Deductions (−)" />
            <div className="space-y-0.5">
              <LineRow label="Standard deduction" amount={`− ${fmt(regime === 'new' ? 75000 : 50000)}`} green />
              {activeData.professionalTaxDeduction > 0 && <LineRow label="Professional tax" amount={`− ${fmt(activeData.professionalTaxDeduction)}`} green />}
              {activeData.employerNPSDeduction > 0 && <LineRow label="Employer NPS (80CCD2)" amount={`− ${fmt(activeData.employerNPSDeduction)}`} green />}
              {regime === 'old' && activeData.hraExemption > 0 && <LineRow label="HRA Exemption" amount={`− ${fmt(activeData.hraExemption)}`} green />}
              {regime === 'old' && activeData.deduction80C > 0 && <LineRow label="80C Investments" amount={`− ${fmt(activeData.deduction80C)}`} green />}
              {regime === 'old' && activeData.deduction80D > 0 && <LineRow label="Health Ins. (80D)" amount={`− ${fmt(activeData.deduction80D)}`} green />}
              {regime === 'old' && activeData.deductionPersonalNPS > 0 && <LineRow label="Personal NPS (80CCD1B)" amount={`− ${fmt(activeData.deductionPersonalNPS)}`} green />}
              {regime === 'old' && activeData.deductionHomeLoanInterest > 0 && <LineRow label="Home Loan Int. (24b)" amount={`− ${fmt(activeData.deductionHomeLoanInterest)}`} green />}
              {regime === 'old' && activeData.deduction80TTA_TTB > 0 && <LineRow label="Savings Int. (80TTA/TTB)" amount={`− ${fmt(activeData.deduction80TTA_TTB)}`} green />}
            </div>
            {regime === 'new' && activeData.employerNPSDeduction === 0 && (
              <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-gray-50 rounded-lg">
                <svg className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                <div className="text-[11px] text-gray-400 leading-relaxed">New regime: only standard deduction applies.</div>
              </div>
            )}
            <ResultBox label="Taxable Income" amount={fmt(activeData.taxableIncome)} indigo />
          </div>

          <div className="px-4 py-2">
            <SectionLabel letter="C" text="Tax on Slabs" />
            
            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-2">
              <div className="grid grid-cols-4 gap-1 px-2.5 py-2 border-b border-gray-200 bg-gray-100/50">
                <div className="text-[10px] font-semibold text-gray-500 uppercase">Income Slab</div>
                <div className="text-[10px] font-semibold text-gray-500 uppercase text-center">Rate</div>
                <div className="text-[10px] font-semibold text-gray-500 uppercase text-right">Your Income</div>
                <div className="text-[10px] font-semibold text-gray-500 uppercase text-right">Tax</div>
              </div>
              <div className="divide-y divide-gray-100">
                {slabRows.map((row, i) => (
                  <div key={i} className={`grid grid-cols-4 gap-1 px-2.5 py-1.5 text-[11px] ${row.active ? 'bg-indigo-50/60 text-indigo-700 font-medium' : 'text-gray-400'}`}>
                    <div className="truncate" title={row.label}>{row.label}</div>
                    <div className="text-center">{row.rate * 100}%</div>
                    <div className="text-right">{row.incomeInBand > 0 ? fmtN(row.incomeInBand) : '-'}</div>
                    <div className="text-right">{row.tax > 0 ? fmt(row.tax) : '-'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-0.5">
              {activeData.rebate > 0 && <LineRow label="87A Rebate" amount={`− ${fmt(activeData.rebate)}`} green />}
              {activeData.marginalRelief > 0 && <LineRow label="Marginal Relief" amount={`− ${fmt(activeData.marginalRelief)}`} green />}
              {activeData.cess > 0 ? (
                <LineRow label="Health & Education Cess (4%)" amount={`+ ${fmt(activeData.cess)}`} />
              ) : (
                <LineRow label="Health & Education Cess (4%)" amount="₹0" muted />
              )}
            </div>

            <div className="mt-2 flex justify-between items-center bg-indigo-600 rounded-xl px-3 py-2.5">
              <div className="text-xs font-bold text-indigo-200">Total Tax Payable</div>
              <div className="text-lg font-black text-white">{fmt(activeData.totalTax)}</div>
            </div>
          </div>

          {computeSuccess && savings > 0 && (
            <div className="mx-4 mt-2 mb-1 flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div className="text-xs font-bold text-green-800">
                {betterRegime === 'new' ? 'New' : 'Old'} Regime saves you {fmt(savings)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
