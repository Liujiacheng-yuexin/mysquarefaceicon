// Original Friend Block Test protocol and question bank. No runtime dependencies.
export const PAGE_PATH = "/games/friend-block-test";
export const MAX_LINK = 1800;
export const STORAGE_KEY = "msfi-friend-quiz-v1";
export const AVATARS = ["classic", "cute", "funny", "gamer", "minimal", "retro"];
export const QUESTIONS = [
  ["An unexpected free afternoon! My first pick is…", "A long walk", "A creative project", "A cozy nap", "A game with friends"],
  ["I would build a tiny hideaway in…", "A tree canopy", "A seaside cabin", "A city rooftop", "A quiet library"],
  ["My ideal snack has something…", "Crunchy", "Sweet", "Spicy", "Fruity"],
  ["In a group project, I usually…", "Gather ideas", "Make a plan", "Design the details", "Keep everyone smiling"],
  ["The weather that lifts my mood is…", "Bright sunshine", "A soft drizzle", "Fresh snow", "A breezy afternoon"],
  ["If my bag had a secret extra pocket, it would hold…", "A sketchbook", "Emergency snacks", "A little camera", "A puzzle book"],
  ["My preferred way to celebrate a small win is…", "Share the news", "Play a favorite song", "Enjoy a treat", "Take a quiet break"],
  ["At a craft table, I reach for…", "Colorful paper", "Clay", "Paint", "Beads and thread"],
  ["A friendly robot could help me most by…", "Finding lost things", "Tidying my room", "Recommending stories", "Remembering my plans"],
  ["The seat I would choose on a train is…", "By the window", "Near my friends", "In the quiet carriage", "Closest to the snacks"],
  ["My dream mini-adventure involves…", "A hidden garden", "A night museum", "A hilltop picnic", "A colorful street market"],
  ["When I discover a great song, I…", "Play it on repeat", "Send it to a friend", "Add it to a playlist", "Learn the words"],
  ["The best surprise gift for me would be…", "Something handmade", "A shared experience", "A useful gadget", "A thoughtful note"],
  ["If we opened a little shop together, I would choose…", "A book nook", "A bakery", "An art studio", "A plant shop"],
  ["My favorite kind of friendly challenge is…", "A word puzzle", "A treasure hunt", "A drawing game", "A silly dance-off"],
  ["The color family I would pick for my room is…", "Earthy greens", "Sunny yellows", "Calm blues", "Warm pinks"],
  ["Before a day out, I am most likely to…", "Plan each stop", "Check the weather", "Pack extra snacks", "See where we end up"],
  ["When a friend needs cheering up, I offer…", "A listening ear", "A funny story", "A small surprise", "Company on a walk"],
  ["For one day, I would enjoy learning…", "Pottery", "Stargazing", "A musical instrument", "A new recipe"],
  ["A picture of my perfect weekend would include…", "Fresh air", "Friends around a table", "A blanket and a book", "Something I made"],
  ["The tiny superpower I would choose is…", "Always finding a comfy seat", "Never losing a bookmark", "Keeping drinks just right", "Untangling any cable"],
  ["My favorite souvenir from a day together is…", "A photo", "An inside joke", "A little keepsake", "A new shared playlist"],
  ["When trying a new game, I prefer to…", "Read the instructions", "Learn by playing", "Watch one round first", "Ask a friend to show me"],
  ["If my avatar had a signature accessory, it would be…", "A bright scarf", "Round glasses", "A tiny crown", "A leafy hat"]
].map(([prompt, ...options], id) => Object.freeze({ id, prompt, options: Object.freeze(options) }));

export function cleanName(value) {
  const text = String(value ?? "").normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "")
    .replace(/<[^>]*>?/g, "").replace(/[<>]/g, "")
    .replace(/(?:[a-z][a-z\d+.-]*:\/\/|www\.)[^\s]+/gi, "")
    .replace(/\b(?:[\w-]+\.)+[a-z]{2,}(?:\/[^\s]*)?/gi, "")
    .replace(/\s+/g, " ").trim();
  return Array.from(text).slice(0, 16).join("").trim();
}

export function checksum(text) {
  let hash = 2166136261;
  for (const byte of new TextEncoder().encode(text)) hash = Math.imul(hash ^ byte, 16777619) >>> 0;
  return hash.toString(16).padStart(8, "0");
}
const exactKeys = (obj, keys) => obj && typeof obj === "object" && !Array.isArray(obj)
  && Object.keys(obj).sort().join(",") === keys.split(",").sort().join(",");
const nameOK = name => typeof name === "string" && name.length > 0 && cleanName(name) === name;
const avatarOK = avatar => Number.isInteger(avatar) && avatar >= 0 && avatar < AVATARS.length;
const answersOK = values => Array.isArray(values) && values.length === 10
  && values.every(value => Number.isInteger(value) && value >= 0 && value <= 3);
