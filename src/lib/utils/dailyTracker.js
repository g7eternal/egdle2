import { browser } from "$app/environment";
import { writable } from "svelte/store";
import { formatDate } from "./common";

const lsKey = "egdle2-dtracker";

export const tracker = writable({
  date: formatDate(new Date()),
  done: [],
});

// loading from localStorage
try {
  if (!browser) throw new Error("Not a browser, skip loading daily tracker");

  const storedSettings = localStorage.getItem(lsKey);
  if (storedSettings) {
    const parsedData = JSON.parse(storedSettings);

    tracker.update((s) => {
      if (s.date === parsedData.date) {
        for (let key in parsedData) {
          if (key in s) s[key] = parsedData[key];
          if (s[key] instanceof Date) {
            s[key] = new Date(s[key]);
          }
        }
      }

      return s;
    });
  }
} catch (e) {
  console.warn("Failed to load daily tracker from localStorage", e);
} finally {
  // subscribe an auto-saver
  if (browser) {
    tracker.subscribe((s) => {
      localStorage.setItem(lsKey, JSON.stringify(s));
    });
  }
}

export function recordSolved(gameId) {
  tracker.update((s) => {
    if (!s.done.includes(gameId)) s.done.push(gameId);
    return s;
  });
}
