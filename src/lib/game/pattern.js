import { BaseGame } from "./baseClasses";
import { recordSeenGame } from "../utils/settings";
import { sample, sampleSize } from "../utils/common";
import { forceUpdateDOM } from "../utils/state";
import { cellColors, emoji } from "./consts";

import TopBar from "./topbar/Pattern.svelte";
import Helper from "./help/Pattern.svelte";
import Stats from "./stats/Pattern.svelte";

export const STARTING_EGGS = 4,
  STARTING_LIVES = 3,
  DELAY_BETWEEN_ACTIONS = 1300;

class Pattern extends BaseGame {
  constructor() {
    super();

    this.id = "pattern";
    this.name = "Egdle Pattern";

    this.topBarComponent = TopBar;
    this.helperComponent = Helper;
    this.statsComponent = Stats;

    this.settings = {};
    this._storedProperties = ["settings", "stats"];

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

    return this;
  }

  startNewRun() {
    this.stats.lastVisit = new Date(); // prevents About window from popping up
    return this.reset().startLevel();
  }

  startLevel(isLevelUp = true) {
    this.gameOver = false;
    this.clicks = 0;

    // startLevel(false) can be called when user fails the round
    if (isLevelUp) {
      this.level += 1;
      this.eggs += 1;
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
      this.field.hideCells().enableCells();
      forceUpdateDOM(); // renders egg fade out
    }, this.hideDelay);

    forceUpdateDOM(); // renders egg fade in - initial pattern demonstration
    return this;
  }

  scheduleHideAndRender() {
    // aux method: hides all cells and renders DOM updates
    return setTimeout(() => {
      this.field.hideCells();
      forceUpdateDOM();
    }, DELAY_BETWEEN_ACTIONS);
  }

  endGame(result) {
    delete this._gameOverScreenSeen;
    super.endGame(result);
    forceUpdateDOM();

    // re-enable "start game" button
    setTimeout(() => {
      delete this.result;
      forceUpdateDOM();
    }, 800);

    return this;
  }
}

let game = null;
export function getInstance() {
  if (!game) game = new Pattern();
  recordSeenGame(game.id);
  return game;
}
