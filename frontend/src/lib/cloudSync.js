// Cloud sync layer — writes go to Firestore, real-time subscriptions mirror
// cloud state into localStorage so the rest of the app keeps reading local.
import { firebaseEnabled, db, auth } from "./firebase";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Firestore layout under academy/main/*
const ROOT = "academy";
const MAIN = "main";
const configDoc = () => doc(db, ROOT, MAIN);
const col = (name) => collection(db, ROOT, MAIN, name);
const docIn = (name, id) => doc(db, ROOT, MAIN, name, id);

const LS = {
  students: "ta_students",
  modules: "ta_modules",
  live: "ta_live",
  announcements: "ta_announcements",
};

const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// ---------- Real-time subscribers (call once from App) ----------
export function startCloudSync(onChange) {
  if (!firebaseEnabled) return () => {};
  const unsubs = [];

  unsubs.push(
    onSnapshot(col("students"), (snap) => {
      const list = snap.docs.map((d) => d.data());
      write(LS.students, list);
      onChange?.("students");
    })
  );
  unsubs.push(
    onSnapshot(col("modules"), (snap) => {
      const list = snap.docs
        .map((d) => d.data())
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      write(LS.modules, list);
      onChange?.("modules");
    })
  );
  unsubs.push(
    onSnapshot(col("announcements"), (snap) => {
      const list = snap.docs
        .map((d) => d.data())
        .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      write(LS.announcements, list);
      onChange?.("announcements");
    })
  );
  unsubs.push(
    onSnapshot(configDoc(), (snap) => {
      const data = snap.data();
      if (data?.live) write(LS.live, data.live);
      onChange?.("live");
    })
  );

  return () => unsubs.forEach((u) => u());
}

// ---------- Auth ----------
export const cloudLoginAdmin = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const cloudLogout = () => signOut(auth);

export const onCloudAuthChange = (cb) => onAuthStateChanged(auth, cb);

export const currentCloudUser = () => auth?.currentUser || null;

// ---------- Students ----------
export const cloudAddStudent = (s) =>
  setDoc(docIn("students", s.username), {
    username: s.username,
    password: s.password,
    name: s.name || "",
    createdAt: new Date().toISOString(),
  });

export const cloudRemoveStudent = (username) =>
  deleteDoc(docIn("students", username));

// ---------- Modules & Lessons ----------
export const cloudSaveModule = (m) =>
  setDoc(docIn("modules", m.id), {
    id: m.id,
    title: m.title,
    description: m.description || "",
    lessons: m.lessons || [],
    order: m.order ?? Date.now(),
  });

export const cloudRemoveModule = (id) => deleteDoc(docIn("modules", id));

// ---------- Live ----------
export async function cloudUpdateLive(live) {
  await setDoc(configDoc(), { live }, { merge: true });
}

// ---------- Announcements ----------
export const cloudAddAnnouncement = (a) =>
  setDoc(docIn("announcements", a.id), a);
export const cloudRemoveAnnouncement = (id) =>
  deleteDoc(docIn("announcements", id));

// ---------- Bulk seed (used by admin import) ----------
export async function cloudBulkImport({
  students = [],
  modules = [],
  announcements = [],
  live = null,
}) {
  const ops = [];
  students.forEach((s) => ops.push(cloudAddStudent(s)));
  modules.forEach((m, i) => ops.push(cloudSaveModule({ ...m, order: i })));
  announcements.forEach((a) => ops.push(cloudAddAnnouncement(a)));
  if (live) ops.push(cloudUpdateLive(live));
  await Promise.all(ops);
}
