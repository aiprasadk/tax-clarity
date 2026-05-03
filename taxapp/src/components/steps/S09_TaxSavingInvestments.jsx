import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import ConfusedLink from '../ConfusedLink'
import CommonQuestions from '../CommonQuestions'
import { fmt } from '../../utils'

const FREQ_DEFAULTS = { epf: 'monthly', elss: 'monthly', homeLoanPrincipal: 'monthly', ppf: 'annual', lic: 'annual' }

const INVESTMENT_ITEMS = [
  { key: 'epf', label: 'EPF — money deducted from my salary every month', emoji: '💼', tag: '80C', description: 'Employee Provident Fund. Your employer deducts ~12% of your basic pay every month...' },
  { key: 'lic', label: 'LIC or other life insurance premiums', emoji: '🛡️', tag: '80C', description: 'Premiums you personally pay for a term plan, endowment plan, or any life insurance policy...' },
  { key: 'ppf', label: 'PPF — Public Provident Fund', emoji: '📮', tag: '80C', description: 'A government savings scheme with a 15-year lock-in...' },
  { key: 'elss', label: 'ELSS — Tax saving mutual funds (SIP)', emoji: '📈', tag: '80C', description: 'Equity Linked Savings Scheme. A type of mutual fund with a 3-year lock-in...' },
  { key: 'tuition', label: "Children's school or college tuition fees", emoji: '🎓', tag: '80C', description: 'Tuition fees you paid for up to 2 children...' },
  { key: 'homeLoanPrincipal', label: 'Home loan — principal repayment', emoji: '🏡', tag: '80C', description: 'The principal portion of your home loan EMI...' },
  { key: 'nsc', label: 'NSC or Post Office time deposit', emoji: '📬', tag: '80C', description: 'National Savings Certificate (NSC) or Post Office Fixed Deposits (5-year)...' }
]

