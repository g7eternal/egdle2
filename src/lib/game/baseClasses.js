import { nullFunction, emoji, today } from "./consts";
import { forceUpdateDOM } from "../utils/state";
import { sample } from "../utils/common";
import seedrandom from "seedrandom";

const CELL_ACTIVATION_DELAY = 300; // should roughly equal to css transition time in FieldCell.svelte

export class BaseCell {
  constructor(content = "") {
    this.enabled = true;

    this.clear(content, true);

    this._timers = {
      hider: null,
      enabler: null,
    };

    this.clickCallback = function () {
      console.log("Click recorded. Cell:", this);
      return this;
    };
  }

  clear(content = "", withClicks = false) {
    this.content = content;
    this.visible = false;
    this.locked = false;

    this.bgcolor = "";
    this.color = "";

    this.winner = false;
    this.loser = false;
    this.finisher = false; // toggles confetti animation

    if (withClicks) this.clicks = 0;

    return this;
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
    const listOfProps = ["content", "enabled", "visible", "locked", "clicks", "winner", "loser", "bgcolor", "color"];

    const simpleObject = {};
    listOfProps.forEach((prop) => {
      simpleObject[prop] = this[prop];
    });

    return simpleObject;
  }
}

export class BaseField {
  constructor(width = 6, height = 6) {
    // recommended min size: 3x3
    // recommended max size: 8x8
    this.setSize(width, height);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    if (width < 3 || height < 3) throw new Error("Invalid field dimensions: cannot go lower than 3x3");

    this.size = this.width * this.height;
    return this.reset();
  }

  reset() {
    this.cells = new Array(this.size).fill(null).map(() => new BaseCell(sample(emoji.food)));

    // Y-based grid (references as [y][x], this.cells[3] === this.grid[0][3])
    this.inverseGrid = [];
    for (let y = 0; y < this.height; y++) {
      this.inverseGrid.push(this.cells.slice(y * this.height, (y + 1) * this.height));
    }

    // X-based grid (references as [x][y], this.cells[3] === this.grid[3][0])
    this.grid = [];
    for (let x = 0; x < this.width; x++) {
      const column = [];
      for (let y = 0; y < this.height; y++) {
        column.push(this.inverseGrid[y][x]);
      }
      this.grid.push(column);
    }

    return this;
  }

  clear(content, withClicks) {
    this.cells.forEach((f) => {
      f.clear(content, withClicks);
    });
    return this;
  }

  enableCells() {
    this.cells.forEach((f) => {
      f.enabled = !f.locked;
    });
    return this;
  }
  disableCells() {
    this.cells.forEach((f) => {
      f.enabled = false;
    });
    return this;
  }

  showCells() {
    this.cells.forEach((f) => {
      f.visible = true;
    });
    return this;
  }
  hideCells() {
    this.cells.forEach((f) => {
      f.visible = false;
    });
    return this;
  }

  getTotalClicks() {
    return this.cells.reduce((ac, cell) => ac + cell.clicks, 0);
  }

  setCellClickCallback(callback) {
    this.cells.forEach((cell) => {
      cell.clickCallback = callback;
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

    // subclasses should override these component references:
    this.helperComponent = null;
    this.statsComponent = null;
    this.gameOverComponent = null;
    this.topBarComponent = null;

    this.issue = 0;
    this.firstIssueDate = 0;
    this.refreshIssueNumber("2022-04-01T00:00:00"); // egdle v1 started on 01.Apr

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
    this.result = null;
    this.gameOver = false;
    this._gameOverScreenSeen = false;

    this._prng = nullFunction;
    this._prngFactor = 1;

    this.startTime = 0;
    this.timeLimit = 0;
    this._timer = null;
    this.onTimeout = nullFunction;

    // list of properties which would go into localStorage:
    this._storedProperties = ["field", "settings", "stats", "gameOver", "result"];
  }

  refreshIssueNumber(newFirstDate) {
    this.firstIssueDate = new Date(newFirstDate);
    this.issue = Math.floor((today.getTime() - this.firstIssueDate.getTime()) / (1000 * 3600 * 24));
    return this;
  }

  getShareableData() {
    // this method should be overridden in subclasses
    return "🥚 " + this.name + "\n" + window.location.href;
  }

  setOption(key, value) {
    this.settings[key] = value;
    return this.saveState();
  }

  initRNG() {
    const seed = [this.id, today.getFullYear(), today.getMonth(), today.getDate(), today.getDay()].join("-");
    this._prng = new seedrandom(seed);
    return this;
  }

  getRandomInt(baseOf = 0) {
    const random = this._prngFactor * this._prng();
    if (!baseOf) return Math.floor(random); // is always zero?
    return Math.floor(baseOf * random) % baseOf;
  }

  resetTimer() {
    this.startTime = 0;
    this.stopTimer();
    return this;
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
    this.gameOver = true;
    this.result = Boolean(result);

    this.field.disableCells();

    if (!skipRecording) {
      this.clicks = this.field.getTotalClicks();
      this.stats.lastClicks = this.clicks;

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
    this.stats.lastIssue = this.issue;

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
      if (this.kind === "daily" && this.stats.lastIssue === this.issue) {
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
        this.startTime = 0; // resets the timer for timed daily games
        this.clicks = 0;
        this.result = null;
      }

      // apply fixups
      this.stats.lastVisit = new Date(this.stats.lastVisit || 0);
      if (storedData && !("clicks" in storedData)) {
        this.clicks = this.field.getTotalClicks();
      }
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
