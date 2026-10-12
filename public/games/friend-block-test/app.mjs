import { AVATARS, QUESTIONS, PAGE_PATH, STORAGE_KEY, cleanName, decode, newQuiz, replaceQuestion, shareLink, score, tier, readHistory, saveOwned, saveResult } from "./core.mjs";

const app = document.getElementById("app");
const status = document.getElementById("status");
let linkInitialized = window.parent === window;
let storage;
try { storage = window.localStorage; } catch { storage = { getItem() { throw new Error(); }, setItem() { throw new Error(); }, removeItem() { throw new Error(); } }; }
let stage = "start", quiz = null, result = null, step = 0, guesses = [], selectedAvatar = 0, nickname = "", savedNote = "", originStage = "start", confirmClear = false;

function element(tag, attributes = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else if (value != null && (value !== false || key.startsWith("aria-"))) node.setAttribute(key, String(value));
  }
  for (const child of children.flat()) if (child != null) node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  return node;
}
const button = (text, action, className = "button", attrs = {}) => element("button", { type: "button", class: className, onclick: action, ...attrs }, text);
const portrait = (avatar, className = "portrait") => element("img", { src: `/game-face-samples/${AVATARS[avatar]}.webp`, alt: `${AVATARS[avatar]} face`, width: 64, height: 64, class: className });
const heading = text => element("h2", { tabindex: "-1" }, text);
function announce(message) { status.textContent = message; reportSize(); }
function go(next) { stage = next; render(); app.querySelector("h2")?.focus({ preventScroll: true }); if (window.parent !== window) window.parent.postMessage({ type: "friend-quiz:focus" }, location.origin); }
function reset() {
  quiz = null; result = null; nickname = ""; selectedAvatar = 0; step = 0; guesses = []; savedNote = "";
  if (window.parent !== window) window.parent.postMessage({ type: "friend-quiz:reset" }, location.origin);
  else history.replaceState(null, "", location.pathname);
  go("start");
}
function privacy() {
  return element("p", { class: "privacy" }, "No signup. Quiz content is not uploaded; results stay on this device. The surrounding site uses analytics and ads. Use Copy link to share; anyone with the link can read its contents.");
}
function masthead() {
  return element("div", { class: "masthead" }, element("span", { class: "wordmark" }, "FRIEND BLOCK TEST"),
    button("My results", () => { originStage = stage; go("history"); }, "small-button"));
}
function identity(answering) {
  const avatars = element("div", { class: "avatars" }, AVATARS.map((name, index) => button(portrait(index), () => {
    selectedAvatar = index;
    avatars.querySelectorAll("button").forEach((node, i) => node.setAttribute("aria-pressed", String(i === index)));
    announce(`${name} avatar selected.`);
  }, "avatar", { "aria-label": `${name} avatar`, "aria-pressed": index === selectedAvatar })));
  const input = element("input", { id: "nickname", class: "nickname", type: "text", value: nickname, autocomplete: "off", maxlength: 16, "aria-describedby": "nickname-hint", placeholder: "Your nickname", oninput: event => { nickname = event.target.value; } });
  const form = element("form", { onsubmit: event => {
    event.preventDefault();
    const cleaned = cleanName(nickname);
    if (!cleaned) { announce("Add a nickname using letters, numbers or emoji. Links are removed."); input.focus(); return; }
    nickname = cleaned;
    if (!answering) quiz = newQuiz(nickname, selectedAvatar);
    guesses = Array(10).fill(null); step = 0;
    go(answering ? "answer" : "create");
  } },
  element("div", { class: "identity" },
    element("fieldset", {}, element("legend", {}, "Choose your face"), avatars),
    element("div", {}, element("label", { for: "nickname", class: "label" }, "What should we call you?"), input,
      element("p", { id: "nickname-hint", class: "hint" }, "Up to 16 characters. Use a nickname, not personal details. Links and formatting are removed."))),
  element("div", { class: "actions" }, element("button", { class: "button primary", type: "submit" }, answering ? "Start guessing" : "Make my quiz")));
  return form;
}
function showQuestion() {
  const making = stage === "create", question = QUESTIONS[quiz.q[step]], selected = making ? quiz.x[step] : guesses[step];
  const next = button(step === 9 ? (making ? "Get my share link" : "See my result") : "Next question", () => {
    if ((making ? quiz.x[step] : guesses[step]) === null) { announce("Choose one answer to continue."); return; }
    if (step < 9) { step++; go(stage); return; }
    if (making) {
      savedNote = saveOwned(storage, quiz) ? "This browser can collect results for this quiz. Open return links here." : "This browser could not remember your quiz. You can share and view results, but a local results list may not be available.";
      go("share");
    } else {
      result = { v: 1, k: "r", quiz, n: nickname, a: selectedAvatar, x: [...guesses] };
      savedNote = "Send your result link back so your friend can add it to their list.";
      go("result");
    }
  }, "button primary", { disabled: selected === null });
  const options = element("div", { class: "options", role: "group", "aria-label": "Choose one answer" }, question.options.map((choice, index) => button([
    element("span", { class: "letter", "aria-hidden": "true" }, String.fromCharCode(65 + index)), element("span", {}, choice)
  ], () => {
    if (making) quiz.x[step] = index; else guesses[step] = index;
    options.querySelectorAll("button").forEach((node, i) => node.setAttribute("aria-pressed", String(i === index)));
    next.disabled = false;
    announce(`Selected: ${choice}.`);
  }, "option", { "aria-pressed": selected === index })));
  return [element("div", { class: "progress-row" }, element("span", {}, making ? "YOUR TEN PICKS" : `GUESS ${quiz.n.toLocaleUpperCase()}'S PICKS`), element("span", {}, `${step + 1} / 10`)),
    element("progress", { max: 10, value: step + 1, "aria-label": `Question ${step + 1} of 10` }),
    heading(question.prompt), options,
    making ? button("Swap this question ↻", () => { quiz = replaceQuestion(quiz, step); go("create"); announce("A different question is ready. Choose a new answer."); }, "swap") : element("p", { class: "hint" }, `Pick the answer you think ${quiz.n} chose.`),
    element("div", { class: "question-actions" }, button("Back", () => { if (step > 0) { step--; go(stage); } else go(making ? "start" : "intro"); }, "button secondary"), next),
    element("p", { class: "hint" }, "Choose an option, then continue. Reloading clears unfinished answers.")];
}
function sharePanel(payload, label) {
  const link = shareLink(payload, location.origin);
  const textarea = element("textarea", { class: "share-link", id: "share-link", readonly: "", spellcheck: "false" }, link);
  return [element("label", { for: "share-link", class: "share-label" }, label), textarea,
    element("div", { class: "actions" }, button("Copy link", async () => {
      try { await navigator.clipboard.writeText(link); announce("Link copied. Paste it into a message to your friend."); }
      catch { textarea.focus(); textarea.select(); announce("Link selected. Use your browser’s Copy command, then paste it into a message."); }
    }, "button primary")), element("p", { class: "hint" }, "Copy the complete link, including everything after #. Links are not private or cheat-proof.")];
}
function resultScreen() {
  const correct = score(result.quiz, result.x);
  const review = element("details", {}, element("summary", {}, "Compare the ten answers"), element("ol", { class: "review" }, result.quiz.q.map((id, i) => element("li", {},
    element("strong", {}, QUESTIONS[id].prompt), element("p", {}, `You guessed: ${QUESTIONS[id].options[result.x[i]]}. ${result.quiz.n} picked: ${QUESTIONS[id].options[result.quiz.x[i]]}.`)))));
  return [element("div", { class: "avatar-row" }, portrait(result.a), element("div", {}, element("p", { class: "eyebrow" }, "THE RESULTS ARE IN"), heading(`${result.n} + ${result.quiz.n}`))),
    element("p", { class: "intro" }, "Ten little guesses. One more reason to start a conversation."),
    element("div", { class: "score-box" }, element("div", { class: "score" }, `${correct * 10}`, element("small", {}, " / 100")), element("div", {}, element("p", { class: "tier" }, tier(correct)), element("p", {}, `${correct} of 10 answers matched.`))),
    element("p", { class: "notice" }, savedNote), ...sharePanel(result, "Your result link"), review,
    element("div", { class: "actions" }, button("Make my own quiz", reset, "button secondary"), element("a", { class: "button secondary", href: "/", target: "_top" }, "Make my square face")),
    element("p", { class: "hint" }, "Just for fun. A score cannot measure friendship, and no one is actually blocked.")];
}
function historyScreen() {
  const { data, available } = readHistory(storage);
  return [heading("Results on this device"), element("p", { class: "intro" }, "Return links from your friends appear here when opened in the browser that created the quiz. Nothing syncs or uploads."),
    !available ? element("p", { class: "notice" }, "Saved results are unavailable. Browser storage may be blocked or the saved data may be unreadable. You can still play and share links.") : null,
    data.results.length ? element("ul", { class: "history" }, data.results.map(item => element("li", {}, portrait(item.a), element("div", {}, element("strong", {}, item.n), element("small", {}, `${item.host}'s quiz · ${tier(item.correct)}`)), element("span", { class: "points" }, `${item.correct} / 10`))))
      : element("p", {}, "No results saved yet. Make a quiz, then open a friend's result link here."),
    element("p", { class: "hint" }, "Up to 20 created-quiz identifiers and the latest 50 results stay in this browser. Your original answer list is kept in the link, not in this results list."),
    element("div", { class: "actions" }, button("Back to quiz", () => { confirmClear = false; go(originStage); }, "button secondary"),
      button(confirmClear ? "Yes, clear my quiz records" : "Clear quiz records", () => {
        if (!confirmClear) { confirmClear = true; render(); announce("Press Yes, clear my quiz records to remove this game's identifiers and results. Other site data is kept."); return; }
        try { storage.removeItem(STORAGE_KEY); confirmClear = false; render(); announce("Quiz records cleared from this browser."); }
        catch { announce("Browser storage is unavailable. You can clear this site's data in your browser settings."); }
      }, "button secondary"))];
}
function render() {
  status.textContent = "";
  let content;
  if (stage === "start") content = [element("p", { class: "eyebrow" }, "YOUR FRIENDS. YOUR TEN PICKS."), heading("Who knows your little quirks?"), element("p", { class: "intro" }, "Pick your answers, send a link, and let your friends guess. Ten questions. No signup. All in good fun."), identity(false)];
  else if (stage === "intro") content = [element("div", { class: "avatar-row" }, portrait(quiz.a), element("div", {}, element("p", { class: "eyebrow" }, "YOU'RE INVITED"), heading(`${quiz.n}'s friend quiz`))), element("p", { class: "intro" }, `How well do you know ${quiz.n}? Guess ten everyday choices, then send your score back.`), identity(true)];
  else if (stage === "create" || stage === "answer") content = showQuestion();
  else if (stage === "share") content = [element("p", { class: "eyebrow" }, "READY FOR THE GROUP CHAT"), heading("Your quiz is ready!"), element("p", { class: "intro" }, `Send ${quiz.n}'s ten questions to a friend. Ask them to send their result link back, then open it in this browser.`), ...sharePanel(quiz, "Your quiz link"), element("p", { class: "notice" }, savedNote), element("div", { class: "actions" }, button("Edit my answers", () => { quiz = { ...quiz, id: newQuiz(quiz.n, quiz.a).id }; step = 0; go("create"); }, "button secondary"), button("Make another quiz", reset, "button secondary"))];
  else if (stage === "result") content = resultScreen();
  else if (stage === "history") content = historyScreen();
  else content = [heading("Let's fix that link"), element("p", { class: "intro" }, savedNote), element("div", { class: "actions" }, button("Make a new quiz", reset, "button primary"))];
  app.replaceChildren(masthead(), ...content.filter(Boolean), privacy());
  reportSize();
}
function reportSize() {
  if (window.parent === window || !linkInitialized) return;
  requestAnimationFrame(() => window.parent.postMessage({ type: "friend-quiz:size", height: Math.ceil(app.getBoundingClientRect().height + status.getBoundingClientRect().height + 8) }, location.origin));
}
function readLink(hash = location.hash) {
  linkInitialized = true;
  if (!hash || hash === "#game-player") { stage = "start"; }
  else {
    const parsed = decode(hash);
    if (!parsed.ok) { stage = "error"; savedNote = parsed.message; }
    else if (parsed.payload.k === "q") { quiz = parsed.payload; stage = "intro"; }
    else {
      result = parsed.payload; stage = "result";
      const saved = saveResult(storage, result);
      savedNote = { saved: "Saved to your results on this device.", duplicate: "This result is already in your list. No duplicate was added.", "other-device": "To save this result, open the link in the browser that created the quiz. You can still view and share it here.", unavailable: "This browser could not save the result. You can still view it and keep the link.", invalid: "This result could not be saved." }[saved.status];
    }
  }
  render();
}
window.addEventListener("hashchange", () => readLink());
window.addEventListener("message", event => {
  if (event.source !== window.parent || event.origin !== location.origin || window.parent === window) return;
  if (event.data?.type === "friend-quiz:link" && typeof event.data.fragment === "string") readLink(event.data.fragment);
});
window.addEventListener("resize", reportSize);
new ResizeObserver(reportSize).observe(app);
if (window.parent === window) readLink();
else window.parent.postMessage({ type: "friend-quiz:ready" }, location.origin);
