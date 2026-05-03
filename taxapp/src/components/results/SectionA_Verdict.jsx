import React from 'react'
import { fmt } from '../../utils'

export default function SectionA_Verdict({ results, data }) {
  const { recommended, savings, newRegime } = results
  const isNew = recommended === 'new'
  
  return (
    <div className="text-center pt-4 pb-4">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider mb-4 border border-emerald-100">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        Analysis Complete
      </div>
      
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">
        You should choose the <span className="text-indigo-600 border-b-4 border-indigo-200 pb-1">{isNew ? 'New Regime' : 'Old Regime'}</span>
      </h1>
      
      {savings > 0 ? (
        <p className="text-gray-500 text-sm sm:text-base">
          It saves you <span className="font-bold text-green-600">{fmt(savings)}</span> in taxes compared to the {isNew ? 'old' : 'new'} regime.
        </p>
      ) : (
        <p className="text-gray-500 text-sm sm:text-base">
          Both regimes result in the exact same tax liability. The {isNew ? 'New' : 'Old'} Regime is recommended by default.
        </p>
      )}
    </div>
  )
}
