export default function ProgressBar({ current, total, stepName }) {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-semibold text-gray-700">Step {current} of {total}</span>
        <span className="text-gray-300 hidden sm:inline">|</span>
        <span className="text-xs text-gray-500 truncate max-w-[160px] hidden sm:inline">{stepName}</span>
      </div>
      <div className="flex items-center gap-1.5 flex-1 justify-end">
        {Array.from({ length: total }).map((_, i) => {
          const stepNum = i + 1;
          let dotClass = "w-1.5 h-1.5 bg-gray-200";
          if (stepNum < current) dotClass = "w-2 h-2 bg-indigo-600";
          else if (stepNum === current) dotClass = "w-2 h-2 bg-indigo-300";
          
          return (
            <div 
              key={i} 
              className={`rounded-full transition-all duration-300 ${dotClass}`}
              role="progressbar"
              aria-valuenow={current}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          )
        })}
      </div>
    </div>
  )
}
