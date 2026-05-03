import React from 'react'

export default function S01_Landing({ goNext }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className="w-full max-w-6xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-sm font-bold text-gray-900 tracking-tight">TaxClarity</div>
        </div>
        <div className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-3 py-1">FY 2025-26</div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-10 py-6 lg:py-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 w-fit mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              Know. Compare. Save.
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-4">
              Find out <span className="text-indigo-600 underline decoration-indigo-200 decoration-4 underline-offset-4">which tax regime</span> saves you more money this year.
            </h1>
            
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-6 max-w-md">
              Answer a few simple questions about your salary and expenses. We'll compare both tax regimes and show you which one saves you more money — with a clear rupee-by-rupee estimate.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                <span>⏱</span> 2 min
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                <span>🔒</span> 100% Free
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                <span>🛡</span> Private
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
              <button 
                onClick={goNext}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3.5 px-7 rounded-2xl text-sm transition-colors shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2"
              >
                Start calculation
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              
              <button 
                onClick={goNext}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-7 rounded-2xl text-sm transition-colors border border-gray-200 flex items-center justify-center gap-2"
              >
                See how it works
              </button>
            </div>
            
            <p className="mt-4 text-xs text-gray-400">
              Built for salaried individuals only · FY 2025-26
            </p>
          </div>
          
          <div className="relative mt-6 lg:mt-0">
            <div className="absolute inset-0 bg-indigo-100 rounded-3xl blur-3xl opacity-40 scale-95 translate-y-4"></div>
            <div className="relative bg-white rounded-3xl shadow-xl shadow-gray-200/80 border border-gray-100 p-6 sm:p-8">
              <div className="mb-6">
                <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Your Tax Summary</div>
                <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">✓</div>
                  <div>
                    <div className="text-sm font-bold text-green-800">You Save ₹18,540</div>
                    <div className="text-xs text-green-600">by choosing New Regime</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-indigo-600 bg-indigo-50 rounded-xl p-4 relative">
                  <div className="text-xs font-semibold text-indigo-700 mb-1">New Regime</div>
                  <div className="text-xl font-bold text-gray-900">₹42,120</div>
                  <div className="mt-2 text-[10px] font-bold text-white bg-indigo-600 px-2 py-0.5 rounded w-fit uppercase">Winner</div>
                </div>
                <div className="border border-gray-200 bg-white rounded-xl p-4 opacity-75">
                  <div className="text-xs font-semibold text-gray-500 mb-1">Old Regime</div>
                  <div className="text-xl font-bold text-gray-900">₹60,660</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        <div className="mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 text-xl">⚖️</div>
            <h3 className="font-bold text-gray-900 text-sm mb-2">Old vs New Regime</h3>
            <p className="text-xs text-gray-500">We run the numbers on both regimes side-by-side so you don't have to guess.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-4 text-xl">💰</div>
            <h3 className="font-bold text-gray-900 text-sm mb-2">Exact Amount You Save</h3>
            <p className="text-xs text-gray-500">See exactly how many rupees you save by choosing the correct regime.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-4 text-xl">💸</div>
            <h3 className="font-bold text-gray-900 text-sm mb-2">Refund or Tax Due</h3>
            <p className="text-xs text-gray-500">Know instantly if you'll get a tax refund or if you need to pay extra tax.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-4 text-xl">📝</div>
            <h3 className="font-bold text-gray-900 text-sm mb-2">Plain English, No Jargon</h3>
            <p className="text-xs text-gray-500">Simple questions that anyone can answer without a finance degree.</p>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-gray-100 bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 text-center text-xs text-gray-400">
          <p className="flex items-center justify-center gap-1.5 mb-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            100% Private & Secure. Your data never leaves your browser.
          </p>
          <p>© 2026 TaxClarity. This tool is for estimation purposes only.</p>
        </div>
      </footer>
    </div>
  )
}
