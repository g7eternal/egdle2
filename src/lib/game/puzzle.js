import { writable } from "svelte/store";
import { BaseGame } from "./baseClasses";
import { formatTimer, shuffle } from "../utils/common";
import { forceUpdateDOM } from "../utils/state";

import Helper from "./help/Puzzle.svelte";
import TopBar from "./topbar/Puzzle.svelte";
import Stats from "./stats/Puzzle.svelte";
import GameOver from "./gameover/Puzzle.svelte";
import { cellColors } from "./consts";

class Puzzle extends BaseGame {
  constructor() {
    super();

    this.id = "puzzle";
    this.name = "Egdle Puzzle";
    this.usesInteractiveField = true;

    this.helperComponent = Helper;
    this.statsComponent = Stats;
    this.gameOverComponent = GameOver;
    this.topBarComponent = TopBar;

    this._storedProperties = ["settings", "stats"];

    this.settings = {
      allowFlicks: true,
      numericMode: false,
    };
    this.stats = {
      games: 0,
      runs: 0,
      avgTime: 0,
      avgClicks: 0,
      lastTime: 0,
      lastClicks: 0,
      bestTime: 0,
      bestClicks: 0,
    };

    this.loadState().reset();
    this.activeCell = null;
    this.gameOver = true;
    this._gameOverScreenSeen = true; // prevents instant gameover popup

    this.displayTime = writable("00:00");
    clearInterval(this._displayTimeInterval);

    const gameInstance = this;
    this._cellCallback = function () {
      this.enabled = true;
      this.visible = this.puzzleId !== 0;

      // fix for quick clickers:
      if (this.isTraveling || this.finisher) return;

      // perform a swap into an adjacent empty space
      gameInstance.swapTwoCells(this, gameInstance._emptyCell);

      return true; // this updates DOM
    };
    this.field.setCellClickCallback(this._cellCallback);

    this.doInitialFill(false).field.showCells();
  }

  setOption(key, value) {
    super.setOption(key, value);

    if (key === "numericMode") {
      this.field.cells.forEach((cell) => {
        if (value) {
          cell.content = cell.puzzleId || ""; // shortcut sets zero cell as empty
        } else cell.content = "";
      });
      forceUpdateDOM();
    }

    return this;
  }

  reset() {
    this.gameOver = true;

    this.clicks = 0;

    this.resetTimer();

    this.field.cells.forEach((cell, i) => {
      cell.clear("", true);

      cell.color = "gray";
      cell.bgcolor = cellColors[cell.color];

      cell.visible = false;
      cell.enabled = false;

      cell.puzzleId = i + 1;
      if (cell.puzzleId === this.field.size) cell.puzzleId = 0;
    });
    return this;
  }

  startNewRun() {
    this.stats.games += 1;
    this.saveState();

    this.reset();

    this.gameOver = false;
    this.startTimer();

    this.displayTime.set("00:00");

    clearInterval(this._displayTimeInterval);
    this._displayTimeInterval = setInterval(() => {
      const t = this.getTimeElapsed();
      this.displayTime.set(formatTimer(t));
    }, 1000);

    this.doInitialFill(true).field.enableCells();

    forceUpdateDOM();
    return this;
  }

  doInitialFill(doShuffle = true) {
    if (doShuffle) {
      let hasSolution = false;

      while (!hasSolution) {
        shuffle(this.field.cells);

        // idea from https://www.geeksforgeeks.org/check-instance-15-puzzle-solvable/
        const blankRowIndex = Math.floor(this.field.cells.findIndex((c) => c.puzzleId === 0) / this.field.width);
        const inversionCount = this.field.cells.reduce((ac, cv, ci, ca) => {
          let inversions = 0;
          for (let i = ci + 1; i < ca.length; i++) {
            const cell = ca[i];
            if (!cell) continue; // zero is ignored
            if (cell.puzzleId > cv.puzzleId) inversions += 1;
          }
          return ac + inversions;
        }, 0);

        hasSolution = (blankRowIndex + inversionCount) % 2 !== 0;
      }
    }

    this.field.cells.forEach((cell) => {
      if (cell.puzzleId > 0) {
        if (this.settings.numericMode) cell.content = cell.puzzleId;
        cell.visible = true;
      } else {
        cell.content = "";
        cell.visible = false;
        // remember the reference for callbacks:
        this._emptyCell = cell;
      }
    });

    return this;
  }

