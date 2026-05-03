import StepWrapper from '../StepWrapper'

export default function S02_FinancialYear(props) {
  return (
    <StepWrapper {...props} stepName="Financial Year">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">📅</div>
        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Financial Year</div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 leading-tight mb-6">
        Which financial year are you calculating tax for?
      </h2>
      
      <div className="space-y-4 mb-8">
        <div className="p-4 bg-indigo-50 border-2 border-indigo-600 rounded-xl cursor-default">
          <div className="flex justify-between items-center mb-1">
            <div className="font-bold text-gray-900">FY 2025-26</div>
            <div className="w-5 h-5 rounded-full border-2 border-indigo-600 bg-indigo-600 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
          <div className="text-sm text-gray-600">April 2025 to March 2026</div>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800 leading-relaxed">
            The rules for Income Tax change every year in the Union Budget. This calculator is strictly updated for <strong>FY 2025-26</strong>.
          </div>
        </div>
      </div>

      <button 
        onClick={props.goNext}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center gap-2"
      >
        Continue <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </button>
    </StepWrapper>
  )
}
