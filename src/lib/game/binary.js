import { writable } from "svelte/store";
import { BaseGame } from "./baseClasses";
import { cellColors, emoji, binarySeeds } from "./consts";
import { formatTimer } from "../utils/common";
import { forceUpdateDOM } from "../utils/state";

import { showAdviceFriend } from "../utils/adviceFriend";

import Helper from "./help/Binary.svelte";
import Stats from "./stats/Binary.svelte";
import GameOver from "./gameover/Binary.svelte";
import TopBar from "./topbar/Binary.svelte";

class Binary extends BaseGame {
  constructor() {
    super();
    this.id = "binary";
    this.name = "Egdle Binary";
    this.kind = "daily";

    this.refreshIssueNumber("2023-05-27T00:00:00");

    this.helperComponent = Helper;
    this.statsComponent = Stats;
    this.gameOverComponent = GameOver;
    this.topBarComponent = TopBar;

    this.settings = {
      visualAidMode: false,
      adviceFriendValidation: true,
      colors: ["red", "blue"],
    };
    this.stats = {
      games: 0,
      wins: 0,
      lastIssue: 0,
      lastTime: 0,
      bestTime: 0,
      avgTime: 0,
      lastClicks: 0,
      bestClicks: 0,
      avgClicks: 0,
    };

    this._storedProperties.push("clicks");
    this._storedProperties.push("startTime");

    this.fieldError = "";
    this.gameOver = true;
    this._gameOverScreenSeen = true; // prevents instant gameover popup

    this.displayTime = writable("00:00");
    clearInterval(this._displayTimeInterval);

    this._endGameCheckTimeout = null;

    this.initRNG(0);

    // enrich object by loading stored data
    this.loadState();

    // init all fields' callback
    const gameInstance = this;
    this.field.setCellClickCallback(function () {
      gameInstance.clicks += 1;

      if (this.clicks > gameInstance.settings.colors.length) {
        this.clicks = 0;
      }

      this.enabled = true;
      switch (this.clicks) {
        case 0: {
          this.visible = false;
          this.color = "";
          this.bgcolor = "";
          break;
        }
        default: {
          this.visible = true;
          this.color = gameInstance.settings.colors[this.clicks - 1];
          this.bgcolor = cellColors[this.color];
          break;
        }
      }

      gameInstance.scheduleVerification().saveState();

      return this;
    });

    console.info("Initialized game:", this.id);
  }

  reset() {
    this.gameOver = true;
    this.fieldError = "";
    this.clicks = 0;
    this.activeCell = -1;

    this.resetTimer();
    this.field.clear(emoji.good, true);
    this.field.disableCells();

    this.displayTime.set("00:00");
    clearInterval(this._displayTimeInterval);

    return this;
  }

  setOption(key, value) {
    // color changer
    if (key === "colors") {
      this.field.cells.forEach((cell) => {
        cell.color = value[cell.clicks - 1];
        cell.bgcolor = cellColors[cell.color];
      });
    }

    return super.setOption(key, value);
  }

  startTimer(time) {
    const _timer = super.startTimer(time);

    const updateTimerText = () => {
      const t = this.getTimeElapsed();
      this.displayTime.set(formatTimer(t));
    };

    this._displayTimeInterval = setInterval(updateTimerText, 1000);
    updateTimerText(); // initial game state fix

    return _timer;
  }

  loadState() {
    this.reset();
    super.loadState();

    // restart timer
    if (!this.result && this.startTime) {
      this.field.enableCells();
      this.scheduleVerification().startTimer();
    }

    // apply fixups for when loading into a gameover
    if (this.result) {
      this.displayTime.set(formatTimer(this.stats.lastTime, true));
      delete this._gameOverScreenSeen;
    }

    return this;
  }

  generateSequence() {
    // initial field fill algorithm
    const seedIndex = this.getRandomInt(binarySeeds.length);
    const seedNumber = binarySeeds[seedIndex];
    //console.info("Seed: ", seedNumber);

    const seed = seedNumber.toString(2).padStart(this.field.size, "0").split("");

    const locks = new Set(),
      lockLength = this.getRandomInt(4) + 9;
    while (locks.size < lockLength) {
      locks.add(this.getRandomInt(this.field.size));
    }

    seed.forEach((e, i, a) => {
      if (locks.has(i)) {
        // visible cell: remember its state in this seed
        // 1=red, 2=blue
        a[i] = parseInt(e, 10) + 1;
      } else {
        // hidden cell: set it to nothing
        a[i] = 0;
      }
    });

    // edit this.field using new struct
    this.field.cells.forEach((cell, i) => {
      cell.clicks = seed[i];

      cell.visible = cell.clicks > 0;
      cell.locked = cell.visible;

      cell.color = this.settings.colors[cell.clicks - 1];
      cell.bgcolor = cellColors[cell.color];
    });

    return this;
  }

