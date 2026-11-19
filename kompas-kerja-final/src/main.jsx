import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/**
 * `window.storage` di file ini aslinya API khusus milik sandbox Claude.ai.
 * Di luar Claude.ai (mis. saat dijalankan di VS Code / browser biasa) API itu
 * tidak ada, jadi kita ganti dengan versi sederhana berbasis localStorage
 * supaya semua fitur (pelacak jam, kalkulator, checklist, kanban) tetap
 * tersimpan otomatis di browser kamu.
 */
window.storage = {
  async get(key, shared = false) {
    const raw = localStorage.getItem(`kw:${shared ? "shared" : "me"}:${key}`);
    if (raw === null) throw new Error("Key not found");
    return { key, value: raw, shared };
  },
  async set(key, value, shared = false) {
    localStorage.setItem(`kw:${shared ? "shared" : "me"}:${key}`, value);
    return { key, value, shared };
  },
  async delete(key, shared = false) {
    localStorage.removeItem(`kw:${shared ? "shared" : "me"}:${key}`);
    return { key, deleted: true, shared };
  },
  async list(prefix = "", shared = false) {
    const scope = `kw:${shared ? "shared" : "me"}:`;
    const keys = Object.keys(localStorage)
      .filter((k) => k.startsWith(scope + prefix))
      .map((k) => k.slice(scope.length));
    return { keys, prefix, shared };
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
