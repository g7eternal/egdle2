<script>
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import game from "../utils/state";
  import GameOverInfo from "./GameOverInfo.svelte";
  import FieldCell from "../elements/FieldCell.svelte";

  let gameOverModalElement, gameOverModal, gameOverModalTimer;

  $: if (!$game._gameOverScreenSeen && $game.gameOver) {
    $game._gameOverScreenSeen = true;
    gameOverModalTimer = setTimeout(() => gameOverModal.show(), 800);
  }

  onMount(() => {
    gameOverModal = new bootstrap.Modal(gameOverModalElement, {});

    return () => {
      clearTimeout(gameOverModalTimer);
      gameOverModal.dispose();
    };
  });
</script>

<div in:fly={{ duration: 200, y: 20 }}>
  <svelte:component this={$game.topBarComponent} />
  <div class="field" style:grid-template-columns={`repeat(${$game.field.width}, min-content)`}>
    {#each $game.field.cells as cell, cellIndex}
      <FieldCell {cell} focused={$game.activeCell === cellIndex} />
    {/each}
  </div>
</div>

<!-- gameover modal -->
<div
  class="modal fade"
  id="mdlGameOver"
  tabindex="-1"
  aria-labelledby="mdlGameOverTitle"
  aria-hidden="true"
  bind:this={gameOverModalElement}
>
  <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
    <GameOverInfo />
  </div>
</div>

<style>
  .field {
    width: 100%;
    padding: 8px;
    display: grid;
    grid-template-columns: repeat(6, min-content);
    grid-gap: 8px;
    justify-content: center;
    font-size: 1.5em;
    font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol";
  }

  @media all and (max-width: 400px) {
    .field {
      gap: 2px;
    }
  }
</style>
