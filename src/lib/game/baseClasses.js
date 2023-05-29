import { nullFunction, emoji, today, gameCreatedDate } from "./consts";
import { forceUpdateDOM } from "../utils/state";
import { sample } from "../utils/common";

const CELL_ACTIVATION_DELAY = 300; // should roughly equal to css transition time in FieldCell.svelte

// legacy pseudo random number generator
// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function sfc32(a, b, d, c) {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

export class BaseCell {
  constructor(content = "") {
    this.content = content;
    this.enabled = true;
    this.visible = false;

    this.clicks = 0;
    this.winner = false;
    this.loser = false;
    this.bgcolor = "";
    this._prevBgColor = "";

    this._timers = {
      hider: null,
      enabler: null,
    };

    this.clickCallback = function () {
      console.log("Click recorded. Cell:", this);
      return this;
    };
  }

  hideAfter(time = 0) {
    this._timers.hider = setTimeout(() => {
      this.visible = false;
      forceUpdateDOM();
    }, time);
    this._timers.enabler = setTimeout(() => {
      this.enabled = true;
      forceUpdateDOM();
    }, time + CELL_ACTIVATION_DELAY);
    return this;
  }
  cancelTimers() {
    Object.keys(this._timers).forEach((timer) => {
      clearTimeout(this._timers[timer]);
    });
    return this;
  }

  click() {
    if (!this.enabled) return;

    this.visible = true;
    this.clicks += 1;
    this.enabled = false;

    return this.clickCallback();
  }

  toJSON() {
    const listOfProps = ["content", "enabled", "visible", "clicks", "winner", "loser", "bgcolor"];

    const simpleObject = {};
    listOfProps.forEach((prop) => {
      simpleObject[prop] = this[prop];
    });

    return simpleObject;
  }
}

export class BaseField {
  constructor(width = 6, height = 6) {
    this.width = width;
    this.height = height;
    if (width < 3 || height < 3)
      throw new Error("Invalid field dimensions: cannot go lower than 3x3");

    this.size = this.width * this.height;

    this.cells = new Array(this.size).fill(null).map(() => new BaseCell(sample(emoji.food)));
  }

  enableCells() {
    this.cells.forEach((f) => {
      f.enabled = true;
    });
    return this;
  }
  disableCells() {
    this.cells.forEach((f) => {
      f.enabled = false;
    });
    return this;
  }

  getTotalClicks() {
    return this.cells.reduce((ac, cell) => ac + cell.clicks, 0);
  }

  setCellClickCallback(callback) {
    this.cells.forEach((f) => {
      f.clickCallback = callback;
    });
    return this;
  }

  toJSON() {
    return { cells: this.cells };
  }
}

export class BaseGame {
  constructor() {
    this.id = "baseGame";
    this.name = "Egdle";
    this.kind = "base";
    this.issue = Math.floor((today.getTime() - gameCreatedDate.getTime()) / (1000 * 3600 * 24));

    this.field = new BaseField();

    this.settings = {};
    this.disabledSettings = new Set();

    this.stats = {
      games: 0,
      streak: 0,
      wins: 0,
      maxClicks: 0,
      minClicks: 0,
      avgClicks: 0,
      lastClicks: 0,
      lastIssue: 0,
      lastVisit: new Date(0),
    };

    this.clicks = 0;
    this.gameOver = false;
    this.result = null;

    this._prng = nullFunction;
    this._prngFactor = 1e10;

    this.startTime = 0;
    this.timeLimit = 0;
    this._timer = null;
    this.onTimeout = nullFunction;

    // list of properties which would go into localStorage:
    this._storedProperties = ["field", "settings", "stats", "gameOver", "result"];
  }

  getShareableData() {
    // this method should be overridden in subclasses
    return "🥚 " + this.name + "\n" + window.location.href;
  }

  setOption(key, value) {
    this.settings[key] = value;
    return this.saveState();
  }

