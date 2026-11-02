/**
 * input.js — keyboard + tombol sentuh dalam satu objek `Input`.
 */
const Input = (() => {
  const state = { left: false, right: false, jump: false, run: false };

  const keyMap = {
    ArrowLeft: "left", KeyA: "left",
    ArrowRight: "right", KeyD: "right",
    ArrowUp: "jump", KeyW: "jump", Space: "jump",
    ShiftLeft: "run", ShiftRight: "run", KeyX: "run",
  };

  function set(code, value, e) {
    const action = keyMap[code];
    if (!action) return;
    state[action] = value;
    if (e) e.preventDefault();
  }

  window.addEventListener("keydown", (e) => set(e.code, true, e));
  window.addEventListener("keyup", (e) => set(e.code, false, e));
  window.addEventListener("blur", () => Object.keys(state).forEach((k) => (state[k] = false)));

  // Tombol sentuh
  document.querySelectorAll("#touch button").forEach((btn) => {
    const action = btn.dataset.key;
    const on = (e) => { state[action] = true; e.preventDefault(); };
    const off = (e) => { state[action] = false; e.preventDefault(); };
    btn.addEventListener("touchstart", on, { passive: false });
    btn.addEventListener("touchend", off, { passive: false });
    btn.addEventListener("touchcancel", off, { passive: false });
    btn.addEventListener("mousedown", on);
    btn.addEventListener("mouseup", off);
    btn.addEventListener("mouseleave", off);
  });

  return state;
})();
