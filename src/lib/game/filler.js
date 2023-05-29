import { writable } from "svelte/store";
import { BaseGame } from "./baseClasses";
import { recordSeenGame } from "../utils/settings";
import { sample, formatTimer } from "../utils/common";
import { cellColors, emoji } from "./consts";
import { forceUpdateDOM } from "../utils/state";

import Helper from "./help/Filler.svelte";
import TopBar from "./topbar/Filler.svelte";
import Stats from "./stats/Filler.svelte";
import GameOver from "./gameover/Filler.svelte";

class Filler extends BaseGame {
  constructor() {
    super();

    this.id = "filler";
    this.name = "Egdle Filler";

    this.helperComponent = Helper;
    this.statsComponent = Stats;
    this.gameOverComponent = GameOver;
    this.topBarComponent = TopBar;

    this.colors = ["red", "yellow", "green", "cyan", "purple", "gray"];

    this._storedProperties = ["settings", "stats"];

    this.settings = {
      visualAidMode: false,
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

    this.gameOver = true;
    this._gameOverScreenSeen = true; // prevents instant gameover popup

    this.displayTime = writable("00:00");
    clearInterval(this._displayTimeInterval);

    this.loadState().reset(true);
  }

  reset(firstTime = false) {
    this.gameOver = true;

    this.clicks = 0;

    this.resetTimer();

    this.field.cells.forEach((cell) => {
      cell.clear("", true);
      if (!firstTime) {
        cell.color = sample(this.colors);
        cell.bgcolor = cellColors[cell.color];
      }
      cell.visible = true;
      cell.enabled = false;
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

    /* // random starting corner turned out to be not a good idea
    this.startingCell = sample([
      0,
      this.field.size - 1,
      this.field.size - this.field.width,
      this.field.width - 1,
    ]);
    */
    this.startingCell = 0;
    this.activeColor = sample(this.colors);

    const starter = this.field.cells[this.startingCell];
    starter.winner = true;
    starter.content = emoji.good;
    starter.bgcolor = cellColors[this.activeColor];

    this.doColorFill(this.activeColor);
    this.clicks -= 1; // fixes extra click count

    forceUpdateDOM();
    return this;
  }

  doColorFill(newColor) {
    this.activeCell = -1; // removes highlight from starting cell
    this.activeColor = newColor;
    this.clicks += 1;

    const color = cellColors[newColor];

    const queue = this.field.cells.reduce((a, c, i) => {
      if (c.winner) {
        a.push(i);
        c.bgcolor = color;
        c.color = newColor;
      }
      return a;
    }, new Array());

    const visitedCells = new Set();

    while (queue.length > 0) {
      const currIndex = queue.shift();
      const cell = this.field.cells[currIndex];

      if (visitedCells.has(currIndex)) continue;
      visitedCells.add(currIndex);

      if (cell.bgcolor !== color) continue;

      const x = currIndex % this.field.width;
      const y = Math.floor(currIndex / this.field.width);

      // check left
      if (x > 0) {
        const leftIndex = currIndex - 1;
        const leftCell = this.field.cells[leftIndex];
        if (leftCell.bgcolor === color && !queue.includes(leftIndex)) {
          queue.push(leftIndex);
        }
      }

      // check right
      if (x < this.field.width - 1) {
        const rightIndex = currIndex + 1;
        const rightCell = this.field.cells[rightIndex];
        if (rightCell.bgcolor === color && !queue.includes(rightIndex)) {
          queue.push(rightIndex);
        }
      }

      // check up
      if (y > 0) {
        const upIndex = currIndex - this.field.width;
        const upCell = this.field.cells[upIndex];
        if (upCell.bgcolor === color && !queue.includes(upIndex)) {
          queue.push(upIndex);
        }
      }

      // check down
      if (y < this.field.height - 1) {
        const downIndex = currIndex + this.field.width;
        const downCell = this.field.cells[downIndex];
        if (downCell.bgcolor === color && !queue.includes(downIndex)) {
          queue.push(downIndex);
        }
      }

      // mark this cell as "owned"
      cell.winner = true;
      cell.content = emoji.good;
    }

    // check win condition
    if (this.field.cells.every((c) => c.winner)) {
      this.endGame(true);
    }

    forceUpdateDOM();
  }

  endGame(result) {
    delete this._gameOverScreenSeen;
    super.endGame(result, true); // this class uses its own recorder

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
    this.stats.bestClicks =
      Math.min(this.stats.bestClicks, this.stats.lastClicks) || this.stats.lastClicks;
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
    let str = "🥚 " + this.name;

    if (this.stats.runs > 0) {
      str += `\n🏁 Last run: ${formatTimer(this.stats.lastTime, true)} (${this.stats.lastClicks})`;
      str += `\nAverage in ${this.stats.runs} runs:`;
      str += `\n⏱️ ~${formatTimer(this.stats.lastTime, true)}`;
      str += `\n👆 ~${this.stats.avgClicks.toFixed(2)} clicks`;
      str += `\nPersonal best:`;
      str += `\n⏱️🎖️ ${formatTimer(this.stats.bestTime, true)}`;
      str += `\n👆🎖️ ${this.stats.bestClicks} clicks`;
    }

    str += "\n" + window.location.href;
    return str;
  }
}

let game = null;
export function getInstance() {
  if (!game) game = new Filler();
  recordSeenGame(game.id);
  return game;
}
