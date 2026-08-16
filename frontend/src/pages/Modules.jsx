import { useEffect, useState } from "react";
import { PlayCircle, ChevronRight, Clock, BookOpen } from "lucide-react";
import { getModules } from "../lib/store";
import { getEmbedUrl, getThumbnail, getYouTubeId } from "../lib/youtube";

export default function Modules() {
  const [modules, setModules] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    const mods = getModules();
    setModules(mods);
    // Pick first lesson available
    for (const m of mods) {
      if (m.lessons && m.lessons.length) {
        setActiveLesson({ moduleTitle: m.title, ...m.lessons[0] });
        return;
      }
    }
  }, []);

  const embed = activeLesson ? getEmbedUrl(activeLesson.youtubeUrl) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
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
              <div className="mt-4">
                <div className="font-mono-t text-[10px] uppercase tracking-widest text-emerald-400">
                  {activeLesson.moduleTitle}
                </div>
                <h2 className="mt-1 text-xl font-semibold text-gray-100" data-testid="active-lesson-title">
                  {activeLesson.title}
                </h2>
                {activeLesson.duration && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5" /> {activeLesson.duration}
                  </div>
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
          {modules.map((m) => (
            <div
              key={m.id}
              className="rounded-lg border border-[#232D42] bg-[#111622] overflow-hidden"
              data-testid="module-card-item"
            >
              <div className="border-b border-[#232D42] bg-[#161D2F] px-4 py-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-400" />
                  <h3 className="font-display text-base font-bold uppercase tracking-wide text-gray-100">
                    {m.title}
                  </h3>
                </div>
                {m.description && (
                  <p className="mt-1 text-xs text-gray-400">{m.description}</p>
                )}
              </div>
              <ul>
                {(m.lessons || []).map((l) => {
                  const active = activeLesson?.id === l.id;
                  const thumb = getThumbnail(l.youtubeUrl);
                  const isValid = !!getYouTubeId(l.youtubeUrl);
                  return (
                    <li key={l.id}>
                      <button
                        data-testid="lesson-item-button"
                        onClick={() =>
                          setActiveLesson({ moduleTitle: m.title, ...l })
                        }
                        className={`group flex w-full items-center gap-3 border-b border-[#232D42]/60 px-3 py-2.5 text-left transition-colors last:border-0 ${
                          active
                            ? "bg-emerald-500/10"
                            : "hover:bg-[#1E273D]"
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
                          {isValid && (
                            <PlayCircle className="absolute inset-0 m-auto h-6 w-6 text-white/90" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`truncate text-sm ${active ? "text-emerald-300" : "text-gray-200"}`}>
                            {l.title}
                          </div>
                          {l.duration && (
                            <div className="text-[11px] text-gray-500">{l.duration}</div>
                          )}
                        </div>
                        <ChevronRight className={`h-4 w-4 flex-shrink-0 ${active ? "text-emerald-400" : "text-gray-600 group-hover:text-gray-400"}`} />
                      </button>
                    </li>
                  );
                })}
                {(!m.lessons || m.lessons.length === 0) && (
                  <li className="px-4 py-3 text-xs text-gray-500">No lessons yet</li>
                )}
              </ul>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
