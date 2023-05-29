export const today = new Date();

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

export const resultFlavorTexts = [
  "Wow, that was amazing!",
  "Impressive!",
  "Very nice!",
  "Good job!",
  "Solid performance today!",
  "Nice try!",
  "That was OK.",
  "Not bad. Not good either.",
  "Much room for improvement.",
  "Come on, you can do better than that.",
  "That was… bad. Really bad.",
  "You are just having a bad day, aren't you?",
  "<img src='emotes/forsenswa.webp' alt='' width='24' height='24'> Unlucky.",
];

export const settingsLibrary = {
  egdle: {
    hardMode: {
      title: "♨️ Hard mode",
      desc: "Fields will fade out after some time, and if you find a broken egg - you lose!",
      error: "Cannot change the game mode after it has started",
    },
  },
  matcher: {
    visualAidMode: {
      title: "✴️ Visual aid",
      desc: "Cell color will be displayed as text",
    },
  },
};
