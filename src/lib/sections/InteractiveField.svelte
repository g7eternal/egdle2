<script>
  import { fly } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { onMount } from "svelte";
  import game from "../utils/state";
  import GameOverInfo from "./GameOverInfo.svelte";
  import FieldCell from "../elements/FieldCell.svelte";

  let gameOverModalElement, gameOverModal, gameOverModalTimer;

  const cellAnimTiming = {
    in: 0,
    out: 150,
  };

  $: if (!$game._gameOverScreenSeen && $game.gameOver) {
    $game._gameOverScreenSeen = true;
    gameOverModalTimer = setTimeout(() => gameOverModal.show(), 300);
  }

  onMount(() => {
    cellAnimTiming.in = 200; // enables cell animation for when the field is rendered
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
    {#each $game.field.cells as cell (cell)}
      <div
        class="cell-container"
        in:fly={{ duration: cellAnimTiming.in, y: -150 }}
        animate:flip={{ delay: 0, duration: 300 }}
      >
        <FieldCell
          {cell}
          allowFlicks={$game.settings.allowFlicks}
          focused={$game.activeCell === cell}
          isPuzzlePiece={$game.id === "puzzle" && !$game.settings.numericMode}
        />
      </div>
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
  }

  @media all and (max-width: 400px) {
    .field {
      gap: 2px;
    }
  }
</style>
