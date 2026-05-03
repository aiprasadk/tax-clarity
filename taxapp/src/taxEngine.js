import { 
  NEW_REGIME_SLABS, getOldSlabs, EMPTY_REGIME, 
  STANDARD_DEDUCTION_NEW, STANDARD_DEDUCTION_OLD, PROF_TAX_CAP, 
  EMPLOYER_NPS_PCT_OF_BASIC, CAP_80C, CAP_80CCD1B, 
  CAP_80D_SELF_BELOW60, CAP_80D_SELF_ABOVE60, 
  CAP_80D_PARENTS_BELOW60, CAP_80D_PARENTS_ABOVE60,
  CAP_24B, CAP_80TTA, CAP_80TTB, 
  REBATE_87A_NEW_INCOME_LIMIT, REBATE_87A_NEW_MAX, 
  MARGINAL_RELIEF_THRESHOLD, 
  REBATE_87A_OLD_INCOME_LIMIT, REBATE_87A_OLD_MAX, 
  CESS_RATE, HRA_METRO_PCT, HRA_NONMETRO_PCT 
} from './constants'
import { fmtL } from './utils'

export function applySlabs(income, slabs) {
  if (income <= 0) return 0
  let tax = 0, prev = 0
  for (const { upTo, rate } of slabs) {
    if (upTo === null) { tax += (income - prev) * rate; break }
    if (income <= upTo) { tax += (income - prev) * rate; break }
    tax += (upTo - prev) * rate
    prev = upTo
  }
  return Math.round(tax)
}

export function slabLabel(prev, upTo) {
  if (prev === 0) return upTo === null ? 'All' : `0 – ${fmtL(upTo)}`
  return upTo === null ? `${fmtL(prev)}+` : `${fmtL(prev)} – ${fmtL(upTo)}`
}

export function computeSlabRows(taxableIncome, slabs) {
  const rows = []
  let prev = 0
  let remaining = taxableIncome

  for (const slab of slabs) {
    const bandSize = slab.upTo === null ? Infinity : slab.upTo - prev
    const incomeInBand = Math.max(0, Math.min(remaining, bandSize))
    const tax = Math.round(incomeInBand * slab.rate)
    
    rows.push({
      label: slabLabel(prev, slab.upTo),
      rate: slab.rate,
      incomeInBand,
      tax,
      active: incomeInBand > 0 && slab.rate > 0
    })

    remaining -= incomeInBand
    prev = slab.upTo || 0
  }
  return rows
}

function n(val) {
  const num = Number(val)
  return isNaN(num) ? 0 : num
}

function calculateGrossIncome(data) {
  const takeHomeSalaryMonthly = n(data.takeHomeSalaryMonthly)
  const bonus = data.hasBonus ? n(data.bonus) : 0
  const fdInterest = data.hasOtherIncome ? n(data.fdInterest) : 0
  const savingsInterest = data.hasOtherIncome ? n(data.savingsInterest) : 0
  return (takeHomeSalaryMonthly * 12) + bonus + fdInterest + savingsInterest
}

function calculateHRAExemption(data) {
  if (!data.paysRent || !data.hasHRA || n(data.hraMonthly) <= 0) return 0
  
  const annualHRAReceived = n(data.hraMonthly) * 12
  const annualBasic = n(data.basicSalaryMonthly) * 12
  const hraPct = data.cityType === 'metro' ? HRA_METRO_PCT : HRA_NONMETRO_PCT
  const annualRentPaid = n(data.monthlyRent) * 12
  
  const cond1 = annualHRAReceived
  const cond2 = hraPct * annualBasic
  const cond3 = Math.max(0, annualRentPaid - (0.10 * annualBasic))
  
  return Math.max(0, Math.min(cond1, cond2, cond3))
}

function calculateNewRegimeTax(data, grossIncome, annualBasic, employerNPS) {
  const taxableIncome = Math.max(0, grossIncome - STANDARD_DEDUCTION_NEW - employerNPS)
  const slabTax = applySlabs(taxableIncome, NEW_REGIME_SLABS)
  
  const rebate = (taxableIncome <= REBATE_87A_NEW_INCOME_LIMIT) ? Math.min(slabTax, REBATE_87A_NEW_MAX) : 0
  const taxAfterRebateBeforeMarginal = Math.max(0, slabTax - rebate)
  
  const excess = taxableIncome - MARGINAL_RELIEF_THRESHOLD
  let marginalRelief = 0
  if (taxableIncome > MARGINAL_RELIEF_THRESHOLD && rebate === 0 && taxAfterRebateBeforeMarginal > excess) {
    marginalRelief = taxAfterRebateBeforeMarginal - excess
  }
  
  const taxAfterRebate = taxAfterRebateBeforeMarginal - marginalRelief
  const cess = taxAfterRebate > 0 ? Math.round(taxAfterRebate * CESS_RATE) : 0
  
  return {
    grossIncome,
    taxableIncome,
    standardDeduction: STANDARD_DEDUCTION_NEW,
    professionalTaxDeduction: 0,
    hraExemption: 0,
    deduction80C: 0,
    deduction80D: 0,
    deductionPersonalNPS: 0,
    employerNPSDeduction: employerNPS,
    deductionHomeLoanInterest: 0,
    deduction80TTA_TTB: 0,
    slabTax,
    rebate,
    marginalRelief,
    cess,
    totalTax: taxAfterRebate + cess
  }
}

