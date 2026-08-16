import { useEffect, useState } from "react";
import {
  Users,
  Video,
  Radio,
  Plus,
  Trash2,
  KeyRound,
  Save,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  getStudents,
  addStudent,
  removeStudent,
  getModules,
  addModule,
  removeModule,
  addLesson,
  removeLesson,
  getLive,
  updateLive,
  getAdmin,
  updateAdmin,
} from "../lib/store";
import { getYouTubeId } from "../lib/youtube";

const TABS = [
  { id: "students", label: "Students", icon: Users },
  { id: "content", label: "Videos & Modules", icon: Video },
  { id: "live", label: "Live Session", icon: Radio },
  { id: "settings", label: "Admin Password", icon: KeyRound },
];

export default function Admin() {
  const [tab, setTab] = useState("students");
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="font-mono-t text-[10px] uppercase tracking-[0.3em] text-amber-400">
          Admin Console
        </div>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-gray-100">
          Control Panel
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Manage students, course videos, and live session URL. Changes save instantly to this browser.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-1 rounded-md border border-[#232D42] bg-[#0A0D14] p-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              data-testid={`admin-tab-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 rounded px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                active
                  ? "bg-amber-500 text-[#0A0D14]"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "students" && <StudentsTab />}
      {tab === "content" && <ContentTab />}
      {tab === "live" && <LiveTab />}
      {tab === "settings" && <SettingsTab />}
    </div>
  );
}

