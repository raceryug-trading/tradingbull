import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Shield, GraduationCap, Cloud } from "lucide-react";
import { toast } from "sonner";
import { loginStudent, loginAdmin } from "../lib/store";
import { firebaseEnabled } from "../lib/firebase";
import { cloudLoginAdmin, cloudFetchStudent } from "../lib/cloudSync";
import { BRAND } from "../config";
import { BullLogo } from "../components/BullLogo";

export default function Login() {
  const [mode, setMode] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Enter username and password");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "student") {
        let session = loginStudent(username, password);
        // If the local snapshot hasn't hydrated yet (race on first load with
        // cloud sync), fall back to a direct Firestore lookup so real students
        // don't see false "Invalid credentials" errors.
        if (!session && firebaseEnabled) {
          const cloudUser = await cloudFetchStudent(username.trim());
          if (cloudUser && cloudUser.password === password) {
            session = {
              role: "student",
              username: cloudUser.username,
              name: cloudUser.name || cloudUser.username,
            };
            localStorage.setItem("ta_session", JSON.stringify(session));
          }
        }
        if (!session) {
          toast.error("Invalid credentials");
          return;
        }
        toast.success(`Welcome, ${session.name}`);
        navigate("/modules");
      } else {
        // Admin login: use Firebase Auth when configured, else localStorage
        if (firebaseEnabled) {
          try {
            const cred = await cloudLoginAdmin(username.trim(), password);
            const session = {
              role: "admin",
              username: cred.user.email,
              name: "Admin",
            };
            localStorage.setItem("ta_session", JSON.stringify(session));
            toast.success("Admin signed in (cloud)");
            navigate("/admin");
          } catch (err) {
            toast.error("Invalid admin credentials");
          }
        } else {
          const session = loginAdmin(username, password);
          if (!session) {
            toast.error("Invalid credentials");
            return;
          }
          toast.success(`Welcome, ${session.name}`);
          navigate("/admin");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Terminal frame */}
        <div className="relative rounded-lg border border-[#232D42] bg-[#111622] p-8 shadow-2xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

          {/* Header block */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10">
              <BullLogo size={36} glow={false} />
            </div>
            <div className="font-mono-t text-[10px] uppercase tracking-[0.3em] text-emerald-400">
              Secure Terminal Access
            </div>
            <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-gray-100">
              {BRAND.name}
            </h1>
            <p className="mt-1 text-sm text-gray-400">{BRAND.tagline}</p>
            {firebaseEnabled && (
              <div
                data-testid="cloud-sync-indicator"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono-t text-[10px] uppercase tracking-widest text-emerald-300"
              >
                <Cloud className="h-3 w-3" /> Cloud Sync Active
              </div>
            )}
          </div>

          {/* Toggle */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-md border border-[#232D42] bg-[#0A0D14] p-1">
            <button
              data-testid="portal-switch-student"
              type="button"
              onClick={() => setMode("student")}
              className={`flex items-center justify-center gap-1.5 rounded px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                mode === "student"
                  ? "bg-emerald-500 text-[#0A0D14]"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <GraduationCap className="h-4 w-4" /> Student
            </button>
            <button
              data-testid="portal-switch-admin"
              type="button"
              onClick={() => setMode("admin")}
              className={`flex items-center justify-center gap-1.5 rounded px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                mode === "admin"
                  ? "bg-amber-500 text-[#0A0D14]"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Shield className="h-4 w-4" /> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 font-mono-t text-[10px] uppercase tracking-widest text-gray-500">
                <User className="h-3 w-3" />
                {mode === "admin" && firebaseEnabled ? "Admin Email" : "Username"}
              </span>
              <input
                data-testid="login-username-input"
                type={mode === "admin" && firebaseEnabled ? "email" : "text"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-terminal w-full rounded-md px-3 py-2.5 text-sm"
                placeholder={
                  mode === "admin" && firebaseEnabled
                    ? "admin@yourdomain.com"
                    : "Enter username"
                }
                autoComplete="username"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 font-mono-t text-[10px] uppercase tracking-widest text-gray-500">
                <Lock className="h-3 w-3" /> Password
              </span>
              <input
                data-testid="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-terminal w-full rounded-md px-3 py-2.5 text-sm"
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </label>
            <button
              data-testid="login-submit-button"
              type="submit"
              disabled={submitting}
              className={`w-full rounded-md py-2.5 text-sm font-bold uppercase tracking-widest transition-colors disabled:opacity-60 ${
                mode === "student"
                  ? "bg-emerald-500 text-[#0A0D14] hover:bg-emerald-400"
                  : "bg-amber-500 text-[#0A0D14] hover:bg-amber-400"
              }`}
            >
              {submitting
                ? "Signing in…"
                : mode === "student"
                ? "Enter Trading Desk"
                : "Access Admin Console"}
            </button>
          </form>

          <div className="mt-6 rounded border border-dashed border-[#232D42] p-3 text-[11px] text-gray-500">
            <div className="mb-1 font-mono-t uppercase tracking-widest text-emerald-400">
              Login Access
            </div>
            {firebaseEnabled ? (
              <>
                <div className="font-mono-t">
                  Student → <span className="text-gray-300">Ask your instructor for username & password</span>
                </div>
                <div className="font-mono-t">
                  Admin → <span className="text-gray-300">Firebase Auth (email / password)</span>
                </div>
              </>
            ) : (
              <>
                <div className="font-mono-t">
                  Student → <span className="text-gray-300">student / student123</span>
                </div>
                <div className="font-mono-t">
                  Admin → <span className="text-gray-300">admin / admin123</span>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          No self sign-up · Accounts created by your instructor
        </p>
      </div>
    </div>
  );
}
