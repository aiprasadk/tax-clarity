import { useState, useEffect } from 'react'
import S01_Landing from './components/steps/S01_Landing'
import S02_FinancialYear from './components/steps/S02_FinancialYear'
import S03_AgeGroup from './components/steps/S03_AgeGroup'
import S04_SalaryDetails from './components/steps/S04_SalaryDetails'
import S05_SalaryComponents from './components/steps/S05_SalaryComponents'
import S06_OtherIncome from './components/steps/S06_OtherIncome'
import S07_PaysRent from './components/steps/S07_PaysRent'
import S08_RentDetails from './components/steps/S08_RentDetails'
import S09_TaxSavingInvestments from './components/steps/S09_TaxSavingInvestments'
import S10_HealthInsurance from './components/steps/S10_HealthInsurance'
import S11_HomeLoan from './components/steps/S11_HomeLoan'
import S12_TDS from './components/steps/S12_TDS'
import S13_Calculating from './components/steps/S13_Calculating'
import S14_Results from './components/steps/S14_Results'

export const INITIAL_STATE = {
  fy: '2025-26',
  ageGroup: null,              // 'below60' | 'senior' | 'superSenior'
  basicSalaryMonthly: '',
  takeHomeSalaryMonthly: '',
  hasBonus: null,              // boolean | null
  bonus: '',                   // annual figure (FrequencyInput handles conversion)
  hasHRA: false,
  hraMonthly: '',
  hasProfTax: false,
  professionalTax: '',         // annual, capped at 2500 in engine
  hasEmployerNPS: false,
  employerNPS: '',             // annual, capped at 14% of basic in engine
  hasOtherIncome: null,        // boolean | null
  fdInterest: '',
  savingsInterest: '',
  paysRent: null,              // boolean | null
  monthlyRent: '',
  cityType: null,              // 'metro' | 'nonMetro'
  hasHRAInSalary: null,        // boolean | null
  investments80C: {
    epf: '',
    lic: '',
    ppf: '',
    elss: '',
    tuition: '',
    homeLoanPrincipal: '',
    nsc: '',
  },
  has80CItems: [],             // array of selected 80C keys e.g. ['epf', 'ppf']
  hasPersonalNPS: null,        // boolean | null
  personalNPS: '',             // annual
  hasSelfInsurance: null,      // boolean | null
  selfInsurancePremium: '',    // annual
  hasParentInsurance: null,    // boolean | null
  parentInsurancePremium: '',  // annual
  parentsAbove60: null,        // boolean | null
  hasHomeLoan: null,           // boolean | null
  loanOwnership: null,         // 'own' | 'joint' | 'other'
  homeLoanInterest: '',        // annual
  hasTDS: null,                // boolean | null
  tdsDeducted: '',             // employer TDS for the year
  bankTDS: '',                 // bank TDS on FD interest
}

export default function App() {
  const [step, setStep] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('state')) return 13 // Auto-compute on shared link load
    const saved = localStorage.getItem('taxclarity_step')
    return saved ? parseInt(saved, 10) : 1
  })
  
  const [data, setData] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sharedState = urlParams.get('state')
    if (sharedState) {
      try { 
        // Handle both older base64-only and newer URI-encoded base64 formats safely
        const decoded = atob(sharedState)
        try {
          return { ...INITIAL_STATE, ...JSON.parse(decodeURIComponent(decoded)) }
        } catch (e) {
          return { ...INITIAL_STATE, ...JSON.parse(decoded) }
        }
      } catch (e) { console.error('Failed to parse shared state', e) }
    }
    const saved = localStorage.getItem('taxclarity_data')
    if (saved) {
      try { return { ...INITIAL_STATE, ...JSON.parse(saved) } } catch (e) {}
    }
    return INITIAL_STATE
  })
  
  const [results, setResults] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('state')) return null // Reset results to force recompute
    const saved = localStorage.getItem('taxclarity_results')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return null
  })

  // clear URL after loading
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('state')) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  useEffect(() => { localStorage.setItem('taxclarity_step', step.toString()) }, [step])
  useEffect(() => { localStorage.setItem('taxclarity_data', JSON.stringify(data)) }, [data])
  useEffect(() => {
    if (results) localStorage.setItem('taxclarity_results', JSON.stringify(results))
    else localStorage.removeItem('taxclarity_results')
  }, [results])

  function update(fields) { setData(prev => ({ ...prev, ...fields })) }
  function goNext() { setStep(s => s + 1) }
  function goBack() { setStep(s => Math.max(1, s - 1)) }
  function skipTo(targetStep) { setStep(targetStep) }
  function reset() { 
    localStorage.removeItem('taxclarity_data')
    localStorage.removeItem('taxclarity_step')
    localStorage.removeItem('taxclarity_results')
    setData(INITIAL_STATE)
    setResults(null)
    setStep(1)
  }

  const PROGRESS_STEPS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]  // steps shown in progress
  const TOTAL_PROGRESS = 10
  const progressStep = PROGRESS_STEPS.indexOf(step) + 1
  const showProgress = PROGRESS_STEPS.includes(step)

  const sharedProps = { data, update, goNext, goBack, skipTo, step, progressStep, showProgress, TOTAL_PROGRESS, reset }

  switch (step) {
    case 1: return <S01_Landing {...sharedProps} />
    case 2: return <S02_FinancialYear {...sharedProps} />
    case 3: return <S03_AgeGroup {...sharedProps} />
    case 4: return <S04_SalaryDetails {...sharedProps} />
    case 5: return <S05_SalaryComponents {...sharedProps} />
    case 6: return <S06_OtherIncome {...sharedProps} />
    case 7: return <S07_PaysRent {...sharedProps} />
    case 8: return <S08_RentDetails {...sharedProps} />
    case 9: return <S09_TaxSavingInvestments {...sharedProps} />
    case 10: return <S10_HealthInsurance {...sharedProps} />
    case 11: return <S11_HomeLoan {...sharedProps} />
    case 12: return <S12_TDS {...sharedProps} />
    case 13: return <S13_Calculating {...sharedProps} setResults={setResults} />
    case 14: return <S14_Results {...sharedProps} results={results} />
    default: return <S01_Landing {...sharedProps} />
  }
}