function StudentsTab() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ username: "", password: "", name: "" });

  useEffect(() => setStudents(getStudents()), []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error("Username and password required");
      return;
    }
    try {
      const list = addStudent(form);
      setStudents(list);
      setForm({ username: "", password: "", name: "" });
      toast.success("Student added");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRemove = (u) => {
    setStudents(removeStudent(u));
    toast.success("Student removed");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form
        onSubmit={handleAdd}
        className="rounded-lg border border-[#232D42] bg-[#111622] p-5 space-y-3"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-[#232D42]">
          <Plus className="h-4 w-4 text-amber-400" />
          <h3 className="font-display text-base font-bold uppercase tracking-wide text-gray-100">
            Add Student
          </h3>
        </div>
        <Field label="Full Name">
          <input
            data-testid="admin-student-name-input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-terminal w-full rounded px-3 py-2 text-sm"
            placeholder="Optional"
          />
        </Field>
        <Field label="Username *">
          <input
            data-testid="admin-student-username-input"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="input-terminal w-full rounded px-3 py-2 text-sm"
            placeholder="e.g. rahul123"
          />
        </Field>
        <Field label="Password *">
          <input
            data-testid="admin-student-password-input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-terminal w-full rounded px-3 py-2 text-sm"
            placeholder="Set login password"
          />
        </Field>
        <button
          data-testid="admin-add-student-button"
          type="submit"
          className="w-full rounded-md bg-amber-500 py-2.5 text-sm font-bold uppercase tracking-widest text-[#0A0D14] hover:bg-amber-400 transition-colors"
        >
          Create Account
        </button>
      </form>

      <div className="lg:col-span-2 rounded-lg border border-[#232D42] bg-[#111622] p-5">
        <div className="mb-3 flex items-center justify-between border-b border-[#232D42] pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-400" />
            <h3 className="font-display text-base font-bold uppercase tracking-wide text-gray-100">
              Active Students
            </h3>
          </div>
          <span className="font-mono-t text-xs text-gray-500">{students.length} total</span>
        </div>
        {students.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No students yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="admin-students-table">
              <thead>
                <tr className="border-b border-[#232D42] text-left font-mono-t text-[10px] uppercase tracking-widest text-gray-500">
                  <th className="py-2">Username</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Password</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.username} className="border-b border-[#232D42]/40">
                    <td className="py-2.5 font-mono-t text-emerald-400">{s.username}</td>
                    <td className="py-2.5 text-gray-200">{s.name || "—"}</td>
                    <td className="py-2.5 font-mono-t text-gray-400">{s.password}</td>
                    <td className="py-2.5 text-right">
                      <button
                        data-testid={`admin-remove-student-${s.username}`}
                        onClick={() => handleRemove(s.username)}
                        className="inline-flex items-center gap-1 rounded border border-[#232D42] px-2 py-1 text-xs text-red-400 hover:border-red-500 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ContentTab() {
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({ title: "", description: "" });
  const [lessonForms, setLessonForms] = useState({});

  const refresh = () => setModules(getModules());
  useEffect(refresh, []);

  const handleAddModule = (e) => {
    e.preventDefault();
    if (!newModule.title) return toast.error("Module title required");
    addModule(newModule);
    setNewModule({ title: "", description: "" });
    refresh();
    toast.success("Module added");
  };

  const handleAddLesson = (moduleId) => {
    const f = lessonForms[moduleId] || {};
    if (!f.title || !f.youtubeUrl) return toast.error("Lesson title and YouTube URL required");
    if (!getYouTubeId(f.youtubeUrl)) return toast.error("Invalid YouTube URL");
    addLesson(moduleId, f);
    setLessonForms({ ...lessonForms, [moduleId]: { title: "", youtubeUrl: "", duration: "" } });
    refresh();
    toast.success("Lesson added");
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleAddModule}
        className="rounded-lg border border-[#232D42] bg-[#111622] p-5"
      >
        <div className="mb-3 flex items-center gap-2 border-b border-[#232D42] pb-3">
          <Plus className="h-4 w-4 text-amber-400" />
          <h3 className="font-display text-base font-bold uppercase tracking-wide text-gray-100">
            Add New Module
          </h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            data-testid="admin-module-title-input"
            value={newModule.title}
            onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
            className="input-terminal rounded px-3 py-2 text-sm"
            placeholder="Module title"
          />
          <input
            data-testid="admin-module-desc-input"
            value={newModule.description}
            onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
            className="input-terminal rounded px-3 py-2 text-sm md:col-span-1"
            placeholder="Short description"
          />
          <button
            data-testid="admin-add-module-button"
            type="submit"
            className="rounded-md bg-amber-500 py-2 text-sm font-bold uppercase tracking-widest text-[#0A0D14] hover:bg-amber-400 transition-colors"
          >
            + Add Module
          </button>
        </div>
      </form>

      {modules.map((m) => {
        const lf = lessonForms[m.id] || { title: "", youtubeUrl: "", duration: "" };
        return (
          <div key={m.id} className="rounded-lg border border-[#232D42] bg-[#111622]">
            <div className="flex items-center justify-between border-b border-[#232D42] px-5 py-3">
              <div>
                <h3 className="font-display text-base font-bold uppercase tracking-wide text-gray-100">
                  {m.title}
                </h3>
                {m.description && <p className="text-xs text-gray-400">{m.description}</p>}
              </div>
              <button
                data-testid={`admin-remove-module-${m.id}`}
                onClick={() => {
                  if (window.confirm("Delete this module and all its lessons?")) {
                    removeModule(m.id);
                    refresh();
                    toast.success("Module removed");
                  }
                }}
                className="inline-flex items-center gap-1 rounded border border-[#232D42] px-2 py-1 text-xs text-red-400 hover:border-red-500 transition-colors"
              >
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="grid gap-2 md:grid-cols-[1fr_2fr_100px_auto]">
                <input
                  data-testid={`admin-lesson-title-${m.id}`}
                  value={lf.title}
                  onChange={(e) =>
                    setLessonForms({ ...lessonForms, [m.id]: { ...lf, title: e.target.value } })
                  }
                  className="input-terminal rounded px-3 py-2 text-sm"
                  placeholder="Lesson title"
                />
                <input
                  data-testid={`admin-lesson-url-${m.id}`}
                  value={lf.youtubeUrl}
                  onChange={(e) =>
                    setLessonForms({ ...lessonForms, [m.id]: { ...lf, youtubeUrl: e.target.value } })
                  }
                  className="input-terminal rounded px-3 py-2 text-sm"
                  placeholder="YouTube URL (any format)"
                />
                <input
                  data-testid={`admin-lesson-duration-${m.id}`}
                  value={lf.duration}
                  onChange={(e) =>
                    setLessonForms({ ...lessonForms, [m.id]: { ...lf, duration: e.target.value } })
                  }
                  className="input-terminal rounded px-3 py-2 text-sm"
                  placeholder="12:34"
                />
                <button
                  data-testid={`admin-add-video-button-${m.id}`}
                  onClick={() => handleAddLesson(m.id)}
                  className="rounded-md bg-emerald-500 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#0A0D14] hover:bg-emerald-400 transition-colors"
                >
                  + Video
                </button>
              </div>

              {(m.lessons || []).length === 0 ? (
                <p className="py-4 text-center text-xs text-gray-500">No videos in this module yet.</p>
              ) : (
                <ul className="divide-y divide-[#232D42]/60 rounded border border-[#232D42]">
                  {m.lessons.map((l) => (
                    <li key={l.id} className="flex items-center justify-between px-3 py-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm text-gray-200">{l.title}</div>
                        <div className="truncate font-mono-t text-[10px] text-gray-500">{l.youtubeUrl}</div>
                      </div>
                      <button
                        data-testid={`admin-remove-lesson-${l.id}`}
                        onClick={() => {
                          removeLesson(m.id, l.id);
                          refresh();
                          toast.success("Lesson removed");
                        }}
                        className="ml-3 inline-flex items-center gap-1 rounded border border-[#232D42] px-2 py-1 text-xs text-red-400 hover:border-red-500 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LiveTab() {
  const [live, setLive] = useState({ url: "", title: "", isLive: false });
  useEffect(() => setLive(getLive()), []);

  const handleSave = () => {
    if (live.url && !getYouTubeId(live.url) && !/youtube\.com\/(channel|c|user|@)/.test(live.url)) {
      return toast.error("Invalid YouTube URL");
    }
    updateLive(live);
    toast.success("Live session updated");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-lg border border-[#232D42] bg-[#111622] p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#232D42] pb-3">
          <Radio className="h-4 w-4 text-red-400" />
          <h3 className="font-display text-base font-bold uppercase tracking-wide text-gray-100">
            Live Session Control
          </h3>
        </div>

        <Field label="YouTube Live URL">
          <input
            data-testid="admin-live-url-input"
            value={live.url}
            onChange={(e) => setLive({ ...live, url: e.target.value })}
            className="input-terminal w-full rounded px-3 py-2 text-sm"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </Field>
        <Field label="Session Title">
          <input
            data-testid="admin-live-title-input"
            value={live.title}
            onChange={(e) => setLive({ ...live, title: e.target.value })}
            className="input-terminal w-full rounded px-3 py-2 text-sm"
            placeholder="e.g. Weekly Market Outlook"
          />
        </Field>

        <div className="flex items-center gap-3 rounded-md border border-[#232D42] bg-[#0A0D14] p-3">
          <button
            data-testid="admin-toggle-live-button"
            onClick={() => setLive({ ...live, isLive: !live.isLive })}
            className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-bold uppercase tracking-widest ${
              live.isLive
                ? "bg-red-500 text-white"
                : "bg-[#232D42] text-gray-300"
            }`}
          >
            {live.isLive ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
            {live.isLive ? "Broadcasting" : "Offline"}
          </button>
          <span className="text-xs text-gray-500">
            Toggle the live badge shown to students.
          </span>
        </div>

        <button
          data-testid="admin-update-live-url-button"
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-amber-500 py-2.5 text-sm font-bold uppercase tracking-widest text-[#0A0D14] hover:bg-amber-400 transition-colors"
        >
          <Save className="h-4 w-4" /> Save Live Settings
        </button>
      </div>

      <div className="rounded-lg border border-[#232D42] bg-[#111622] p-5">
        <h3 className="mb-3 font-display text-base font-bold uppercase tracking-wide text-gray-100">
          Quick Guide
        </h3>
        <ol className="space-y-3 text-sm text-gray-400">
          <li className="flex gap-3">
            <span className="font-mono-t text-emerald-400">01</span>
            Start your YouTube live stream from your channel.
          </li>
          <li className="flex gap-3">
            <span className="font-mono-t text-emerald-400">02</span>
            Copy the live video URL (or channel/live URL).
          </li>
          <li className="flex gap-3">
            <span className="font-mono-t text-emerald-400">03</span>
            Paste above, mark it &quot;Broadcasting&quot;, and Save.
          </li>
          <li className="flex gap-3">
            <span className="font-mono-t text-emerald-400">04</span>
            Students refresh their Live page — they see it embedded.
          </li>
        </ol>
      </div>
    </div>
  );
}

function SettingsTab() {
  const [admin, setAdmin] = useState({ username: "", password: "" });
  useEffect(() => setAdmin(getAdmin()), []);

  const save = () => {
    if (!admin.username || !admin.password) return toast.error("Both fields required");
    updateAdmin(admin);
    toast.success("Admin credentials updated");
  };

  return (
    <div className="max-w-md rounded-lg border border-[#232D42] bg-[#111622] p-5">
      <div className="mb-3 flex items-center gap-2 border-b border-[#232D42] pb-3">
        <KeyRound className="h-4 w-4 text-amber-400" />
        <h3 className="font-display text-base font-bold uppercase tracking-wide text-gray-100">
          Change Admin Credentials
        </h3>
      </div>
      <Field label="Admin Username">
        <input
          data-testid="admin-username-input"
          value={admin.username}
          onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
          className="input-terminal w-full rounded px-3 py-2 text-sm"
        />
      </Field>
      <div className="mt-3">
        <Field label="Admin Password">
          <input
            data-testid="admin-password-input"
            value={admin.password}
            onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
            className="input-terminal w-full rounded px-3 py-2 text-sm"
          />
        </Field>
      </div>
      <button
        data-testid="admin-save-credentials-button"
        onClick={save}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-amber-500 py-2.5 text-sm font-bold uppercase tracking-widest text-[#0A0D14] hover:bg-amber-400 transition-colors"
      >
        <Save className="h-4 w-4" /> Save Credentials
      </button>
      <p className="mt-3 text-[11px] text-gray-500">
        Note: Credentials are stored in this browser only. Log in from the same device to admin.
      </p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono-t text-[10px] uppercase tracking-widest text-gray-500">
        {label}
      </span>
      {children}
    </label>
  );
}
