import React from 'react'
import { fmt } from '../../utils'

export default function SectionB_TaxSummary({ results }) {
  const { recommended, newRegime, oldRegime, tds, tdsDeducted } = results
  const activeData = recommended === 'new' ? newRegime : oldRegime
  const totalTax = activeData.totalTax
  
  // Infographic Math
  const gross = activeData.grossIncome;
  const tax = totalTax;
  // Sum of all deductions
  const deductions = activeData.standardDeduction + activeData.professionalTaxDeduction + (activeData.hraExemption || 0) + (activeData.deduction80C || 0) + (activeData.deduction80D || 0) + (activeData.deductionPersonalNPS || 0) + activeData.employerNPSDeduction + (activeData.deductionHomeLoanInterest || 0) + (activeData.deduction80TTA_TTB || 0);
  const takeHome = Math.max(0, gross - tax - deductions);

  const taxPct = gross > 0 ? (tax / gross) * 100 : 0;
  const dedPct = gross > 0 ? (deductions / gross) * 100 : 0;
  const homePct = gross > 0 ? (takeHome / gross) * 100 : 0;
  
  return (
    <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8">
      <h3 className="text-sm font-bold text-gray-900 text-center mb-6">Tax & TDS Summary (Under Recommended Regime)</h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
          <span className="text-sm text-gray-500 font-medium">Total Tax Payable</span>
          <span className="text-sm font-bold text-gray-900">{fmt(totalTax)}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
          <span className="text-sm text-gray-500 font-medium">Total TDS Deducted</span>
          <span className="text-sm font-bold text-gray-900">{fmt(tdsDeducted)}</span>
        </div>
      </div>
      
      <div className={`p-4 rounded-xl text-center border ${
        tds.type === 'refund' ? 'bg-green-50/50 border-green-100 text-green-800' : 
        tds.type === 'payable' ? 'bg-red-50/50 border-red-100 text-red-800' : 
        'bg-gray-50 border-gray-100 text-gray-700'
      }`}>
        <div className="font-bold text-sm mb-1">
          {tds.type === 'refund' ? 'Refund Expected 🤑' : 
           tds.type === 'payable' ? 'Tax Due ⚠️' : 
           'Perfectly Balanced ⚖️'}
        </div>
        <div className="text-xs opacity-80">
          {tds.type === 'refund' ? `You have overpaid by ${fmt(tds.amount)}. Expect a refund.` : 
           tds.type === 'payable' ? `You still owe ${fmt(tds.amount)}. Please pay advance tax.` : 
           'Your TDS exactly matches your tax liability. No refund, no due.'}
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide text-center mb-6">Where your money goes</h4>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          {/* SVG Donut Chart */}
          <div className="relative w-40 h-40 shrink-0">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="14" />
              
              <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="14" 
                strokeDasharray={`${(homePct / 100) * 314.159} 314.159`} strokeDashoffset={0} 
                className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                
              <circle cx="60" cy="60" r="50" fill="none" stroke="#fbbf24" strokeWidth="14" 
                strokeDasharray={`${(dedPct / 100) * 314.159} 314.159`} strokeDashoffset={-((homePct / 100) * 314.159)} 
                className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                
              <circle cx="60" cy="60" r="50" fill="none" stroke="#ef4444" strokeWidth="14" 
                strokeDasharray={`${(taxPct / 100) * 314.159} 314.159`} strokeDashoffset={-(((homePct + dedPct) / 100) * 314.159)} 
                className="transition-all duration-1000 ease-out" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-gray-900">{homePct.toFixed(0)}%</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Take Home</span>
            </div>
          </div>

          {/* Infographic Legend */}
          <div className="flex flex-col gap-4 w-full sm:w-auto">
            <div className="flex justify-between items-center gap-6 sm:gap-12">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm"></div>
                <span className="text-sm text-gray-600 font-medium">Net Income</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{fmt(takeHome)}</span>
            </div>
            
            <div className="flex justify-between items-center gap-6 sm:gap-12">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm"></div>
                <span className="text-sm text-gray-600 font-medium">Deductions</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{fmt(deductions)}</span>
            </div>

            <div className="flex justify-between items-center gap-6 sm:gap-12">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm"></div>
                <span className="text-sm text-gray-600 font-medium">Taxes</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{fmt(tax)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
