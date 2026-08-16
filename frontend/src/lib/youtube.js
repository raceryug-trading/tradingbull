// Extract YouTube video ID from any URL format (watch, shorts, youtu.be, embed, live).
export function getYouTubeId(url) {
  if (!url) return null;
  const s = String(url).trim();
  const patterns = [
    /(?:youtube\.com\/watch\?[^#]*v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    /(?:youtube\.com\/live\/)([\w-]{11})/,
    /^([\w-]{11})$/,
  ];
  for (const p of patterns) {
    const m = s.match(p);
    if (m) return m[1];
  }
  return null;
}

export function getEmbedUrl(url, opts = {}) {
  const id = getYouTubeId(url);
  if (!id) return null;
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    ...(opts.autoplay ? { autoplay: "1" } : {}),
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export function getLiveEmbedUrl(url) {
  // Supports channel live URL like /channel/CHID/live or full video url
  const id = getYouTubeId(url);
  if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  // If channel live URL: e.g. https://www.youtube.com/channel/UCxxxx/live -> use as embed live_stream
  const chMatch = String(url || "").match(
    /youtube\.com\/(?:channel|c|user|@[\w.-]+)\/live/i
  );
  if (chMatch) {
    const chanId = url.match(/channel\/([\w-]+)/);
    if (chanId) {
      return `https://www.youtube.com/embed/live_stream?channel=${chanId[1]}&autoplay=1`;
    }
  }
  return null;
}

export function getThumbnail(url) {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
