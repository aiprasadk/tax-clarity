import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import FrequencyInput from '../FrequencyInput'
import ConfusedLink from '../ConfusedLink'
import CommonQuestions from '../CommonQuestions'
import { fmt } from '../../utils'

export default function S04_SalaryDetails(props) {
  const [errors, setErrors] = useState({})
  
  const takeHome = Number(props.data.takeHomeSalaryMonthly) || 0
  const basic = Number(props.data.basicSalaryMonthly) || 0
  const bonus = Number(props.data.bonus) || 0
  
  const annualTakeHome = takeHome * 12
  const showBasicWarning = basic > takeHome && takeHome > 0
  const showSurchargeWarning = annualTakeHome > 5000000

  function handleNext() {
    const newErrors = {}
    if (!props.data.takeHomeSalaryMonthly) newErrors.takeHome = true
    if (!props.data.basicSalaryMonthly) newErrors.basic = true
    if (props.data.hasBonus === null) newErrors.hasBonus = true
    if (props.data.hasBonus && !props.data.bonus) newErrors.bonus = true
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      props.goNext()
    }
  }

  function handleBonusToggle(val) {
    props.update({ hasBonus: val })
    setErrors(prev => ({ ...prev, hasBonus: false }))
  }

  return (
    <StepWrapper {...props} stepName="Salary Details">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">💰</div>
        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Your Salary</div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 leading-tight mb-6">
        What does your salary look like?
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <NumberInput 
            id="takeHome"
            label="Take-home monthly"
            required
            value={props.data.takeHomeSalaryMonthly}
            onChange={(val) => { props.update({ takeHomeSalaryMonthly: val }); setErrors(prev => ({...prev, takeHome: false})) }}
            placeholder="e.g. 50,000"
            hint="The amount credited to your bank account each month — not your CTC or gross salary."
          />
          {errors.takeHome && <p className="text-sm text-red-600 font-medium mt-1">Required</p>}
        </div>
        <div>
          <NumberInput 
            id="basic"
            label="Basic Pay monthly"
            required
            value={props.data.basicSalaryMonthly}
            onChange={(val) => { props.update({ basicSalaryMonthly: val }); setErrors(prev => ({...prev, basic: false})) }}
            placeholder="e.g. 25,000"
          />
          <div className="mt-1">
            <ConfusedLink label="Where is Basic Pay?" />
          </div>
          {errors.basic && <p className="text-sm text-red-600 font-medium mt-1">Required</p>}
        </div>
      </div>

      {showBasicWarning && (
        <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <strong>Wait, basic pay is higher than take-home?</strong><br />
          Basic pay should generally be a component of your total salary, and thus lower than your take-home amount. Please re-check your salary slip.
        </div>
      )}

      {showSurchargeWarning && (
        <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <strong>High Income Note:</strong><br />
          Since your annual take-home is above ₹50 lakh, surcharge may apply. This calculator provides a base estimate but does not calculate surcharge. Consider consulting a tax professional.
        </div>
      )}

      {annualTakeHome > 0 && (
        <div className="reveal px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between mb-8">
          <span className="text-sm font-medium text-indigo-900">Base annual salary</span>
          <span className="text-sm font-bold text-indigo-700">{fmt(annualTakeHome)}</span>
        </div>
      )}

      <div className="border-t border-gray-100 pt-6 mb-8">
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Do you get any extra money apart from your fixed monthly salary? <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => handleBonusToggle(true)}
            className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${props.data.hasBonus === true ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            Yes
          </button>
          <button 
            onClick={() => handleBonusToggle(false)}
            className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${props.data.hasBonus === false ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            No
          </button>
        </div>
        {errors.hasBonus && <p className="text-sm text-red-600 font-medium mb-4">Please answer this question.</p>}

        {props.data.hasBonus === true && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 reveal">
            <FrequencyInput 
              id="bonus"
              label="Bonus / Variable Pay / Incentives"
              required
              value={props.data.bonus}
              onChange={(val) => { props.update({ bonus: val }); setErrors(prev => ({...prev, bonus: false})) }}
            />
            {errors.bonus && <p className="text-sm text-red-600 font-medium mt-1">Required</p>}
            
            <div className="bg-white rounded-lg p-3 mt-4 text-xs text-gray-600 shadow-sm border border-gray-100">
              <strong>Not sure of the exact amount?</strong><br />
              Enter an estimate. Don't include your fixed monthly salary here.
            </div>
          </div>
        )}
        
        {props.data.hasBonus === false && (
          <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl p-4 text-center reveal">
            Got it — we'll use only your fixed monthly salary.
          </div>
        )}

        {props.data.hasBonus === true && bonus > 0 && annualTakeHome > 0 && (
          <div className="reveal px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between mt-4">
            <span className="text-sm font-medium text-green-900">Total estimated income</span>
            <span className="text-base font-bold text-green-700">{fmt(annualTakeHome + bonus)}</span>
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
        { q: "What is Take-home salary?", a: "It's the amount that actually lands in your bank account every month after all deductions like EPF, PT, and TDS." },
        { q: "Where do I find Basic Pay?", a: "Your salary slip or CTC breakdown will explicitly list a component called 'Basic' or 'Basic Pay'. This is required for HRA and NPS calculation." },
        { q: "What if my salary varies?", a: "Use an average of the last few months for the monthly take-home, and put any lump sum variable pay in the bonus section." },
        { q: "Should I include allowances?", a: "Yes, your take-home already includes your paid allowances. We will ask for specific exemptions like HRA in the next step." },
        { q: "Are bonuses fully taxable?", a: "Yes, bonuses and variable pay are fully taxable at your applicable slab rate." }
      ]} />
    </StepWrapper>
  )
}
