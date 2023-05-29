import { writable } from "svelte/store";
import { BaseGame } from "./baseClasses";
import { formatTimer, shuffle, sampleValue, isMobileClient } from "../utils/common";
import { cellColors, emoji } from "./consts";
import { forceUpdateDOM } from "../utils/state";

import Helper from "./help/Aimlab.svelte";
import TopBar from "./topbar/Aimlab.svelte";
import Stats from "./stats/Aimlab.svelte";
import GameOver from "./gameover/Aimlab.svelte";

class Aimlab extends BaseGame {
  constructor() {
    super();

    this.id = "aimlab";
    this.name = "Egdle Reflex";

    this.helperComponent = Helper;
    this.statsComponent = Stats;
    this.gameOverComponent = GameOver;
    this.topBarComponent = TopBar;

    this._storedProperties = ["settings", "stats"];

    this.settings = {};
    this.stats = {
      games: 0,
      runs: 0,
      lastTime: 0,
      bestTime: 0,
      avgTime: 0,
      lastClickTime: 0,
      bestClickTime: 0,
      avgClickTime: 0,
    };

    this.gameOver = true;
    this._gameOverScreenSeen = true; // prevents instant gameover popup

    this.displayTime = writable("00:00");
    clearInterval(this._displayTimeInterval);

    this.clickOrder = [];
    this.activeCell = -1;

    const gameInstance = this;
    this.field.setCellClickCallback(function () {
      this.clear();
      gameInstance.clicks += 1;
      gameInstance.doActivateNextCell();
    });

    this.loadState().reset();
    this.field.disableCells();
  }

  updateDisplayedTime(time) {
    this.displayTime.update((s) => {
      s.text = formatTimer(time);
      s.isLow = time < 10000;
      s.isDangerous = time < 3000;
      return s;
    });
  }

  reset() {
    this.gameOver = true;
    this.clicks = 0;
    this.activeCell = -1;

    this.resetTimer();
    this.field.clear("", true);

    return this;
  }

  startNewRun() {
    this.stats.games += 1;
    this.saveState();

    this.reset();

    this.displayTime.set("00:00");

    clearInterval(this._displayTimeInterval);
    this._displayTimeInterval = setInterval(() => {
      const t = this.getTimeElapsed();
      this.displayTime.set(formatTimer(t));
    }, 1000);

    const queue = [];
    for (let i = 0; i < this.field.size; i++) {
      queue.push(i);
    }

    this.clickOrder = shuffle(queue);

    this.gameOver = false;
    this.startTimer();

    return this.doActivateNextCell();
  }

  doActivateNextCell() {
    if (this.clickOrder.length > 0) {
      this.activeCell = this.clickOrder.pop();

      const cell = this.field.cells[this.activeCell];
      cell.visible = true;
      cell.enabled = true;
      cell.content = emoji.good;
      cell.bgcolor = sampleValue(cellColors);
    } else {
      const lastCell = this.field.cells[this.activeCell];
      lastCell.finisher = true;

      this.endGame(true);
    }

    forceUpdateDOM();
    return this;
  }

  endGame(result) {
    delete this._gameOverScreenSeen;
    super.endGame(result, true); // this class uses its own recorder

    const time = this.stopTimer();
    clearInterval(this._displayTimeInterval);

    // calculate stats
    const restoredTimeAvg = this.stats.avgTime * this.stats.runs;
    const restoredClickTimeAvg = this.stats.avgClickTime * this.stats.runs;

    const avgClickTime = time / this.clicks;

    this.stats.runs += 1;
    this.stats.lastTime = time;
    this.stats.lastClickTime = avgClickTime;

    this.stats.avgTime = (restoredTimeAvg + time) / this.stats.runs;
    this.stats.avgClickTime = (restoredClickTimeAvg + avgClickTime) / this.stats.runs;

    this.stats.bestTime = Math.min(this.stats.bestTime, time) || time;
    this.stats.bestClickTime = Math.min(this.stats.bestClickTime, avgClickTime) || avgClickTime;
    this.saveState();

    // re-enable "start game" button
    this.displayTime.set(formatTimer(time, true));
    forceUpdateDOM();
    setTimeout(() => {
      const lastCell = this.field.cells[this.activeCell];
      lastCell.finisher = false; // fixes confetti appearing upon reentering the game

      this.activeCell = -1;

      delete this.result;
      forceUpdateDOM();
    }, 1200); // confetti duration

    return this;
  }

  getShareableData() {
    let str = "🥚 " + this.name;

    if (isMobileClient()) {
      str += " 📱";
    }

    if (this.stats.runs > 0) {
      str += `\n🏁 Last run: ${formatTimer(this.stats.lastTime, true)} (~${Math.round(
        this.stats.lastClickTime
      )} ms)`;
      if (Math.round(this.stats.lastClickTime) === Math.round(this.stats.bestClickTime))
        str += "🎖️";
      str += `\nAverage in ${this.stats.runs} runs:`;
      str += `\n⏱️ ${formatTimer(this.stats.avgTime, true)}`;
      str += `\n👆 ${Math.round(this.stats.avgClickTime)}ms per click`;
      str += `\nPersonal best: ⏱️ ${formatTimer(this.stats.bestTime, true)}`;
    }

    str += "\n" + window.location.href;
    return str;
  }
}

let game = null;
export function getInstance() {
  if (!game) game = new Aimlab();
  return game;
}
