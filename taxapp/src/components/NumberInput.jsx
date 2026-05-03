import { fmtN } from '../utils'

export default function NumberInput({ id, label, value, onChange, placeholder = '0', hint, note, required = false, max, prefix = '₹' }) {
  const isValid = value !== '' && value !== null && value !== undefined && Number(value) > 0

  function handleChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    onChange(raw ? Number(raw) : '')
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={`relative rounded-2xl border-2 ${isValid ? 'border-indigo-400 bg-indigo-50/10 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'border-gray-200'} transition-all duration-200 group`}>
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <span className={`text-lg font-bold ${isValid ? 'text-indigo-600' : 'text-gray-400 group-focus-within:text-indigo-500'} transition-colors`}>{prefix}</span>
          </div>
        )}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          id={id}
          value={value ? fmtN(value) : ''}
          onChange={handleChange}
          placeholder={placeholder}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`block w-full rounded-2xl py-3.5 sm:py-4 text-lg font-bold text-gray-900 focus:border-transparent focus:ring-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal bg-transparent ${prefix ? 'pl-9 pr-10' : 'px-4'}`}
        />
        {isValid && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <svg className="w-5 h-5 text-indigo-500 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      {note && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1">
          {note}
        </div>
      )}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
    </div>
  )
}
