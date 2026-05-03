import { useEffect, useState, useRef } from 'react'
import { computeTax } from '../../taxEngine'

const STEPS = [
  "Adding up all your income",
  "Applying your salary components",
  "Computing old regime with all deductions",
  "Computing new regime",
  "Comparing both regimes",
  "Finding the best option for you"
]

export default function S13_Calculating({ data, goNext, setResults }) {
  const [activeStep, setActiveStep] = useState(0)
  const [doneSteps, setDoneSteps] = useState([])
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i)
        if (i > 0) setDoneSteps(prev => [...prev, i - 1])
      }, i * 380)
    })

    const totalDelay = STEPS.length * 380 + 300
    setTimeout(() => {
      setDoneSteps(STEPS.map((_, i) => i))
      const results = computeTax(data)
      setResults(results)
      setTimeout(goNext, 400)
    }, totalDelay)
  }, [data, goNext, setResults])

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Crunching your numbers...</h2>
          <p className="text-sm text-gray-500 mt-1">This will take just a moment</p>
        </div>
        <div className="w-full space-y-3">
          {STEPS.map((stepName, i) => {
            const isDone = doneSteps.includes(i)
            const isActive = activeStep === i && !isDone
            const isUpcoming = !isDone && !isActive

            return (
              <div key={i} className={`flex items-center gap-3 transition-opacity duration-300 ${isUpcoming ? 'opacity-30' : 'opacity-100'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-green-500' : isActive ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                  {isDone && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
                  {isUpcoming && <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>}
                </div>
                <div className={`text-sm ${isDone ? 'text-green-700 font-medium' : isActive ? 'text-indigo-700 font-medium' : 'text-gray-400'}`}>
                  {stepName}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
