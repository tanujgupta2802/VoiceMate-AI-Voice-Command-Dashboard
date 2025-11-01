// import React from "react";
// import { Home, History } from "lucide-react";

// export default function Navigation({ currentRoute, setCurrentRoute }) {
//   const navItems = [
//     { id: "home", icon: Home, label: "Home" },
//     { id: "history", icon: History, label: "History" },
//   ];

//   return (
//     <nav className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-slate-900 to-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-50 md:relative md:border-0 md:bg-transparent md:backdrop-blur-none">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-around md:justify-start md:gap-4 py-4">
//           {navItems.map(({ id, icon: Icon, label }) => (
//             <button
//               key={id}
//               onClick={() => setCurrentRoute(id)}
//               className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-2 rounded-xl transition-all ${
//                 currentRoute === id
//                   ? "text-cyan-400 bg-cyan-400/10"
//                   : "text-slate-400 hover:text-white hover:bg-slate-800/50"
//               }`}
//             >
//               <Icon size={20} />
//               <span className="text-xs md:text-sm font-medium">{label}</span>
//             </button>
//           ))}
//         </div>
//       </div>
//     </nav>
//   );
// }

import React from "react";
import { Home, History } from "lucide-react";

export default function Navigation({ currentRoute, setCurrentRoute }) {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "history", icon: History, label: "History" },
  ];

  return (
    // <nav className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-slate-900 to-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-50 md:relative md:border-0 md:bg-transparent md:backdrop-blur-none">
    //   <div className="max-w-2xl mx-auto px-4">
    //     <div className="flex justify-around md:justify-start md:gap-4 py-4">
    //       {navItems.map(({ id, icon: Icon, label }) => (
    //         <button
    //           key={id}
    //           onClick={() => setCurrentRoute(id)}
    //           className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-2 rounded-xl transition-all ${
    //             currentRoute === id
    //               ? "text-cyan-400 bg-cyan-400/10"
    //               : "text-slate-400 hover:text-white hover:bg-slate-800/50"
    //           }`}
    //         >
    //           <Icon size={20} />
    //           <span className="text-xs md:text-sm font-medium">{label}</span>
    //         </button>
    //       ))}
    //     </div>
    //   </div>
    // </nav>
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-50 md:relative md:border-0 md:bg-transparent md:backdrop-blur-none">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex justify-center items-center py-3">
          <div className="flex items-center justify-center gap-8">
            {navItems.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setCurrentRoute(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  currentRoute === id
                    ? "text-cyan-400 bg-cyan-400/10 shadow-sm shadow-cyan-400/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium tracking-wide">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
