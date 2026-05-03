const fs = require('fs');
const path = require('path');

const dir = 'src/components/steps';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx')).map(f => path.join(dir, f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/className={\`flex-1 py-2\.5 rounded-xl border-2 font-medium transition-all \$\{([^=]+) === true \? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}\`}/g, 'className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${$1 === true ? \\'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]\\' : \\'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800\\'}`}');

  content = content.replace(/className={\`flex-1 py-2\.5 rounded-xl border-2 font-medium transition-all \$\{([^=]+) === false \? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}\`}/g, 'className={`flex-1 py-3 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${$1 === false ? \\'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]\\' : \\'border-gray-100 bg-white text-gray-500 hover:border-indigo-200 hover:text-gray-800\\'}`}');
  
  content = content.replace(/className="flex gap-3 mb-4"/g, 'className="flex gap-4 mb-4"');

  fs.writeFileSync(file, content);
});
console.log('Done replacement');
