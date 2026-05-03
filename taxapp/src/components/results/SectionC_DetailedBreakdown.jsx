import React from 'react'
import { fmt, fmtN } from '../../utils'
import { computeSlabRows } from '../../taxEngine'
import { NEW_REGIME_SLABS, getOldSlabs } from '../../constants'
import Tooltip from '../Tooltip'

function SectionLabel({ letter, text }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-5">
      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">{letter}</div>
      <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">{text}</div>
    </div>
  )
}

function LineRow({ label, amount, green, muted }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <div className={`text-sm flex items-center ${muted ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
      <div className={`text-sm font-semibold ${green ? 'text-green-600' : muted ? 'text-gray-400' : 'text-gray-700'}`}>{amount}</div>
    </div>
  )
}

function ResultBox({ label, amount, indigo }) {
  return (
    <div className={`flex justify-between items-center rounded-lg px-4 py-3 mt-2 ${indigo ? 'bg-indigo-50/50 border border-indigo-100' : 'bg-gray-50 border border-gray-100'}`}>
      <div className={`text-sm font-semibold flex items-center ${indigo ? 'text-indigo-700' : 'text-gray-500'}`}>{label}</div>
      <div className={`text-base font-bold ${indigo ? 'text-indigo-800' : 'text-gray-800'}`}>{amount}</div>
    </div>
  )
}

function RegimeHeader({ isWinner, title, subtitle, totalTax }) {
  return (
    <div className={`rounded-2xl border ${isWinner ? 'border-indigo-200 bg-white shadow-sm ring-1 ring-indigo-50' : 'border-gray-200 bg-white opacity-90'} p-4 flex justify-between items-center`}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className={`text-sm sm:text-base font-bold ${isWinner ? 'text-gray-900' : 'text-gray-600'}`}>{title}</h3>
          {isWinner && <span className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">RECOMMENDED</span>}
        </div>
        <div className="text-[10px] sm:text-xs text-gray-400">{subtitle}</div>
      </div>
      <div className={`text-2xl sm:text-3xl font-black ${isWinner ? 'text-indigo-600' : 'text-gray-400'}`}>{fmt(totalTax)}</div>
    </div>
  )
}

function RegimeBody({ type, data, activeData, totalTax, isWinner }) {
  const slabs = type === 'new' ? NEW_REGIME_SLABS : getOldSlabs(data.ageGroup)
  const slabRows = computeSlabRows(activeData.taxableIncome, slabs)

  const takeHomeSalary = (Number(data.takeHomeSalaryMonthly) || 0) * 12
  const bonus = data.hasBonus ? (Number(data.bonus) || 0) : 0
  const fdInterest = data.hasOtherIncome ? (Number(data.fdInterest) || 0) : 0
  const savingsInterest = data.hasOtherIncome ? (Number(data.savingsInterest) || 0) : 0

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm flex flex-col h-full">
      <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">BREAKDOWN</div>
      
      <SectionLabel letter="A" text="Your Income" />
      <div className="space-y-1">
        <LineRow label="Annual salary (take-home)" amount={fmt(takeHomeSalary)} />
        {bonus > 0 && <LineRow label="Bonus / incentive" amount={fmt(bonus)} />}
        {fdInterest > 0 && <LineRow label="FD interest" amount={fmt(fdInterest)} />}
        {savingsInterest > 0 && <LineRow label="Savings account interest" amount={fmt(savingsInterest)} />}
      </div>
      <ResultBox label={<>= Gross Income <Tooltip text="Your total income before any deductions are applied."/></>} amount={fmt(activeData.grossIncome)} />

      <SectionLabel letter="B" text="Deductions (−)" />
      <div className="space-y-1">
        <LineRow label={<>Standard deduction <Tooltip text="A flat deduction available to all salaried individuals."/></>} amount={`− ${fmt(type === 'new' ? 75000 : 50000)}`} green />
        {activeData.professionalTaxDeduction > 0 && <LineRow label="Professional tax" amount={`− ${fmt(activeData.professionalTaxDeduction)}`} green />}
        {activeData.employerNPSDeduction > 0 && <LineRow label={<>Employer NPS (80CCD2) <Tooltip text="Deduction up to 14% of basic salary, available in BOTH regimes!"/></>} amount={`− ${fmt(activeData.employerNPSDeduction)}`} green />}
        {type === 'old' && activeData.hraExemption > 0 && <LineRow label={<>HRA Exemption <Tooltip text="Based on your rent paid, basic salary, and city type."/></>} amount={`− ${fmt(activeData.hraExemption)}`} green />}
        {type === 'old' && activeData.deduction80C > 0 && <LineRow label={<>80C Investments <Tooltip text="Includes EPF, PPF, ELSS, LIC. Maximum limit is ₹1.5L."/></>} amount={`− ${fmt(activeData.deduction80C)}`} green />}
        {type === 'old' && activeData.deduction80D > 0 && <LineRow label={<>Health Ins. (80D) <Tooltip text="Premiums paid for health insurance for self and parents."/></>} amount={`− ${fmt(activeData.deduction80D)}`} green />}
        {type === 'old' && activeData.deductionPersonalNPS > 0 && <LineRow label={<>Personal NPS (80CCD1B) <Tooltip text="Extra ₹50k deduction for personal NPS investments over 80C."/></>} amount={`− ${fmt(activeData.deductionPersonalNPS)}`} green />}
        {type === 'old' && activeData.deductionHomeLoanInterest > 0 && <LineRow label={<>Home Loan Int. (24b) <Tooltip text="Interest paid on home loan. Max ₹2L for self-occupied."/></>} amount={`− ${fmt(activeData.deductionHomeLoanInterest)}`} green />}
        {type === 'old' && activeData.deduction80TTA_TTB > 0 && <LineRow label={<>Savings Int. (80TTA/TTB) <Tooltip text="Deduction on savings account interest (Max ₹10k) or FD for seniors (Max ₹50k)."/></>} amount={`− ${fmt(activeData.deduction80TTA_TTB)}`} green />}
      </div>
      
      {type === 'new' && activeData.employerNPSDeduction === 0 && (
        <div className="flex items-center gap-2 mt-3 p-3 border border-gray-100 rounded-lg text-gray-500 bg-gray-50/50">
          <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center shrink-0 text-[10px] font-bold">i</div>
          <div className="text-xs">New regime: only standard deduction applies.</div>
        </div>
      )}
      
      <ResultBox label="Taxable Income" amount={fmt(activeData.taxableIncome)} indigo />

      <SectionLabel letter="C" text="Tax on Slabs" />
      <div className="rounded-lg overflow-hidden border border-gray-200 mb-4 mt-2">
        <div className="grid grid-cols-4 gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 bg-gray-50">
          <div className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">Income Slab</div>
          <div className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase text-center">Rate</div>
          <div className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase text-right">Your Income</div>
          <div className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase text-right">Tax</div>
        </div>
        <div className="divide-y divide-gray-100">
          {slabRows.map((row, i) => (
            <div key={i} className={`grid grid-cols-4 gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm ${row.active ? 'bg-indigo-50/30 text-indigo-800 font-medium' : 'text-gray-400'}`}>
              <div className="truncate" title={row.label}>{row.label}</div>
              <div className="text-center">{row.rate * 100}%</div>
              <div className="text-right">{row.incomeInBand > 0 ? fmtN(row.incomeInBand) : '-'}</div>
              <div className="text-right">{row.tax > 0 ? fmt(row.tax) : '₹0'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1 mt-auto">
        {activeData.rebate > 0 && <LineRow label="Section 87A Rebate" amount={`− ${fmt(activeData.rebate)}`} green />}
        {activeData.marginalRelief > 0 && <LineRow label="Marginal Relief" amount={`− ${fmt(activeData.marginalRelief)}`} green />}
        <LineRow label="Health & Education Cess (4%)" amount={`+ ${fmt(activeData.cess)}`} muted={activeData.cess === 0} />
      </div>
      
      <div className={`mt-4 flex justify-between items-center rounded-xl px-4 py-3 ${isWinner ? 'bg-indigo-600' : 'bg-gray-100'}`}>
        <div className={`text-sm font-bold ${isWinner ? 'text-white' : 'text-gray-600'}`}>Total Tax Payable</div>
        <div className={`text-xl font-black ${isWinner ? 'text-white' : 'text-gray-900'}`}>{fmt(totalTax)}</div>
      </div>
    </div>
  )
}

export default function SectionC_DetailedBreakdown({ results, data }) {
  const isNewRec = results.recommended === 'new'

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Detailed Tax Breakdown</h2>
        <p className="text-sm text-gray-500 mt-1">Here's exactly how the math works out for both regimes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6 mb-4 xl:mb-6">
        <RegimeHeader 
          isWinner={isNewRec} 
          title="New Regime" 
          subtitle="Default tax regime with standard slabs" 
          totalTax={results.newRegime.totalTax} 
        />
        <RegimeHeader 
          isWinner={!isNewRec} 
          title="Old Regime" 
          subtitle="With all your specified deductions" 
          totalTax={results.oldRegime.totalTax} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6">
        <RegimeBody 
          type="new"
          data={data}
          activeData={results.newRegime}
          totalTax={results.newRegime.totalTax}
          isWinner={isNewRec}
        />
        <RegimeBody 
          type="old"
          data={data}
          activeData={results.oldRegime}
          totalTax={results.oldRegime.totalTax}
          isWinner={!isNewRec}
        />
      </div>
    </div>
  )
}
