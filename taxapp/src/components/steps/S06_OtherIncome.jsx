import { useState, useRef } from 'react'
import StepWrapper from '../StepWrapper'
import FrequencyInput from '../FrequencyInput'
import ConfusedLink from '../ConfusedLink'
import CommonQuestions from '../CommonQuestions'

export default function S06_OtherIncome(props) {
  const [errors, setErrors] = useState({})
  const faqRef = useRef(null)
  
  function handleNext() {
    if (props.data.hasOtherIncome === null) {
      setErrors({ hasOtherIncome: true })
      return
    }
    if (props.data.hasOtherIncome === false) {
      props.update({ fdInterest: '', savingsInterest: '' })
    }
    setErrors({})
    props.goNext()
  }

  function handleToggle(val) {
    props.update({ hasOtherIncome: val })
    setErrors({})
  }

  return (
    <StepWrapper {...props} stepName="Other Income">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">💵</div>
        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Other Income</div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2">
        Did your bank pay you any interest this year?
      </h2>
      <p className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
        Interest from Fixed Deposits (FD) and Savings accounts is added to your income and taxed. Many people forget this. <ConfusedLink faqRef={faqRef} label="What counts as interest income?" />
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🏦</span>
            <span className="font-semibold text-sm text-gray-900">Fixed Deposit (FD)</span>
          </div>
          <p className="text-xs text-gray-500">Interest earned on money locked in an FD for 1–5 years.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💳</span>
            <span className="font-semibold text-sm text-gray-900">Savings Account</span>
          </div>
          <p className="text-xs text-gray-500">The small interest your bank pays on the balance in your regular account.</p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6 mb-8">
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Did you earn any interest from FDs or savings accounts in FY 2025-26? <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => { props.update({ hasOtherIncome: true }); setErrors(prev => ({...prev, hasOtherIncome: false})) }}
            className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${props.data.hasOtherIncome === true ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            Yes
          </button>
          <button 
            onClick={() => { 
              props.update({ hasOtherIncome: false, fdInterest: '', savingsInterest: '' })
              setErrors(prev => ({...prev, hasOtherIncome: false}))
            }}
            className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${props.data.hasOtherIncome === false ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            No
          </button>
        </div>
        {errors.hasOtherIncome && <p className="text-sm text-red-600 font-medium mb-4">Please answer this question.</p>}

        {props.data.hasOtherIncome === true && (
          <div className="reveal space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <FrequencyInput 
              id="fdInterest"
              label="FD Interest"
              value={props.data.fdInterest}
              onChange={(val) => props.update({ fdInterest: val })}
              placeholder="0"
              hint="Add all FDs together. Enter 0 if you have no FDs."
            />
            <div className="border-t border-blue-100 my-2"></div>
            <FrequencyInput 
              id="savingsInterest"
              label="Savings Account Interest"
              value={props.data.savingsInterest}
              onChange={(val) => props.update({ savingsInterest: val })}
              placeholder="0"
              hint="Usually a small amount. Check your annual bank statement. Enter 0 if negligible."
            />
            <p className="text-xs text-blue-700 font-medium mt-2">
              Tip: open your bank app → Statements → search for "Interest Credit" entries.
            </p>
          </div>
        )}
      </div>

      <button 
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center gap-2"
      >
        Continue <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </button>

      <CommonQuestions ref={faqRef} questions={[
        { q: "Is FD interest taxable?", a: "Yes, FD interest is fully taxable at your applicable slab rate." },
        { q: "Is savings interest taxable?", a: "Yes, but under the old regime, you get a deduction up to ₹10,000 (Section 80TTA). We will calculate this automatically." },
        { q: "What if bank already deducted TDS?", a: "Still enter the GROSS interest here. We will ask for TDS paid in a later step to deduct it from your final tax." },
        { q: "Should I include spouse's FD?", a: "Only if the FD is linked to your PAN. If it's linked to their PAN, it's their income." },
        { q: "What about PPF interest?", a: "PPF interest is completely tax-free. Do not include it here." },
        { q: "I don't know the exact amount.", a: "Provide an estimate based on your balance, usually around 3% for savings accounts." }
      ]} />
    </StepWrapper>
  )
}
