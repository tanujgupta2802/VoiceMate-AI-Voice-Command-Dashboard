// import React, { useState } from "react";
// import { Zap, Clock } from "lucide-react";
// import VoiceCommand from "../components/VoiceCommand";
// import QuickActions from "../components/QuickActions";
// import HistoryView from "../components/HistoryView";

// export default function HomePage({ setCurrentRoute }) {
//   const [refreshKey, setRefreshKey] = useState(0);

//   return (
//     <div className="space-y-6 pb-24 md:pb-6">
//       <div className="text-center mb-8">
//         <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
//           VoiceMate
//         </h1>
//         <p className="text-slate-400">Your AI Voice Command Assistant</p>
//       </div>

//       <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700/50 shadow-2xl">
//         <VoiceCommand onResponseUpdate={() => setRefreshKey((p) => p + 1)} />
//       </div>

//       <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
//         <div className="flex items-center gap-2 mb-4">
//           <Zap size={20} className="text-cyan-400" />
//           <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
//         </div>
//         <QuickActions onActionClick={(text) => console.log(text)} />
//       </div>

//       <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <Clock size={20} className="text-cyan-400" />
//             <h2 className="text-lg font-semibold text-white">Recent History</h2>
//           </div>
//           <button
//             onClick={() => setCurrentRoute("history")}
//             className="text-sm text-cyan-400 hover:text-cyan-300"
//           >
//             View All →
//           </button>
//         </div>
//         <HistoryView key={refreshKey} compact />
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Zap, Clock, StickyNote } from "lucide-react";
import VoiceCommand from "../components/VoiceCommand";
import QuickActions from "../components/QuickActions";
import HistoryView from "../components/HistoryView";

export default function HomePage({ setCurrentRoute }) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {/* <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
          VoiceMate
        </h1>
        <p className="text-slate-400">Your AI Voice Command Assistant</p>
      </div> */}

      {/* Voice Command Section */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700/50 shadow-2xl">
        <VoiceCommand onResponseUpdate={() => setRefreshKey((p) => p + 1)} />
      </div>

      {/* Quick Actions */}
      {/* <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={20} className="text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        </div>
        <QuickActions onActionClick={(text) => console.log(text)} />
      </div> */}

      {/* History Section */}
      {/* <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">Recent History</h2>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentRoute("history")}
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              View All →
            </button>
            <button
              onClick={() => setCurrentRoute("notes")}
              className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <StickyNote size={16} /> Notes
            </button>
          </div>
        </div>
        <HistoryView key={refreshKey} compact />
      </div> */}
    </div>
  );
}