function calculateOldRegimeTax(data, grossIncome, annualBasic, employerNPS) {
  const isSenior = data.ageGroup === 'senior' || data.ageGroup === 'superSenior'
  const isSuperSenior = data.ageGroup === 'superSenior'

  const professionalTaxDeduction = data.hasProfTax ? Math.min(n(data.professionalTax), PROF_TAX_CAP) : 0
  const hraExemption = calculateHRAExemption(data)
  
  let deduction80C = 0
  data.has80CItems.forEach(key => {
    deduction80C += n(data.investments80C[key])
  })
  deduction80C = Math.min(deduction80C, CAP_80C)
  
  const selfCap = isSenior ? CAP_80D_SELF_ABOVE60 : CAP_80D_SELF_BELOW60
  const selfDeduction = data.hasSelfInsurance ? Math.min(n(data.selfInsurancePremium), selfCap) : 0
  const parentCap = data.parentsAbove60 ? CAP_80D_PARENTS_ABOVE60 : CAP_80D_PARENTS_BELOW60
  const parentDeduction = data.hasParentInsurance ? Math.min(n(data.parentInsurancePremium), parentCap) : 0
  const deduction80D = selfDeduction + parentDeduction
  
  const deductionHomeLoanInterest = (data.hasHomeLoan && data.loanOwnership !== 'other') ? Math.min(n(data.homeLoanInterest), CAP_24B) : 0
  
  let deduction80TTA_TTB = 0
  if (data.hasOtherIncome) {
    if (isSenior) {
      deduction80TTA_TTB = Math.min(n(data.fdInterest) + n(data.savingsInterest), CAP_80TTB)
    } else {
      deduction80TTA_TTB = Math.min(n(data.savingsInterest), CAP_80TTA)
    }
  }
  
  const deductionPersonalNPS = data.hasPersonalNPS ? Math.min(n(data.personalNPS), CAP_80CCD1B) : 0
  
  const totalDeductions = STANDARD_DEDUCTION_OLD + professionalTaxDeduction + hraExemption + deduction80C + deduction80D + deductionHomeLoanInterest + deduction80TTA_TTB + deductionPersonalNPS + employerNPS
  
  const taxableIncome = Math.max(0, grossIncome - totalDeductions)
  const slabs = getOldSlabs(data.ageGroup)
  const slabTax = applySlabs(taxableIncome, slabs)
  
  const rebate = (!isSuperSenior && taxableIncome <= REBATE_87A_OLD_INCOME_LIMIT) ? Math.min(slabTax, REBATE_87A_OLD_MAX) : 0
  const taxAfterRebate = Math.max(0, slabTax - rebate)
  const cess = taxAfterRebate > 0 ? Math.round(taxAfterRebate * CESS_RATE) : 0
  
  return {
    grossIncome,
    taxableIncome,
    standardDeduction: STANDARD_DEDUCTION_OLD,
    professionalTaxDeduction,
    hraExemption,
    deduction80C,
    deduction80D,
    deductionPersonalNPS,
    employerNPSDeduction: employerNPS,
    deductionHomeLoanInterest,
    deduction80TTA_TTB,
    slabTax,
    rebate,
    marginalRelief: 0,
    cess,
    totalTax: taxAfterRebate + cess
  }
}

export function computeTax(data) {
  const grossIncome = calculateGrossIncome(data)
  const annualBasic = n(data.basicSalaryMonthly) * 12
  const employerNPS = data.hasEmployerNPS ? Math.min(n(data.employerNPS), EMPLOYER_NPS_PCT_OF_BASIC * annualBasic) : 0
  
  const newRegime = calculateNewRegimeTax(data, grossIncome, annualBasic, employerNPS)
  const oldRegime = calculateOldRegimeTax(data, grossIncome, annualBasic, employerNPS)
  
  const recommended = newRegime.totalTax <= oldRegime.totalTax ? 'new' : 'old'
  const savings = Math.abs(newRegime.totalTax - oldRegime.totalTax)
  
  const employerTDS = data.hasTDS ? n(data.tdsDeducted) : 0
  const bankTDS = (data.hasOtherIncome && n(data.fdInterest) > 0) ? n(data.bankTDS) : 0
  const tdsDeducted = employerTDS + bankTDS
  const totalTax = recommended === 'new' ? newRegime.totalTax : oldRegime.totalTax
  
  let tdsType = 'settled'
  let tdsAmount = 0
  if (tdsDeducted > totalTax) {
    tdsType = 'refund'
    tdsAmount = tdsDeducted - totalTax
  } else if (tdsDeducted < totalTax) {
    tdsType = 'payable'
    tdsAmount = totalTax - tdsDeducted
  }

  return {
    newRegime,
    oldRegime,
    recommended,
    savings,
    tds: { type: tdsType, amount: tdsAmount },
    tdsDeducted,
    employerTDS,
    bankTDS
  }
}
