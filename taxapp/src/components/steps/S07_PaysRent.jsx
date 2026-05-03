import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import CommonQuestions from '../CommonQuestions'

export default function S07_PaysRent(props) {
  const [error, setError] = useState(false)

  function handleNext() {
    if (props.data.paysRent === null) {
      setError(true)
      return
    }
    setError(false)
    if (props.data.paysRent === false) {
      props.skipTo(9)
    } else {
      props.goNext()
    }
  }

  function handleToggle(val) {
    props.update({ paysRent: val })
    setError(false)
  }

  return (
    <StepWrapper {...props} stepName="Housing">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">🏠</div>
        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Housing</div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 leading-tight mb-6">
        Do you live in a rented house and personally pay the rent?
      </h2>

      <div className="space-y-4 mb-8">
        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => { props.update({ paysRent: true }); setErrors({}) }}
            className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${props.data.paysRent === true ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            Yes
          </button>
          <button 
            onClick={() => { 
              props.update({ paysRent: false, monthlyRent: '', cityType: null, hasHRAInSalary: null })
              setErrors({}) 
            }}
            className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${props.data.paysRent === false ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            No
          </button>
        </div>
        
        {error && <p className="text-sm text-red-600 font-medium">Please answer this question.</p>}

        {props.data.paysRent === false && (
          <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-4 reveal">
            You won't get any HRA tax benefit under the old regime if you don't pay rent.
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
        { q: "What if I live with parents?", a: "You can pay rent to your parents (and they show it as income). If you do, you can select Yes." },
        { q: "What if I own a house but pay rent?", a: "If you live in a rented house in a different city for work, you can claim both HRA and home loan benefits." },
        { q: "What if I don't have rent receipts?", a: "Rent under ₹1 lakh/year doesn't require landlord's PAN, but you should still have a rent agreement and receipts." }
      ]} />
    </StepWrapper>
  )
}
