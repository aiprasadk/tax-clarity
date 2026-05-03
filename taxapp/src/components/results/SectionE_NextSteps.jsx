import React from 'react'
import { fmt } from '../../utils'

export default function SectionE_NextSteps({ results, data }) {
  const suggestions = []
  
  if (results.tds.type === 'payable' && results.tds.amount > 10000) {
    suggestions.push({
      title: "Pay Advance Tax immediately",
      desc: `Your tax payable is ${fmt(results.tds.amount)} which exceeds ₹10,000. You are liable to pay Advance Tax to avoid penal interest under Section 234B/C.`,
      urgent: true
    })
  }

  if (results.recommended === 'new' && data.has80CItems && data.has80CItems.length > 0) {
    suggestions.push({
      title: "Rethink 80C lock-ins",
      desc: "Since the new regime is better for you, your 80C investments (like ELSS, PPF) don't give you extra tax benefits. Consider investing based on returns rather than tax lock-ins.",
      urgent: false
    })
  }
  
  if (results.recommended === 'old' && results.oldRegime.deduction80C < 150000) {
    suggestions.push({
      title: "Maximize 80C limit",
      desc: `You have only claimed ${fmt(results.oldRegime.deduction80C)} under 80C. Investing ${fmt(150000 - results.oldRegime.deduction80C)} more will save you additional tax under the old regime.`,
      urgent: false
    })
  }

  if (results.recommended === 'old' && !data.hasPersonalNPS) {
    suggestions.push({
      title: "Consider NPS for extra ₹50K deduction",
      desc: "You can claim an extra ₹50,000 deduction under 80CCD(1B) by investing in NPS, above the 80C limit.",
      urgent: false
    })
  }

  if (results.tds.type === 'refund') {
    suggestions.push({
      title: "File your ITR early to get your refund",
      desc: `You have overpaid tax by ${fmt(results.tds.amount)}. File your return as soon as the forms are available to get your refund processed quickly.`,
      urgent: false
    })
  }

  if (suggestions.length === 0) {
    suggestions.push({
      title: "You are fully optimized!",
      desc: "Based on your inputs, you don't need any immediate tax-saving actions. Just ensure you file your ITR before the July 31st deadline.",
      urgent: false
    })
  }

  return (
    <div className="mt-6 mb-4">
      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /></svg>
        Actionable Insights for You
      </h3>
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div key={i} className={`p-4 rounded-xl border ${i === 0 ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start gap-2">
              {s.urgent ? (
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse"></div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></div>
              )}
              <div>
                <h4 className={`text-sm font-bold ${s.urgent ? 'text-red-700' : 'text-gray-900'}`}>{s.title}</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-4 leading-relaxed italic text-center">
        These suggestions are general pointers based on your inputs — not personalised financial or tax advice. Every person's situation is different. Please consult a qualified Chartered Accountant or tax professional before making investment or filing decisions.
      </p>
    </div>
  )
}