  initRNG(seed = 0) {
    // this function follows old egdle prng algorithm
    this._prng = sfc32(
      today.getFullYear() + seed,
      today.getMonth() + seed,
      today.getDate() + seed,
      today.getDay() + seed + 1
    );
    return this;
  }

  getRandomInt(baseOf = 0) {
    const random = this._prngFactor * this._prng();
    if (!baseOf) return Math.floor(random);
    return Math.floor(baseOf * random) % baseOf;
  }

  startTimer(time = 0) {
    if (!this.startTime) this.startTime = Date.now();
    this.timeLimit = time;

    if (this.timeLimit > 0) {
      this._timer = setTimeout(() => this.onTimeout, this.timeLimit);
    }

    return this._timer;
  }
  stopTimer() {
    clearTimeout(this._timer);
    return this.getTimeElapsed();
  }
  getTimeElapsed() {
    if (!this.startTime) return 0;
    return Date.now() - this.startTime;
  }
  getTimeRemaining() {
    if (!this.startTime) return 0;
    return this.startTime + this.timeLimit - Date.now();
  }

  endGame(result, skipRecording = false) {
    console.info("Game ended. Result:", result);
    this.gameOver = true;
    this.result = Boolean(result);

    this.field.disableCells();
    this.clicks = this.field.getTotalClicks();
    this.stats.lastClicks = this.clicks;

    if (!skipRecording) {
      const restoredAvg = this.stats.games * this.stats.avgClicks;

      this.stats.games += 1;
      this.stats.lastIssue = this.issue;
      if (result) {
        // win
        this.stats.wins += 1;
        this.stats.streak = Math.max(1, this.stats.streak + 1);
      } else {
        // loss
        this.stats.streak = Math.min(-1, this.stats.streak - 1);
      }
      // record action count
      this.stats.avgClicks = (restoredAvg + this.stats.lastClicks) / this.stats.games;
      this.stats.maxClicks = Math.max(this.stats.maxClicks, this.stats.lastClicks);
      this.stats.minClicks =
        this.stats.minClicks === 0 // if zero, user just played first game
          ? this.stats.lastClicks
          : Math.min(this.stats.minClicks, this.stats.lastClicks);

      this.saveState();
    }

    return this;
  }

  pause() {
    clearTimeout(this._timer);
    return this;
  }

  toJSON() {
    const simpleObject = {};
    this._storedProperties.forEach((prop) => {
      simpleObject[prop] = this[prop];
    });

    return simpleObject;
  }

  getStorageKey() {
    return "egdle2-" + this.id;
  }

  saveState() {
    this.stats.lastVisit = new Date();

    const jsonString = JSON.stringify(this);

    localStorage.setItem(this.getStorageKey(), jsonString);
    return this;
  }

  loadState() {
    try {
      const jsonString = localStorage.getItem(this.getStorageKey());
      const storedData = JSON.parse(jsonString);

      // restore basic props
      for (let key in storedData) {
        if (key === "field") continue; // field needs special treatment
        this[key] = storedData[key];
      }

      // restore field
      if (this.stats.lastIssue === this.issue) {
        try {
          const storedCells = storedData.field.cells;
          storedCells.forEach((cellData, idx) => {
            const cell = this.field.cells[idx];
            for (let key in cellData) {
              cell[key] = cellData[key];
            }
          });
        } catch (e) {
          console.warn(this.id + " - Failed to restore field", e);
        }
      } else {
        // reset game state
        this.gameOver = false;
        this.result = null;
      }

      // apply fixups
      this.stats.lastVisit = new Date(this.stats.lastVisit || 0);
      this.clicks = this.field.getTotalClicks();
      if (this.issue - this.stats.lastIssue > 1) {
        this.stats.streak = 0;
      }

      console.info(this.id + " - restored state from localStorage");
    } catch (e) {
      console.warn(this.id + " - Failed to restore state", e);
    }

    return this;
  }

  destroy() {
    clearTimeout(this._timer);
    this.gameOver = true;
    this.field.disableCells();
    return null;
  }
}
