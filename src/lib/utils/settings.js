import { browser } from "$app/environment";
import { writable } from "svelte/store";
import { showAdviceFriend } from "./adviceFriend";
import { chooseAnnouncementOnLoad } from "./announcements";
import { migrateSettings } from "./migrateV1";

const defaultSettings = {
  darkMode: false,
  firstVisit: true,
  announcements: [],
  seenGames: ["classic"],
};

export const settings = writable({});
const lsKey = "egdle2-settings";

try {
  if (!browser) throw new Error("Not a browser, skip loading settings");

  let parsedSettings = null;
  const storedSettings = localStorage.getItem(lsKey);

  if (storedSettings) {
    parsedSettings = JSON.parse(storedSettings);
  } else {
    // attempt to migrate from v1
    parsedSettings = migrateSettings();
    parsedSettings.firstVisit = false;
  }

  settings.update((s) => {
    for (let key in parsedSettings) {
      if (key in defaultSettings) s[key] = parsedSettings[key];
    }
    return s;
  });
} catch (e) {
  console.warn("Failed to restore settings from localStorage", e);
} finally {
  settings.update((s) => {
    // validate according to default settings list
    for (let key in defaultSettings) {
      s[key] = key in s ? s[key] : defaultSettings[key];
    }

    if (s.firstVisit) {
      // first visit - autodetect some options
      s.firstVisit = false;
      s.announcements.push("firstReturnVisit"); // prevents "welcome back" message
      if (
        browser &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        toggleDarkMode(true);
      }
    } else {
      // apply settings
      toggleDarkMode(s.darkMode);
    }

    // loading finished, show announcements if any
    const adviceData = chooseAnnouncementOnLoad(s.announcements);
    s.announcements = adviceData.seen;
    if (adviceData.announce) {
      showAdviceFriend(adviceData.announce.text, adviceData.announce.header);
    }

    return s;
  });

  // subscribe an auto-saver
  if (browser) {
    settings.subscribe((s) => {
      localStorage.setItem(lsKey, JSON.stringify(s));
    });
  }
}

export function toggleDarkMode(newState) {
  settings.update((s) => {
    if (newState === undefined) newState = !s.darkMode;
    s.darkMode = newState;
    document.documentElement.dataset.bsTheme = s.darkMode ? "dark" : "light";
    return s;
  });
}

export function recordAnnouncements(annoList = []) {
  if (!annoList.length) return;

  settings.update((s) => {
    annoList.forEach((annoId) => {
      if (s.announcements.includes(annoId)) return;
      s.announcements.push(annoId);
    });
    return s;
  });
}
