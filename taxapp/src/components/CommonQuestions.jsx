import { useState, forwardRef, useImperativeHandle, useRef } from 'react'

const CommonQuestions = forwardRef(({ questions }, ref) => {
  const [open, setOpen] = useState(false)
  const [openIndex, setOpenIndex] = useState(null)
  const containerRef = useRef(null)

  useImperativeHandle(ref, () => ({
    openAndScroll: () => {
      setOpen(true)
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 80)
    }
  }))

  if (!questions || questions.length === 0) return null;

  return (
    <div ref={containerRef} className="border border-gray-200 rounded-xl overflow-hidden mt-6">
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Common questions about this
        </div>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {open && (
        <div className="divide-y divide-gray-100 border-t border-gray-100">
          {questions.map((q, i) => (
            <div key={i} className="bg-white">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-start justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700 pr-4 leading-snug">{q.q}</span>
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 mt-0.5 ${openIndex === i ? 'rotate-180' : ''}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-4 pb-3 reveal text-sm text-gray-600 leading-relaxed">
                  {q.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
export default CommonQuestions
