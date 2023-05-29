import { BaseGame } from "./baseClasses";
import { cellColors, emoji, today } from "./consts";
import { recordSeenGame } from "../utils/settings";
import { sample, sfc32 } from "../utils/common";
import {
  migrateClassicField,
  migrateClassicSettings,
  migrateClassicStats,
} from "../utils/migrateV1";

import Helper from "./help/Classic.svelte";
import Stats from "./stats/Classic.svelte";
import GameOver from "./gameover/Classic.svelte";
import TopBar from "./topbar/Classic.svelte";

class Egdle extends BaseGame {
  constructor() {
    super();
    this.id = "egdle";
    this.name = "Egdle Classic";
    this.kind = "daily";

    this.helperComponent = Helper;
    this.statsComponent = Stats;
    this.gameOverComponent = GameOver;
    this.topBarComponent = TopBar;

    this.settings = {
      hardMode: false,
    };

    // calculate win/lose conditions:
    this.initRNG(0);
    this.winnerIndex = this.getRandomInt(36);
    do {
      this.loserIndex = this.getRandomInt(36);
    } while (this.winnerIndex === this.loserIndex);

    const winnerCell = this.field.cells[this.winnerIndex];
    winnerCell.content = emoji.good;
    winnerCell.winner = true;

    // enrich object by loading stored data
    this.loadState();

    // init all fields' callback
    const gameInstance = this;
    this.field.setCellClickCallback(function () {
      gameInstance.disabledSettings.add("hardMode");
      gameInstance.clicks += 1;

      this.bgcolor = cellColors.red;
      if (this.winner) {
        this.bgcolor = cellColors.yellow;
        gameInstance.endGame(true);
      } else if (this.loser) {
        this.bgcolor = cellColors.purple;
        gameInstance.endGame(false);
      } else {
        if (gameInstance.settings.hardMode) {
          // hide field after a timeout
          this.hideAfter(1500);
        }
      }

      gameInstance.saveState();

      return this;
    });

    console.info("Initialized game:", this.id);
  }

  setOption(key, value) {
    super.setOption(key, value);

    switch (key) {
      case "hardMode": {
        // update loser cell state
        const loserCell = this.field.cells[this.loserIndex];
        if (this.settings.hardMode) {
          loserCell.content = emoji.death;
          loserCell.loser = true;
        } else {
          loserCell.content = sample(emoji.food);
          loserCell.loser = false;
        }
      }
    }

    return this;
  }

  initRNG() {
    if (this.issue < 369) {
      // this function follows old egdle prng algorithm
      this._prngFactor = 1e16;
      this._prng = sfc32(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getDay() + 1
      );
    } else {
      console.log("Egdle Classic: using new seeded RNG algorithm");
      super.initRNG();
    }
    return this;
  }

  endGame(result, skipRecording) {
    super.endGame(result, skipRecording);

    if (this.settings.hardMode) {
      this.field.cells.forEach((cell) => {
        if (cell.clicks > 0) {
          cell.cancelTimers();
          cell.visible = true;
        }
      });
    }

    return this;
  }

  getShareableData() {
    let str = this.settings.hardMode ? emoji.hardMode : emoji.easyMode;
    str += " " + this.name;

    if (this.gameOver) {
      str += " #" + this.issue + " - ";
      str += this.result ? emoji.good : emoji.death;
      str += " in " + this.stats.lastClicks;
    }

    if (this.stats.games > 0) {
      const winrate = (100 * this.stats.wins) / Math.max(this.stats.games, 1);

      str += `\n🥚 Eggs: ${this.stats.wins} (${winrate.toPrecision(4)}%)`;
      str += ` / Streak: ${this.stats.streak}`;

      str += `\n🧮 Avg: ${this.stats.avgClicks.toFixed(2)} `;
      str += `Min: ${this.stats.minClicks} `;
      str += `Max: ${this.stats.maxClicks} `;
    }

    str += "\n" + window.location.origin + window.location.pathname;

    return str;
  }

  loadState() {
    super.loadState();

    // first visit? attempt to migrate old data from v1
    if (this.stats.lastVisit.getTime() === 0) {
      const oldData = migrateClassicSettings();
      if (oldData) {
        this.settings.hardMode = oldData.hardMode;
      }

      const oldStats = migrateClassicStats();
      if (oldStats) {
        Object.keys(oldStats).forEach((key) => {
          this.stats[key] = oldStats[key];
        });
        // migrate field too:
        const oldField = migrateClassicField();

        if (oldField && this.stats.lastIssue === this.issue) {
          this.field.cells.forEach((cell, idx) => {
            for (let key in oldField[idx]) {
              cell[key] = oldField[idx][key];
            }
          });

          // fix: if total clicks > field clicks, add the difference to random field
          this.clicks = this.field.getTotalClicks();
          if (this.stats.lastClicks > this.clicks) {
            const randomCell = this.field.cells.find((c) => c.clicks > 0);
            if (randomCell) randomCell.clicks += this.stats.lastClicks - this.clicks;
          }

          // fix: detect if game over or not
          const winnerCell = this.field.cells[this.winnerIndex];
          winnerCell.winner = true;
          const loserCell = this.field.cells[this.loserIndex];
          if (this.settings.hardMode) loserCell.loser = true;

          const isLoss = this.settings.hardMode && loserCell.visible;
          const isWin = winnerCell.visible;
          if (isLoss || isWin) this.endGame(isWin, true);
        }
      }
    }

    // apply fixups:
    if (this.settings.hardMode) this.setOption("hardMode", true); // resets loser cell state
    if (this.field.cells.some((cell) => cell.clicks > 0)) {
      this.disabledSettings.add("hardMode");
    }
    if (!this.gameOver && this.settings.hardMode) {
      this.field.cells.forEach((cell) => {
        cell.visible = false;
        cell.enabled = true;
      });
    }

    return this;
  }
  saveState() {
    return super.saveState();
  }
}

let game = null;
export function getInstance() {
  if (!game) game = new Egdle();
  recordSeenGame(game.id);
  return game;
}
