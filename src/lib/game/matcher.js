import { BaseGame } from "./baseClasses";
import { recordSeenGame } from "../utils/settings";
import { emoji, cellColors } from "./consts";

import Helper from "./help/Matcher.svelte";
import Stats from "./stats/Matcher.svelte";
import GameOver from "./gameover/Matcher.svelte";
import TopBar from "./topbar/Matcher.svelte";
import { showAdviceFriend } from "../utils/adviceFriend";

class Matcher extends BaseGame {
  constructor() {
    super();
    this.id = "matcher";
    this.name = "Egdle Pairs";
    this.kind = "daily";

    this.refreshIssueNumber("2023-03-27T00:00:00");

    this.helperComponent = Helper;
    this.statsComponent = Stats;
    this.gameOverComponent = GameOver;
    this.topBarComponent = TopBar;

    this.colors = ["red", "yellow", "green", "cyan", "blue", "gray"];
    this.emotes = new Array(3).fill(emoji.good);

    this.settings = {
      visualAidMode: false,
    };

    this._storedProperties.push("activeCell");
    this.activeCell = -1;

    // calculate win/lose conditions:
    this.initRNG(1);
    const freeIndices = [];
    for (let i = 0; i < this.field.size; i++) {
      freeIndices.push(i);
    }
    for (let i = 0; i < Math.floor(this.field.size / 2); i++) {
      const colorIndex = Math.floor(i % this.colors.length);
      const emoteIndex = Math.floor(i / this.colors.length);

      const cellIndices = [];
      while (cellIndices.length < 2) {
        const random = this.getRandomInt(freeIndices.length);
        cellIndices.push(freeIndices.splice(random, 1).pop());
      }

      cellIndices.forEach((index) => {
        const cell = this.field.cells[index];
        cell.color = this.colors[colorIndex];
        cell.bgcolor = cellColors[cell.color];
        cell.content = this.emotes[emoteIndex];
      });
    }

    // enrich object by loading stored data
    this.loadState();

    // init all fields' callback
    const gameInstance = this;
    this.field.cells.forEach((cell, i) => {
      cell.clickCallback = function () {
        gameInstance.clicks += 1;

        if (gameInstance.activeCell >= 0) {
          // perform a match check with active cell
          const activeCell = gameInstance.field.cells[gameInstance.activeCell];

          if (activeCell.color === this.color && activeCell.content === this.content) {
            activeCell.winner = true;
            this.winner = true;
            if (gameInstance.field.cells.every((c) => c.winner)) {
              this.finisher = true; // shows confetti
              gameInstance.endGame(true);
              setTimeout(() => (this.finisher = false), 1500); // removes trailing confetti
            }
          } else {
            activeCell.hideAfter(1000);
            this.hideAfter(1000);
          }

          // forsenLaughingAtYou
          if (!gameInstance.gameOvre && gameInstance.clicks === 100) {
            showAdviceFriend("U nab? 💢");
          }

          gameInstance.activeCell = -1;
        } else {
          // mark cell as active
          gameInstance.activeCell = i;
        }

        gameInstance.saveState();
        return this;
      };
    });

    console.info("Initialized game:", this.id);
  }

  getShareableData() {
    let str = this.settings.hardMode ? emoji.hardMode : emoji.easyMode;
    str += " " + this.name;

    if (this.gameOver) {
      str += " #" + this.issue;
      str += `\n🥚 ${this.stats.lastClicks} clicks`;
    }

    //str += `\n Streak: ${this.stats.streak}`;

    if (this.stats.games > 0) {
      str += `\n🧮 Avg: ${this.stats.avgClicks.toFixed(2)} `;
      str += `Min: ${this.stats.minClicks} `;
      str += `Max: ${this.stats.maxClicks} `;
    }

    str += "\n" + window.location.origin + window.location.pathname;

    return str;
  }

  loadState() {
    super.loadState();

    // apply fixups
    this.clicks = this.field.getTotalClicks();
    this.stats.lastClicks = this.clicks;

    this.field.cells.forEach((cell, index) => {
      if (cell.winner || index === this.activeCell) {
        cell.bgcolor = cellColors[cell.color];
        cell.visible = true;
        cell.enabled = false;
      } else {
        cell.visible = false;
        cell.enabled = true;
      }
    });

    return this;
  }
  saveState() {
    return super.saveState();
  }
}

let game = null;
export function getInstance() {
  if (!game) game = new Matcher();
  recordSeenGame(game.id);
  return game;
}
