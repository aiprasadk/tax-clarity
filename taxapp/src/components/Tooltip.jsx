import React from 'react';

export default function Tooltip({ text }) {
  return (
    <div className="group relative inline-flex items-center ml-1.5 cursor-help">
      <div className="w-3.5 h-3.5 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center text-[9px] font-bold transition-colors group-hover:bg-gray-100 group-hover:text-gray-600 group-hover:border-gray-400">?</div>
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 opacity-0 transition-opacity group-hover:opacity-100 z-50">
        <div className="bg-gray-900 text-white text-xs leading-relaxed p-2.5 rounded-lg shadow-xl text-center">
          {text}
        </div>
        <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
}
