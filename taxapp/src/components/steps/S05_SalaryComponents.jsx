import { useState, useRef } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import FrequencyInput from '../FrequencyInput'
import ConfusedLink from '../ConfusedLink'
import CommonQuestions from '../CommonQuestions'

const COMPONENTS = [
  { key: 'hasHRA', label: 'HRA — House Rent Allowance', tag: 'Section 10(13A)', emoji: '🏠', description: 'A part of your salary meant for rent. Can be partially tax-free if you pay rent.' },
  { key: 'hasProfTax', label: 'Professional Tax', tag: 'Section 16(iii)', emoji: '🏛️', description: 'State govt tax deducted monthly from your salary. Usually ₹200/month (max ₹2,400/year).' },
  { key: 'hasEmployerNPS', label: 'Employer NPS contribution', tag: 'Section 80CCD(2)', emoji: '🏦', description: 'Your company puts money into your NPS retirement account as part of your pay package.' }
]

export default function S05_SalaryComponents(props) {
  const [errors, setErrors] = useState({})
  const faqRef = useRef(null)
  
  function handleNext() {
    const newErrors = {}
    if (props.data.hasHRA && !props.data.hraMonthly) newErrors.hraMonthly = true
    if (props.data.hasProfTax && !props.data.professionalTax) newErrors.professionalTax = true
    if (props.data.hasEmployerNPS && !props.data.employerNPS) newErrors.employerNPS = true
    
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      props.goNext()
    }
  }

  function toggleComponent(key) {
    props.update({ [key]: !props.data[key] })
    setErrors(prev => ({ ...prev, [key === 'hasHRA' ? 'hraMonthly' : key === 'hasProfTax' ? 'professionalTax' : 'employerNPS']: false }))
  }

  return (
    <StepWrapper {...props} stepName="Salary Components">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">📋</div>
        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Salary Components</div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2">
        Does your salary slip show any of these?
      </h2>
      <p className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
        Tick all that appear on your slip. Leave the rest blank. <ConfusedLink faqRef={faqRef} label="What are these?" />
      </p>
      
      <div className="space-y-4 mb-6">
        {COMPONENTS.map(({ key, label, tag, emoji, description }) => {
          const isChecked = props.data[key]
          return (
            <div key={key} className={`rounded-xl border-2 overflow-hidden transition-all ${isChecked ? 'border-indigo-600' : 'border-gray-200'}`}>
              <label className={`flex items-start gap-3 p-4 cursor-pointer transition-colors ${isChecked ? 'bg-indigo-50' : 'bg-white hover:bg-gray-50'}`}>
                <div className="mt-0.5">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isChecked ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}`}>
                    {isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleComponent(key)} />
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
                  {key === 'hasHRA' && (
                    <div>
                      <NumberInput 
                        id="hraMonthly"
                        label="How much HRA do you receive per month?"
                        required
                        value={props.data.hraMonthly}
                        onChange={(val) => { props.update({ hraMonthly: val }); setErrors(prev => ({...prev, hraMonthly: false})) }}
                        placeholder="e.g. 15,000"
                        hint="Find it on your salary slip under Earnings."
                      />
                      {errors.hraMonthly && <p className="text-sm text-red-600 font-medium mt-1">Required</p>}
                    </div>
                  )}
                  {key === 'hasProfTax' && (
                    <div>
                      <FrequencyInput 
                        id="professionalTax"
                        label="How much Professional Tax is deducted?"
                        required
                        value={props.data.professionalTax}
                        onChange={(val) => { props.update({ professionalTax: val }); setErrors(prev => ({...prev, professionalTax: false})) }}
                        placeholder="200"
                        note="Usually ₹200/month = ₹2,400/year. Maximum is ₹2,500 per year."
                      />
                      {errors.professionalTax && <p className="text-sm text-red-600 font-medium mt-1">Required</p>}
                    </div>
                  )}
                  {key === 'hasEmployerNPS' && (
                    <div>
                      <FrequencyInput 
                        id="employerNPS"
                        label="How much does your employer contribute to NPS?"
                        required
                        value={props.data.employerNPS}
                        onChange={(val) => { props.update({ employerNPS: val }); setErrors(prev => ({...prev, employerNPS: false})) }}
                        placeholder="0"
                        hint="Check your CTC breakdown or salary slip. This is your employer's contribution, not yours."
                      />
                      {errors.employerNPS && <p className="text-sm text-red-600 font-medium mt-1">Required</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 text-center mb-6">If none of these appear on your slip, leave them all unticked and continue.</p>

      <button 
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center gap-2"
      >
        Continue <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </button>

      <CommonQuestions ref={faqRef} questions={[
        { q: "What is HRA?", a: "House Rent Allowance. If you get this and pay rent, a portion becomes tax-free." },
        { q: "What is Professional Tax?", a: "A small state tax, usually ₹200/month deducted directly from your salary." },
        { q: "What is Employer NPS?", a: "When your employer adds money to your Tier-1 NPS account on your behalf." },
        { q: "I get HRA but I don't pay rent. Should I tick it?", a: "Yes, you should tick it if it's on your slip. Later, you can say you don't pay rent. It will then be fully taxable." },
        { q: "What about Employer EPF?", a: "Do not include Employer's EPF contribution here. It is generally tax-exempt up to 12% of basic pay." }
      ]} />
    </StepWrapper>
  )
}
