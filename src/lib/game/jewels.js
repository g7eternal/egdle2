import { BaseCell, BaseGame } from "./baseClasses";
import { sample } from "$lib/utils/common";
import { forceUpdateDOM } from "$lib/utils/state";
import { cellColors, emoji } from "./consts";

import Helper from "./help/Jewels.svelte";
import TopBar from "./topbar/Jewels.svelte";
import Stats from "./stats/Jewels.svelte";
import GameOver from "./gameover/Jewels.svelte";
import { tweened } from "svelte/motion";

class Jewels extends BaseGame {
  constructor() {
    super();

    this.id = "jewels";
    this.name = "Egdle Crush";
    this.usesInteractiveField = true;

    this.helperComponent = Helper;
    this.statsComponent = Stats;
    this.gameOverComponent = GameOver;
    this.topBarComponent = TopBar;

    this._storedProperties = ["settings", "stats"];

    this.colors = ["gray", "red", "yellow", "green", "blue", "pink"];

    this.settings = {
      visualAidMode: false,
      allowFlicks: true,
      onlyEggMode: false,
    };
    this.stats = {
      games: 0,
      runs: 0,
      lastScore: 0,
      bestScore: 0,
    };

    this.loadState();
    this.result = false;
    this.gameOver = true;
    this._gameOverScreenSeen = true; // prevents instant gameover popup

    this.score = 0;
    this.ongoingCombos = 0; // when 0, game can be ended
    this.activeCell = null;

    this.maxTime = 20;
    this.time = tweened(this.maxTime, {
      duration: 1000,
    });

    const gameInstance = this;
    this._cellCallback = function () {
      this.enabled = true;

      // fix for quick clickers:
      if (this.isTraveling || this.finisher) return;

      if (!gameInstance.activeCell) {
        // first active
        gameInstance.activeCell = this;
      } else {
        // second active - svap
        if (this !== gameInstance.activeCell) {
          gameInstance.swapTwoCells(gameInstance.activeCell, this);
        }
        gameInstance.activeCell = null;
      }

      return true; // this updates DOM
    };
    this.field.setCellClickCallback(this._cellCallback);

    this.field.disableCells();
  }

  setOption(key, value) {
    super.setOption(key, value);

    if (key === "onlyEggMode") {
      this.field.cells.forEach((cell) => {
        cell.content = value ? emoji.good : emoji.jewels[this.colors.indexOf(cell.color)];
      });
      forceUpdateDOM();
    }

    return this;
  }

  reset() {
    this.gameOver = false;
    this.result = false;
    this.score = 0;
    this.ongoingCombos = 0;
    this.activeCell = null;

    this.time.set(this.maxTime);
    clearInterval(this._timer);

    const baseColors = this.colors.slice(1);
    const helperColor = this.colors[0];

    this.field.cells.forEach((cell) => {
      cell.clear("", true);
      cell.enabled = false;
      cell.visible = false;
      cell.isTraveling = false;

      cell.color = sample(baseColors);
      cell.bgcolor = cellColors[cell.color];
      cell.content = this.settings.onlyEggMode ? emoji.good : emoji.jewels[this.colors.indexOf(cell.color)];
    });

    // remove all combos from starting position:
    const grid = [];
    for (let x = 0; x < this.field.width; x++) {
      grid.push(this.field.cells.slice(x * this.field.width, (x + 1) * this.field.width));
    }
    for (let x = 0; x < this.field.width; x++) {
      for (let y = 0; y < this.field.height; y++) {
        if (y > 1 && grid[x][y].color === grid[x][y - 1].color && grid[x][y].color === grid[x][y - 2].color) {
          grid[x][y - 1].color = helperColor;
          grid[x][y - 1].bgcolor = cellColors[helperColor];
          grid[x][y - 1].content = this.settings.onlyEggMode ? emoji.good : emoji.jewels[0];
        }
        if (x > 1 && grid[x][y].color === grid[x - 1][y].color && grid[x][y].color === grid[x - 2][y].color) {
          grid[x - 1][y].color = helperColor;
          grid[x - 1][y].bgcolor = cellColors[helperColor];
          grid[x - 1][y].content = this.settings.onlyEggMode ? emoji.good : emoji.jewels[0];
        }
      }
    }

    return this;
  }

  addTime(bonus = 0) {
    this.time.update((t) => Math.min(bonus + t, this.maxTime));
    return this.time;
  }

  startCountdown() {
    const timerUpdater = () => {
      this.time.update((t) => {
        let step = t - 1;
        const loseCondition = step < 0;

        // end game check
        if (loseCondition && !this.ongoingCombos) {
          step = 0;
          clearInterval(this._timer);
          this.endGame();
        }

        return step;
      });
    };
    this._timer = setInterval(timerUpdater, 1000);
    timerUpdater();

    return this;
  }

  startNewRun() {
    this.stats.games += 1;
    this.saveState();

    this.reset();

    this.field.showCells().enableCells();
    this.startCountdown();

    forceUpdateDOM();
    return this;
  }

