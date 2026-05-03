import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import CommonQuestions from '../CommonQuestions'

export default function S11_HomeLoan(props) {
  const [errors, setErrors] = useState({})

  function handleNext() {
    if (props.data.hasHomeLoan === null) {
      setErrors({ hasHomeLoan: true })
      return
    }

    const newErrors = {}
    if (props.data.hasHomeLoan) {
      if (!props.data.loanOwnership) newErrors.loanOwnership = true
      if ((props.data.loanOwnership === 'own' || props.data.loanOwnership === 'joint') && !props.data.homeLoanInterest) {
        newErrors.homeLoanInterest = true
      }
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      props.goNext()
    }
  }

  function handleToggle(val) {
    props.update({ hasHomeLoan: val })
    if (!val) {
      props.update({ loanOwnership: null, homeLoanInterest: '' })
    }
    setErrors({})
  }

  function handleOwnershipSelect(val) {
    props.update({ loanOwnership: val, homeLoanInterest: '' })
    setErrors(prev => ({ ...prev, loanOwnership: false }))
  }

  return (
    <StepWrapper {...props} stepName="Home Loan">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">🏡</div>
        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Home Loan</div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2">
        Do you have a home loan for a house you currently live in?
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Home loan interest reduces taxable income under old regime only.
        <span className="text-xs text-gray-400 block mt-1">Section 24(b) — max ₹2,00,000 for self-occupied property</span>
      </p>

      <div className="space-y-5 mb-8">
        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => { props.update({ hasHomeLoan: true }); setErrors(prev => ({...prev, hasHomeLoan: false})) }}
            className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${props.data.hasHomeLoan === true ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            Yes
          </button>
          <button 
            onClick={() => { props.update({ hasHomeLoan: false, homeLoanInterest: '', loanOwnership: null }); setErrors(prev => ({...prev, hasHomeLoan: false})) }}
            className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${props.data.hasHomeLoan === false ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            No
          </button>
        </div>
        {errors.hasHomeLoan && <p className="text-sm text-red-600 font-medium">Please answer this question.</p>}

        {props.data.hasHomeLoan === true && (
          <fieldset className="reveal space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <legend className="block text-sm font-semibold text-gray-800 mb-3 w-full">
              Is this loan in your name? <span className="text-red-500">*</span>
            </legend>
            
            <div className="space-y-3">
              {[
                { value: 'own', label: 'In my name only' },
                { value: 'joint', label: 'Joint with spouse or co-borrower' },
                { value: 'other', label: "In someone else's name" }
              ].map(opt => {
                const isSelected = props.data.loanOwnership === opt.value
                return (
                  <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span className={`font-semibold text-sm ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>{opt.label}</span>
                    <input type="radio" className="hidden" checked={isSelected} onChange={() => handleOwnershipSelect(opt.value)} />
                  </label>
                )
              })}
            </div>
            {errors.loanOwnership && <p className="text-sm text-red-600 font-medium mt-1">Required</p>}

            {props.data.loanOwnership === 'other' && (
              <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-4 reveal mt-4">
                <strong>You cannot claim this deduction.</strong><br />
                Under Section 24(b), you must be both an owner of the property AND a borrower on the loan to claim the interest deduction.
              </div>
            )}

            {(props.data.loanOwnership === 'own' || props.data.loanOwnership === 'joint') && (
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm reveal mt-4">
                <NumberInput 
                  id="homeLoanInterest"
                  label="How much interest did you pay on this home loan last year?"
                  required
                  value={props.data.homeLoanInterest}
                  onChange={(val) => { props.update({ homeLoanInterest: val }); setErrors(prev => ({...prev, homeLoanInterest: false})) }}
                  placeholder="e.g. 1,50,000"
                />
                <p className="text-xs text-gray-500 mt-2">Cap: ₹2,00,000. Check your bank's home loan interest certificate.</p>
                {errors.homeLoanInterest && <p className="text-sm text-red-600 font-medium mt-1">Required</p>}

                {props.data.loanOwnership === 'joint' && (
                  <div className="text-xs text-indigo-700 font-medium bg-indigo-50 border border-indigo-100 rounded-lg p-3 mt-3">
                    <strong>Joint Loan:</strong> Enter only your share — typically 50% of total interest. Each co-borrower can claim up to ₹2,00,000.
                  </div>
                )}
              </div>
            )}
          </fieldset>
        )}
      </div>

      <button 
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center gap-2"
      >
        Continue <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </button>

      <CommonQuestions questions={[
        { q: "Loan in father's name, but I pay EMI.", a: "You cannot claim any tax deduction unless your name is on both the property registry and the loan agreement." },
        { q: "Interest vs Principal?", a: "Principal repayment comes under 80C. Interest comes under Section 24b. We are asking for INTEREST here." },
        { q: "House is under construction?", a: "You cannot claim home loan interest for an under-construction property until you receive possession." },
        { q: "Can I claim HRA and Home Loan?", a: "Yes, provided they are in different cities, or you have a valid reason for renting while owning a home." }
      ]} />
    </StepWrapper>
  )
}
