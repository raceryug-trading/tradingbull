import { useEffect, useState } from "react";
import {
  PlayCircle,
  ChevronRight,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  Megaphone,
  X,
} from "lucide-react";
import {
  getModules,
  getAnnouncements,
  currentSession,
  getProgress,
  toggleLessonComplete,
  moduleProgress,
} from "../lib/store";
import { getEmbedUrl, getThumbnail, getYouTubeId } from "../lib/youtube";

const DISMISSED_KEY = "ta_dismissed_ann";

export default function Modules() {
  const [modules, setModules] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [progress, setProgress] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const session = currentSession();
  const username = session?.username;

  useEffect(() => {
    const mods = getModules();
    setModules(mods);
    setProgress(username ? getProgress(username) : {});
    setAnnouncements(getAnnouncements());
    for (const m of mods) {
      if (m.lessons && m.lessons.length) {
        setActiveLesson({ moduleTitle: m.title, ...m.lessons[0] });
        return;
      }
    }
  }, [username]);

  const dismiss = (id) => {
    const next = [...dismissed, id];
    setDismissed(next);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
  };

  const handleToggleComplete = (lessonId) => {
    if (!username) return;
    const updated = toggleLessonComplete(username, lessonId);
    setProgress({ ...updated });
  };

  const embed = activeLesson ? getEmbedUrl(activeLesson.youtubeUrl) : null;
  const visibleAnnouncements = announcements.filter((a) => !dismissed.includes(a.id));

  const overall = (() => {
    const all = modules.flatMap((m) => m.lessons || []);
    if (all.length === 0) return { pct: 0, done: 0, total: 0 };
    const done = all.filter((l) => progress[l.id]).length;
    return { pct: Math.round((done / all.length) * 100), done, total: all.length };
  })();

  const toneClass = {
    info: "border-emerald-500/40 bg-emerald-500/8 text-emerald-200",
    warn: "border-amber-500/40 bg-amber-500/8 text-amber-200",
    alert: "border-red-500/40 bg-red-500/8 text-red-200",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Announcements */}
      {visibleAnnouncements.length > 0 && (
        <div className="mb-6 space-y-2" data-testid="student-announcements-list">
          {visibleAnnouncements.map((a) => (
            <div
              key={a.id}
              className={`flex items-start gap-3 rounded-md border p-3 ${
                toneClass[a.tone] || toneClass.info
              }`}
              data-testid={`student-announcement-${a.id}`}
            >
              <Megaphone className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-t text-[10px] uppercase tracking-widest opacity-80">
                    {a.tone || "info"}
                  </span>
                  <span className="font-mono-t text-[10px] opacity-60">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="mt-0.5 text-sm font-semibold text-gray-100">{a.title}</div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{a.body}</p>
              </div>
              <button
                onClick={() => dismiss(a.id)}
                className="rounded p-1 hover:bg-white/5"
                data-testid={`dismiss-announcement-${a.id}`}
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono-t text-[10px] uppercase tracking-[0.3em] text-emerald-400">
            Course Terminal
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-gray-100">
            Modules & Recorded Sessions
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Structured lessons from foundations to advanced execution.
          </p>
        </div>
        {overall.total > 0 && (
          <div
            className="rounded-lg border border-[#232D42] bg-[#111622] px-4 py-3 min-w-[220px]"
            data-testid="overall-progress-card"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono-t text-[10px] uppercase tracking-widest text-gray-500">
                Your Progress
              </span>
              <span className="font-mono-t text-xs text-emerald-400">
                {overall.done}/{overall.total} · {overall.pct}%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#0A0D14]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                style={{ width: `${overall.pct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-[#232D42] bg-[#0A0D14] p-4">
            <div className="aspect-video overflow-hidden rounded border border-[#232D42] bg-black">
              {embed ? (
                <iframe
                  data-testid="video-player-frame"
                  key={activeLesson?.id}
                  src={embed}
                  title={activeLesson?.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  Select a lesson to start
                </div>
              )}
            </div>

            {activeLesson && (
              <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono-t text-[10px] uppercase tracking-widest text-emerald-400">
                    {activeLesson.moduleTitle}
                  </div>
                  <h2
                    className="mt-1 text-xl font-semibold text-gray-100"
                    data-testid="active-lesson-title"
                  >
                    {activeLesson.title}
                  </h2>
                  {activeLesson.duration && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" /> {activeLesson.duration}
                    </div>
                  )}
                </div>
                {username && (
                  <button
                    data-testid="mark-complete-button"
                    onClick={() => handleToggleComplete(activeLesson.id)}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                      progress[activeLesson.id]
                        ? "border-emerald-500 bg-emerald-500 text-[#0A0D14]"
                        : "border-[#232D42] bg-[#111622] text-gray-200 hover:border-emerald-500"
                    }`}
                  >
                    {progress[activeLesson.id] ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Completed
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4" /> Mark as Watched
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Lesson list */}
        <aside className="space-y-4">
          {modules.length === 0 && (
            <div className="rounded-lg border border-dashed border-[#232D42] p-8 text-center text-sm text-gray-500">
              No modules yet. Ask admin to add.
            </div>
          )}
          {modules.map((m) => {
            const mp = username ? moduleProgress(username, m) : { pct: 0, done: 0, total: (m.lessons || []).length };
            return (
              <div
                key={m.id}
                className="rounded-lg border border-[#232D42] bg-[#111622] overflow-hidden"
                data-testid="module-card-item"
              >
                <div className="border-b border-[#232D42] bg-[#161D2F] px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <h3 className="font-display text-base font-bold uppercase tracking-wide text-gray-100 truncate">
                        {m.title}
                      </h3>
                    </div>
                    {username && mp.total > 0 && (
                      <span
                        className="font-mono-t text-[10px] text-emerald-400 flex-shrink-0"
                        data-testid={`module-progress-${m.id}`}
                      >
                        {mp.done}/{mp.total}
                      </span>
                    )}
                  </div>
                  {m.description && (
                    <p className="mt-1 text-xs text-gray-400">{m.description}</p>
                  )}
                  {username && mp.total > 0 && (
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#0A0D14]">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${mp.pct}%` }}
                      />
                    </div>
                  )}
                </div>
                <ul>
                  {(m.lessons || []).map((l) => {
                    const active = activeLesson?.id === l.id;
                    const thumb = getThumbnail(l.youtubeUrl);
                    const isValid = !!getYouTubeId(l.youtubeUrl);
                    const done = !!progress[l.id];
                    return (
                      <li key={l.id}>
                        <button
                          data-testid="lesson-item-button"
                          onClick={() =>
                            setActiveLesson({ moduleTitle: m.title, ...l })
                          }
                          className={`group flex w-full items-center gap-3 border-b border-[#232D42]/60 px-3 py-2.5 text-left transition-colors last:border-0 ${
                            active ? "bg-emerald-500/10" : "hover:bg-[#1E273D]"
                          }`}
                        >
                          <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded border border-[#232D42] bg-black">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[10px] text-gray-600">
                                N/A
                              </div>
                            )}
                            {isValid && !done && (
                              <PlayCircle className="absolute inset-0 m-auto h-6 w-6 text-white/90" />
                            )}
                            {done && (
                              <CheckCircle2 className="absolute inset-0 m-auto h-6 w-6 text-emerald-400 drop-shadow" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div
                              className={`truncate text-sm ${
                                active ? "text-emerald-300" : done ? "text-gray-400 line-through" : "text-gray-200"
                              }`}
                            >
                              {l.title}
                            </div>
                            {l.duration && (
                              <div className="text-[11px] text-gray-500">
                                {l.duration}
                              </div>
                            )}
                          </div>
                          <ChevronRight
                            className={`h-4 w-4 flex-shrink-0 ${
                              active ? "text-emerald-400" : "text-gray-600 group-hover:text-gray-400"
                            }`}
                          />
                        </button>
                      </li>
                    );
                  })}
                  {(!m.lessons || m.lessons.length === 0) && (
                    <li className="px-4 py-3 text-xs text-gray-500">No lessons yet</li>
                  )}
                </ul>
              </div>
            );
          })}
        </aside>
      </div>
    </div>
  );
}