  startNewRun() {
    this.stats.games += 1;
    this.saveState();

    this.reset();
    this.generateSequence();

    // init some vars:
    this.gameOver = false;
    this.field.enableCells();
    this.startTimer();

    forceUpdateDOM();
    return this.saveState();
  }

  isFieldFillValid() {
    // Gameover checks:
    const cells = this.field.grid;
    const cellsX = this.field.inverseGrid;

    // each cell must be filled with an egg:
    if (this.field.cells.some((c) => c.clicks === 0)) {
      this.fieldError = ""; // game is not yet finished
      return false;
    }

    // no more than 2 same colors in a row or column
    for (let y = 0; y < this.field.height; y++) {
      // equal amount of both in a column
      const balance = cells[y].reduce((a, c) => a + 2 * c.clicks - 3, 0);
      if (balance !== 0) {
        this.fieldError = `Column <b>${1 + y}</b> must contain the same number of eggs of each color.`;
        return false;
      }

      for (let x = 0; x < this.field.width; x++) {
        // equal amount of both in a row
        const balance = cellsX[x].reduce((a, c) => a + 2 * c.clicks - 3, 0);
        if (balance !== 0) {
          this.fieldError = `Row <b>${1 + x}</b> must contain the same number of eggs of each color.`;
          return false;
        }
        // three in a column
        if (x >= 2 && cells[y][x].clicks === cells[y][x - 1].clicks && cells[y][x].clicks === cells[y][x - 2].clicks) {
          this.fieldError = `There are three eggs of same color next to each other in column <b>${1 + y}</b>`;
          return false;
        }
        // three in a row
        if (y >= 2 && cells[y][x].clicks === cells[y - 1][x].clicks && cells[y][x].clicks === cells[y - 2][x].clicks) {
          this.fieldError = `There are three eggs of same color next to each other in row <b>${1 + x}</b>`;
          return false;
        }
        // row similarity
        for (let nextX = x + 1; nextX < this.field.width; nextX++) {
          if (cellsX[nextX].every((c, i) => c.clicks === cellsX[x][i].clicks)) {
            this.fieldError = `Rows <b>${1 + x}</b> and <b>${1 + nextX}</b> are identical!`;
            return false;
          }
        }
      }
      // column similarity
      for (let nextY = y + 1; nextY < this.field.height; nextY++) {
        if (cells[nextY].every((c, i) => c.clicks === cells[y][i].clicks)) {
          this.fieldError = `Columns <b>${1 + y}</b> and <b>${1 + nextY}</b> are identical!`;
          return false;
        }
      }
    }

    this.fieldError = "";
    return true;
  }

  scheduleVerification() {
    this.fieldError = "";
    forceUpdateDOM();

    clearTimeout(this._endGameCheckTimeout);
    this._endGameCheckTimeout = setTimeout(() => {
      if (this.isFieldFillValid()) {
        this.endGame(true);
      } else if (this.fieldError) {
        forceUpdateDOM();
        if (this.settings.adviceFriendValidation) showAdviceFriend(this.fieldError);
      }
    }, 1000);

    return this;
  }

  endGame(result) {
    delete this._gameOverScreenSeen;
    super.endGame(result, true); // this class uses its own recorder

    const time = this.stopTimer();
    clearInterval(this._displayTimeInterval);

    // calculate stats
    const restoredTimeAvg = this.stats.avgTime * this.stats.wins;
    const restoredClicksAvg = this.stats.avgClicks * this.stats.wins;

    this.stats.wins += 1;
    this.stats.lastTime = time;
    this.stats.lastClicks = this.clicks;

    this.stats.avgTime = (restoredTimeAvg + time) / this.stats.wins;
    this.stats.avgClicks = (restoredClicksAvg + this.clicks) / this.stats.wins;

    this.stats.bestTime = Math.min(this.stats.bestTime, time) || time;
    this.stats.bestClicks = Math.min(this.stats.bestClicks, this.clicks) || this.clicks;
    this.saveState();

    // re-enable "start game" button
    this.displayTime.set(formatTimer(time, true));
    forceUpdateDOM();

    return this;
  }

  getShareableData() {
    let str = "🥚 " + this.name;

    if (this.stats.wins > 0) {
      if (this.result) {
        str += " #" + this.issue;
        str += `\n✔️ Solved in ${formatTimer(this.stats.lastTime, true)} (${this.stats.lastClicks} clicks)`;
      }
      str += `\nIn ${this.stats.wins} runs:`;
      str += `\n· Average: ⏱️${formatTimer(this.stats.avgTime, true)} 👆${this.stats.avgClicks.toFixed(2)}`;
      str += `\n· ⏱️ Best time: ${formatTimer(this.stats.bestTime, true)}`;
      str += `\n· 👆 Lowest clicks: ${this.stats.bestClicks}`;
    }

    str += "\n" + window.location.href;
    return str;
  }
}

let game = null;
export function getInstance() {
  if (!game) game = new Binary();
  return game;
}
