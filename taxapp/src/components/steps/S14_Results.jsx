import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'
import SectionA_Verdict from '../results/SectionA_Verdict'
import SectionB_TaxSummary from '../results/SectionB_TaxSummary'
import SectionC_DetailedBreakdown from '../results/SectionC_DetailedBreakdown'
import SectionD_Education from '../results/SectionD_Education'
import SectionE_NextSteps from '../results/SectionE_NextSteps'

export default function S14_Results({ results, data, reset, skipTo }) {
  useEffect(() => {
    if (results && results.savings > 0) {
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#10b981', '#34d399', '#4f46e5', '#818cf8']
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#10b981', '#34d399', '#4f46e5', '#818cf8']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [results])

  if (!results) return null

  const shareLink = async () => {
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
      const url = `${window.location.origin}${window.location.pathname}?state=${encoded}`;
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(url);
          alert('Shareable link copied to clipboard! Anyone with this link can view your tax breakdown.');
          return;
        } catch (clipboardErr) {
          console.warn("Clipboard write failed, falling back to prompt", clipboardErr);
        }
      }
      
      // Fallback for browsers that don't support clipboard API or blocked it
      prompt('Copy this link to share:', url);
    } catch (e) {
      alert('Failed to generate link.');
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm px-4 sm:px-8 py-3 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 leading-none">TaxClarity</div>
            <div className="text-[10px] font-semibold text-indigo-600 mt-0.5">FY 2025-26</div>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button onClick={shareLink} className="text-xs sm:text-sm font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors border border-indigo-100 hidden sm:block">
            Share Link
          </button>
          <button onClick={() => window.print()} className="text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors border border-gray-200 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            <span className="hidden sm:inline">Save PDF</span>
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Verdict - Full Width */}
        <div className="mb-8">
          <SectionA_Verdict results={results} data={data} />
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left Column: Tax & TDS Summary */}
          <div className="xl:col-span-5 space-y-6 xl:sticky xl:top-24">
            <SectionB_TaxSummary results={results} data={data} />
            <div className="print:hidden space-y-6">
              <SectionE_NextSteps results={results} data={data} />
              <SectionD_Education results={results} data={data} />
            </div>
          </div>
          
          {/* Right Column: Detailed Breakdown */}
          <div className="xl:col-span-7">
            <SectionC_DetailedBreakdown results={results} data={data} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-12 pb-12 justify-center print:hidden">
          <button onClick={reset} className="px-8 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-md">
            Start Over
          </button>
          <button onClick={() => skipTo(4)} className="px-8 py-3 bg-white text-gray-700 text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
            Edit Details
          </button>
          <button onClick={shareLink} className="px-8 py-3 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors shadow-sm sm:hidden">
            Share Link
          </button>
        </div>
      </div>
    </div>
  )
}
