import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import NumberInput from '../NumberInput'
import CommonQuestions from '../CommonQuestions'

export default function S12_TDS(props) {
  const [errors, setErrors] = useState({})

  function handleNext() {
    const newErrors = {}
    if (props.data.hasTDS === null) newErrors.hasTDS = true
    if (props.data.hasTDS && !props.data.tdsDeducted) newErrors.tdsDeducted = true
    
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      props.goNext()
    }
  }

  const showBankTDS = props.data.hasOtherIncome && Number(props.data.fdInterest) > 0

  return (
    <StepWrapper {...props} stepName="Almost done">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">🧾</div>
        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Almost done</div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 leading-tight mb-4">
        Does your employer deduct income tax from your salary every month?
      </h2>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-900">
        <div className="font-semibold mb-2">How to find this:</div>
        <ol className="list-decimal pl-4 space-y-1 text-blue-800">
          <li>Open your latest salary slip.</li>
          <li>Look under the <strong>Deductions</strong> section.</li>
          <li>Find "Income Tax" or "TDS".</li>
          <li>Multiply that monthly amount by 12.</li>
        </ol>
      </div>

      <div className="border-t border-gray-100 pt-6 mb-8 space-y-6">
        <div>
          <div className="flex gap-4 mb-4">
          <button 
            onClick={() => { props.update({ hasTDS: true }); setErrors(prev => ({...prev, hasTDS: false})) }}
            className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${props.data.hasTDS === true ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            Yes
          </button>
          <button 
            onClick={() => { props.update({ hasTDS: false, tdsDeducted: '' }); setErrors(prev => ({...prev, hasTDS: false})) }}
            className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${props.data.hasTDS === false ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800'}`}
          >
            No
          </button>
        </div>
          {errors.hasTDS && <p className="text-sm text-red-600 font-medium mt-2">Please answer this question.</p>}

          {props.data.hasTDS === true && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 reveal mt-4">
              <NumberInput 
                id="tdsDeducted"
                label="Total tax deducted by employer in the year"
                required
                value={props.data.tdsDeducted}
                onChange={(val) => { props.update({ tdsDeducted: val }); setErrors(prev => ({...prev, tdsDeducted: false})) }}
                placeholder="0"
              />
              {errors.tdsDeducted && <p className="text-sm text-red-600 font-medium mt-1">Required</p>}
            </div>
          )}

          {props.data.hasTDS === false && (
            <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4 reveal">
              If your tax liability is more than zero, you will have to pay the entire amount directly to the Income Tax Department (as Advance Tax or Self-Assessment Tax).
            </div>
          )}
        </div>

        {showBankTDS && (
          <div className="border-t border-gray-100 pt-6 reveal">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Did your bank deduct tax (TDS) on your FD interest?</h3>
              <p className="text-xs text-blue-800 mb-4">
                Banks automatically deduct 10% TDS if your FD interest exceeds ₹40,000 (₹50,000 for senior citizens). Leave blank if none.
              </p>
              <NumberInput 
                id="bankTDS"
                label="Total bank TDS"
                value={props.data.bankTDS}
                onChange={(val) => props.update({ bankTDS: val })}
                placeholder="0"
              />
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex justify-center items-center gap-2"
      >
        Calculate My Tax →
      </button>

      <div className="mt-6">
        <CommonQuestions questions={[
          { q: "Where do I find my total TDS?", a: "Your employer issues Form 16 at the end of the year showing exact TDS. During the year, check your monthly payslips." },
          { q: "What if I overpay TDS?", a: "If the total TDS deducted is more than your actual tax liability, you will get a refund when you file your ITR." },
          { q: "What if I underpay TDS?", a: "You will have to pay the balance amount as Self-Assessment Tax before filing your ITR." },
          { q: "What is Form 26AS?", a: "It's a consolidated tax statement available on the income tax portal that shows all TDS deducted against your PAN by employers and banks." }
        ]} />
      </div>
    </StepWrapper>
  )
}
