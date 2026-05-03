import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import CommonQuestions from '../CommonQuestions'
import { fmt } from '../../utils'

function InsuranceCard({ title, subtitle, badge, cap, checked, onToggle, amount, onAmountChange, amountError, children }) {
  return (
    <div className={`rounded-xl border-2 overflow-hidden transition-all ${checked === true ? 'border-indigo-600' : 'border-gray-200'}`}>
      <div className={`px-4 py-3 flex items-start gap-3 transition-colors ${checked === true ? 'bg-indigo-50' : 'bg-gray-50'}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${checked === true ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-700'}`}>
          {badge}
        </div>
        <div>
          <div className={`text-sm font-semibold ${checked === true ? 'text-indigo-900' : 'text-gray-900'}`}>{title}</div>
          <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>
        </div>
      </div>
      
      <div className="px-4 py-4 bg-white border-t border-gray-100">
        <div className="text-sm font-semibold text-gray-800 mb-3">Do you personally pay a premium for this group? <span className="text-red-500">*</span></div>
        <div className="flex gap-4">
          <button 
            onClick={() => onToggle(true)}
            className={`flex-1 py-2.5 rounded-xl border-2 font-bold transition-all duration-200 ${checked === true ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_15px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            Yes, I pay
          </button>
          <button 
            onClick={() => onToggle(false)}
            className={`flex-1 py-2.5 rounded-xl border-2 font-bold transition-all duration-200 ${checked === false ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_15px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            No
          </button>
        </div>
      </div>
      
      {checked === true && (
        <div className="px-4 pb-4 pt-3 bg-indigo-50 border-t border-indigo-100 reveal">
          {children}
          
          <NumberInput 
            label="How much do you pay per year?"
            value={amount}
            onChange={onAmountChange}
            placeholder="0"
          />
          {amountError && <p className="text-sm text-red-600 font-medium mt-1">Required</p>}
          <div className="text-xs text-indigo-700 font-medium mt-1.5">
            Tax benefit capped at {fmt(cap)} per year
          </div>
        </div>
      )}
    </div>
  )
}

export default function S10_HealthInsurance(props) {
  const [errors, setErrors] = useState({})

  const isSenior = props.data.ageGroup === 'senior' || props.data.ageGroup === 'superSenior'
  const selfCap = isSenior ? 50000 : 25000
  const parentsCap = props.data.parentsAbove60 ? 50000 : 25000

  function handleNext() {
    const newErrors = {}
    if (props.data.hasSelfInsurance === null) newErrors.hasSelfInsurance = true
    if (props.data.hasSelfInsurance && !props.data.selfInsurancePremium) newErrors.selfInsurancePremium = true
    
    if (props.data.hasParentInsurance === null) newErrors.hasParentInsurance = true
    if (props.data.hasParentInsurance && !props.data.parentInsurancePremium) newErrors.parentInsurancePremium = true
    if (props.data.hasParentInsurance && props.data.parentsAbove60 === null) newErrors.parentsAbove60 = true

    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      props.goNext()
    }
  }

  return (
    <StepWrapper {...props} stepName="Health Insurance">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">🏥</div>
        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Health Insurance</div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2">
        Do you pay for health insurance?
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        There are <strong>two separate tax benefits</strong> here — one for insuring yourself and one for insuring your parents. Answer both cards below.
        <span className="text-xs text-gray-400 block mt-1">Section 80D — old regime only</span>
      </p>

      <div className="space-y-4 mb-6">
        <InsuranceCard
          title="For you, your spouse or children"
          subtitle="Any health insurance policy that covers you or your immediate family"
          badge="1"
          cap={selfCap}
          checked={props.data.hasSelfInsurance}
          onToggle={(val) => {
            props.update({ hasSelfInsurance: val })
            if (!val) props.update({ selfInsurancePremium: '' })
            setErrors(prev => ({ ...prev, hasSelfInsurance: false }))
          }}
          amount={props.data.selfInsurancePremium}
          onAmountChange={(val) => {
            props.update({ selfInsurancePremium: val })
            setErrors(prev => ({ ...prev, selfInsurancePremium: false }))
          }}
          amountError={errors.selfInsurancePremium}
        />

        <InsuranceCard
          title="For your mother or father"
          subtitle="A separate policy covering your own parents (not in-laws)"
          badge="2"
          cap={parentsCap}
          checked={props.data.hasParentInsurance}
          onToggle={(val) => {
            props.update({ hasParentInsurance: val })
            if (!val) props.update({ parentInsurancePremium: '', parentsAbove60: null })
            setErrors(prev => ({ ...prev, hasParentInsurance: false }))
          }}
          amount={props.data.parentInsurancePremium}
          onAmountChange={(val) => {
            props.update({ parentInsurancePremium: val })
            setErrors(prev => ({ ...prev, parentInsurancePremium: false }))
          }}
          amountError={errors.parentInsurancePremium}
        >
          <div className="mb-4 bg-white p-3 rounded-lg border border-indigo-100">
            <div className="text-sm font-medium text-gray-800 mb-1">How old are your parents? <span className="text-red-500">*</span></div>
            <div className="text-xs text-gray-500 mb-2">This changes the cap — ₹50,000 if above 60, ₹25,000 if below 60.</div>
            <div className="flex gap-2">
              <button 
                onClick={() => { props.update({ parentsAbove60: true }); setErrors(prev => ({ ...prev, parentsAbove60: false })) }}
                className={`flex-1 py-1.5 rounded text-sm font-medium transition-all border ${props.data.parentsAbove60 === true ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
              >
                Above 60
              </button>
              <button 
                onClick={() => { props.update({ parentsAbove60: false }); setErrors(prev => ({ ...prev, parentsAbove60: false })) }}
                className={`flex-1 py-1.5 rounded text-sm font-medium transition-all border ${props.data.parentsAbove60 === false ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
              >
                Below 60
              </button>
            </div>
            {errors.parentsAbove60 && <p className="text-xs text-red-600 font-medium mt-1">Required</p>}
          </div>
        </InsuranceCard>
      </div>

      {(errors.hasSelfInsurance || errors.hasParentInsurance) && (
        <p className="text-sm text-red-600 font-medium mb-4 text-center">Please answer Yes or No for both policies.</p>
      )}

      {props.data.hasSelfInsurance === false && props.data.hasParentInsurance === false && (
        <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 reveal">
          No 80D deduction will be applied since you don't pay any health insurance premiums.
        </div>
      )}

      <button 
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center gap-2"
      >
        Continue <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </button>

      <CommonQuestions questions={[
        { q: "What about company group insurance?", a: "If your employer deducts a premium from your salary for a group health cover, you CANNOT claim it under 80D." },
        { q: "My father pays his own premium.", a: "If your father pays his own premium, HE gets the deduction, not you. Only enter it here if YOU pay the premium for them." },
        { q: "Can I claim for my in-laws?", a: "No. Section 80D only allows deductions for parents, not parents-in-law." },
        { q: "My parents are above 60 but have no insurance.", a: "You can claim up to ₹50,000 for their preventive health checkups and actual medical bills." }
      ]} />
    </StepWrapper>
  )
}
