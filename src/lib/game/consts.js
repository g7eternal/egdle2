export const today = new Date();

export const nullFunction = () => {};

export const emoji = {
  food: ["🍒", "🍓", "🌶️", "🍄", "🍉", "🍅", "🥩", "🍟", "🍎", "🍧", "🌹", "🦀", "🦐"],
  bad: "❌",
  death: "🍳",
  good: "🥚",
  egs: ["🍳", "🥚", "🪺"],
  jewels: ["🐔", "🥩", "🥚", "🍗", "🍳", "🪺"],
  life: "💚",
  unlife: "🖤",
  hardMode: "♨️",
  easyMode: "⭐",
};

export const cellColors = {
  //empty: "rgba(0, 0, 0, 0)",
  red: "rgba(192, 96, 96, 0.38)",
  orange: "rgba(160, 128, 96, 0.38)",
  yellow: "rgba(160, 160, 96, 0.38)",
  green: "rgba(96, 192, 96, 0.38)",
  cyan: "rgba(96, 192, 192, 0.38)",
  blue: "rgba(96, 96, 192, 0.38)",
  purple: "rgba(136, 64, 192, 0.38)",
  pink: "rgba(172, 64, 128, 0.38)",
  brown: "rgba(128, 96, 64, 0.38)",
  gray: "rgba(140, 140, 140, 0.38)",
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

/* Options descriptions for different game modes */

const commonOptions = {
  visualAidMode: {
    title: "✴️ Visual aid",
    desc: "Cell color will be displayed as text",
  },
};

export const settingsLibrary = {
  egdle: {
    hardMode: {
      title: "♨️ Hard mode",
      desc: "Fields will fade out after some time, and if you find a broken egg - you lose!",
      error: "Cannot change the game mode after it has started",
    },
  },
  matcher: {
    visualAidMode: commonOptions.visualAidMode,
  },
  filler: {
    visualAidMode: commonOptions.visualAidMode,
  },
  jewels: {
    visualAidMode: commonOptions.visualAidMode,
    onlyEggMode: {
      title: "🥚 OnlyEggs mode",
      desc: "All the elements in this game will be rendered as eggs",
    },
    allowFlicks: {
      title: "👆 Enable flicks",
      desc: "Drag one cell onto another to swap. If disabled, only clicks will work",
    },
  },
  binary: {
    visualAidMode: commonOptions.visualAidMode,
    colors: {
      title: "🎨 Cell colors",
      desc: "You can change the color scheme for the game",
      error: "Can't have two identical colors!",
      type: "color_multiselect",
    },
    adviceFriendValidation: {
      title: "💬 Field validation popups",
      desc: "Advice friend will announce all of your mistakes",
    },
  },
  puzzle: {
    allowFlicks: {
      title: "👆 Enable flicks",
      desc: "Drag a piece onto an empty space to move it. If disabled, only clicks will work",
    },
    numericMode: {
      title: "🔢 Simple mode",
      desc: "Puzzle pieces will show their number. Perfect for casual players",
    },
    gridSizes: {
      title: "🖼️ Grid size",
      desc: "More pieces = harder puzzle. Stats are tracked separately for each size",
      type: "dropdown",
      error: "Cannot change grid size during an active game!",
    },
  },
};

// these are the pre-generated seeds for egdle binary
// generator is available at _dev/binary-gen/
export const binarySeeds = [
  12655695276, 47610123498, 41165368587, 24323897997, 27038145204, 20632479084, 56542706073, 27537331878, 56458308186,
  20764474668, 28346884965, 56274347241, 27561866598, 12173548212, 53916293907, 28560500325, 44402386266, 47669990130,
  56055768426, 27553851045, 12562519284, 45477090981, 45724672854, 12141634932, 40438252890, 28279481958, 23291970282,
  53885453517, 20632410540, 23424082794, 54331332237, 41429854809, 27486694053, 40153826034, 41165432217, 12693641877,
  28149103206, 28631734677, 24365669643, 40158976410, 28551721842, 21111426189, 24315849369, 45452575980, 22879085418,
  12693384333, 40993507989, 20781776169, 41165629785, 44666111322, 27586894230, 40100645529, 44452915542, 39918979674,
  45973185867, 28280800485, 41182124697, 28618875621, 23816678697, 40108403097, 56156407209, 41547033171, 56032320141,
  41429592666, 27289771173, 40438253205, 27488064933, 20629265076, 28551197556, 41157609129, 12695188905, 14804216595,
  47686527315, 27692160678, 40174719858, 20632410918, 23256845451, 12694403862, 27553851990, 45461091186, 28245927276,
  56528263827, 24464677545, 28543724118, 23263286949, 27537287526, 40423342806, 44395611813, 41182144857, 21100586598,
  28551198060, 47690595477,
];
