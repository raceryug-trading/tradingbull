import { useEffect, useState } from "react";
import { Radio, Calendar, MessageCircle, AlertCircle } from "lucide-react";
import { getLive } from "../lib/store";
import { getLiveEmbedUrl } from "../lib/youtube";
import { BRAND } from "../config";

export default function LiveSession() {
  const [live, setLive] = useState({ url: "", title: "", isLive: false });
  useEffect(() => {
    setLive(getLive());
  }, []);

  const embed = getLiveEmbedUrl(live.url);
  const num = (BRAND.whatsappNumber || "").replace(/[^\d]/g, "");
  const waHref = `https://wa.me/${num}?text=${encodeURIComponent("I have a question about the live session")}`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="font-mono-t text-[10px] uppercase tracking-[0.3em] text-emerald-400">
            Live Broadcast Room
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-gray-100">
            Live Session
          </h1>
        </div>
        <div
          data-testid="live-stream-status-badge"
          className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-widest ${
            live.isLive
              ? "border-red-500/50 bg-red-500/10 text-red-400"
              : "border-[#232D42] bg-[#111622] text-gray-400"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${live.isLive ? "bg-red-500 live-pulse" : "bg-gray-500"}`} />
          {live.isLive ? "On Air" : "Offline"}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-[#232D42] bg-[#0A0D14] p-4">
          <div className="aspect-video overflow-hidden rounded border border-[#232D42] bg-black">
            {embed ? (
              <iframe
                src={embed}
                title={live.title || "Live Session"}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-testid="live-embed-frame"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                <AlertCircle className="h-8 w-8 text-gray-600" />
                <p className="font-display text-lg font-bold uppercase tracking-wider text-gray-300">
                  No Live Session Right Now
                </p>
                <p className="text-sm text-gray-500">
                  Instructor will paste the YouTube live link here when the session begins.
                </p>
              </div>
            )}
          </div>
          {live.title && (
            <h2 className="mt-4 text-xl font-semibold text-gray-100">{live.title}</h2>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-[#232D42] bg-[#111622] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Radio className="h-4 w-4 text-emerald-400" />
              <h3 className="font-display text-base font-bold uppercase tracking-wide text-gray-100">
                How Live Works
              </h3>
            </div>
            <ol className="space-y-2 text-sm text-gray-400">
              <li className="flex gap-2">
                <span className="font-mono-t text-emerald-400">01</span>
                Instructor goes live on YouTube.
              </li>
              <li className="flex gap-2">
                <span className="font-mono-t text-emerald-400">02</span>
                Live URL is pasted in the Admin Panel.
              </li>
              <li className="flex gap-2">
                <span className="font-mono-t text-emerald-400">03</span>
                Refresh this page to watch inside the site.
              </li>
            </ol>
          </div>

          <div className="rounded-lg border border-[#232D42] bg-[#111622] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-400" />
              <h3 className="font-display text-base font-bold uppercase tracking-wide text-gray-100">
                Session Schedule
              </h3>
            </div>
            <p className="text-sm text-gray-400">
              Weekly market outlook and live trading breakdowns. Times announced on WhatsApp.
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline"
              data-testid="live-schedule-whatsapp"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Get schedule on WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