function FreqToggle({ freq, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-indigo-200 overflow-hidden bg-indigo-50/50 p-0.5 gap-0.5">
      <button 
        type="button"
        onClick={() => onChange('monthly')}
        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${freq === 'monthly' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-400 hover:text-indigo-600'}`}
      >
        Per month
      </button>
      <button 
        type="button"
        onClick={() => onChange('annual')}
        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${freq === 'annual' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-400 hover:text-indigo-600'}`}
      >
        Per year
      </button>
    </div>
  )
}

export default function S09_TaxSavingInvestments(props) {
  const [errors, setErrors] = useState({})
  
  const [frequencies, setFrequencies] = useState(() => {
    const init = {}
    INVESTMENT_ITEMS.forEach(({ key }) => { init[key] = FREQ_DEFAULTS[key] || 'annual' })
    return init
  })
  const [npsFreq, setNpsFreq] = useState('annual')

  function handleNext() {
    const newErrors = {}
    let hasError = false
    
    props.data.has80CItems.forEach(key => {
      if (!props.data.investments80C[key]) {
        newErrors[key] = true
        hasError = true
      }
    })

    if (props.data.hasPersonalNPS === null) {
      newErrors.hasPersonalNPS = true
      hasError = true
    } else if (props.data.hasPersonalNPS && !props.data.personalNPS) {
      newErrors.personalNPS = true
      hasError = true
    }

    setErrors(newErrors)
    if (!hasError) {
      props.goNext()
    }
  }

  function handleGoBack() {
    if (props.data.paysRent === false) {
      props.skipTo(7)
    } else {
      props.goBack()
    }
  }

  function toggleItem(key) {
    const checked = props.data.has80CItems.includes(key)
    let newItems
    if (checked) {
      newItems = props.data.has80CItems.filter(i => i !== key)
      props.update({ investments80C: { ...props.data.investments80C, [key]: '' } })
    } else {
      newItems = [...props.data.has80CItems, key]
    }
    props.update({ has80CItems: newItems })
    setErrors(prev => ({ ...prev, [key]: false }))
  }

  function handleItemChange(key, valStr) {
    const v = Number(valStr) || 0
    const freq = frequencies[key] || 'annual'
    const annualVal = freq === 'monthly' ? String(v * 12) : valStr
    props.update({ investments80C: { ...props.data.investments80C, [key]: annualVal } })
    setErrors(prev => ({ ...prev, [key]: false }))
  }

  function getDisplayVal(key) {
    const stored = Number(props.data.investments80C[key]) || 0
    if (!stored) return ''
    const freq = frequencies[key] || 'annual'
    return freq === 'monthly' ? String(Math.round(stored / 12)) : String(stored)
  }

  function handleNpsChange(valStr) {
    const v = Number(valStr) || 0
    const annualVal = npsFreq === 'monthly' ? String(v * 12) : valStr
    props.update({ personalNPS: annualVal })
    setErrors(prev => ({ ...prev, personalNPS: false }))
  }

  function getNpsDisplayVal() {
    const stored = Number(props.data.personalNPS) || 0
    if (!stored) return ''
    return npsFreq === 'monthly' ? String(Math.round(stored / 12)) : String(stored)
  }

  const total80C = props.data.has80CItems.reduce((acc, key) => acc + (Number(props.data.investments80C[key]) || 0), 0)
  const cappedTotal = Math.min(total80C, 150000)
  const progressPct = Math.min(100, Math.round((total80C / 150000) * 100))
  const isCapped = total80C >= 150000
  const remaining = 150000 - total80C

  return (
    <StepWrapper {...props} goBack={handleGoBack} stepName="Tax Saving Investments">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">📊</div>
        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Tax Saving Investments</div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2">
        Do you make any of these investments?
      </h2>
      <p className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
        These reduce your tax under the old regime only. Tick all that apply. <ConfusedLink label="What are these?" />
      </p>

      <div className="space-y-4 mb-6">
        {INVESTMENT_ITEMS.map(({ key, label, emoji, tag, description }) => {
          const isChecked = props.data.has80CItems.includes(key)
          const hasFreq = key in FREQ_DEFAULTS
          const freq = frequencies[key] || 'annual'
          const annualVal = Number(props.data.investments80C[key]) || 0
          
          return (
            <div key={key} className={`rounded-xl border-2 overflow-hidden transition-all ${isChecked ? 'border-indigo-600' : 'border-gray-200'}`}>
              <label className={`flex items-start gap-3 p-4 cursor-pointer transition-colors ${isChecked ? 'bg-indigo-50' : 'bg-white hover:bg-gray-50'}`}>
                <div className="mt-0.5">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isChecked ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}`}>
                    {isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleItem(key)} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{emoji} {label}</span>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase tracking-wide">{tag}</span>
                  </div>
                  <div className="text-xs text-gray-500">{description}</div>
                </div>
              </label>

              {isChecked && (
                <div className="px-4 pb-4 bg-indigo-50 border-t border-indigo-100 reveal mt-0 pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                    <div className="text-xs text-indigo-600 font-medium">
                      {hasFreq ? "How are you entering this?" : "Enter the annual total."}
                    </div>
                    {hasFreq && (
                      <FreqToggle 
                        freq={freq} 
                        onChange={(f) => {
                          const displayV = getDisplayVal(key)
                          setFrequencies(prev => ({ ...prev, [key]: f }))
                          // Re-apply the display value with new frequency
                          if (displayV) {
                            const num = Number(displayV)
                            const ann = f === 'monthly' ? String(num * 12) : displayV
                            props.update({ investments80C: { ...props.data.investments80C, [key]: ann } })
                          }
                        }} 
                      />
                    )}
                  </div>
                  
                  <NumberInput 
                    id={`input-${key}`}
                    label={hasFreq && freq === 'monthly' ? "Amount per month" : "Amount per year"}
                    value={getDisplayVal(key)}
                    onChange={(val) => handleItemChange(key, val)}
                    placeholder="0"
                  />
                  {errors[key] && <p className="text-sm text-red-600 font-medium mt-1">Required</p>}
                  
                  {hasFreq && freq === 'monthly' && annualVal > 0 && (
                    <div className="text-xs text-indigo-600 font-medium mt-2">
                      = {fmt(annualVal)} per year (what we use for tax calculation)
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {props.data.has80CItems.length > 0 && (
        <div className="reveal p-4 bg-white border-2 border-gray-200 rounded-xl space-y-2 mb-8">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Your 80C total</span>
            <span className={`font-bold ${isCapped ? 'text-green-600' : 'text-gray-900'}`}>{fmt(cappedTotal)} / ₹1,50,000</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${isCapped ? 'bg-green-500' : 'bg-indigo-600'}`} 
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
          {isCapped ? (
            <div className="text-xs text-green-700 font-medium">You've hit the ₹1,50,000 cap. Any additional 80C investments won't reduce tax further.</div>
          ) : (
            <div className="text-xs text-gray-500">{fmt(remaining)} more can still earn a tax benefit.</div>
          )}
        </div>
      )}

      <div className="border-t border-gray-100 pt-6 mb-8">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Do you personally invest in NPS? <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-4">
          NPS = National Pension System. A government retirement scheme. Under Section 80CCD(1B), you can claim an extra ₹50,000 deduction on top of 80C.
        </p>

        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => { props.update({ hasPersonalNPS: true }); setErrors({}) }}
            className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${props.data.hasPersonalNPS === true ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            Yes
          </button>
          <button 
            onClick={() => { props.update({ hasPersonalNPS: false, personalNPS: '' }); setErrors({}) }}
            className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${props.data.hasPersonalNPS === false ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            No
          </button>
        </div>
        {errors.hasPersonalNPS && <p className="text-sm text-red-600 font-medium mb-4">Please answer this question.</p>}

        {props.data.hasPersonalNPS === true && (
          <div className="reveal space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-2">
              <div className="text-xs text-blue-800 font-medium">How are you entering this?</div>
              <FreqToggle 
                freq={npsFreq} 
                onChange={(f) => {
                  const displayV = getNpsDisplayVal()
                  setNpsFreq(f)
                  if (displayV) {
                    const num = Number(displayV)
                    const ann = f === 'monthly' ? String(num * 12) : displayV
                    props.update({ personalNPS: ann })
                  }
                }} 
              />
            </div>
            
            <NumberInput 
              id="nps"
              label={npsFreq === 'monthly' ? "Amount per month" : "Amount per year"}
              value={getNpsDisplayVal()}
              onChange={(val) => handleNpsChange(val)}
              placeholder="0"
            />
            {errors.personalNPS && <p className="text-sm text-red-600 font-medium mt-1">Required</p>}
            
            {npsFreq === 'monthly' && Number(props.data.personalNPS) > 0 && (
              <div className="text-xs text-blue-700 font-medium">
                = {fmt(Number(props.data.personalNPS))} per year (what we use for tax calculation)
              </div>
            )}
            
            <div className="bg-white rounded-lg p-3 text-xs text-gray-600 shadow-sm border border-gray-100">
              <strong>Note:</strong> Capped at ₹50,000 for deduction. Any extra doesn't reduce tax further.
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center gap-2"
      >
        Continue <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </button>

      <CommonQuestions questions={[
        { q: "What is the 80C limit?", a: "The maximum total deduction you can claim across all 80C items (EPF, LIC, PPF, etc.) combined is ₹1.5 Lakh per year." },
        { q: "Do I add Employer's EPF share?", a: "No, only YOUR share (Employee's contribution) goes into 80C. Your employer's share is already tax-exempt up to 12%." },
        { q: "NPS under 80C or 80CCD(1B)?", a: "The first ₹1.5L can go to 80C, but any extra up to ₹50K can be claimed under 80CCD(1B). Our calculator automatically handles this optimization for you." },
        { q: "Home loan principal vs interest?", a: "Principal repayment comes under 80C (₹1.5L cap). Interest repayment comes under Section 24b (₹2L cap). We ask for interest separately." }
      ]} />
    </StepWrapper>
  )
}