  swapTwoCells(c1, c2, swapBack = true) {
    c1.isTraveling = true;
    c2.isTraveling = true;
    c1.enabled = false;
    c2.enabled = false;

    const c1Index = this.field.cells.findIndex((c) => c === c1);
    const c2Index = this.field.cells.findIndex((c) => c === c2);

    // index check
    let isValidDistance = true;
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

    // schedule a combo check after animation ends:
    setTimeout(() => {
      c1.isTraveling = false;
      c2.isTraveling = false;

      this.calculateAllCombos().then((comboScore) => {
        if (comboScore < 1) {
          // swap them back!
          if (swapBack) {
            this.swapTwoCells(c2, c1, false);
          }
        }
        c1.enabled = true;
        c2.enabled = true;
        forceUpdateDOM();
      });
    }, 300);
  }

  async calculateAllCombos(depth = 1) {
    this.ongoingCombos += 1;
    let combo = 0;

    const grid = [];
    for (let x = 0; x < this.field.width; x++) {
      grid.push(this.field.cells.slice(x * this.field.width, (x + 1) * this.field.width));
    }

    for (let x = 0; x < this.field.width; x++) {
      for (let y = 0; y < this.field.height; y++) {
        if (y > 1) {
          const colorsMatch = grid[x][y].color === grid[x][y - 1].color && grid[x][y].color === grid[x][y - 2].color;
          const allCellsAreAlive = grid[x][y].visible && grid[x][y - 1].visible && grid[x][y - 2].visible;
          const allCellsAreStatic =
            !grid[x][y].isTraveling && !grid[x][y - 1].isTraveling && !grid[x][y - 2].isTraveling;
          if (colorsMatch && allCellsAreStatic && allCellsAreAlive) {
            grid[x][y].finisher = true;
            grid[x][y - 1].finisher = true;
            grid[x][y - 2].finisher = true;
            combo += 10;
          }
        }
        if (x > 1) {
          const colorsMatch = grid[x][y].color === grid[x - 1][y].color && grid[x][y].color === grid[x - 2][y].color;
          const allCellsAreAlive = grid[x][y].visible && grid[x - 1][y].visible && grid[x - 2][y].visible;
          const allCellsAreStatic =
            !grid[x][y].isTraveling && !grid[x - 1][y].isTraveling && !grid[x - 2][y].isTraveling;
          if (colorsMatch && allCellsAreStatic && allCellsAreAlive) {
            grid[x][y].finisher = true;
            grid[x - 1][y].finisher = true;
            grid[x - 2][y].finisher = true;
            combo += 10;
          }
        }
      }
    }

    // mark cells for destruction:
    this.field.cells.forEach((cell) => {
      if (cell.finisher) {
        cell.visible = false;
        cell.enabled = false;
      }
    });

    let isFieldFull = combo === 0;
    const refiller = () => {
      if (isFieldFull) {
        this.calculateAllCombos(depth + 1);
        this.ongoingCombos -= 1e4; // unlocks game end check condition
        return;
      }
      isFieldFull = true;

      for (let i = this.field.size - 1; i >= 0; i--) {
        const cell = this.field.cells[i];

        if (!cell.visible) {
          isFieldFull = false;

          let indexer = i;
          while (indexer > this.field.width) {
            indexer -= this.field.width;
            this.field.cells[indexer + this.field.width] = this.field.cells[indexer];
          }
          const newCell = new BaseCell("");
          newCell.enabled = true;
          newCell.visible = true;
          newCell.isTraveling = false;
          newCell.color = sample(this.colors);
          newCell.bgcolor = cellColors[newCell.color];
          newCell.content = this.settings.onlyEggMode ? emoji.good : emoji.jewels[this.colors.indexOf(newCell.color)];
          newCell.clickCallback = this._cellCallback;
          this.field.cells[indexer] = newCell;
        }

        forceUpdateDOM();
      }
      setTimeout(refiller, 300);
    };
    if (!isFieldFull) {
      this.ongoingCombos += 1e4; // blocks game end check condition
      setTimeout(refiller, 400);
    }

    forceUpdateDOM();
    this.score += Math.round(combo * depth);
    this.ongoingCombos -= 1;
    this.addTime(Math.round(combo * 0.18));
    return combo;
  }

  unpause() {
    if (this.gameOver) return this;
    this.field.enableCells();
    return this.startCountdown();
  }

  endGame() {
    delete this._gameOverScreenSeen;
    this.time.set(0);
    super.endGame(true);

    // calculate stats
    this.stats.runs += 1;
    this.stats.lastScore = this.score;

    this.stats.bestScore = Math.max(this.stats.bestScore, this.score) || this.score;
    this.saveState();

    // re-enable "start game" button
    this.activeCell = null;
    setTimeout(() => {
      delete this.result;
      this.time.set(0); // just in case some stupid animations decide to ruin it
      forceUpdateDOM();
    }, 500);

    return this;
  }

  getShareableData() {
    let str = "🥚 " + this.name;

    if (this.stats.runs > 0) {
      str += `\n💎 Last score: ${this.stats.lastScore}`;
      str += `\n🎖️ Best of ${this.stats.runs} games: ${this.stats.bestScore}`;
    }

    str += "\n" + window.location.href;
    return str;
  }
}

let game = null;
export function getInstance() {
  if (!game) game = new Jewels();
  return game;
}
