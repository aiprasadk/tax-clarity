import { useState } from 'react'
import NumberInput from './NumberInput'
import { fmt } from '../utils'

export default function FrequencyInput(props) {
  const [freq, setFreq] = useState('annual')
  
  const annualValue = props.value || ''
  const displayValue = freq === 'monthly' ? (annualValue ? Math.round(annualValue / 12) : '') : annualValue

  function handleInput(val) {
    if (val === '') {
      props.onChange('')
      return
    }
    const num = Number(val)
    if (freq === 'monthly') {
      props.onChange(num * 12)
    } else {
      props.onChange(num)
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
          {props.label} {props.required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex rounded-xl p-1 gap-1 shrink-0 bg-gray-100 border border-gray-200 shadow-inner">
          <button
            type="button"
            onClick={() => setFreq('monthly')}
            className={`px-4 py-1.5 text-[11px] uppercase tracking-wider font-bold transition-all rounded-lg ${freq === 'monthly' ? 'bg-white text-indigo-700 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setFreq('annual')}
            className={`px-4 py-1.5 text-[11px] uppercase tracking-wider font-bold transition-all rounded-lg ${freq === 'annual' ? 'bg-white text-indigo-700 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Per Year
          </button>
        </div>
      </div>
      
      <NumberInput 
        {...props} 
        label="" 
        value={displayValue} 
        onChange={handleInput} 
      />
      
      {freq === 'monthly' && annualValue > 0 && (
        <div className="text-xs text-indigo-600 font-medium reveal mt-1.5">
          = {fmt(annualValue)} per year (auto-calculated)
        </div>
      )}
    </div>
  )
}
