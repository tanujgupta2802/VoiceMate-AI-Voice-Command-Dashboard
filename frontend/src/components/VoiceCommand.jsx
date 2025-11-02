// import React, { useState, useEffect, useRef } from "react";
// import {
//   sendCommand,
//   createNoteAPI,
//   listNotesAPI,
//   deleteNoteAPI,
//   executeSmartActionAPI,
//   getPendingRemindersAPI,
//   deleteReminderAPI,
// } from "../services/api";
// import {
//   Mic,
//   Loader,
//   Send,
//   Volume2,
//   VolumeX,
//   Trash2,
//   Sparkles,
//   Bell,
//   X,
//   Square,
//   Music,
//   Play,
//   Pause,
// } from "lucide-react";
// import { auth } from "../firebase";
// import toast, { Toaster } from "react-hot-toast";

// export default function VoiceCommand() {
//   const [text, setText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState("");
//   const [notes, setNotes] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [reminders, setReminders] = useState([]);
//   const [showReminders, setShowReminders] = useState(false);
//   const [history, setHistory] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("vm_history") || "[]");
//     } catch {
//       return [];
//     }
//   });

//   const recognitionRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const reminderCheckIntervalRef = useRef(null);
//   const [userId, setUserId] = useState(null);
//   const [user, setUser] = useState(null);
//   const utteranceRef = useRef(null);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [triggeredReminder, setTriggeredReminder] = useState(null);
//   const playerRef = useRef(null);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [activeMusic, setActiveMusic] = useState(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
//       if (firebaseUser) {
//         setUserId(firebaseUser.uid);
//         setUser({
//           _id: firebaseUser.uid,
//           email: firebaseUser.email,
//           displayName: firebaseUser.displayName,
//         });
//       } else {
//         setUserId(null);
//         setUser(null);
//         setNotes([]);
//         setMessages([]);
//         setReminders([]);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (userId && user) {
//       listNotes();
//       loadReminders();
//     }
//   }, [userId, user]);

//   useEffect(() => {
//     if (!window.YT) {
//       const tag = document.createElement("script");
//       tag.src = "https://www.youtube.com/iframe_api";
//       const firstScriptTag = document.getElementsByTagName("script")[0];
//       firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//     }
//   }, []);

//   const listNotes = async () => {
//     if (!userId) return;
//     try {
//       const res = await listNotesAPI(userId);
//       setNotes(res.notes || []);
//     } catch (err) {
//       console.error("Error loading notes:", err);
//       setNotes([]);
//     }
//   };

//   const loadReminders = async () => {
//     if (!user) return;
//     try {
//       const res = await getPendingRemindersAPI(user);
//       if (res.success) {
//         setReminders(res.reminders || []);
//       }
//     } catch (err) {
//       console.error("Error loading reminders:", err);
//     }
//   };

//   useEffect(() => {
//     if (!user || !userId) return;

//     if ("Notification" in window && Notification.permission === "default") {
//       Notification.requestPermission();
//     }

//     checkAndTriggerReminders();
//     reminderCheckIntervalRef.current = setInterval(() => {
//       checkAndTriggerReminders();
//     }, 30000);

//     return () => {
//       if (reminderCheckIntervalRef.current) {
//         clearInterval(reminderCheckIntervalRef.current);
//       }
//     };
//   }, [user, userId, reminders]);

//   const checkAndTriggerReminders = async () => {
//     if (!reminders || reminders.length === 0) return;
//     const now = new Date();

//     for (const reminder of reminders) {
//       const reminderTime = new Date(reminder.scheduledTime);
//       const timeDiff = now - reminderTime;

//       if (timeDiff >= 0 && timeDiff < 60000) {
//         triggerReminderAlert(reminder);
//         try {
//           await deleteReminderAPI(reminder._id, user);
//           setReminders((prev) => prev.filter((r) => r._id !== reminder._id));
//         } catch (err) {
//           console.error("Error deleting triggered reminder:", err);
//         }
//       }
//     }
//   };

//   const triggerReminderAlert = (reminder) => {
//     playNotificationSound();
//     if ("Notification" in window && Notification.permission === "granted") {
//       new Notification("⏰ Reminder Alert!", {
//         body: reminder.message,
//         icon: "/favicon.ico",
//         requireInteraction: true,
//       });
//     }
//     toast.success(`⏰ Reminder: ${reminder.message}`, {
//       duration: 8000,
//       icon: "⏰",
//     });
//     setTriggeredReminder(reminder);
//     speakText(`Reminder: ${reminder.message}`);

//     const reminderMessage = {
//       id: Date.now(),
//       type: "ai",
//       text: `⏰ REMINDER ALERT!\n\n${reminder.message}`,
//       time: new Date().toLocaleString(),
//       icon: "⏰",
//       isAction: true,
//     };
//     setMessages((prev) => [...prev, reminderMessage]);
//   };

//   const playNotificationSound = () => {
//     try {
//       const audioContext = new (window.AudioContext ||
//         window.webkitAudioContext)();
//       const oscillator = audioContext.createOscillator();
//       const gainNode = audioContext.createGain();

//       oscillator.connect(gainNode);
//       gainNode.connect(audioContext.destination);
//       oscillator.frequency.value = 800;
//       oscillator.type = "sine";
//       gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//       gainNode.gain.exponentialRampToValueAtTime(
//         0.01,
//         audioContext.currentTime + 0.5
//       );
//       oscillator.start(audioContext.currentTime);
//       oscillator.stop(audioContext.currentTime + 0.5);

//       setTimeout(() => {
//         const oscillator2 = audioContext.createOscillator();
//         const gainNode2 = audioContext.createGain();
//         oscillator2.connect(gainNode2);
//         gainNode2.connect(audioContext.destination);
//         oscillator2.frequency.value = 1000;
//         oscillator2.type = "sine";
//         gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
//         gainNode2.gain.exponentialRampToValueAtTime(
//           0.01,
//           audioContext.currentTime + 0.5
//         );
//         oscillator2.start(audioContext.currentTime);
//         oscillator2.stop(audioContext.currentTime + 0.5);
//       }, 300);
//     } catch (err) {
//       console.error("Error playing notification sound:", err);
//     }
//   };

//   const closeTriggeredReminder = () => {
//     setTriggeredReminder(null);
//   };

//   const extractYouTubeId = (url) => {
//     const regExp =
//       /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return match && match[2].length === 11 ? match[2] : null;
//   };

//   const handleMusicControl = (messageId, action) => {
//     const musicMsg = messages.find((m) => m.id === messageId && m.isMusic);
//     if (!musicMsg) return;

//     if (playerRef.current) {
//       if (action === "toggle") {
//         if (musicMsg.isPlaying) {
//           playerRef.current.pauseVideo();
//           setMessages((prev) =>
//             prev.map((m) =>
//               m.id === messageId ? { ...m, isPlaying: false } : m
//             )
//           );
//         } else {
//           playerRef.current.playVideo();
//           setMessages((prev) =>
//             prev.map((m) =>
//               m.id === messageId ? { ...m, isPlaying: true } : m
//             )
//           );
//         }
//       } else if (action === "stop") {
//         playerRef.current.stopVideo();
//         setMessages((prev) =>
//           prev.map((m) => (m.id === messageId ? { ...m, isPlaying: false } : m))
//         );
//       }
//     }
//   };

//   const initializePlayer = (videoId, messageId) => {
//     const onYouTubeIframeAPIReady = () => {
//       if (playerRef.current && playerRef.current.destroy) {
//         playerRef.current.destroy();
//       }

//       playerRef.current = new window.YT.Player("youtube-player", {
//         height: "0",
//         width: "0",
//         videoId: videoId,
//         playerVars: {
//           autoplay: 1,
//           controls: 0,
//         },
//         events: {
//           onReady: (event) => {
//             event.target.playVideo();
//             setMessages((prev) =>
//               prev.map((m) =>
//                 m.id === messageId ? { ...m, isPlaying: true } : m
//               )
//             );
//             setActiveMusic(messageId);
//             setDuration(event.target.getDuration());

//             // Update progress bar
//             const interval = setInterval(() => {
//               if (playerRef.current && playerRef.current.getCurrentTime) {
//                 setCurrentTime(playerRef.current.getCurrentTime());
//               }
//             }, 500);

//             playerRef.current.progressInterval = interval;
//           },
//           onStateChange: (event) => {
//             if (event.data === window.YT.PlayerState.ENDED) {
//               setMessages((prev) =>
//                 prev.map((m) =>
//                   m.id === messageId ? { ...m, isPlaying: false } : m
//                 )
//               );
//               setActiveMusic(null);
//               if (playerRef.current.progressInterval) {
//                 clearInterval(playerRef.current.progressInterval);
//               }
//             } else if (event.data === window.YT.PlayerState.PLAYING) {
//               setMessages((prev) =>
//                 prev.map((m) =>
//                   m.id === messageId ? { ...m, isPlaying: true } : m
//                 )
//               );
//             } else if (event.data === window.YT.PlayerState.PAUSED) {
//               setMessages((prev) =>
//                 prev.map((m) =>
//                   m.id === messageId ? { ...m, isPlaying: false } : m
//                 )
//               );
//             }
//           },
//         },
//       });
//     };

//     if (window.YT && window.YT.Player) {
//       onYouTubeIframeAPIReady();
//     } else {
//       window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
//     }
//   };

