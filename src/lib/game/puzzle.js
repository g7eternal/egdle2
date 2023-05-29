import { writable } from "svelte/store";
import { BaseField, BaseGame } from "./baseClasses";
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

    this.options = {
      gridSizes: ["3x3", "4x4", "5x5", "6x6", "7x7"],
    };
    this.settings = {
      allowFlicks: true,
      numericMode: false,
      gridSizes: this.options.gridSizes.indexOf("6x6"),
    };
    // track stats separately per game mode:
    this._statsProto = {
      games: 0,
      runs: 0,
      avgTime: 0,
      avgClicks: 0,
      lastTime: 0,
      lastClicks: 0,
      bestTime: 0,
      bestClicks: 0,
    };
    this.stats = this.options.gridSizes.reduce((statObject, size) => {
      statObject[size] = Object.assign({}, this._statsProto);
      return statObject;
    }, {});

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

    this.loadState().updateGridSize();
    this.activeCell = null;
    this.gameOver = true;
    this._gameOverScreenSeen = true; // prevents instant gameover popup

    this.displayTime = writable("00:00");
    clearInterval(this._displayTimeInterval);

    this.doInitialFill(false);
  }

  setOption(key, value) {
    super.setOption(key, value);

    switch (key) {
      case "numericMode": {
        this.field.cells.forEach((cell) => {
          if (value) {
            cell.content = cell.puzzleId || ""; // shortcut sets zero cell as empty
          } else cell.content = "";
        });
        forceUpdateDOM();
        break;
      }
      case "gridSizes": {
        this.updateGridSize();
        forceUpdateDOM();
        break;
      }
    }

    return this;
  }

  updateGridSize() {
    const dimensions = this.options.gridSizes[this.settings.gridSizes].split("x");
    this.field = new BaseField(+dimensions[0], +dimensions[1]);
    this.field.setCellClickCallback(this._cellCallback);

    return this.reset();
  }

  reset() {
    this.gameOver = true;
    this.disabledSettings.clear();

    this.clicks = 0;

    this.resetTimer();

    this.field.cells.forEach((cell, i) => {
      cell.clear("", true);

      cell.color = "gray";
      cell.bgcolor = cellColors[cell.color];

      cell.puzzleId = i + 1;
      if (cell.puzzleId === this.field.size) {
        cell.puzzleId = 0;
        this._emptyCell = cell; // remember reference for swapTwoCells()
      }
      if (this.settings.numericMode) cell.content = cell.puzzleId || "";

      cell.visible = cell.puzzleId > 0;
      cell.enabled = false;
    });
    return this;
  }

  startNewRun() {
    const gridSize = this.options.gridSizes[this.settings.gridSizes];
    this.stats[gridSize].games += 1;
    this.saveState();

    this.reset();
    this.disabledSettings.add("gridSizes");

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
      let attemptCount = 0;

      while (!hasSolution) {
        attemptCount += 1;
        shuffle(this.field.cells);

        // idea from https://www.geeksforgeeks.org/check-instance-15-puzzle-solvable/
        const blankRowIndex = Math.floor(this.field.cells.findIndex((c) => c.puzzleId === 0) / this.field.width);
        const inversionCount = this.field.cells.reduce((total, cell, cellIndex, field) => {
          if (!cell.puzzleId) return total; // zero (blank cell) is ignored

          let inversions = 0;
          for (let i = cellIndex + 1; i < field.length; i++) {
            const comparedCell = field[i];
            if (!comparedCell.puzzleId) continue; // zero (blank cell) is ignored
            if (comparedCell.puzzleId < cell.puzzleId) inversions += 1;
          }
          return total + inversions;
        }, 0);

        if (this.field.width % 2 === 0) {
          /*
          If N is even, puzzle instance is solvable if either
           - the blank is on an even row (0-based row index) and number of inversions is odd
           - the blank is on an odd row (0-based row index) and number of inversions is even
          Hint: odd+even is always odd. Quick maths, innit?
          */
          hasSolution = (blankRowIndex + inversionCount) % 2 !== 0;
        } else {
          /*
          If N is odd, then puzzle instance is solvable if number of inversions is even in the input state.
          */
          hasSolution = inversionCount % 2 === 0;
        }

        if (attemptCount > 1e4) {
          console.warn("\nPossible infinite loop prevented at puzzle.doInitialFill() - puzzle may become unsolvable!");
          break;
        }
      }
      /* // for hardcore debugging sessions:
      console.debug(
        JSON.stringify(
          this.field.cells
            .map((c) => c.puzzleId)
            .reduce((ac, cv, ci) => {
              const zi = Math.floor(ci / this.field.width);
              if (ci % this.field.width === 0) ac[zi] = [];
              ac[zi].push(cv || "");
              return ac;
            }, [])
        )
      );
      */
      console.log(`Puzzle: found valid starting position after ${attemptCount} tries.`);
    }

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

    const gridSize = this.options.gridSizes[this.settings.gridSizes];
    const statRef = this.stats[gridSize];

    const restoredAvgTime = statRef.runs * statRef.avgTime;
    const restoredAvgClicks = statRef.runs * statRef.avgClicks;

    statRef.runs += 1;
    statRef.lastClicks = this.clicks;
    statRef.lastTime = time;
    statRef.avgTime = (restoredAvgTime + statRef.lastTime) / statRef.runs;
    statRef.avgClicks = (restoredAvgClicks + statRef.lastClicks) / statRef.runs;
    statRef.bestTime = Math.min(statRef.bestTime, statRef.lastTime) || statRef.lastTime;
    statRef.bestClicks = Math.min(statRef.bestClicks, statRef.lastClicks) || statRef.lastClicks;
    this.saveState();

    // re-enable "start game" button and grid picker
    this.disabledSettings.remove("gridSizes");
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

    const gridSize = this.options.gridSizes[this.settings.gridSizes];
    str += " (" + gridSize + ")";

    const statRef = this.stats[gridSize];

    if (statRef.runs > 0) {
      str += `\n🏁 Last run: ${formatTimer(statRef.lastTime, true)} (${statRef.lastClicks})`;
      str += `\nAverage in ${statRef.runs} runs:`;
      str += `\n⏱️ ~${formatTimer(statRef.avgTime, true)}`;
      str += `\n👆 ~${statRef.avgClicks.toFixed(2)} swaps`;
      str += `\nPersonal best:`;
      str += `\n⏱️🎖️ ${formatTimer(statRef.bestTime, true)}`;
      str += `\n👆🎖️ ${statRef.bestClicks} swaps`;
    }

    str += "\n" + window.location.href;
    return str;
  }

  loadState() {
    super.loadState();

    // fix: stats object might contain old data (not per size, but general)
    if ("games" in this.stats && !("6x6" in this.stats)) {
      const fixedStats = this.options.gridSizes.reduce((statObject, size) => {
        statObject[size] = Object.assign({}, this._statsProto);
        return statObject;
      }, {});

      // original size was 6x6, assign all stats:
      fixedStats["6x6"] = this.stats;
      this.stats = fixedStats;
    }

    return this;
  }
}

let game = null;
export function getInstance() {
  if (!game) game = new Puzzle();
  return game;
}