  swapTwoCells(c1, c2) {
    c1.isTraveling = true;
    c2.isTraveling = true;
    c1.enabled = false;
    c2.enabled = false;

    const c1Index = this.field.cells.findIndex((c) => c === c1);
    const c2Index = this.field.cells.findIndex((c) => c === c2);

    // index check
    let isValidDistance = c1.visible !== c2.visible; // one of the cells must be "empty"!
    const distance = c2Index - c1Index;
    switch (distance) {
      case 1: {
        // c2 is on the right side of c1
        if ((c1Index + 1) % this.field.width === 0) isValidDistance = false; // rightmost cell cant have no neighbors on the right
        break;
      }
      case -1: {
        // c2 is on the left side of c1
        if (c1Index % this.field.width === 0) isValidDistance = false; // leftmost cell cant have no neighbors on the left
        break;
      }
      case this.field.height: {
        // c2 is below c1
        if (c1Index >= this.field.size - this.field.width) isValidDistance = false; // lowermost cell cant have no neighbors below
        break;
      }
      case -this.field.height: {
        // c2 is above c1
        if (c1Index < this.field.width) isValidDistance = false; // uppermost cell cant have no neighbors above
        break;
      }
      default: {
        isValidDistance = false;
      }
    }

    if (!isValidDistance) {
      c1.enabled = true;
      c2.enabled = true;
      c1.isTraveling = false;
      c2.isTraveling = false;
      return;
    }

    // do the swap:
    this.field.cells[c1Index] = c2;
    this.field.cells[c2Index] = c1;
    this.clicks += 1;

    // schedule a combo check after animation ends:
    setTimeout(() => {
      c1.isTraveling = false;
      c2.isTraveling = false;

      this.checkWinCondition().then((isGameWon) => {
        c1.enabled = true;
        c2.enabled = true;
        if (isGameWon) this.endGame(true);
        forceUpdateDOM();
      });
    }, 300);
  }

  async checkWinCondition() {
    // each cell must be in its own position (cell 1 in index 0, etc)
    // except for invisible (empty) cell - it must be last
    return this.field.cells.every((cell, i) => i + 1 === (cell.puzzleId === 0 ? this.field.size : cell.puzzleId));
  }

  endGame(result) {
    delete this._gameOverScreenSeen;
    super.endGame(result, true); // this class uses its own recorder
    this.field.showCells();

    const time = this.stopTimer();
    clearInterval(this._displayTimeInterval);

    const restoredAvgTime = this.stats.runs * this.stats.avgTime;
    const restoredAvgClicks = this.stats.runs * this.stats.avgClicks;

    this.stats.runs += 1;
    this.stats.lastClicks = this.clicks;
    this.stats.lastTime = time;
    this.stats.avgTime = (restoredAvgTime + this.stats.lastTime) / this.stats.runs;
    this.stats.avgClicks = (restoredAvgClicks + this.stats.lastClicks) / this.stats.runs;
    this.stats.bestTime = Math.min(this.stats.bestTime, this.stats.lastTime) || this.stats.lastTime;
    this.stats.bestClicks = Math.min(this.stats.bestClicks, this.stats.lastClicks) || this.stats.lastClicks;
    this.saveState();

    // re-enable "start game" button
    this.displayTime.set(formatTimer(time, true));
    forceUpdateDOM();
    setTimeout(() => {
      delete this.result;
      forceUpdateDOM();
    }, 800);

    return this;
  }

  getShareableData() {
    let str = "🧩 " + this.name;

    if (this.stats.runs > 0) {
      str += `\n🏁 Last run: ${formatTimer(this.stats.lastTime, true)} (${this.stats.lastClicks})`;
      str += `\nAverage in ${this.stats.runs} runs:`;
      str += `\n⏱️ ~${formatTimer(this.stats.avgTime, true)}`;
      str += `\n👆 ~${this.stats.avgClicks.toFixed(2)} swaps`;
      str += `\nPersonal best:`;
      str += `\n⏱️🎖️ ${formatTimer(this.stats.bestTime, true)}`;
      str += `\n👆🎖️ ${this.stats.bestClicks} swaps`;
    }

    str += "\n" + window.location.href;
    return str;
  }
}

let game = null;
export function getInstance() {
  if (!game) game = new Puzzle();
  return game;
}
