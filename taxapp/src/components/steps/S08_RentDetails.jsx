import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import CommonQuestions from '../CommonQuestions'

export default function S08_RentDetails(props) {
  const [errors, setErrors] = useState({})

  function handleNext() {
    const newErrors = {}
    if (!props.data.monthlyRent) newErrors.monthlyRent = true
    if (!props.data.cityType) newErrors.cityType = true
    if (props.data.hasHRAInSalary === null) newErrors.hasHRAInSalary = true

    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      props.goNext()
    }
  }

  return (
    <StepWrapper {...props} stepName="Rent Details">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">🏠</div>
        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Tell us about your rent</div>
      </div>
      
      <div className="space-y-6 mb-8">
        <div>
          <NumberInput 
            id="monthlyRent"
            label="How much rent do you pay per month?"
            required
            value={props.data.monthlyRent}
            onChange={(val) => { props.update({ monthlyRent: val }); setErrors(prev => ({...prev, monthlyRent: false})) }}
            placeholder="e.g. 15,000"
          />
          {errors.monthlyRent && <p className="text-sm text-red-600 font-medium mt-1">Required</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">Where do you live? <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
              onClick={() => { props.update({ cityType: 'metro' }); setErrors(prev => ({...prev, cityType: false})) }}
              className={`p-3 rounded-xl border-2 text-left transition-all ${props.data.cityType === 'metro' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <div className="font-semibold text-sm mb-1 text-gray-900">Metro City</div>
              <div className="text-xs text-gray-500">Mumbai, Delhi, Kolkata, Chennai</div>
            </button>
            <button 
              onClick={() => { props.update({ cityType: 'nonMetro' }); setErrors(prev => ({...prev, cityType: false})) }}
              className={`p-3 rounded-xl border-2 text-left transition-all ${props.data.cityType === 'nonMetro' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <div className="font-semibold text-sm mb-1 text-gray-900">Non-Metro City</div>
              <div className="text-xs text-gray-500">Any other city in India (e.g., Bangalore, Pune)</div>
            </button>
          </div>
          {errors.cityType && <p className="text-sm text-red-600 font-medium mt-1">Required</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">Does your salary include HRA? <span className="text-red-500">*</span></label>
          <div className="flex gap-4 mb-4">
          <button 
            onClick={() => { props.update({ hasHRAInSalary: true }); setErrors(prev => ({...prev, hasHRA: false})) }}
            className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${props.data.hasHRAInSalary === true ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            Yes
          </button>
          <button 
            onClick={() => { props.update({ hasHRAInSalary: false }); setErrors(prev => ({...prev, hasHRA: false})) }}
            className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${props.data.hasHRAInSalary === false ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            No
          </button>
        </div>
          {errors.hasHRAInSalary && <p className="text-sm text-red-600 font-medium mt-1">Required</p>}
          
          {props.data.hasHRAInSalary === false && (
            <div className="mt-3 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg p-3 reveal">
              Since you don't get HRA, you will be eligible for Section 80GG deduction (up to ₹60,000/year).
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center gap-2"
      >
        Continue <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </button>

      <CommonQuestions questions={[
        { q: "Is Bangalore a metro city?", a: "For Income Tax purposes, only Delhi, Mumbai, Chennai, and Kolkata are considered Metro cities. Bangalore is Non-Metro." },
        { q: "What is HRA exemption?", a: "It's the minimum of: Actual HRA received, Rent Paid minus 10% of Basic Pay, or 50% (Metro)/40% (Non-Metro) of Basic Pay." },
        { q: "What is Section 80GG?", a: "If you pay rent but your employer doesn't give you HRA, you can claim up to ₹5,000/month under Section 80GG." },
        { q: "Rent is shared with flatmates?", a: "Only enter the portion of the rent that YOU actually pay from your account." }
      ]} />
    </StepWrapper>
  )
}
