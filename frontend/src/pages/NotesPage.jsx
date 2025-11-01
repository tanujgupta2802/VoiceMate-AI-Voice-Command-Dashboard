// import React, { useEffect, useState } from "react";
// import { listNotesAPI, deleteNoteAPI } from "../services/api";
// import { Trash2, Clock, FileText } from "lucide-react";

// export default function NotesPage() {
//   const [notes, setNotes] = useState([]);
//   const [deleting, setDeleting] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   const fetchNotes = async () => {
//     try {
//       setLoading(true);
//       const res = await listNotesAPI("123");
//       if (res && res.success) setNotes(res.notes || []);
//     } catch (err) {
//       console.error("Notes fetch error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this note?")) return;
//     try {
//       setDeleting(id);
//       const res = await deleteNoteAPI(id, "123");
//       if (res && res.success) {
//         setNotes((prev) => prev.filter((n) => n._id !== id));
//       }
//     } catch (err) {
//       console.error("Delete note error", err);
//     } finally {
//       setDeleting(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header Section with Animation */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50 mb-6">
//             <FileText size={40} className="text-white" />
//           </div>
//           <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
//             All Notes
//           </h1>
//           <p className="text-slate-400 text-lg">
//             Your thoughts, organized beautifully
//           </p>
//           <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></div>
//         </div>

//         {/* Loading State */}
//         {loading ? (
//           <div className="flex items-center justify-center py-20">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
//           </div>
//         ) : notes.length === 0 ? (
//           /* Empty State */
//           <div className="text-center py-20">
//             <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-800/50 border-2 border-slate-700 mb-6">
//               <FileText size={48} className="text-slate-600" />
//             </div>
//             <p className="text-slate-400 text-xl mb-2">No notes found yet</p>
//             <p className="text-slate-500 text-sm">
//               Start creating your first note!
//             </p>
//           </div>
//         ) : (
//           /* Notes Grid */
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {notes.map((note, index) => (
//               <div
//                 key={note._id || note.id}
//                 className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-105"
//                 style={{
//                   animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
//                 }}
//               >
//                 {/* Gradient Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

//                 {/* Top Border Glow */}
//                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>

//                 {/* Delete Button */}
//                 <button
//                   onClick={() => handleDelete(note._id || note.id)}
//                   disabled={deleting === (note._id || note.id)}
//                   className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300 hover:scale-110 active:scale-95"
//                   title="Delete Note"
//                 >
//                   {deleting === (note._id || note.id) ? (
//                     <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-400"></div>
//                   ) : (
//                     <Trash2 size={18} strokeWidth={2.5} />
//                   )}
//                 </button>

//                 {/* Time Badge */}
//                 <div className="flex items-center gap-2 mb-4 text-xs">
//                   <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
//                     <Clock size={14} />
//                     <span className="font-medium">
//                       {new Date(note.createdAt || note.time).toLocaleString(
//                         "en-US",
//                         {
//                           month: "short",
//                           day: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         }
//                       )}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Note Content */}
//                 <div className="relative">
//                   <p className="text-white text-base leading-relaxed font-medium tracking-wide">
//                     {note.content || note.note || note.text}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { listNotesAPI, deleteNoteAPI } from "../services/api";
import { Trash2, Clock, FileText } from "lucide-react";

export default function NotesPage({ user }) {
  const [notes, setNotes] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    if (!user?.uid) return; // don't fetch until user is present
    try {
      setLoading(true);
      const res = await listNotesAPI(user.uid);
      if (res && res.success) setNotes(res.notes || []);
    } catch (err) {
      console.error("Notes fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      setDeleting(id);
      const res = await deleteNoteAPI(id, user.uid);
      if (res && res.success) {
        setNotes((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (err) {
      console.error("Delete note error", err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50 mb-6">
            <FileText size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            All Notes
          </h1>
          <p className="text-slate-400 text-lg">
            Your thoughts, organized beautifully
          </p>
          <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-800/50 border-2 border-slate-700 mb-6">
              <FileText size={48} className="text-slate-600" />
            </div>
            <p className="text-slate-400 text-xl mb-2">No notes found yet</p>
            <p className="text-slate-500 text-sm">
              Start creating your first note!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note, index) => (
              <div
                key={note._id || note.id}
                className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-105"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                <button
                  onClick={() => handleDelete(note._id || note.id)}
                  disabled={deleting === (note._id || note.id)}
                  className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300 hover:scale-110 active:scale-95"
                  title="Delete Note"
                >
                  {deleting === (note._id || note.id) ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-400"></div>
                  ) : (
                    <Trash2 size={18} strokeWidth={2.5} />
                  )}
                </button>
                <div className="flex items-center gap-2 mb-4 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Clock size={14} />
                    <span className="font-medium">
                      {new Date(note.createdAt || note.time).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <p className="text-white text-base leading-relaxed font-medium tracking-wide">
                    {note.content || note.note || note.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
  );
}
