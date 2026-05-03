export const STANDARD_DEDUCTION_NEW = 75000
export const STANDARD_DEDUCTION_OLD = 50000
export const PROF_TAX_CAP = 2500
export const EMPLOYER_NPS_PCT_OF_BASIC = 0.14
export const CAP_80C = 150000
export const CAP_80CCD1B = 50000
export const CAP_80D_SELF_BELOW60 = 25000
export const CAP_80D_SELF_ABOVE60 = 50000
export const CAP_80D_PARENTS_BELOW60 = 25000
export const CAP_80D_PARENTS_ABOVE60 = 50000
export const CAP_24B = 200000
export const CAP_80TTA = 10000
export const CAP_80TTB = 50000
export const REBATE_87A_NEW_INCOME_LIMIT = 1200000
export const REBATE_87A_NEW_MAX = 60000
export const MARGINAL_RELIEF_THRESHOLD = 1200000
export const REBATE_87A_OLD_INCOME_LIMIT = 500000
export const REBATE_87A_OLD_MAX = 12500
export const CESS_RATE = 0.04
export const HRA_METRO_PCT = 0.50
export const HRA_NONMETRO_PCT = 0.40

export const NEW_REGIME_SLABS = [
  { upTo: 400000, rate: 0.00 },
  { upTo: 800000, rate: 0.05 },
  { upTo: 1200000, rate: 0.10 },
  { upTo: 1600000, rate: 0.15 },
  { upTo: 2000000, rate: 0.20 },
  { upTo: 2400000, rate: 0.25 },
  { upTo: null, rate: 0.30 },
]

export const OLD_REGIME_SLABS_BELOW60 = [
  { upTo: 250000, rate: 0.00 },
  { upTo: 500000, rate: 0.05 },
  { upTo: 1000000, rate: 0.20 },
  { upTo: null, rate: 0.30 },
]
export const OLD_REGIME_SLABS_SENIOR = [
  { upTo: 300000, rate: 0.00 },
  { upTo: 500000, rate: 0.05 },
  { upTo: 1000000, rate: 0.20 },
  { upTo: null, rate: 0.30 },
]
export const OLD_REGIME_SLABS_SUPER_SENIOR = [
  { upTo: 500000, rate: 0.00 },
  { upTo: 1000000, rate: 0.20 },
  { upTo: null, rate: 0.30 },
]

export function getOldSlabs(ageGroup) {
  if (ageGroup === 'superSenior') return OLD_REGIME_SLABS_SUPER_SENIOR
  if (ageGroup === 'senior') return OLD_REGIME_SLABS_SENIOR
  return OLD_REGIME_SLABS_BELOW60
}

export const EMPTY_REGIME = {
  grossIncome: 0, taxableIncome: 0, standardDeduction: 0,
  professionalTaxDeduction: 0, hraExemption: 0, deduction80C: 0,
  deduction80D: 0, deductionPersonalNPS: 0, employerNPSDeduction: 0,
  deductionHomeLoanInterest: 0, deduction80TTA_TTB: 0,
  slabTax: 0, rebate: 0, marginalRelief: 0, cess: 0, totalTax: 0,
}