export function validQuiz(quiz) {
  return exactKeys(quiz, "v,k,id,n,a,q,x") && quiz.v === 1 && quiz.k === "q"
    && typeof quiz.id === "string" && /^[a-f0-9]{12}$/.test(quiz.id) && nameOK(quiz.n) && avatarOK(quiz.a)
    && Array.isArray(quiz.q) && quiz.q.length === 10 && new Set(quiz.q).size === 10
    && quiz.q.every(id => Number.isInteger(id) && id >= 0 && id < QUESTIONS.length) && answersOK(quiz.x);
}
export function validPayload(payload) {
  return validQuiz(payload) || (exactKeys(payload, "v,k,quiz,n,a,x") && payload.v === 1 && payload.k === "r"
    && validQuiz(payload.quiz) && nameOK(payload.n) && avatarOK(payload.a) && answersOK(payload.x));
}
export function encode(payload) {
  if (!validPayload(payload)) throw new Error("Please complete all ten questions and add a nickname.");
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  const body = btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const token = `fbt1.${body}.${checksum(body)}`;
  if (token.length > MAX_LINK - 100) throw new Error("This link is too long. Please try a shorter nickname.");
  return token;
}
export function decode(fragment) {
  try {
    if (typeof fragment !== "string" || fragment.length > MAX_LINK) throw new Error();
    const token = fragment.replace(/^#/, "");
    const parts = /^fbt1\.([A-Za-z0-9_-]+)\.([a-f0-9]{8})$/.exec(token);
    if (!parts || checksum(parts[1]) !== parts[2]) throw new Error();
    const binary = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const json = new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
    const payload = JSON.parse(json);
    if (!validPayload(payload) || encode(payload) !== token) throw new Error();
    return { ok: true, payload };
  } catch {
    return { ok: false, message: "This quiz link is incomplete or uses an unsupported version. Ask your friend to copy the whole link again, or make a new quiz." };
  }
}
export function shareLink(payload, origin) {
  const url = new URL(PAGE_PATH, origin);
  if (!/^https?:$/.test(url.protocol)) throw new Error("Open the game in your browser to share it.");
  url.hash = encode(payload);
  if (url.href.length > MAX_LINK) throw new Error("This link is too long to share.");
  return url.href;
}
export function score(quiz, guesses) {
  if (!validQuiz(quiz) || !answersOK(guesses)) throw new Error("Incomplete answers.");
  return quiz.x.reduce((total, answer, i) => total + Number(answer === guesses[i]), 0);
}
export function tier(correct) {
  if (!Number.isInteger(correct) || correct < 0 || correct > 10) throw new Error("Invalid score.");
  return correct <= 3 ? "Getting in Sync" : correct <= 6 ? "Good Vibes" : correct <= 8 ? "Close Crew" : "Same Wavelength";
}
export function newQuiz(name, avatar) {
  const ids = QUESTIONS.map(question => question.id);
  const random = crypto.getRandomValues(new Uint32Array(ids.length));
  for (let i = ids.length - 1; i > 0; i--) { const j = random[i] % (i + 1); [ids[i], ids[j]] = [ids[j], ids[i]]; }
  const id = Array.from(crypto.getRandomValues(new Uint8Array(6)), n => n.toString(16).padStart(2, "0")).join("");
  return { v: 1, k: "q", id, n: cleanName(name), a: avatar, q: ids.slice(0, 10), x: Array(10).fill(null) };
}
export function replaceQuestion(quiz, index) {
  const available = QUESTIONS.filter(question => !quiz.q.includes(question.id));
  const next = available[crypto.getRandomValues(new Uint32Array(1))[0] % available.length];
  return { ...quiz, q: quiz.q.map((id, i) => i === index ? next.id : id), x: quiz.x.map((x, i) => i === index ? null : x) };
}

export function readHistory(storage) {
  const empty = { v: 1, owned: [], results: [] };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { data: empty, available: true };
    if (raw.length > 50000) throw new Error();
    const data = JSON.parse(raw);
    if (!exactKeys(data, "v,owned,results") || data.v !== 1 || !Array.isArray(data.owned) || data.owned.length > 20
      || !Array.isArray(data.results) || data.results.length > 50) throw new Error();
    if (!data.owned.every(item => exactKeys(item, "id,tag") && /^[a-f0-9]{12}$/.test(item.id) && /^[a-f0-9]{8}$/.test(item.tag))) throw new Error();
    if (!data.results.every(item => exactKeys(item, "id,quizId,host,n,a,correct") && /^[a-f0-9]{8}$/.test(item.id)
      && /^[a-f0-9]{12}$/.test(item.quizId) && nameOK(item.host) && nameOK(item.n) && avatarOK(item.a)
      && Number.isInteger(item.correct) && item.correct >= 0 && item.correct <= 10)) throw new Error();
    return { data, available: true };
  } catch { return { data: empty, available: false }; }
}
export function saveOwned(storage, quiz) {
  const { data, available } = readHistory(storage);
  if (!available) return false;
  const owned = [{ id: quiz.id, tag: checksum(encode(quiz)) }, ...data.owned.filter(item => item.id !== quiz.id)].slice(0, 20);
  try { storage.setItem(STORAGE_KEY, JSON.stringify({ ...data, owned })); return true; } catch { return false; }
}
export function saveResult(storage, payload) {
  if (!validPayload(payload) || payload.k !== "r") return { status: "invalid" };
  const { data, available } = readHistory(storage);
  if (!available) return { status: "unavailable" };
  if (!data.owned.some(item => item.id === payload.quiz.id && item.tag === checksum(encode(payload.quiz)))) return { status: "other-device" };
  const id = checksum(encode(payload));
  if (data.results.some(item => item.id === id)) return { status: "duplicate" };
  const result = { id, quizId: payload.quiz.id, host: payload.quiz.n, n: payload.n, a: payload.a, correct: score(payload.quiz, payload.x) };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ ...data, results: [result, ...data.results].slice(0, 50) }));
    return { status: "saved" };
  } catch { return { status: "unavailable" }; }
}
