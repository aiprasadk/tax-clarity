import { useState } from 'react'
import StepWrapper from '../StepWrapper'
import CommonQuestions from '../CommonQuestions'

const AGE_OPTIONS = [
  { value: 'below60', label: 'Below 60 years', tag: null, description: 'Basic exemption: ₹2,50,000 under old regime' },
  { value: 'senior', label: '60 to 79 years', tag: 'Senior Citizen', description: 'Basic exemption: ₹3,00,000 under old regime' },
  { value: 'superSenior', label: '80 years or above', tag: 'Super Senior Citizen', description: 'Basic exemption: ₹5,00,000 under old regime' },
]

export default function S03_AgeGroup(props) {
  const [error, setError] = useState(false)
  
  function handleNext() {
    if (!props.data.ageGroup) {
      setError(true)
      return
    }
    setError(false)
    props.goNext()
  }

  function handleSelect(val) {
    props.update({ ageGroup: val })
    setError(false)
  }

  return (
    <StepWrapper {...props} stepName="Your Age Group">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">🎂</div>
        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wide">About You</div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 leading-tight mb-6">
        Which age group do you fall in?
      </h2>
      
      <div className="space-y-3 mb-8">
        {AGE_OPTIONS.map(opt => {
          const isSelected = props.data.ageGroup === opt.value
          return (
            <div 
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 group ${isSelected ? 'border-indigo-500 bg-indigo-50/50 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02] z-10 relative' : 'border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md'}`}
            >
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-3">
                  <div className={`text-lg font-extrabold ${isSelected ? 'text-indigo-900' : 'text-gray-800 group-hover:text-indigo-800'}`}>{opt.label}</div>
                  {opt.tag && (
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                      {opt.tag}
                    </span>
                  )}
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white group-hover:border-indigo-400'}`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                </div>
              </div>
              <div className={`text-sm ${isSelected ? 'text-indigo-700/80 font-medium' : 'text-gray-500'}`}>{opt.description}</div>
            </div>
          )
        })}
        {error && <p className="text-sm text-red-600 font-medium mt-2" role="alert">Please select your age group to continue.</p>}
      </div>

      <button 
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center gap-2"
      >
        Continue <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </button>

      <CommonQuestions questions={[
        {
          q: "Why does age matter for tax?",
          a: "The old tax regime offers higher basic exemption limits for senior citizens (₹3L) and super senior citizens (₹5L). The new regime has the same rules for everyone."
        },
        {
          q: "What if I turn 60 this year?",
          a: "If you turn 60 at any time during the financial year (between 1st April 2025 and 31st March 2026), you are considered a senior citizen for that entire year."
        },
        {
          q: "I'm exactly 60 right now.",
          a: "You count as a Senior Citizen (60 to 79 years)."
        }
      ]} />
    </StepWrapper>
  )
}
