import React, { useState } from "react";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
// import NotesPage from "./pages/NotesPage";
import { auth, provider, signInWithPopup, signOut } from "./firebase";

export default function App() {
  const [currentRoute, setCurrentRoute] = useState("home");
  const [user, setUser] = useState(null);

  // Google Login
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCurrentRoute("home");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Agar user login nahi hai
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white overflow-hidden relative">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-900/30 via-transparent to-transparent animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "3s" }}
        ></div>

        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Login Card */}
        <div className="relative z-10 max-w-lg w-full mx-6">
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>

            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
              {/* Top Border Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 to-transparent"></div>

              <div className="p-12">
                {/* Icon */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 rounded-2xl blur-2xl opacity-60 animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition duration-300">
                      <svg
                        className="w-12 h-12 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v3a3 3 0 01-3 3z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-4 mb-10">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent animate-pulse">
                    VoiceMate AI
                  </h1>
                  <p className="text-slate-400 text-lg font-light">
                    Sign in to continue your voice journey
                  </p>
                </div>

                {/* Login Button */}
                <button
                  onClick={handleLogin}
                  className="w-full group relative bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 hover:bg-gradient-to-r from-fuchsia-400 via-purple-400 to-violet-400
 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-cyan-900/50 hover:shadow-2xl hover:shadow-cyan-900/70 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Agar login ho gaya
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* User Header Card */}
        <div className="relative group mb-6">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative flex justify-between items-center bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-8 py-5 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-md opacity-50"></div>
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-bold shadow-xl ring-2 ring-cyan-500/20">
                  {user.displayName?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-400 font-light">
                  Welcome back
                </p>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {user.displayName}
                </h2>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="relative group/btn bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/60"
            >
              Logout
            </button>
          </div>
        </div>

        <Navigation
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
        />

        <div className="mt-6">
          {currentRoute === "history" ? (
            <HistoryPage setCurrentRoute={setCurrentRoute} />
          ) : currentRoute === "notes" ? (
            <NotesPage setCurrentRoute={setCurrentRoute} user={user} />
          ) : (
            <HomePage setCurrentRoute={setCurrentRoute} />
          )}
        </div>
      </div>
    </div>
  );
}