//   const handleSeek = (messageId, value) => {
//     if (playerRef.current && activeMusic === messageId) {
//       playerRef.current.seekTo(value, true);
//       setCurrentTime(value);
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const deleteNote = async (id) => {
//     if (!userId) return;
//     try {
//       await deleteNoteAPI(id, userId);
//       setNotes((prev) => prev.filter((note) => note._id !== id));
//       setTimeout(() => {
//         listNotes();
//       }, 300);
//       toast.success("📝 Note deleted successfully!");
//     } catch (err) {
//       console.error("Delete failed:", err);
//       toast.error("Failed to delete note");
//       listNotes();
//     }
//   };

//   const clearChat = () => {
//     if (window.confirm("Clear current conversation?")) {
//       setMessages([]);
//       setText("");
//       setTranscript("");
//       if (playerRef.current) {
//         playerRef.current.stopVideo();
//       }
//       toast.success("Chat cleared!");
//     }
//   };

//   const isSmartAction = (command) => {
//     const lower = command.toLowerCase();
//     return (
//       lower.includes("remind me") ||
//       lower.includes("reminder") ||
//       (lower.includes("send") &&
//         (lower.includes("email") || lower.includes("mail"))) ||
//       lower.includes("play")
//     );
//   };

//   const getActionIcon = (command) => {
//     const lower = command.toLowerCase();
//     if (lower.includes("remind")) return "⏰";
//     if (lower.includes("email") || lower.includes("mail")) return "📧";
//     if (lower.includes("play")) return "🎵";
//     return "💬";
//   };

//   useEffect(() => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       console.warn("Speech Recognition not supported in this browser.");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-IN";
//     recognition.interimResults = false;

//     recognition.onresult = (event) => {
//       const spokenText = event.results[0][0].transcript;
//       setTranscript(spokenText);
//       setText(spokenText);
//       setIsListening(false);
//     };

//     recognition.onend = () => setIsListening(false);
//     recognition.onerror = () => setIsListening(false);
//     recognitionRef.current = recognition;
//   }, []);

//   const startVoiceRecognition = () => {
//     if (recognitionRef.current) {
//       setIsListening(true);
//       setTranscript("");
//       recognitionRef.current.start();
//     } else {
//       alert("Speech recognition not supported in this browser.");
//     }
//   };

//   const speakText = (textToSpeak) => {
//     if (typeof window === "undefined" || !("speechSynthesis" in window)) {
//       return;
//     }

//     if (window.speechSynthesis.speaking || utteranceRef.current) {
//       window.speechSynthesis.cancel();
//       utteranceRef.current = null;
//       setIsSpeaking(false);
//       return;
//     }

//     const ut = new SpeechSynthesisUtterance(textToSpeak);
//     ut.lang = "en-IN";
//     ut.rate = 1;
//     ut.pitch = 1;

//     ut.onstart = () => setIsSpeaking(true);
//     ut.onend = () => {
//       utteranceRef.current = null;
//       setIsSpeaking(false);
//     };
//     ut.onerror = () => {
//       utteranceRef.current = null;
//       setIsSpeaking(false);
//     };

//     utteranceRef.current = ut;
//     window.speechSynthesis.speak(ut);
//   };

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();
//     if (!text.trim()) return;

//     if (!userId || !user) {
//       alert("Please login first!");
//       return;
//     }

//     const userMessage = {
//       id: Date.now(),
//       type: "user",
//       text: text,
//       time: new Date().toLocaleString(),
//       icon: getActionIcon(text),
//     };
//     setMessages((prev) => [...prev, userMessage]);

//     const currentText = text;
//     setText("");
//     setTranscript("");
//     setLoading(true);

//     try {
//       if (isSmartAction(currentText)) {
//         const actionResult = await executeSmartActionAPI(currentText, user);

//         if (actionResult.success) {
//           const aiMessage = {
//             id: Date.now() + 1,
//             type: "ai",
//             text: actionResult.message,
//             time: new Date().toLocaleString(),
//             icon: getActionIcon(currentText),
//             isAction: true,
//           };
//           setMessages((prev) => [...prev, aiMessage]);

//           if (currentText.toLowerCase().includes("remind")) {
//             toast.success("⏰ " + actionResult.message, {
//               duration: 4000,
//               icon: "⏰",
//             });
//             loadReminders();
//           } else if (currentText.toLowerCase().includes("email")) {
//             toast.success("📧 " + actionResult.message, {
//               duration: 4000,
//               icon: "📧",
//             });
//           } else if (currentText.toLowerCase().includes("play")) {
//             if (actionResult.url) {
//               const videoId = extractYouTubeId(actionResult.url);
//               if (videoId) {
//                 const songName = currentText
//                   .replace(/play|music|song/gi, "")
//                   .trim();

//                 const musicMessage = {
//                   id: Date.now() + 2,
//                   type: "ai",
//                   text: `🎵 Now Playing: ${songName || "Music"}`,
//                   time: new Date().toLocaleString(),
//                   icon: "🎵",
//                   isMusic: true,
//                   videoId: videoId,
//                   songTitle: songName || "Music",
//                   isPlaying: false,
//                 };
//                 setMessages((prev) => [...prev, musicMessage]);

//                 // Automatically initialize and play the music
//                 setTimeout(() => {
//                   initializePlayer(videoId, musicMessage.id);
//                 }, 500);

//                 toast.success(`🎵 Music loaded: ${songName || "Music"}`, {
//                   duration: 3000,
//                   icon: "🎵",
//                 });
//               } else {
//                 toast.error("Invalid YouTube URL");
//               }
//             }
//           }
//         } else {
//           const errorMessage = {
//             id: Date.now() + 1,
//             type: "ai",
//             text: actionResult.message || "Action failed",
//             time: new Date().toLocaleString(),
//           };
//           setMessages((prev) => [...prev, errorMessage]);
//           toast.error(actionResult.message || "Action failed");
//         }
//       } else {
//         const res = await sendCommand(currentText, userId);

//         const aiMessage = {
//           id: Date.now() + 1,
//           type: "ai",
//           text: res.response,
//           time: new Date().toLocaleString(),
//         };
//         setMessages((prev) => [...prev, aiMessage]);

//         if (
//           currentText.toLowerCase().includes("create") &&
//           currentText.toLowerCase().includes("note")
//         ) {
//           // Force refresh notes after a short delay to ensure backend has saved
//           setTimeout(async () => {
//             await listNotes();
//             toast.success("📝 Note saved successfully!");
//           }, 500);
//         }
//       }

//       const newEntry = {
//         id: Date.now(),
//         text: currentText,
//         time: new Date().toLocaleString(),
//       };
//       const updated = [newEntry, ...history].slice(0, 50);
//       setHistory(updated);
//       localStorage.setItem("vm_history", JSON.stringify(updated));
//     } catch (error) {
//       console.error(error);
//       const errorMessage = {
//         id: Date.now() + 1,
//         type: "ai",
//         text: "Error: Could not reach server",
//         time: new Date().toLocaleString(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//       toast.error("❌ Could not reach server");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSubmit();
//   };

//   if (userId === null) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <Loader
//             className="animate-spin text-violet-500 mx-auto mb-4"
//             size={40}
//           />
//           <p className="text-slate-400">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="">
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             background: "#1e293b",
//             color: "#fff",
//             border: "1px solid #475569",
//           },
//           success: {
//             iconTheme: {
//               primary: "#10b981",
//               secondary: "#fff",
//             },
//           },
//           error: {
//             iconTheme: {
//               primary: "#ef4444",
//               secondary: "#fff",
//             },
//           },
//         }}
//       />

//       <div id="youtube-player" style={{ display: "none" }}></div>

//       {triggeredReminder && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
//           <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-violet-500 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-violet-500/50 animate-scaleIn">
//             <div className="text-center">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
//                 <Bell size={40} className="text-white" />
//               </div>

//               <h2 className="text-2xl font-bold text-white mb-2">
//                 ⏰ Reminder Alert!
//               </h2>

//               <div className="bg-slate-900/50 border border-violet-500/30 rounded-2xl p-6 mb-6">
//                 <p className="text-lg text-slate-200 leading-relaxed">
//                   {triggeredReminder.message}
//                 </p>
//                 <p className="text-sm text-slate-500 mt-3">
//                   {new Date(triggeredReminder.scheduledTime).toLocaleString()}
//                 </p>
//               </div>

//               <button
//                 onClick={closeTriggeredReminder}
//                 className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
//               >
//                 <X size={20} />
//                 Got it!
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="text-center mb-6 sm:mb-8">
//         <div className="inline-flex items-center gap-3 mb-2">
//           <h1 className="text-3xl sm:text-4xl lg:text-4xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
//             VoiceMate AI
//           </h1>
//           {reminders.length > 0 && (
//             <button
//               onClick={() => setShowReminders(!showReminders)}
//               className="relative"
//             >
//               <Bell
//                 size={24}
//                 className="text-violet-400 hover:text-violet-300 transition-colors"
//               />
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
//                 {reminders.length}
//               </span>
//             </button>
//           )}
//         </div>
//         <p className="text-slate-400 text-[12px] sm:text-[13px] font-medium mb-4">
//           Your intelligent voice assistant
//         </p>
//         <p className="text-slate-400 text-[12px] sm:text-[13px] font-medium mb-4 sm:text-left ml-0 sm:ml-35">
//           <p className="block sm:hidden text-[12px] font-bold">
//             (Scroll down to view saved notes)
//           </p>
//           Read below instructions carefully
//         </p>

//         <div className="max-w-4xl mx-auto mb-4">
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
//             <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-xl p-3 hover:border-violet-400/50 transition-all group">
//               <div className="flex items-center gap-2 mb-1.5">
//                 <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
//                   <Bell size={14} className="text-white" />
//                 </div>
//                 <h4 className="text-white font-bold text-xs">Reminders</h4>
//               </div>
//               <p className="text-white text-[12px] leading-tight text-left">
//                 Command: "Set Reminder in 2 mins"
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/30 rounded-xl p-3 hover:border-fuchsia-400/50 transition-all group">
//               <div className="flex items-center gap-2 mb-1.5">
//                 <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg">
//                   <Music size={14} className="text-white" />
//                 </div>
//                 <h4 className="text-white font-bold text-xs">Music</h4>
//               </div>
//               <p className="text-white text-[13px] leading-tight text-left">
//                 Command: "Play Despacito"
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-3 hover:border-blue-400/50 transition-all group">
//               <div className="flex items-center gap-2 mb-1.5">
//                 <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
//                   <span className="text-white text-xs font-bold">📧</span>
//                 </div>
//                 <h4 className="text-white font-bold text-xs">Email</h4>
//               </div>
//               <p className="text-white text-[12px] leading-tight text-left">
//                 Command: "Send email to..." <br />
//                 Ex: Send email to test@gmail.com hello how are you?
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-3 hover:border-emerald-400/50 transition-all group">
//               <div className="flex items-center gap-2 mb-1.5">
//                 <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
//                   <Sparkles size={14} className="text-white" />
//                 </div>
//                 <h4 className="text-white font-bold text-xs">Notes</h4>
//               </div>
//               <p className="text-white text-[12px] leading-tight text-left">
//                 Command: "Create note..."
//                 <br /> Ex: Create note buy nuts today
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showReminders && reminders.length > 0 && (
//         <div className="fixed top-20 right-8 z-50 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-2xl w-80 animate-slideIn">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-white font-bold flex items-center gap-2">
//               <Bell size={18} className="text-violet-400" />
//               Pending Reminders
//             </h3>
//             <button
//               onClick={() => setShowReminders(false)}
//               className="text-slate-400 hover:text-white"
//             >
//               ✕
//             </button>
//           </div>
//           <div className="space-y-2 max-h-60 overflow-y-auto">
//             {reminders.map((reminder) => (
//               <div
//                 key={reminder._id}
//                 className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-3"
//               >
//                 <p className="text-slate-200 text-sm">{reminder.message}</p>
//                 <p className="text-slate-500 text-xs mt-1">
//                   {new Date(reminder.scheduledTime).toLocaleString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="flex flex-col lg:flex-row lg:items-start lg:justify-center gap-8 w-full max-w-7xl mx-auto">
//         <div className="w-full lg:w-2/3">
//           <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/30 p-4 sm:p-6 lg:p-8 shadow-2xl mb-6 sm:mb-8">
//             <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
//               <div className="space-y-4 sm:space-y-5">
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-2xl"></div>
//                   <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-violet-500/20">
//                     <div className="flex flex-col items-center">
//                       <button
//                         type="button"
//                         onClick={startVoiceRecognition}
//                         disabled={isListening || loading}
//                         className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-500 transform ${
//                           isListening
//                             ? "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 shadow-2xl shadow-purple-500/60 scale-110 animate-pulse"
//                             : "bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400 hover:scale-105 hover:shadow-2xl hover:shadow-purple-400/50"
//                         } disabled:opacity-50 disabled:cursor-not-allowed`}
//                       >
//                         {isListening ? (
//                           <>
//                             <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-40"></div>
//                             <div className="absolute inset-2 rounded-full bg-purple-500/30 animate-pulse"></div>
//                             <Mic
//                               size={40}
//                               className="text-white relative z-10 drop-shadow-lg"
//                             />
//                           </>
//                         ) : (
//                           <Mic
//                             size={40}
//                             className="text-white drop-shadow-lg"
//                           />
//                         )}
//                       </button>
//                       <div className="mt-5 text-center">
//                         <p className="text-white text-base sm:text-lg font-bold mb-1">
//                           {isListening ? "I'm listening..." : "Tap to Speak"}
//                         </p>
//                         <p className="text-slate-400 text-xs sm:text-sm">
//                           {isListening
//                             ? "Speak clearly into your microphone"
//                             : "Hold and speak your command"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-700/30">
//                   <div className="flex items-center gap-2 mb-3">
//                     <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
//                       <Sparkles size={14} className="text-violet-400" />
//                     </div>
//                     <h3 className="text-slate-200 text-sm font-bold">
//                       Type Command
//                     </h3>
//                   </div>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={text}
//                       placeholder="Type your command here..."
//                       onChange={(e) => setText(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       className="flex-1 bg-slate-800/80 text-white px-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl outline-none border border-slate-600/40 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/20 placeholder-slate-500 transition-all"
//                     />
//                     {text && (
//                       <button
//                         type="button"
//                         onClick={handleSubmit}
//                         disabled={loading}
//                         className="flex-shrink-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white mx-auto px-4 sm:px-3 py-3 sm:py-3.5 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 font-semibold text-sm sm:text-base"
//                       >
//                         {loading ? (
//                           <>
//                             <Loader className="animate-spin" />
//                             <span className="px-0 py-1 text-sm">Wait</span>
//                           </>
//                         ) : (
//                           <Send size={18} />
//                         )}
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {transcript && (
//                   <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-500/30 rounded-2xl self-center p-4 animate-slideIn backdrop-blur-sm">
//                     <div className="flex items-start gap-3">
//                       <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
//                         <Volume2 size={18} className="text-white" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-violet-400 font-bold text-sm mb-1.5">
//                           Voice Detected
//                         </p>
//                         <p className="text-white text-sm sm:text-base leading-relaxed break-words">
//                           {transcript}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/30 overflow-hidden">
//                   <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/40">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
//                         <Sparkles size={20} className="text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-violet-400 text-base sm:text-lg font-bold">
//                           Conversation
//                         </h3>
//                         <p className="text-slate-500 text-xs">
//                           {messages.length > 0
//                             ? `${Math.floor(messages.length / 2)} messages`
//                             : "AI Responses"}
//                         </p>
//                       </div>
//                     </div>
//                     {messages.length > 0 && (
//                       <button
//                         onClick={clearChat}
//                         className="flex items-center gap-2 px-1 py-2 sm:px-3 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 hover:text-rose-300 transition-all text-sm font-semibold"
//                       >
//                         <Trash2 size={14} />
//                         <span>Clear</span>
//                       </button>
//                     )}
//                   </div>

//                   <div className="h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-violet-500/20 scrollbar-track-transparent">
//                     {messages.length === 0 && !loading && (
//                       <div className="flex items-center justify-center h-full">
//                         <div className="text-center max-w-xs">
//                           <div className="relative inline-flex mb-5">
//                             <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl blur-xl opacity-40 animate-pulse"></div>
//                             <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-violet-500/30 to-purple-500/30 flex items-center justify-center border border-violet-500/30">
//                               <Sparkles size={32} className="text-violet-400" />
//                             </div>
//                           </div>
//                           <p className="text-slate-300 text-base sm:text-lg font-bold mb-2">
//                             Ready to Assist
//                           </p>
//                           <p className="text-slate-500 text-lg">
//                             Your AI responses appears here
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {messages.map((msg) => (
//                       <div
//                         key={msg.id}
//                         className={`flex ${
//                           msg.type === "user" ? "justify-end" : "justify-start"
//                         } animate-fadeIn`}
//                       >
//                         <div
//                           className={`max-w-[85%] rounded-2xl p-3 sm:p-4 ${
//                             msg.type === "user"
//                               ? "bg-gradient-to-br from-violet-500 to-purple-500 text-white"
//                               : msg.isAction
//                               ? "bg-gradient-to-br from-emerald-900/40 to-teal-900/40 text-slate-200 border border-emerald-500/30"
//                               : "bg-slate-800/80 text-slate-200 border border-slate-700/50"
//                           }`}
//                         >
//                           <div className="flex items-start gap-3">
//                             {msg.icon && (
//                               <span className="text-2xl flex-shrink-0">
//                                 {msg.icon}
//                               </span>
//                             )}
//                             <p className="text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap flex-1">
//                               {msg.text}
//                             </p>

//                             {msg.type === "ai" && !msg.isMusic && (
//                               <button
//                                 onClick={() => speakText(msg.text)}
//                                 className="ml-2 p-1.5 rounded-lg hover:bg-slate-700/40 transition-all"
//                                 title={
//                                   isSpeaking ? "Stop speaking" : "Play response"
//                                 }
//                                 type="button"
//                               >
//                                 {isSpeaking ? (
//                                   <VolumeX
//                                     size={16}
//                                     className="text-rose-400"
//                                   />
//                                 ) : (
//                                   <Volume2 size={16} />
//                                 )}
//                               </button>
//                             )}
//                           </div>

//                           {msg.isMusic && (
//                             <div className="mt-4 pt-4 border-t border-slate-700/50">
//                               <div className="flex items-center justify-center gap-3 mb-3">
//                                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
//                                   <Music size={20} className="text-white" />
//                                 </div>

//                                 <button
//                                   onClick={() =>
//                                     handleMusicControl(msg.id, "toggle")
//                                   }
//                                   className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 flex items-center justify-center transition-all shadow-lg"
//                                   title={msg.isPlaying ? "Pause" : "Play"}
//                                 >
//                                   {msg.isPlaying ? (
//                                     <Pause size={18} className="text-white" />
//                                   ) : (
//                                     <Play
//                                       size={18}
//                                       className="text-white ml-0.5"
//                                     />
//                                   )}
//                                 </button>

//                                 <button
//                                   onClick={() =>
//                                     handleMusicControl(msg.id, "stop")
//                                   }
//                                   className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all"
//                                   title="Stop"
//                                 >
//                                   <Square size={16} className="text-white" />
//                                 </button>
//                               </div>

//                               {activeMusic === msg.id && (
//                                 <div className="px-2">
//                                   <div className="flex items-center gap-2 mb-2">
//                                     <span className="text-xs text-slate-400 w-10">
//                                       {formatTime(currentTime)}
//                                     </span>
//                                     <input
//                                       type="range"
//                                       min="0"
//                                       max={duration || 100}
//                                       value={currentTime}
//                                       onChange={(e) =>
//                                         handleSeek(
//                                           msg.id,
//                                           parseFloat(e.target.value)
//                                         )
//                                       }
//                                       className="flex-1 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer seek-slider"
//                                       style={{
//                                         background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
//                                           (currentTime / duration) * 100
//                                         }%, #334155 ${
//                                           (currentTime / duration) * 100
//                                         }%, #334155 100%)`,
//                                       }}
//                                     />
//                                     <span className="text-xs text-slate-400 w-10 text-right">
//                                       {formatTime(duration)}
//                                     </span>
//                                   </div>
//                                 </div>
//                               )}

//                               <div className="mt-3 flex items-center justify-center gap-1">
//                                 {[...Array(5)].map((_, i) => (
//                                   <div
//                                     key={i}
//                                     className={`w-1 bg-gradient-to-t from-violet-500 to-purple-500 rounded-full ${
//                                       msg.isPlaying ? "animate-musicBar" : "h-2"
//                                     }`}
//                                     style={{
//                                       animationDelay: `${i * 0.1}s`,
//                                     }}
//                                   ></div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}

//                     {loading && (
//                       <div className="flex justify-start animate-fadeIn">
//                         <div className="max-w-[85%] rounded-2xl p-4 bg-slate-800/80 border border-slate-700/50">
//                           <div className="flex items-center gap-2">
//                             <Loader
//                               className="animate-spin text-violet-400"
//                               size={16}
//                             />
//                             <p className="text-slate-400 text-sm">
//                               VoiceMate is thinking...
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     <div ref={messagesEndRef} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="w-full lg:w-1/4 bg-slate-900/30 backdrop-blur-lg rounded-3xl border border-slate-700/30 p-4 sm:p-6 lg:p-7 shadow-xl">
//           <div className="flex items-center gap-3 mb-5 sm:mb-3">
//             <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
//               <Sparkles size={20} className="text-white" />
//             </div>
//             <div>
//               <h2 className="text-xl sm:text-2xl font-black text-white">
//                 Saved Notes
//               </h2>
//               <p className="text-slate-400 text-xs sm:text-sm">
//                 Your personal collection
//               </p>
//             </div>
//           </div>

//           <p className="text-violet-400 font-medium text-sm sm:text-[13px] mb-5">
//             Save important thoughts and ideas instantly as notes
//           </p>

//           <div className="grid grid-cols-1 gap-3 sm:gap-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent">
//             {notes.length > 0 ? (
//               notes.map((note) => (
//                 <div
//                   key={note._id}
//                   className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-4 sm:p-5 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 animate-fadeIn"
//                 >
//                   <div className="flex justify-between items-start mb-3">
//                     <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center border border-violet-500/20">
//                       <Sparkles size={14} className="text-violet-400" />
//                     </div>

//                     <button
//                       onClick={() => deleteNote(note._id)}
//                       className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/20 transform hover:scale-110 transition-all duration-200"
//                     >
//                       <Trash2 size={14} />
//                     </button>
//                   </div>

//                   <p className="text-slate-200 text-sm leading-relaxed mb-3 break-words line-clamp-4">
//                     {note.content}
//                   </p>

//                   <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-700/30 pt-3">
//                     <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
//                     <span>{new Date(note.createdAt).toLocaleString()}</span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
//                   <Sparkles size={24} className="text-violet-400" />
//                 </div>
//                 <p className="text-slate-400 text-sm">No notes yet!</p>
//                 <p className="text-slate-500 text-xs mt-1">
//                   Create your first note by saying "create a note..."
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes slideIn {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(15px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         @keyframes scaleIn {
//           from {
//             opacity: 0;
//             transform: scale(0.9);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//         @keyframes musicBar {
//           0%,
//           100% {
//             height: 8px;
//           }
//           50% {
//             height: 24px;
//           }
//         }
//         .animate-slideIn {
//           animation: slideIn 0.3s ease-out;
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.4s ease-out;
//         }
//         .animate-scaleIn {
//           animation: scaleIn 0.3s ease-out;
//         }
//         .animate-musicBar {
//           animation: musicBar 0.8s ease-in-out infinite;
//         }
//         .line-clamp-4 {
//           display: -webkit-box;
//           -webkit-line-clamp: 4;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//         .scrollbar-thin::-webkit-scrollbar {
//           width: 6px;
//         }
//         .scrollbar-thumb-violet-500\/20::-webkit-scrollbar-thumb {
//           background-color: rgba(139, 92, 246, 0.2);
//           border-radius: 3px;
//         }
//         .scrollbar-thumb-pink-500\/20::-webkit-scrollbar-thumb {
//           background-color: rgba(236, 72, 153, 0.2);
//           border-radius: 3px;
//         }
//         .scrollbar-track-transparent::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .seek-slider::-webkit-slider-thumb {
//           appearance: none;
//           width: 12px;
//           height: 12px;
//           border-radius: 50%;
//           background: #8b5cf6;
//           cursor: pointer;
//           box-shadow: 0 0 4px rgba(139, 92, 246, 0.5);
//         }
//         .seek-slider::-moz-range-thumb {
//           width: 12px;
//           height: 12px;
//           border-radius: 50%;
//           background: #8b5cf6;
//           cursor: pointer;
//           border: none;
//           box-shadow: 0 0 4px rgba(139, 92, 246, 0.5);
//         }
//       `}</style>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import {
  sendCommand,
  createNoteAPI,
  listNotesAPI,
  deleteNoteAPI,
  executeSmartActionAPI,
  getPendingRemindersAPI,
  deleteReminderAPI,
} from "../services/api";
import {
  Mic,
  Loader,
  Send,
  Volume2,
  VolumeX,
  Trash2,
  Sparkles,
  Bell,
  X,
  Square,
  Music,
  Play,
  Pause,
} from "lucide-react";
import { auth } from "../firebase";
import toast, { Toaster } from "react-hot-toast";

export default function VoiceCommand() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [notes, setNotes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [showReminders, setShowReminders] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vm_history") || "[]");
    } catch {
      return [];
    }
  });

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const reminderCheckIntervalRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const utteranceRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [triggeredReminder, setTriggeredReminder] = useState(null);
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeMusic, setActiveMusic] = useState(null);

  // const scrollToBottom = () => {
  //   if (messagesEndRef.current) {
  //     // Smooth scroll with inline positioning to avoid over-scrolling
  //     messagesEndRef.current.scrollIntoView({ 
  //       behavior: "smooth",
  //       block: "end",
  //       inline: "nearest"
  //     });
  //   }
  // };
   const scrollToBottom = () => {
    // Scroll only within the messages container, not the whole page
    const messagesContainer = messagesEndRef.current?.parentElement;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  useEffect(() => {
    // Small delay to ensure content is rendered before scrolling
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUserId(firebaseUser.uid);
        setUser({
          _id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        setUserId(null);
        setUser(null);
        setNotes([]);
        setMessages([]);
        setReminders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId && user) {
      listNotes();
      loadReminders();
    }
  }, [userId, user]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const listNotes = async () => {
    if (!userId) return;
    try {
      const res = await listNotesAPI(userId);
      setNotes(res.notes || []);
    } catch (err) {
      console.error("Error loading notes:", err);
      setNotes([]);
    }
  };

  const loadReminders = async () => {
    if (!user) return;
    try {
      const res = await getPendingRemindersAPI(user);
      if (res.success) {
        setReminders(res.reminders || []);
      }
    } catch (err) {
      console.error("Error loading reminders:", err);
    }
  };

  useEffect(() => {
    if (!user || !userId) return;

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    checkAndTriggerReminders();
    reminderCheckIntervalRef.current = setInterval(() => {
      checkAndTriggerReminders();
    }, 30000);

    return () => {
      if (reminderCheckIntervalRef.current) {
        clearInterval(reminderCheckIntervalRef.current);
      }
    };
  }, [user, userId, reminders]);

  const checkAndTriggerReminders = async () => {
    if (!reminders || reminders.length === 0) return;
    const now = new Date();

    for (const reminder of reminders) {
      const reminderTime = new Date(reminder.scheduledTime);
      const timeDiff = now - reminderTime;

      if (timeDiff >= 0 && timeDiff < 60000) {
        triggerReminderAlert(reminder);
        try {
          await deleteReminderAPI(reminder._id, user);
          setReminders((prev) => prev.filter((r) => r._id !== reminder._id));
        } catch (err) {
          console.error("Error deleting triggered reminder:", err);
        }
      }
    }
  };

  const triggerReminderAlert = (reminder) => {
    playNotificationSound();
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("⏰ Reminder Alert!", {
        body: reminder.message,
        icon: "/favicon.ico",
        requireInteraction: true,
      });
    }
    toast.success(`⏰ Reminder: ${reminder.message}`, {
      duration: 8000,
      icon: "⏰",
    });
    setTriggeredReminder(reminder);
    speakText(`Reminder: ${reminder.message}`);

    const reminderMessage = {
      id: Date.now(),
      type: "ai",
      text: `⏰ REMINDER ALERT!\n\n${reminder.message}`,
      time: new Date().toLocaleString(),
      icon: "⏰",
      isAction: true,
    };
    setMessages((prev) => [...prev, reminderMessage]);
  };

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        oscillator2.frequency.value = 1000;
        oscillator2.type = "sine";
        gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
        );
        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.5);
      }, 300);
    } catch (err) {
      console.error("Error playing notification sound:", err);
    }
  };

  const closeTriggeredReminder = () => {
    setTriggeredReminder(null);
  };

  const extractYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleMusicControl = (messageId, action) => {
    const musicMsg = messages.find((m) => m.id === messageId && m.isMusic);
    if (!musicMsg) return;

    if (playerRef.current) {
      if (action === "toggle") {
        if (musicMsg.isPlaying) {
          playerRef.current.pauseVideo();
          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageId ? { ...m, isPlaying: false } : m
            )
          );
        } else {
          playerRef.current.playVideo();
          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageId ? { ...m, isPlaying: true } : m
            )
          );
        }
      } else if (action === "stop") {
        playerRef.current.stopVideo();
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, isPlaying: false } : m))
        );
      }
    }
  };

  const initializePlayer = (videoId, messageId) => {
    const onYouTubeIframeAPIReady = () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            setMessages((prev) =>
              prev.map((m) =>
                m.id === messageId ? { ...m, isPlaying: true } : m
              )
            );
            setActiveMusic(messageId);
            setDuration(event.target.getDuration());

            // Update progress bar
            const interval = setInterval(() => {
              if (playerRef.current && playerRef.current.getCurrentTime) {
                setCurrentTime(playerRef.current.getCurrentTime());
              }
            }, 500);

            playerRef.current.progressInterval = interval;
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === messageId ? { ...m, isPlaying: false } : m
                )
              );
              setActiveMusic(null);
              if (playerRef.current.progressInterval) {
                clearInterval(playerRef.current.progressInterval);
              }
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === messageId ? { ...m, isPlaying: true } : m
                )
              );
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === messageId ? { ...m, isPlaying: false } : m
                )
              );
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }
  };

  const handleSeek = (messageId, value) => {
    if (playerRef.current && activeMusic === messageId) {
      playerRef.current.seekTo(value, true);
      setCurrentTime(value);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const deleteNote = async (id) => {
    if (!userId) return;
    try {
      await deleteNoteAPI(id, userId);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      setTimeout(() => {
        listNotes();
      }, 300);
      toast.success("📝 Note deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete note");
      listNotes();
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear current conversation?")) {
      setMessages([]);
      setText("");
      setTranscript("");
      if (playerRef.current) {
        playerRef.current.stopVideo();
      }
      toast.success("Chat cleared!");
    }
  };

  const isSmartAction = (command) => {
    const lower = command.toLowerCase();
    return (
      lower.includes("remind me") ||
      lower.includes("reminder") ||
      (lower.includes("send") &&
        (lower.includes("email") || lower.includes("mail"))) ||
      lower.includes("play")
    );
  };

  const getActionIcon = (command) => {
    const lower = command.toLowerCase();
    if (lower.includes("remind")) return "⏰";
    if (lower.includes("email") || lower.includes("mail")) return "📧";
    if (lower.includes("play")) return "🎵";
    return "💬";
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      setText(spokenText);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  const startVoiceRecognition = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setTranscript("");
      recognitionRef.current.start();
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  };

  const speakText = (textToSpeak) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    if (window.speechSynthesis.speaking || utteranceRef.current) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setIsSpeaking(false);
      return;
    }

    const ut = new SpeechSynthesisUtterance(textToSpeak);
    ut.lang = "en-IN";
    ut.rate = 1;
    ut.pitch = 1;

    ut.onstart = () => setIsSpeaking(true);
    ut.onend = () => {
      utteranceRef.current = null;
      setIsSpeaking(false);
    };
    ut.onerror = () => {
      utteranceRef.current = null;
      setIsSpeaking(false);
    };

    utteranceRef.current = ut;
    window.speechSynthesis.speak(ut);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    if (!userId || !user) {
      alert("Please login first!");
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: text,
      time: new Date().toLocaleString(),
      icon: getActionIcon(text),
    };
    setMessages((prev) => [...prev, userMessage]);

    const currentText = text;
    setText("");
    setTranscript("");
    setLoading(true);

    try {
      if (isSmartAction(currentText)) {
        const actionResult = await executeSmartActionAPI(currentText, user);

        if (actionResult.success) {
          const aiMessage = {
            id: Date.now() + 1,
            type: "ai",
            text: actionResult.message,
            time: new Date().toLocaleString(),
            icon: getActionIcon(currentText),
            isAction: true,
          };
          setMessages((prev) => [...prev, aiMessage]);

          if (currentText.toLowerCase().includes("remind")) {
            toast.success("⏰ " + actionResult.message, {
              duration: 4000,
              icon: "⏰",
            });
            loadReminders();
          } else if (currentText.toLowerCase().includes("email")) {
            toast.success("📧 " + actionResult.message, {
              duration: 4000,
              icon: "📧",
            });
          } else if (currentText.toLowerCase().includes("play")) {
            if (actionResult.url) {
              const videoId = extractYouTubeId(actionResult.url);
              if (videoId) {
                const songName = currentText
                  .replace(/play|music|song/gi, "")
                  .trim();

                const musicMessage = {
                  id: Date.now() + 2,
                  type: "ai",
                  text: `🎵 Now Playing: ${songName || "Music"}`,
                  time: new Date().toLocaleString(),
                  icon: "🎵",
                  isMusic: true,
                  videoId: videoId,
                  songTitle: songName || "Music",
                  isPlaying: false,
                };
                setMessages((prev) => [...prev, musicMessage]);

                // Automatically initialize and play the music
                setTimeout(() => {
                  initializePlayer(videoId, musicMessage.id);
                }, 500);

                toast.success(`🎵 Music loaded: ${songName || "Music"}`, {
                  duration: 3000,
                  icon: "🎵",
                });
              } else {
                toast.error("Invalid YouTube URL");
              }
            }
          }
        } else {
          const errorMessage = {
            id: Date.now() + 1,
            type: "ai",
            text: actionResult.message || "Action failed",
            time: new Date().toLocaleString(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          toast.error(actionResult.message || "Action failed");
        }
      } else {
        const res = await sendCommand(currentText, userId);

        const aiMessage = {
          id: Date.now() + 1,
          type: "ai",
          text: res.response,
          time: new Date().toLocaleString(),
        };
        setMessages((prev) => [...prev, aiMessage]);

        if (
          currentText.toLowerCase().includes("create") &&
          currentText.toLowerCase().includes("note")
        ) {
          // Force refresh notes after a short delay to ensure backend has saved
          setTimeout(async () => {
            await listNotes();
            toast.success("📝 Note saved successfully!");
          }, 500);
        }
      }

      const newEntry = {
        id: Date.now(),
        text: currentText,
        time: new Date().toLocaleString(),
      };
      const updated = [newEntry, ...history].slice(0, 50);
      setHistory(updated);
      localStorage.setItem("vm_history", JSON.stringify(updated));
    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        text: "Error: Could not reach server",
        time: new Date().toLocaleString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("❌ Could not reach server");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  if (userId === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader
            className="animate-spin text-violet-500 mx-auto mb-4"
            size={40}
          />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid #475569",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div id="youtube-player" style={{ display: "none" }}></div>

      {triggeredReminder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-violet-500 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-violet-500/50 animate-scaleIn">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Bell size={40} className="text-white" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                ⏰ Reminder Alert!
              </h2>

              <div className="bg-slate-900/50 border border-violet-500/30 rounded-2xl p-6 mb-6">
                <p className="text-lg text-slate-200 leading-relaxed">
                  {triggeredReminder.message}
                </p>
                <p className="text-sm text-slate-500 mt-3">
                  {new Date(triggeredReminder.scheduledTime).toLocaleString()}
                </p>
              </div>

              <button
                onClick={closeTriggeredReminder}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <X size={20} />
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-3 mb-2">
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            VoiceMate AI
          </h1>
          {reminders.length > 0 && (
            <button
              onClick={() => setShowReminders(!showReminders)}
              className="relative"
            >
              <Bell
                size={24}
                className="text-violet-400 hover:text-violet-300 transition-colors"
              />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                {reminders.length}
              </span>
            </button>
          )}
        </div>
        <p className="text-slate-400 text-[12px] sm:text-[13px] font-medium mb-4">
          Your intelligent voice assistant
        </p>
        <p className="text-slate-400 text-[12px] sm:text-[13px] font-medium mb-4 sm:text-left ml-0 sm:ml-35">
          <p className="block sm:hidden text-[12px] font-bold">
            (Scroll down to view saved notes)
          </p>
          Read below instructions carefully
        </p>

        <div className="max-w-4xl mx-auto mb-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-xl p-3 hover:border-violet-400/50 transition-all group">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <Bell size={14} className="text-white" />
                </div>
                <h4 className="text-white font-bold text-xs">Reminders</h4>
              </div>
              <p className="text-white text-[12px] leading-tight text-left">
                Command: "Set Reminder in 2 mins"
              </p>
            </div>

            <div className="bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/30 rounded-xl p-3 hover:border-fuchsia-400/50 transition-all group">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Music size={14} className="text-white" />
                </div>
                <h4 className="text-white font-bold text-xs">Music</h4>
              </div>
              <p className="text-white text-[13px] leading-tight text-left">
                Command: "Play Despacito"
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-3 hover:border-blue-400/50 transition-all group">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">📧</span>
                </div>
                <h4 className="text-white font-bold text-xs">Email</h4>
              </div>
              <p className="text-white text-[12px] leading-tight text-left">
                Command: "Send email to..." <br />
                Ex: Send email to test@gmail.com hello how are you?
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-3 hover:border-emerald-400/50 transition-all group">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <Sparkles size={14} className="text-white" />
                </div>
                <h4 className="text-white font-bold text-xs">Notes</h4>
              </div>
              <p className="text-white text-[12px] leading-tight text-left">
                Command: "Create note..."
                <br /> Ex: Create note buy nuts today
              </p>
            </div>
          </div>
        </div>
      </div>

      {showReminders && reminders.length > 0 && (
        <div className="fixed top-20 right-8 z-50 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-2xl w-80 animate-slideIn">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Bell size={18} className="text-violet-400" />
              Pending Reminders
            </h3>
            <button
              onClick={() => setShowReminders(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {reminders.map((reminder) => (
              <div
                key={reminder._id}
                className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-3"
              >
                <p className="text-slate-200 text-sm">{reminder.message}</p>
                <p className="text-slate-500 text-xs mt-1">
                  {new Date(reminder.scheduledTime).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-center gap-8 w-full max-w-7xl mx-auto">
        <div className="w-full lg:w-2/3">
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/30 p-4 sm:p-6 lg:p-8 shadow-2xl mb-6 sm:mb-8">
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="space-y-4 sm:space-y-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-2xl"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-violet-500/20">
                    <div className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={startVoiceRecognition}
                        disabled={isListening || loading}
                        className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                          isListening
                            ? "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 shadow-2xl shadow-purple-500/60 scale-110 animate-pulse"
                            : "bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400 hover:scale-105 hover:shadow-2xl hover:shadow-purple-400/50"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isListening ? (
                          <>
                            <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-40"></div>
                            <div className="absolute inset-2 rounded-full bg-purple-500/30 animate-pulse"></div>
                            <Mic
                              size={40}
                              className="text-white relative z-10 drop-shadow-lg"
                            />
                          </>
                        ) : (
                          <Mic
                            size={40}
                            className="text-white drop-shadow-lg"
                          />
                        )}
                      </button>
                      <div className="mt-5 text-center">
                        <p className="text-white text-base sm:text-lg font-bold mb-1">
                          {isListening ? "I'm listening..." : "Tap to Speak"}
                        </p>
                        <p className="text-slate-400 text-xs sm:text-sm">
                          {isListening
                            ? "Speak clearly into your microphone"
                            : "Hold and speak your command"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                      <Sparkles size={14} className="text-violet-400" />
                    </div>
                    <h3 className="text-slate-200 text-sm font-bold">
                      Type Command
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={text}
                      placeholder="Type your command here..."
                      onChange={(e) => setText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 bg-slate-800/80 text-white px-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl outline-none border border-slate-600/40 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/20 placeholder-slate-500 transition-all"
                    />
                    {text && (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-shrink-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white mx-auto px-4 sm:px-3 py-3 sm:py-3.5 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 font-semibold text-sm sm:text-base"
                      >
                        {loading ? (
                          <>
                            <Loader className="animate-spin" />
                            <span className="px-0 py-1 text-sm">Wait</span>
                          </>
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {transcript && (
                  <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-500/30 rounded-2xl self-center p-4 animate-slideIn backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Volume2 size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-violet-400 font-bold text-sm mb-1.5">
                          Voice Detected
                        </p>
                        <p className="text-white text-sm sm:text-base leading-relaxed break-words">
                          {transcript}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/30 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                        <Sparkles size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-violet-400 text-base sm:text-lg font-bold">
                          Conversation
                        </h3>
                        <p className="text-slate-500 text-xs">
                          {messages.length > 0
                            ? `${Math.floor(messages.length / 2)} messages`
                            : "AI Responses"}
                        </p>
                      </div>
                    </div>
                    {messages.length > 0 && (
                      <button
                        onClick={clearChat}
                        className="flex items-center gap-2 px-1 py-2 sm:px-3 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 hover:text-rose-300 transition-all text-sm font-semibold"
                      >
                        <Trash2 size={14} />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>

                  <div className="h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-violet-500/20 scrollbar-track-transparent">
                    {messages.length === 0 && !loading && (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center max-w-xs">
                          <div className="relative inline-flex mb-5">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl blur-xl opacity-40 animate-pulse"></div>
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-violet-500/30 to-purple-500/30 flex items-center justify-center border border-violet-500/30">
                              <Sparkles size={32} className="text-violet-400" />
                            </div>
                          </div>
                          <p className="text-slate-300 text-base sm:text-lg font-bold mb-2">
                            Ready to Assist
                          </p>
                          <p className="text-slate-500 text-lg">
                            Your AI responses appears here
                          </p>
                        </div>
                      </div>
                    )}

                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.type === "user" ? "justify-end" : "justify-start"
                        } animate-fadeIn`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-3 sm:p-4 ${
                            msg.type === "user"
                              ? "bg-gradient-to-br from-violet-500 to-purple-500 text-white"
                              : msg.isAction
                              ? "bg-gradient-to-br from-emerald-900/40 to-teal-900/40 text-slate-200 border border-emerald-500/30"
                              : "bg-slate-800/80 text-slate-200 border border-slate-700/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {msg.icon && (
                              <span className="text-2xl flex-shrink-0">
                                {msg.icon}
                              </span>
                            )}
                            <p className="text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap flex-1">
                              {msg.text}
                            </p>

                            {msg.type === "ai" && !msg.isMusic && (
                              <button
                                onClick={() => speakText(msg.text)}
                                className="ml-2 p-1.5 rounded-lg hover:bg-slate-700/40 transition-all"
                                title={
                                  isSpeaking ? "Stop speaking" : "Play response"
                                }
                                type="button"
                              >
                                {isSpeaking ? (
                                  <VolumeX
                                    size={16}
                                    className="text-rose-400"
                                  />
                                ) : (
                                  <Volume2 size={16} />
                                )}
                              </button>
                            )}
                          </div>

                          {msg.isMusic && (
                            <div className="mt-4 pt-4 border-t border-slate-700/50">
                              <div className="flex items-center justify-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                                  <Music size={20} className="text-white" />
                                </div>

                                <button
                                  onClick={() =>
                                    handleMusicControl(msg.id, "toggle")
                                  }
                                  className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 flex items-center justify-center transition-all shadow-lg"
                                  title={msg.isPlaying ? "Pause" : "Play"}
                                >
                                  {msg.isPlaying ? (
                                    <Pause size={18} className="text-white" />
                                  ) : (
                                    <Play
                                      size={18}
                                      className="text-white ml-0.5"
                                    />
                                  )}
                                </button>

                                <button
                                  onClick={() =>
                                    handleMusicControl(msg.id, "stop")
                                  }
                                  className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all"
                                  title="Stop"
                                >
                                  <Square size={16} className="text-white" />
                                </button>
                              </div>

                              {activeMusic === msg.id && (
                                <div className="px-2">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs text-slate-400 w-10">
                                      {formatTime(currentTime)}
                                    </span>
                                    <input
                                      type="range"
                                      min="0"
                                      max={duration || 100}
                                      value={currentTime}
                                      onChange={(e) =>
                                        handleSeek(
                                          msg.id,
                                          parseFloat(e.target.value)
                                        )
                                      }
                                      className="flex-1 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer seek-slider"
                                      style={{
                                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
                                          (currentTime / duration) * 100
                                        }%, #334155 ${
                                          (currentTime / duration) * 100
                                        }%, #334155 100%)`,
                                      }}
                                    />
                                    <span className="text-xs text-slate-400 w-10 text-right">
                                      {formatTime(duration)}
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className="mt-3 flex items-center justify-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-1 bg-gradient-to-t from-violet-500 to-purple-500 rounded-full ${
                                      msg.isPlaying ? "animate-musicBar" : "h-2"
                                    }`}
                                    style={{
                                      animationDelay: `${i * 0.1}s`,
                                    }}
                                  ></div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {loading && (
                      <div className="flex justify-start animate-fadeIn">
                        <div className="max-w-[85%] rounded-2xl p-4 bg-slate-800/80 border border-slate-700/50">
                          <div className="flex items-center gap-2">
                            <Loader
                              className="animate-spin text-violet-400"
                              size={16}
                            />
                            <p className="text-slate-400 text-sm">
                              VoiceMate is thinking...
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/4 bg-slate-900/30 backdrop-blur-lg rounded-3xl border border-slate-700/30 p-4 sm:p-6 lg:p-7 shadow-xl">
          <div className="flex items-center gap-3 mb-5 sm:mb-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Saved Notes
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Your personal collection
              </p>
            </div>
          </div>

          <p className="text-violet-400 font-medium text-sm sm:text-[13px] mb-5">
            Save important thoughts and ideas instantly as notes
          </p>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div
                  key={note._id}
                  className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-4 sm:p-5 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 animate-fadeIn"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center border border-violet-500/20">
                      <Sparkles size={14} className="text-violet-400" />
                    </div>

                    <button
                      onClick={() => deleteNote(note._id)}
                      className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/20 transform hover:scale-110 transition-all duration-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <p className="text-slate-200 text-sm leading-relaxed mb-3 break-words line-clamp-4">
                    {note.content}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-700/30 pt-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
                    <span>{new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={24} className="text-violet-400" />
                </div>
                <p className="text-slate-400 text-sm">No notes yet!</p>
                <p className="text-slate-500 text-xs mt-1">
                  Create your first note by saying "create a note..."
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes musicBar {
          0%,
          100% {
            height: 8px;
          }
          50% {
            height: 24px;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-musicBar {
          animation: musicBar 0.8s ease-in-out infinite;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-violet-500\/20::-webkit-scrollbar-thumb {
          background-color: rgba(139, 92, 246, 0.2);
          border-radius: 3px;
        }
        .scrollbar-thumb-pink-500\/20::-webkit-scrollbar-thumb {
          background-color: rgba(236, 72, 153, 0.2);
          border-radius: 3px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        .seek-slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          box-shadow: 0 0 4px rgba(139, 92, 246, 0.5);
        }
        .seek-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 4px rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
}


// import React, { useState, useEffect, useRef } from "react";
// import {
//   sendCommand,
//   createNoteAPI,
//   listNotesAPI,
//   deleteNoteAPI,
//   executeSmartActionAPI,
//   getPendingRemindersAPI,
//   deleteReminderAPI,
// } from "../services/api";
// import {
//   Mic,
//   Loader,
//   Send,
//   Volume2,
//   VolumeX,
//   Trash2,
//   Sparkles,
//   Bell,
//   X,
//   Square,
//   Music,
//   Play,
//   Pause,
// } from "lucide-react";
// import { auth } from "../firebase";
// import toast, { Toaster } from "react-hot-toast";

// export default function VoiceCommand() {
//   const [text, setText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState("");
//   const [notes, setNotes] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [reminders, setReminders] = useState([]);
//   const [showReminders, setShowReminders] = useState(false);
//   const [history, setHistory] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("vm_history") || "[]");
//     } catch {
//       return [];
//     }
//   });

//   const recognitionRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const reminderCheckIntervalRef = useRef(null);
//   const [userId, setUserId] = useState(null);
//   const [user, setUser] = useState(null);
//   const utteranceRef = useRef(null);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [triggeredReminder, setTriggeredReminder] = useState(null);
//   const playerRef = useRef(null);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [activeMusic, setActiveMusic] = useState(null);

//   const scrollToBottom = () => {
//     if (messagesEndRef.current) {
//       // Smooth scroll with inline positioning to avoid over-scrolling
//       messagesEndRef.current.scrollIntoView({ 
//         behavior: "smooth",
//         block: "end",
//         inline: "nearest"
//       });
//     }
//   };

//   useEffect(() => {
//     // Small delay to ensure content is rendered before scrolling
//     const timer = setTimeout(() => {
//       scrollToBottom();
//     }, 100);
//     return () => clearTimeout(timer);
//   }, [messages]);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
//       if (firebaseUser) {
//         setUserId(firebaseUser.uid);
//         setUser({
//           _id: firebaseUser.uid,
//           email: firebaseUser.email,
//           displayName: firebaseUser.displayName,
//         });
//       } else {
//         setUserId(null);
//         setUser(null);
//         setNotes([]);
//         setMessages([]);
//         setReminders([]);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (userId && user) {
//       listNotes();
//       loadReminders();
//     }
//   }, [userId, user]);

//   useEffect(() => {
//     if (!window.YT) {
//       const tag = document.createElement("script");
//       tag.src = "https://www.youtube.com/iframe_api";
//       const firstScriptTag = document.getElementsByTagName("script")[0];
//       firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//     }
//   }, []);

//   const listNotes = async () => {
//     if (!userId) return;
//     try {
//       const res = await listNotesAPI(userId);
//       setNotes(res.notes || []);
//     } catch (err) {
//       console.error("Error loading notes:", err);
//       setNotes([]);
//     }
//   };

//   const loadReminders = async () => {
//     if (!user) return;
//     try {
//       const res = await getPendingRemindersAPI(user);
//       if (res.success) {
//         setReminders(res.reminders || []);
//       }
//     } catch (err) {
//       console.error("Error loading reminders:", err);
//     }
//   };

//   useEffect(() => {
//     if (!user || !userId) return;

//     if ("Notification" in window && Notification.permission === "default") {
//       Notification.requestPermission();
//     }

//     checkAndTriggerReminders();
//     reminderCheckIntervalRef.current = setInterval(() => {
//       checkAndTriggerReminders();
//     }, 30000);

//     return () => {
//       if (reminderCheckIntervalRef.current) {
//         clearInterval(reminderCheckIntervalRef.current);
//       }
//     };
//   }, [user, userId, reminders]);

//   const checkAndTriggerReminders = async () => {
//     if (!reminders || reminders.length === 0) return;
//     const now = new Date();

//     for (const reminder of reminders) {
//       const reminderTime = new Date(reminder.scheduledTime);
//       const timeDiff = now - reminderTime;

//       if (timeDiff >= 0 && timeDiff < 60000) {
//         triggerReminderAlert(reminder);
//         try {
//           await deleteReminderAPI(reminder._id, user);
//           setReminders((prev) => prev.filter((r) => r._id !== reminder._id));
//         } catch (err) {
//           console.error("Error deleting triggered reminder:", err);
//         }
//       }
//     }
//   };

//   const triggerReminderAlert = (reminder) => {
//     playNotificationSound();
//     if ("Notification" in window && Notification.permission === "granted") {
//       new Notification("⏰ Reminder Alert!", {
//         body: reminder.message,
//         icon: "/favicon.ico",
//         requireInteraction: true,
//       });
//     }
//     toast.success(`⏰ Reminder: ${reminder.message}`, {
//       duration: 8000,
//       icon: "⏰",
//     });
//     setTriggeredReminder(reminder);
//     speakText(`Reminder: ${reminder.message}`);

//     const reminderMessage = {
//       id: Date.now(),
//       type: "ai",
//       text: `⏰ REMINDER ALERT!\n\n${reminder.message}`,
//       time: new Date().toLocaleString(),
//       icon: "⏰",
//       isAction: true,
//     };
//     setMessages((prev) => [...prev, reminderMessage]);
//   };

//   const playNotificationSound = () => {
//     try {
//       const audioContext = new (window.AudioContext ||
//         window.webkitAudioContext)();
//       const oscillator = audioContext.createOscillator();
//       const gainNode = audioContext.createGain();

//       oscillator.connect(gainNode);
//       gainNode.connect(audioContext.destination);
//       oscillator.frequency.value = 800;
//       oscillator.type = "sine";
//       gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//       gainNode.gain.exponentialRampToValueAtTime(
//         0.01,
//         audioContext.currentTime + 0.5
//       );
//       oscillator.start(audioContext.currentTime);
//       oscillator.stop(audioContext.currentTime + 0.5);

//       setTimeout(() => {
//         const oscillator2 = audioContext.createOscillator();
//         const gainNode2 = audioContext.createGain();
//         oscillator2.connect(gainNode2);
//         gainNode2.connect(audioContext.destination);
//         oscillator2.frequency.value = 1000;
//         oscillator2.type = "sine";
//         gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
//         gainNode2.gain.exponentialRampToValueAtTime(
//           0.01,
//           audioContext.currentTime + 0.5
//         );
//         oscillator2.start(audioContext.currentTime);
//         oscillator2.stop(audioContext.currentTime + 0.5);
//       }, 300);
//     } catch (err) {
//       console.error("Error playing notification sound:", err);
//     }
//   };

//   const closeTriggeredReminder = () => {
//     setTriggeredReminder(null);
//   };

//   const extractYouTubeId = (url) => {
//     const regExp =
//       /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return match && match[2].length === 11 ? match[2] : null;
//   };

//   const handleMusicControl = (messageId, action) => {
//     const musicMsg = messages.find((m) => m.id === messageId && m.isMusic);
//     if (!musicMsg) return;

//     if (playerRef.current) {
//       if (action === "toggle") {
//         if (musicMsg.isPlaying) {
//           playerRef.current.pauseVideo();
//           setMessages((prev) =>
//             prev.map((m) =>
//               m.id === messageId ? { ...m, isPlaying: false } : m
//             )
//           );
//         } else {
//           playerRef.current.playVideo();
//           setMessages((prev) =>
//             prev.map((m) =>
//               m.id === messageId ? { ...m, isPlaying: true } : m
//             )
//           );
//         }
//       } else if (action === "stop") {
//         playerRef.current.stopVideo();
//         setMessages((prev) =>
//           prev.map((m) => (m.id === messageId ? { ...m, isPlaying: false } : m))
//         );
//       }
//     }
//   };

//   const initializePlayer = (videoId, messageId) => {
//     const onYouTubeIframeAPIReady = () => {
//       if (playerRef.current && playerRef.current.destroy) {
//         playerRef.current.destroy();
//       }

//       playerRef.current = new window.YT.Player("youtube-player", {
//         height: "0",
//         width: "0",
//         videoId: videoId,
//         playerVars: {
//           autoplay: 1,
//           controls: 0,
//         },
//         events: {
//           onReady: (event) => {
//             event.target.playVideo();
//             setMessages((prev) =>
//               prev.map((m) =>
//                 m.id === messageId ? { ...m, isPlaying: true } : m
//               )
//             );
//             setActiveMusic(messageId);
//             setDuration(event.target.getDuration());

//             // Update progress bar
//             const interval = setInterval(() => {
//               if (playerRef.current && playerRef.current.getCurrentTime) {
//                 setCurrentTime(playerRef.current.getCurrentTime());
//               }
//             }, 500);

//             playerRef.current.progressInterval = interval;
//           },
//           onStateChange: (event) => {
//             if (event.data === window.YT.PlayerState.ENDED) {
//               setMessages((prev) =>
//                 prev.map((m) =>
//                   m.id === messageId ? { ...m, isPlaying: false } : m
//                 )
//               );
//               setActiveMusic(null);
//               if (playerRef.current.progressInterval) {
//                 clearInterval(playerRef.current.progressInterval);
//               }
//             } else if (event.data === window.YT.PlayerState.PLAYING) {
//               setMessages((prev) =>
//                 prev.map((m) =>
//                   m.id === messageId ? { ...m, isPlaying: true } : m
//                 )
//               );
//             } else if (event.data === window.YT.PlayerState.PAUSED) {
//               setMessages((prev) =>
//                 prev.map((m) =>
//                   m.id === messageId ? { ...m, isPlaying: false } : m
//                 )
//               );
//             }
//           },
//         },
//       });
//     };

//     if (window.YT && window.YT.Player) {
//       onYouTubeIframeAPIReady();
//     } else {
//       window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
//     }
//   };

//   const handleSeek = (messageId, value) => {
//     if (playerRef.current && activeMusic === messageId) {
//       playerRef.current.seekTo(value, true);
//       setCurrentTime(value);
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const deleteNote = async (id) => {
//     if (!userId) return;
//     try {
//       await deleteNoteAPI(id, userId);
//       setNotes((prev) => prev.filter((note) => note._id !== id));
//       setTimeout(() => {
//         listNotes();
//       }, 300);
//       toast.success("📝 Note deleted successfully!");
//     } catch (err) {
//       console.error("Delete failed:", err);
//       toast.error("Failed to delete note");
//       listNotes();
//     }
//   };

//   const clearChat = () => {
//     if (window.confirm("Clear current conversation?")) {
//       setMessages([]);
//       setText("");
//       setTranscript("");
//       if (playerRef.current) {
//         playerRef.current.stopVideo();
//       }
//       toast.success("Chat cleared!");
//     }
//   };

//   const isSmartAction = (command) => {
//     const lower = command.toLowerCase();
//     return (
//       lower.includes("remind me") ||
//       lower.includes("reminder") ||
//       (lower.includes("send") &&
//         (lower.includes("email") || lower.includes("mail"))) ||
//       lower.includes("play")
//     );
//   };

//   const getActionIcon = (command) => {
//     const lower = command.toLowerCase();
//     if (lower.includes("remind")) return "⏰";
//     if (lower.includes("email") || lower.includes("mail")) return "📧";
//     if (lower.includes("play")) return "🎵";
//     return "💬";
//   };

//   useEffect(() => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       console.warn("Speech Recognition not supported in this browser.");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-IN";
//     recognition.interimResults = false;

//     recognition.onresult = (event) => {
//       const spokenText = event.results[0][0].transcript;
//       setTranscript(spokenText);
//       setText(spokenText);
//       setIsListening(false);
//     };

//     recognition.onend = () => setIsListening(false);
//     recognition.onerror = () => setIsListening(false);
//     recognitionRef.current = recognition;
//   }, []);

//   const startVoiceRecognition = () => {
//     if (recognitionRef.current) {
//       setIsListening(true);
//       setTranscript("");
//       recognitionRef.current.start();
//     } else {
//       alert("Speech recognition not supported in this browser.");
//     }
//   };

//   const speakText = (textToSpeak) => {
//     if (typeof window === "undefined" || !("speechSynthesis" in window)) {
//       return;
//     }

//     if (window.speechSynthesis.speaking || utteranceRef.current) {
//       window.speechSynthesis.cancel();
//       utteranceRef.current = null;
//       setIsSpeaking(false);
//       return;
//     }

//     const ut = new SpeechSynthesisUtterance(textToSpeak);
//     ut.lang = "en-IN";
//     ut.rate = 1;
//     ut.pitch = 1;

//     ut.onstart = () => setIsSpeaking(true);
//     ut.onend = () => {
//       utteranceRef.current = null;
//       setIsSpeaking(false);
//     };
//     ut.onerror = () => {
//       utteranceRef.current = null;
//       setIsSpeaking(false);
//     };

//     utteranceRef.current = ut;
//     window.speechSynthesis.speak(ut);
//   };

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();
//     if (!text.trim()) return;

//     if (!userId || !user) {
//       alert("Please login first!");
//       return;
//     }

//     const userMessage = {
//       id: Date.now(),
//       type: "user",
//       text: text,
//       time: new Date().toLocaleString(),
//       icon: getActionIcon(text),
//     };
//     setMessages((prev) => [...prev, userMessage]);

//     const currentText = text;
//     setText("");
//     setTranscript("");
//     setLoading(true);

//     try {
//       if (isSmartAction(currentText)) {
//         const actionResult = await executeSmartActionAPI(currentText, user);

//         if (actionResult.success) {
//           const aiMessage = {
//             id: Date.now() + 1,
//             type: "ai",
//             text: actionResult.message,
//             time: new Date().toLocaleString(),
//             icon: getActionIcon(currentText),
//             isAction: true,
//           };
//           setMessages((prev) => [...prev, aiMessage]);

//           if (currentText.toLowerCase().includes("remind")) {
//             toast.success("⏰ " + actionResult.message, {
//               duration: 4000,
//               icon: "⏰",
//             });
//             loadReminders();
//           } else if (currentText.toLowerCase().includes("email")) {
//             toast.success("📧 " + actionResult.message, {
//               duration: 4000,
//               icon: "📧",
//             });
//           } else if (currentText.toLowerCase().includes("play")) {
//             if (actionResult.url) {
//               const videoId = extractYouTubeId(actionResult.url);
//               if (videoId) {
//                 const songName = currentText
//                   .replace(/play|music|song/gi, "")
//                   .trim();

//                 const musicMessage = {
//                   id: Date.now() + 2,
//                   type: "ai",
//                   text: `🎵 Now Playing: ${songName || "Music"}`,
//                   time: new Date().toLocaleString(),
//                   icon: "🎵",
//                   isMusic: true,
//                   videoId: videoId,
//                   songTitle: songName || "Music",
//                   isPlaying: false,
//                 };
//                 setMessages((prev) => [...prev, musicMessage]);

//                 // Automatically initialize and play the music
//                 setTimeout(() => {
//                   initializePlayer(videoId, musicMessage.id);
//                 }, 500);

//                 toast.success(`🎵 Music loaded: ${songName || "Music"}`, {
//                   duration: 3000,
//                   icon: "🎵",
//                 });
//               } else {
//                 toast.error("Invalid YouTube URL");
//               }
//             }
//           }
//         } else {
//           const errorMessage = {
//             id: Date.now() + 1,
//             type: "ai",
//             text: actionResult.message || "Action failed",
//             time: new Date().toLocaleString(),
//           };
//           setMessages((prev) => [...prev, errorMessage]);
//           toast.error(actionResult.message || "Action failed");
//         }
//       } else {
//         const res = await sendCommand(currentText, userId);

//         const aiMessage = {
//           id: Date.now() + 1,
//           type: "ai",
//           text: res.response,
//           time: new Date().toLocaleString(),
//         };
//         setMessages((prev) => [...prev, aiMessage]);

//         if (
//           currentText.toLowerCase().includes("create") &&
//           currentText.toLowerCase().includes("note")
//         ) {
//           // Force refresh notes after a short delay to ensure backend has saved
//           setTimeout(async () => {
//             await listNotes();
//             toast.success("📝 Note saved successfully!");
//           }, 500);
//         }
//       }

//       const newEntry = {
//         id: Date.now(),
//         text: currentText,
//         time: new Date().toLocaleString(),
//       };
//       const updated = [newEntry, ...history].slice(0, 50);
//       setHistory(updated);
//       localStorage.setItem("vm_history", JSON.stringify(updated));
//     } catch (error) {
//       console.error(error);
//       const errorMessage = {
//         id: Date.now() + 1,
//         type: "ai",
//         text: "Error: Could not reach server",
//         time: new Date().toLocaleString(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//       toast.error("❌ Could not reach server");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSubmit();
//   };

//   if (userId === null) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <Loader
//             className="animate-spin text-violet-500 mx-auto mb-4"
//             size={40}
//           />
//           <p className="text-slate-400">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="">
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             background: "#1e293b",
//             color: "#fff",
//             border: "1px solid #475569",
//           },
//           success: {
//             iconTheme: {
//               primary: "#10b981",
//               secondary: "#fff",
//             },
//           },
//           error: {
//             iconTheme: {
//               primary: "#ef4444",
//               secondary: "#fff",
//             },
//           },
//         }}
//       />

//       <div id="youtube-player" style={{ display: "none" }}></div>

//       {triggeredReminder && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
//           <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-violet-500 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-violet-500/50 animate-scaleIn">
//             <div className="text-center">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
//                 <Bell size={40} className="text-white" />
//               </div>

//               <h2 className="text-2xl font-bold text-white mb-2">
//                 ⏰ Reminder Alert!
//               </h2>

//               <div className="bg-slate-900/50 border border-violet-500/30 rounded-2xl p-6 mb-6">
//                 <p className="text-lg text-slate-200 leading-relaxed">
//                   {triggeredReminder.message}
//                 </p>
//                 <p className="text-sm text-slate-500 mt-3">
//                   {new Date(triggeredReminder.scheduledTime).toLocaleString()}
//                 </p>
//               </div>

//               <button
//                 onClick={closeTriggeredReminder}
//                 className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
//               >
//                 <X size={20} />
//                 Got it!
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="text-center mb-6 sm:mb-8">
//         <div className="inline-flex items-center gap-3 mb-2">
//           <h1 className="text-3xl sm:text-4xl lg:text-4xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
//             VoiceMate AI
//           </h1>
//           {reminders.length > 0 && (
//             <button
//               onClick={() => setShowReminders(!showReminders)}
//               className="relative"
//             >
//               <Bell
//                 size={24}
//                 className="text-violet-400 hover:text-violet-300 transition-colors"
//               />
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
//                 {reminders.length}
//               </span>
//             </button>
//           )}
//         </div>
//         <p className="text-slate-400 text-[12px] sm:text-[13px] font-medium mb-4">
//           Your intelligent voice assistant
//         </p>
//         <p className="text-slate-400 text-[12px] sm:text-[13px] font-medium mb-4 sm:text-left ml-0 sm:ml-35">
//           <p className="block sm:hidden text-[12px] font-bold">
//             (Scroll down to view saved notes)
//           </p>
//           Read below instructions carefully
//         </p>

//         <div className="max-w-4xl mx-auto mb-4">
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
//             <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-xl p-3 hover:border-violet-400/50 transition-all group">
//               <div className="flex items-center gap-2 mb-1.5">
//                 <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
//                   <Bell size={14} className="text-white" />
//                 </div>
//                 <h4 className="text-white font-bold text-xs">Reminders</h4>
//               </div>
//               <p className="text-white text-[12px] leading-tight text-left">
//                 Command: "Set Reminder in 2 mins"
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/30 rounded-xl p-3 hover:border-fuchsia-400/50 transition-all group">
//               <div className="flex items-center gap-2 mb-1.5">
//                 <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg">
//                   <Music size={14} className="text-white" />
//                 </div>
//                 <h4 className="text-white font-bold text-xs">Music</h4>
//               </div>
//               <p className="text-white text-[13px] leading-tight text-left">
//                 Command: "Play Despacito"
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-3 hover:border-blue-400/50 transition-all group">
//               <div className="flex items-center gap-2 mb-1.5">
//                 <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
//                   <span className="text-white text-xs font-bold">📧</span>
//                 </div>
//                 <h4 className="text-white font-bold text-xs">Email</h4>
//               </div>
//               <p className="text-white text-[12px] leading-tight text-left">
//                 Command: "Send email to..." <br />
//                 Ex: Send email to test@gmail.com hello how are you?
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-3 hover:border-emerald-400/50 transition-all group">
//               <div className="flex items-center gap-2 mb-1.5">
//                 <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
//                   <Sparkles size={14} className="text-white" />
//                 </div>
//                 <h4 className="text-white font-bold text-xs">Notes</h4>
//               </div>
//               <p className="text-white text-[12px] leading-tight text-left">
//                 Command: "Create note..."
//                 <br /> Ex: Create note buy nuts today
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showReminders && reminders.length > 0 && (
//         <div className="fixed top-20 right-8 z-50 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-2xl w-80 animate-slideIn">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-white font-bold flex items-center gap-2">
//               <Bell size={18} className="text-violet-400" />
//               Pending Reminders
//             </h3>
//             <button
//               onClick={() => setShowReminders(false)}
//               className="text-slate-400 hover:text-white"
//             >
//               ✕
//             </button>
//           </div>
//           <div className="space-y-2 max-h-60 overflow-y-auto">
//             {reminders.map((reminder) => (
//               <div
//                 key={reminder._id}
//                 className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-3"
//               >
//                 <p className="text-slate-200 text-sm">{reminder.message}</p>
//                 <p className="text-slate-500 text-xs mt-1">
//                   {new Date(reminder.scheduledTime).toLocaleString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="flex flex-col lg:flex-row lg:items-start lg:justify-center gap-8 w-full max-w-7xl mx-auto">
//         <div className="w-full lg:w-2/3">
//           <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/30 p-4 sm:p-6 lg:p-8 shadow-2xl mb-6 sm:mb-8">
//             <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
//               <div className="space-y-4 sm:space-y-5">
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-2xl"></div>
//                   <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-violet-500/20">
//                     <div className="flex flex-col items-center">
//                       <button
//                         type="button"
//                         onClick={startVoiceRecognition}
//                         disabled={isListening || loading}
//                         className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-500 transform ${
//                           isListening
//                             ? "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 shadow-2xl shadow-purple-500/60 scale-110 animate-pulse"
//                             : "bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400 hover:scale-105 hover:shadow-2xl hover:shadow-purple-400/50"
//                         } disabled:opacity-50 disabled:cursor-not-allowed`}
//                       >
//                         {isListening ? (
//                           <>
//                             <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-40"></div>
//                             <div className="absolute inset-2 rounded-full bg-purple-500/30 animate-pulse"></div>
//                             <Mic
//                               size={40}
//                               className="text-white relative z-10 drop-shadow-lg"
//                             />
//                           </>
//                         ) : (
//                           <Mic
//                             size={40}
//                             className="text-white drop-shadow-lg"
//                           />
//                         )}
//                       </button>
//                       <div className="mt-5 text-center">
//                         <p className="text-white text-base sm:text-lg font-bold mb-1">
//                           {isListening ? "I'm listening..." : "Tap to Speak"}
//                         </p>
//                         <p className="text-slate-400 text-xs sm:text-sm">
//                           {isListening
//                             ? "Speak clearly into your microphone"
//                             : "Hold and speak your command"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-700/30">
//                   <div className="flex items-center gap-2 mb-3">
//                     <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
//                       <Sparkles size={14} className="text-violet-400" />
//                     </div>
//                     <h3 className="text-slate-200 text-sm font-bold">
//                       Type Command
//                     </h3>
//                   </div>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={text}
//                       placeholder="Type your command here..."
//                       onChange={(e) => setText(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       className="flex-1 bg-slate-800/80 text-white px-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl outline-none border border-slate-600/40 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/20 placeholder-slate-500 transition-all"
//                     />
//                     {text && (
//                       <button
//                         type="button"
//                         onClick={handleSubmit}
//                         disabled={loading}
//                         className="flex-shrink-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white mx-auto px-4 sm:px-3 py-3 sm:py-3.5 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 font-semibold text-sm sm:text-base"
//                       >
//                         {loading ? (
//                           <>
//                             <Loader className="animate-spin" />
//                             <span className="px-0 py-1 text-sm">Wait</span>
//                           </>
//                         ) : (
//                           <Send size={18} />
//                         )}
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {transcript && (
//                   <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-500/30 rounded-2xl self-center p-4 animate-slideIn backdrop-blur-sm">
//                     <div className="flex items-start gap-3">
//                       <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
//                         <Volume2 size={18} className="text-white" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-violet-400 font-bold text-sm mb-1.5">
//                           Voice Detected
//                         </p>
//                         <p className="text-white text-sm sm:text-base leading-relaxed break-words">
//                           {transcript}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/30 overflow-hidden">
//                   <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/40">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
//                         <Sparkles size={20} className="text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-violet-400 text-base sm:text-lg font-bold">
//                           Conversation
//                         </h3>
//                         <p className="text-slate-500 text-xs">
//                           {messages.length > 0
//                             ? `${Math.floor(messages.length / 2)} messages`
//                             : "AI Responses"}
//                         </p>
//                       </div>
//                     </div>
//                     {messages.length > 0 && (
//                       <button
//                         onClick={clearChat}
//                         className="flex items-center gap-2 px-1 py-2 sm:px-3 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 hover:text-rose-300 transition-all text-sm font-semibold"
//                       >
//                         <Trash2 size={14} />
//                         <span>Clear</span>
//                       </button>
//                     )}
//                   </div>

//                   <div className="h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-violet-500/20 scrollbar-track-transparent">
//                     {messages.length === 0 && !loading && (
//                       <div className="flex items-center justify-center h-full">
//                         <div className="text-center max-w-xs">
//                           <div className="relative inline-flex mb-5">
//                             <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl blur-xl opacity-40 animate-pulse"></div>
//                             <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-violet-500/30 to-purple-500/30 flex items-center justify-center border border-violet-500/30">
//                               <Sparkles size={32} className="text-violet-400" />
//                             </div>
//                           </div>
//                           <p className="text-slate-300 text-base sm:text-lg font-bold mb-2">
//                             Ready to Assist
//                           </p>
//                           <p className="text-slate-500 text-lg">
//                             Your AI responses appears here
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {messages.map((msg) => (
//                       <div
//                         key={msg.id}
//                         className={`flex ${
//                           msg.type === "user" ? "justify-end" : "justify-start"
//                         } animate-fadeIn`}
//                       >
//                         <div
//                           className={`max-w-[85%] rounded-2xl p-3 sm:p-4 ${
//                             msg.type === "user"
//                               ? "bg-gradient-to-br from-violet-500 to-purple-500 text-white"
//                               : msg.isAction
//                               ? "bg-gradient-to-br from-emerald-900/40 to-teal-900/40 text-slate-200 border border-emerald-500/30"
//                               : "bg-slate-800/80 text-slate-200 border border-slate-700/50"
//                           }`}
//                         >
//                           <div className="flex items-start gap-3">
//                             {msg.icon && (
//                               <span className="text-2xl flex-shrink-0">
//                                 {msg.icon}
//                               </span>
//                             )}
//                             <p className="text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap flex-1">
//                               {msg.text}
//                             </p>

//                             {msg.type === "ai" && !msg.isMusic && (
//                               <button
//                                 onClick={() => speakText(msg.text)}
//                                 className="ml-2 p-1.5 rounded-lg hover:bg-slate-700/40 transition-all"
//                                 title={
//                                   isSpeaking ? "Stop speaking" : "Play response"
//                                 }
//                                 type="button"
//                               >
//                                 {isSpeaking ? (
//                                   <VolumeX
//                                     size={16}
//                                     className="text-rose-400"
//                                   />
//                                 ) : (
//                                   <Volume2 size={16} />
//                                 )}
//                               </button>
//                             )}
//                           </div>

//                           {msg.isMusic && (
//                             <div className="mt-4 pt-4 border-t border-slate-700/50">
//                               <div className="flex items-center justify-center gap-3 mb-3">
//                                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
//                                   <Music size={20} className="text-white" />
//                                 </div>

//                                 <button
//                                   onClick={() =>
//                                     handleMusicControl(msg.id, "toggle")
//                                   }
//                                   className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 flex items-center justify-center transition-all shadow-lg"
//                                   title={msg.isPlaying ? "Pause" : "Play"}
//                                 >
//                                   {msg.isPlaying ? (
//                                     <Pause size={18} className="text-white" />
//                                   ) : (
//                                     <Play
//                                       size={18}
//                                       className="text-white ml-0.5"
//                                     />
//                                   )}
//                                 </button>

//                                 <button
//                                   onClick={() =>
//                                     handleMusicControl(msg.id, "stop")
//                                   }
//                                   className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all"
//                                   title="Stop"
//                                 >
//                                   <Square size={16} className="text-white" />
//                                 </button>
//                               </div>

//                               {activeMusic === msg.id && (
//                                 <div className="px-2">
//                                   <div className="flex items-center gap-2 mb-2">
//                                     <span className="text-xs text-slate-400 w-10">
//                                       {formatTime(currentTime)}
//                                     </span>
//                                     <input
//                                       type="range"
//                                       min="0"
//                                       max={duration || 100}
//                                       value={currentTime}
//                                       onChange={(e) =>
//                                         handleSeek(
//                                           msg.id,
//                                           parseFloat(e.target.value)
//                                         )
//                                       }
//                                       className="flex-1 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer seek-slider"
//                                       style={{
//                                         background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
//                                           (currentTime / duration) * 100
//                                         }%, #334155 ${
//                                           (currentTime / duration) * 100
//                                         }%, #334155 100%)`,
//                                       }}
//                                     />
//                                     <span className="text-xs text-slate-400 w-10 text-right">
//                                       {formatTime(duration)}
//                                     </span>
//                                   </div>
//                                 </div>
//                               )}

//                               <div className="mt-3 flex items-center justify-center gap-1">
//                                 {[...Array(5)].map((_, i) => (
//                                   <div
//                                     key={i}
//                                     className={`w-1 bg-gradient-to-t from-violet-500 to-purple-500 rounded-full ${
//                                       msg.isPlaying ? "animate-musicBar" : "h-2"
//                                     }`}
//                                     style={{
//                                       animationDelay: `${i * 0.1}s`,
//                                     }}
//                                   ></div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}

//                     {loading && (
//                       <div className="flex justify-start animate-fadeIn">
//                         <div className="max-w-[85%] rounded-2xl p-4 bg-slate-800/80 border border-slate-700/50">
//                           <div className="flex items-center gap-2">
//                             <Loader
//                               className="animate-spin text-violet-400"
//                               size={16}
//                             />
//                             <p className="text-slate-400 text-sm">
//                               VoiceMate is thinking...
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     <div ref={messagesEndRef} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="w-full lg:w-1/4 bg-slate-900/30 backdrop-blur-lg rounded-3xl border border-slate-700/30 p-4 sm:p-6 lg:p-7 shadow-xl">
//           <div className="flex items-center gap-3 mb-5 sm:mb-3">
//             <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
//               <Sparkles size={20} className="text-white" />
//             </div>
//             <div>
//               <h2 className="text-xl sm:text-2xl font-black text-white">
//                 Saved Notes
//               </h2>
//               <p className="text-slate-400 text-xs sm:text-sm">
//                 Your personal collection
//               </p>
//             </div>
//           </div>

//           <p className="text-violet-400 font-medium text-sm sm:text-[13px] mb-5">
//             Save important thoughts and ideas instantly as notes
//           </p>

//           <div className="grid grid-cols-1 gap-3 sm:gap-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent">
//             {notes.length > 0 ? (
//               notes.map((note) => (
//                 <div
//                   key={note._id}
//                   className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-4 sm:p-5 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 animate-fadeIn"
//                 >
//                   <div className="flex justify-between items-start mb-3">
//                     <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center border border-violet-500/20">
//                       <Sparkles size={14} className="text-violet-400" />
//                     </div>

//                     <button
//                       onClick={() => deleteNote(note._id)}
//                       className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/20 transform hover:scale-110 transition-all duration-200"
//                     >
//                       <Trash2 size={14} />
//                     </button>
//                   </div>

//                   <p className="text-slate-200 text-sm leading-relaxed mb-3 break-words line-clamp-4">
//                     {note.content}
//                   </p>

//                   <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-700/30 pt-3">
//                     <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
//                     <span>{new Date(note.createdAt).toLocaleString()}</span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
//                   <Sparkles size={24} className="text-violet-400" />
//                 </div>
//                 <p className="text-slate-400 text-sm">No notes yet!</p>
//                 <p className="text-slate-500 text-xs mt-1">
//                   Create your first note by saying "create a note..."
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes slideIn {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(15px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         @keyframes scaleIn {
//           from {
//             opacity: 0;
//             transform: scale(0.9);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//         @keyframes musicBar {
//           0%,
//           100% {
//             height: 8px;
//           }
//           50% {
//             height: 24px;
//           }
//         }
//         .animate-slideIn {
//           animation: slideIn 0.3s ease-out;
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.4s ease-out;
//         }
//         .animate-scaleIn {
//           animation: scaleIn 0.3s ease-out;
//         }
//         .animate-musicBar {
//           animation: musicBar 0.8s ease-in-out infinite;
//         }
//         .line-clamp-4 {
//           display: -webkit-box;
//           -webkit-line-clamp: 4;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//         .scrollbar-thin::-webkit-scrollbar {
//           width: 6px;
//         }
//         .scrollbar-thumb-violet-500\/20::-webkit-scrollbar-thumb {
//           background-color: rgba(139, 92, 246, 0.2);
//           border-radius: 3px;
//         }
//         .scrollbar-thumb-pink-500\/20::-webkit-scrollbar-thumb {
//           background-color: rgba(236, 72, 153, 0.2);
//           border-radius: 3px;
//         }
//         .scrollbar-track-transparent::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .seek-slider::-webkit-slider-thumb {
//           appearance: none;
//           width: 12px;
//           height: 12px;
//           border-radius: 50%;
//           background: #8b5cf6;
//           cursor: pointer;
//           box-shadow: 0 0 4px rgba(139, 92, 246, 0.5);
//         }
//         .seek-slider::-moz-range-thumb {
//           width: 12px;
//           height: 12px;
//           border-radius: 50%;
//           background: #8b5cf6;
//           cursor: pointer;
//           border: none;
//           box-shadow: 0 0 4px rgba(139, 92, 246, 0.5);
//         }

//         /* Mobile Performance Optimization */
//         @media (max-width: 768px) {
//           * {
//             -webkit-transform: translateZ(0);
//             transform: translateZ(0);
//             -webkit-backface-visibility: hidden;
//             backface-visibility: hidden;
//           }
          
//           /* Reduce backdrop blur on mobile */
//           .backdrop-blur-xl,
//           .backdrop-blur-lg,
//           .backdrop-blur-sm {
//             backdrop-filter: blur(4px) !important;
//             -webkit-backdrop-filter: blur(4px) !important;
//           }
          
//           /* Simplify shadows on mobile */
//           .shadow-2xl,
//           .shadow-xl,
//           .shadow-lg {
//             box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
//           }
          
//           /* Optimize animations on mobile */
//           .animate-pulse,
//           .animate-ping {
//             animation: none !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
