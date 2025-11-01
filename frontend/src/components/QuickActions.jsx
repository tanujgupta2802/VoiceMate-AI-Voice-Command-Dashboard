// // src/components/QuickActions.jsx
// import React from "react";

// const actions = [
//   "What’s the weather in Delhi?",
//   "Give me the latest news",
//   "Summarize: Artificial Intelligence benefits",
//   "Create a note: buy groceries tomorrow",
// ];

// export default function QuickActions() {
//   return (
//     <div className="flex flex-col gap-2">
//       {actions.map((a) => (
//         <button
//           key={a}
//           className="text-left px-3 py-2 rounded-lg bg-[#071827] hover:bg-[#0b2430] text-sm"
//         >
//           {a}
//         </button>
//       ))}
//     </div>
//   );
// }

import React from "react";

export default function QuickActions({ onActionClick }) {
  const actions = [
    { icon: "🌤️", text: "What's the weather in Delhi?" },
    { icon: "📰", text: "Give me the latest news" },
    { icon: "🤖", text: "Summarize: Artificial Intelligence benefits" },
    { icon: "📝", text: "Create a note: buy groceries tomorrow" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => onActionClick(action.text)}
          className="group relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-700/50 hover:to-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 rounded-xl p-4 text-left transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{action.icon}</span>
            <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
              {action.text}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
