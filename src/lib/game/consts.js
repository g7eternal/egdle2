export const today = new Date();

export const gameCreatedDate = new Date("2022-04-01T00:00:00"); // first issue = Apr 1, 2022
export const game_v2_Date = new Date("2023-04-01T00:00:00"); // v2 games = Apr 1, 2023

export const nullFunction = () => {};

export const emoji = {
  food: ["🍒", "🍓", "🌶️", "🍄", "🍉", "🍅", "🥩", "🍟", "🍎", "🍧", "🌹", "🦀", "🦐"],
  bad: "❌",
  death: "🍳",
  good: "🥚",
  egs: ["🍳", "🥚", "🪺"],
  hardMode: "♨️",
  easyMode: "⭐",
};

export const cellColors = {
  empty: "rgba(0, 0, 0, 0)",
  red: "rgba(192, 96, 96, 0.2)",
  yellow: "rgba(160, 160, 96, 0.3)",
  purple: "rgba(136, 64, 192, 0.2)",
  green: "rgba(96, 192, 96, 0.2)",
  blue: "rgba(96, 96, 192, 0.3)",
  gray: "rgba(140, 140, 140, 0.2)",
  cyan: "rgba(96, 192, 192, 0.3)",
  brown: "rgba(128, 96, 64, 0.2)",
};

export const settingsLibrary = {
  egdle: {
    hardMode: {
      title: "♨️ Hard mode",
      desc: "Fields will fade out after some time, and if you find a broken egg - you lose!",
      error: "Cannot change the game mode after it has started",
    },
  },
};
