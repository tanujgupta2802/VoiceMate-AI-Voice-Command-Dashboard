import React from "react";
import HistoryView from "../components/HistoryView";

export default function HistoryPage() {
  return (
    <div className="space-y-6 pb-24 md:pb-6 ">
      <h1 className="text-[22px] sm:text-2xl font-bold text-white mt-14 sm:mt-15">
        Conversation History
      </h1>
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
        <HistoryView />
      </div>
    </div>
  );
}
