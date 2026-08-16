import { useEffect } from "react";
import "@/App.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "./components/Header";
import WhatsAppButton from "./components/WhatsAppButton";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Modules from "./pages/Modules";
import LiveSession from "./pages/LiveSession";
import Admin from "./pages/Admin";
import { firebaseEnabled } from "./lib/firebase";
import { startCloudSync, onCloudAuthChange } from "./lib/cloudSync";

function App() {
  // Mount cloud subscribers + auth watcher once at app start
  useEffect(() => {
    if (!firebaseEnabled) return;
    const stop = startCloudSync(() => {
      // Broadcast an event so live pages can re-read localStorage
      window.dispatchEvent(new Event("ta-cloud-update"));
    });
    const off = onCloudAuthChange((user) => {
      // If admin signs out of Firebase from another tab, clear session
      if (!user) {
        const raw = localStorage.getItem("ta_session");
        if (raw) {
          try {
            const s = JSON.parse(raw);
            if (s?.role === "admin") localStorage.removeItem("ta_session");
          } catch {}
        }
      }
    });
    return () => {
      stop && stop();
      off && off();
    };
  }, []);

  return (
    <div className="App min-h-screen">
      {/* HashRouter so it works on GitHub Pages without server rewrites */}
      <HashRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/modules"
              element={
                <ProtectedRoute>
                  <Modules />
                </ProtectedRoute>
              }
            />
            <Route
              path="/live"
              element={
                <ProtectedRoute>
                  <LiveSession />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="mt-16 border-t border-[#232D42] bg-[#0A0D14]/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-center">
            <p className="font-mono-t text-[10px] uppercase tracking-[0.3em] text-gray-500">
              For educational purposes only · Not financial advice
            </p>
          </div>
        </footer>
        <WhatsAppButton />
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "#111622",
              border: "1px solid #232D42",
              color: "#F3F4F6",
            },
          }}
        />
      </HashRouter>
    </div>
  );
}

export default App;
