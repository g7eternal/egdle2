import { cellColors, emoji } from "../game/consts";

export function migrateSettings() {
  console.log("Attempting to migrate settings from Egdle v1");

  try {
    const migratedData = {};

    const oldData = JSON.parse(localStorage.getItem("egdle-settings"));
    if (!oldData) return null;

    migratedData.darkMode = Boolean(oldData.darkMode);
    return migratedData;
  } catch (e) {
    console.warn("Migration failed", e);
    return null;
  }
}

export function migrateClassicSettings() {
  console.log("Attempting to migrate Egdle Classic preferences from Egdle v1");

  try {
    const migratedData = {};

    const oldData = JSON.parse(localStorage.getItem("egdle-settings"));
    if (!oldData) return null;

    migratedData.hardMode = Boolean(oldData.hardMode);
    return migratedData;
  } catch (e) {
    console.warn("Migration failed", e);
    return null;
  }
}

export function migrateClassicStats() {
  console.log("Attempting to migrate Egdle Classic stats from Egdle v1");

  try {
    const oldData = JSON.parse(localStorage.getItem("egdle-stats"));

    return {
      games: oldData.games,
      streak: oldData.streak,
      wins: oldData.wins,
      maxClicks: oldData.max,
      minClicks: oldData.min,
      avgClicks: oldData.avgtimes,
      lastClicks: oldData.lastclicks,
      lastIssue: oldData.lastissue,
      lastVisit: new Date(oldData.lastvisit),
    };
  } catch (e) {
    console.warn("Migration failed", e);
    return null;
  }
}

export function migrateClassicField() {
  console.log("Attempting to migrate Egdle Classic field state from Egdle v1");

  try {
    const oldData = JSON.parse(localStorage.getItem("egdle-field"));

    const cellData = oldData.map((emote) => {
      const cellInfo = {
        enabled: true,
        visible: false,
        clicks: 0,
        bgcolor: "",
        winner: false,
        loser: false,
      };

      if (emote) {
        cellInfo.enabled = false;
        cellInfo.visible = true;
        cellInfo.clicks = 1;
      }

      if (emoji.food.includes(emote)) {
        cellInfo.bgcolor = cellColors.red;
      }
      if (emoji.death === emote) {
        cellInfo.bgcolor = cellColors.purple;
        cellInfo.loser = true;
      }
      if (emoji.good === emote) {
        cellInfo.bgcolor = cellColors.yellow;
        cellInfo.winner = true;
      }

      return cellInfo;
    });
    return cellData;
  } catch (e) {
    console.warn("Migration failed", e);
    return null;
  }
}
