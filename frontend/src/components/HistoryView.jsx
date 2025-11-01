// // import React, { useState, useEffect } from "react";

// // export default function HistoryView() {
// //   const [history, setHistory] = useState([]);

// //   useEffect(() => {
// //     try {
// //       const stored = JSON.parse(localStorage.getItem("vm_history") || "[]");
// //       setHistory(stored);
// //     } catch {
// //       setHistory([]);
// //     }
// //   }, []);

// //   if (history.length === 0) {
// //     return <p className="text-gray-400 text-sm">No history yet.</p>;
// //   }

// //   return (
// //     <div className="max-h-80 overflow-y-auto space-y-3 text-sm">
// //       {history.map((item) => (
// //         <div key={item.id} className="bg-[#08182e] p-3 rounded-lg">
// //           <div className="text-gray-400 text-xs mb-1">{item.time}</div>
// //           <div className="text-white font-medium mb-1">🗣️ {item.text}</div>
// //           <div className="text-gray-300">{item.response}</div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { Clock, Trash2 } from "lucide-react";

// export default function HistoryView({ compact = false }) {
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     try {
//       const stored = JSON.parse(localStorage.getItem("vm_history") || "[]");
//       setHistory(stored);
//     } catch {
//       setHistory([]);
//     }
//   }, []);

//   const clearHistory = () => {
//     if (window.confirm("Are you sure you want to clear all history?")) {
//       localStorage.setItem("vm_history", "[]");
//       setHistory([]);
//     }
//   };

//   const displayHistory = compact ? history.slice(0, 3) : history;

//   if (history.length === 0)
//     return (
//       <div className="text-center py-12">
//         <Clock size={48} className="mx-auto text-slate-600 mb-4" />
//         <p className="text-slate-400">No history yet. Start a conversation!</p>
//       </div>
//     );

//   return (
//     <div className="space-y-3">
//       {displayHistory.map((item) => (
//         <div
//           key={item.id}
//           className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all"
//         >
//           <p className="text-xs text-slate-500 mb-2">{item.time}</p>
//           <p className="text-cyan-400 text-sm mb-1">You: {item.text}</p>
//           <p className="text-slate-300 text-sm">AI: {item.response}</p>
//         </div>
//       ))}

//       {!compact && (
//         <button
//           onClick={clearHistory}
//           className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
//         >
//           <Trash2 size={16} /> Clear All History
//         </button>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Clock, Trash2, MessageSquare, User } from "lucide-react";

export default function HistoryView({ compact = false }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("vm_history") || "[]");
      setHistory(stored);
    } catch {
      setHistory([]);
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      localStorage.setItem("vm_history", "[]");
      setHistory([]);
    }
  };

  const displayHistory = compact ? history.slice(0, 3) : history;

  if (history.length === 0)
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-800/50 border-2 border-slate-700 mb-6">
          <MessageSquare size={48} className="text-slate-600" />
        </div>
        <p className="text-slate-400 text-xl mb-2">No history yet</p>
        <p className="text-slate-500 text-sm">
          Start a conversation to see your history here!
        </p>
      </div>
    );

  return (
    <div>
      {!compact && (
        <button
          onClick={clearHistory}
          className="w-full mb-10 sm:mb-10 bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 border-2 border-red-500/30 hover:border-red-500/50 text-red-400 px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 font-semibold shadow-lg hover:shadow-red-500/20"
        >
          <Trash2 size={20} strokeWidth={2.5} />
          Clear All History
        </button>
      )}

      <div className="space-y-2">
        {displayHistory.map((item, index) => (
          <div
            key={item.id}
            className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-105"
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Top Border Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>

            {/* Time Badge */}
            <div className="flex items-center gap-2 mb-4 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Clock size={14} />
                <span className="font-medium">{item.time}</span>
              </div>
            </div>

            {/* User Message */}
            <div className="relative mb-3">
              <p className="text-cyan-400 text-sm font-semibold mb-2">You:</p>
              <p className="text-white text-base leading-relaxed">
                {item.text}
              </p>
            </div>

            {/* AI Response */}
            <div className="relative">
              <p className="text-cyan-400 text-sm font-semibold mb-2">AI:</p>
              <p className="text-slate-300 text-base leading-relaxed">
                {item.response}
              </p>
            </div>
          </div>
        ))}

        {/* {!compact && (
        <button
          onClick={clearHistory}
          className="w-full bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 border-2 border-red-500/30 hover:border-red-500/50 text-red-400 px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 font-semibold shadow-lg hover:shadow-red-500/20"
        >
          <Trash2 size={20} strokeWidth={2.5} />
          Clear All History
        </button>
      )} */}

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
