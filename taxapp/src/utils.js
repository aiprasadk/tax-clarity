export function fmtN(n) {
  if (n === null || n === undefined || isNaN(n)) return ''
  return Number(n).toLocaleString('en-IN')
}

export function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return '₹0'
  return `₹${fmtN(n)}`
}

export function fmtL(n) {
  if (n >= 100000) return `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`
  return fmtN(n)
}

export function toNum(val) {
  const num = Number(val)
  return isNaN(num) ? 0 : num
}
