import { BaseField, BaseGame } from "./baseClasses";
import { recordSeenGame } from "../utils/settings";
import { sample, sampleSize } from "../utils/common";
import { forceUpdateDOM } from "../utils/state";
import { cellColors, emoji } from "./consts";

import TopBar from "./topbar/Pattern.svelte";
import Helper from "./help/Pattern.svelte";
import Stats from "./stats/Pattern.svelte";
import GameOver from "./gameover/Pattern.svelte";

export const STARTING_EGGS = 4,
  STARTING_LIVES = 3,
  DELAY_BETWEEN_ACTIONS = 1300;

/* different levelup strategies */
function stageBigger(inc = 1) {
  this.hideDelay = DELAY_BETWEEN_ACTIONS;
  this.field.setSize(this.field.width + inc, this.field.height + inc);

  forceUpdateDOM(); // because next action is after setTimeout
  return new Promise((resolve) => {
    setTimeout(resolve, DELAY_BETWEEN_ACTIONS);
  });
}
function stageMoreEggs(inc = 1) {
  this.eggs += inc;
  return Promise.resolve();
}
function stageFaster(dec = 69) {
  this.hideDelay -= dec;
  return Promise.resolve();
}

const levelUpStrategies = [
  { levels: [1, 12], strategy: stageMoreEggs },
  { levels: [15, 20], strategy: stageFaster },
  { levels: [21, 22], strategy: stageMoreEggs },
  { levels: [25, 25], strategy: stageBigger },
  { levels: [26, 31], strategy: stageMoreEggs },
  { levels: [35, 40], strategy: stageFaster },
  { levels: [50, 50], strategy: stageBigger },
  { levels: [51, 60], strategy: stageMoreEggs },
  { levels: [65, 69], strategy: stageFaster },
  { levels: [100, 110], strategy: stageFaster }, // gachiPls DETH
];

class Pattern extends BaseGame {
  constructor() {
    super();

    this.id = "pattern";
    this.name = "Egdle Pattern";

    this.topBarComponent = TopBar;
    this.helperComponent = Helper;
    this.statsComponent = Stats;
    this.gameOverComponent = GameOver;

    this._storedProperties = ["settings", "stats"];
    this.settings = {};
    this.stats = {
      games: 0,
      runs: 0,
      avgRound: 0,
      lastRound: 0,
      bestRound: 0,
    };

    this.gameOver = true;
    this._gameOverScreenSeen = true; // prevents instant gameover popup

    this.loadState().reset();
    this.field.disableCells();
  }

  reset() {
    this.gameOver = true;

    this.level = 0;
    this.clicks = 0;
    this.hideDelay = DELAY_BETWEEN_ACTIONS;
    this.lives = STARTING_LIVES;
    this.eggs = STARTING_EGGS - 1;

    this.field = new BaseField();

    return this;
  }

  startNewRun() {
    this.stats.games += 1;
    this.saveState();

    this.reset().startLevel();
    return this;
  }

  async startLevel(isLevelUp = true) {
    this.gameOver = false;
    this.clicks = 0;

    // startLevel(false) can be called when user fails the round
    if (isLevelUp) {
      this.level += 1;

      const strategy = levelUpStrategies.find(
        (s) => s.levels[0] <= this.level && s.levels[1] >= this.level
      );
      if (strategy) await strategy.strategy.apply(this);
    }

    // create new pattern
    const freeIndices = [];
    for (let i = 0; i < this.field.size; i++) {
      freeIndices.push(i);
    }

    const gameInstance = this;
    this.field.reset().disableCells();
    this.field.setCellClickCallback(function () {
      if (this.winner) {
        gameInstance.clicks += 1;
        if (gameInstance.clicks >= gameInstance.eggs) {
          gameInstance.field.disableCells();
          gameInstance.scheduleHideAndRender();
          setTimeout(() => gameInstance.startLevel(), DELAY_BETWEEN_ACTIONS * 2);
        }
      } else {
        // a mistake was made
        gameInstance.lives -= 1;

        gameInstance.field.cells.forEach((cell) => {
          cell.enabled = false;
          if (cell.winner && !cell.visible) {
            cell.bgcolor = "";
            cell.visible = true;
          }
        });

        if (gameInstance.lives < 1) {
          // end game, show stats
          gameInstance.result = true; // blocks restart button
          setTimeout(() => gameInstance.endGame(true), DELAY_BETWEEN_ACTIONS);
        } else {
          // restart level
          gameInstance.scheduleHideAndRender();
          setTimeout(() => gameInstance.startLevel(false), DELAY_BETWEEN_ACTIONS * 2);
        }
      }

      return this;
    });

    const patternColor = sample(Object.values(cellColors));

    const pattern = sampleSize(freeIndices, this.eggs);
    pattern.forEach((eggIndex) => {
      const cell = this.field.cells[eggIndex];
      cell.content = emoji.good;
      cell.bgcolor = patternColor;
      cell.winner = true;
      cell.visible = true;
    });

    this._hideDelayTimer = setTimeout(() => {
      this.scheduleHideAndRender(true);
    }, this.hideDelay);

    forceUpdateDOM(); // renders egg fade in - initial pattern demonstration
    return this;
  }

  scheduleHideAndRender(doEnableCells = false) {
    // aux method: hides all cells and renders DOM updates
    return setTimeout(() => {
      this.field.hideCells();
      if (doEnableCells) this.field.enableCells();
      forceUpdateDOM();
    }, DELAY_BETWEEN_ACTIONS);
  }

  endGame(result) {
    delete this._gameOverScreenSeen;
    super.endGame(result, true); // this class uses its own recorder

    const restoredAvg = this.stats.runs * this.stats.avgRound;

    this.stats.runs += 1;
    this.stats.avgRound = (restoredAvg + this.level) / this.stats.runs;
    this.stats.lastRound = this.level;
    this.stats.bestRound = Math.max(this.stats.bestRound, this.stats.lastRound);
    this.saveState();

    // re-enable "start game" button
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
      const runWord = this.stats.runs % 10 === 1 && this.stats.runs % 100 !== 11 ? "run" : "runs";

      str += "\n🪦 Last run: lvl " + this.stats.lastRound;
      if (this.stats.lastRound === this.stats.bestRound) {
        str += " 🥇";
      }
      str += `\n💾 In ${this.stats.runs} ${runWord} - `;
      str += `best: ${this.stats.bestRound} avg: ${this.stats.avgRound.toFixed(2)}`;
    }

    str += "\n" + window.location.href;
    return str;
  }
}

let game = null;
export function getInstance() {
  if (!game) game = new Pattern();
  recordSeenGame(game.id);
  return game;
}
