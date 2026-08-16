// Client-side data store using localStorage. Works on GitHub Pages (no backend).
import {
  DEFAULT_ADMIN,
  DEFAULT_STUDENTS,
  DEFAULT_MODULES,
  DEFAULT_LIVE,
  DEFAULT_ANNOUNCEMENTS,
} from "../config";

const KEYS = {
  admin: "ta_admin",
  students: "ta_students",
  modules: "ta_modules",
  live: "ta_live",
  session: "ta_session",
  announcements: "ta_announcements",
  progressPrefix: "ta_progress_",
  version: "ta_version",
};

const VERSION = "1";

function seed() {
  if (localStorage.getItem(KEYS.version) === VERSION) return;
  if (!localStorage.getItem(KEYS.admin))
    localStorage.setItem(KEYS.admin, JSON.stringify(DEFAULT_ADMIN));
  if (!localStorage.getItem(KEYS.students))
    localStorage.setItem(KEYS.students, JSON.stringify(DEFAULT_STUDENTS));
  if (!localStorage.getItem(KEYS.modules))
    localStorage.setItem(KEYS.modules, JSON.stringify(DEFAULT_MODULES));
  if (!localStorage.getItem(KEYS.live))
    localStorage.setItem(KEYS.live, JSON.stringify(DEFAULT_LIVE));
  if (!localStorage.getItem(KEYS.announcements))
    localStorage.setItem(KEYS.announcements, JSON.stringify(DEFAULT_ANNOUNCEMENTS));
  localStorage.setItem(KEYS.version, VERSION);
}
seed();

const read = (k, fallback) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// ---------- Auth ----------
export function loginStudent(username, password) {
  const students = read(KEYS.students, []);
  const s = students.find(
    (x) => x.username === username && x.password === password
  );
  if (!s) return null;
  const session = { role: "student", username: s.username, name: s.name || s.username };
  write(KEYS.session, session);
  return session;
}
export function loginAdmin(username, password) {
  const admin = read(KEYS.admin, DEFAULT_ADMIN);
  if (admin.username !== username || admin.password !== password) return null;
  const session = { role: "admin", username: admin.username, name: "Admin" };
  write(KEYS.session, session);
  return session;
}
export function currentSession() {
  return read(KEYS.session, null);
}
export function logout() {
  localStorage.removeItem(KEYS.session);
}

// ---------- Students ----------
export const getStudents = () => read(KEYS.students, []);
export function addStudent(s) {
  const list = getStudents();
  if (list.find((x) => x.username === s.username))
    throw new Error("Username already exists");
  list.push(s);
  write(KEYS.students, list);
  return list;
}
export function removeStudent(username) {
  const list = getStudents().filter((x) => x.username !== username);
  write(KEYS.students, list);
  return list;
}

// ---------- Admin credentials ----------
export const getAdmin = () => read(KEYS.admin, DEFAULT_ADMIN);
export function updateAdmin(admin) {
  write(KEYS.admin, admin);
}

// ---------- Modules & Lessons ----------
export const getModules = () => read(KEYS.modules, []);
export function saveModules(mods) {
  write(KEYS.modules, mods);
}
export function addModule(mod) {
  const list = getModules();
  list.push({ ...mod, id: `mod-${Date.now()}`, lessons: mod.lessons || [] });
  saveModules(list);
  return list;
}
export function removeModule(id) {
  saveModules(getModules().filter((m) => m.id !== id));
}
export function addLesson(moduleId, lesson) {
  const list = getModules();
  const m = list.find((x) => x.id === moduleId);
  if (!m) return;
  m.lessons = m.lessons || [];
  m.lessons.push({ ...lesson, id: `les-${Date.now()}` });
  saveModules(list);
  return list;
}
export function removeLesson(moduleId, lessonId) {
  const list = getModules();
  const m = list.find((x) => x.id === moduleId);
  if (!m) return;
  m.lessons = (m.lessons || []).filter((l) => l.id !== lessonId);
  saveModules(list);
  return list;
}

// ---------- Live Session ----------
export const getLive = () => read(KEYS.live, DEFAULT_LIVE);
export function updateLive(data) {
  write(KEYS.live, { ...getLive(), ...data });
  return getLive();
}

// ---------- Announcements ----------
export const getAnnouncements = () => read(KEYS.announcements, []);
export function addAnnouncement(a) {
  const list = getAnnouncements();
  list.unshift({
    id: `ann-${Date.now()}`,
    tone: "info",
    createdAt: new Date().toISOString(),
    ...a,
  });
  write(KEYS.announcements, list);
  return list;
}
export function removeAnnouncement(id) {
  const list = getAnnouncements().filter((a) => a.id !== id);
  write(KEYS.announcements, list);
  return list;
}

// ---------- Progress (per student) ----------
export function getProgress(username) {
  if (!username) return {};
  return read(KEYS.progressPrefix + username, {});
}
export function toggleLessonComplete(username, lessonId) {
  if (!username || !lessonId) return {};
  const p = getProgress(username);
  if (p[lessonId]) delete p[lessonId];
  else p[lessonId] = { completedAt: new Date().toISOString() };
  write(KEYS.progressPrefix + username, p);
  return p;
}
export function moduleProgress(username, mod) {
  const lessons = mod?.lessons || [];
  if (lessons.length === 0) return { done: 0, total: 0, pct: 0 };
  const p = getProgress(username);
  const done = lessons.filter((l) => p[l.id]).length;
  return { done, total: lessons.length, pct: Math.round((done / lessons.length) * 100) };
}

// ---------- Export / Import ----------
export function exportAll() {
  return {
    version: VERSION,
    exportedAt: new Date().toISOString(),
    admin: getAdmin(),
    students: getStudents(),
    modules: getModules(),
    live: getLive(),
    announcements: getAnnouncements(),
  };
}
export function importAll(data) {
  if (!data || typeof data !== "object") throw new Error("Invalid file");
  if (data.admin) write(KEYS.admin, data.admin);
  if (Array.isArray(data.students)) write(KEYS.students, data.students);
  if (Array.isArray(data.modules)) write(KEYS.modules, data.modules);
  if (data.live) write(KEYS.live, data.live);
  if (Array.isArray(data.announcements)) write(KEYS.announcements, data.announcements);
}
export function resetAll() {
  [KEYS.admin, KEYS.students, KEYS.modules, KEYS.live, KEYS.announcements, KEYS.version].forEach(
    (k) => localStorage.removeItem(k)
  );
  seed();
}
