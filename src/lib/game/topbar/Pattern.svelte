<script>
  import currentGame from "$lib/utils/state";
  import MaterialIcon from "../../elements/MaterialIcon.svelte";
  import { showConfirmAdviceFriend } from "../../utils/adviceFriend";
  import { emoji } from "../consts";
  import { STARTING_LIVES } from "../pattern";

  function startNewRun() {
    $currentGame.startNewRun();
  }

  function askForRestart() {
    showConfirmAdviceFriend("Do you really want to reset the run?", "Yes, I do", startNewRun);
  }
</script>

<div class="bar">
  <div class="section left">
    Level
    <b class="text-success">{$currentGame.level}</b>
  </div>
  <div class="section mid">
    {#if !$currentGame.result}
      {#if $currentGame.gameOver}
        <button class="btn btn-success" on:click={startNewRun}>
          <MaterialIcon>flag</MaterialIcon>
          Start game
        </button>
      {:else}
        <button class="btn btn-warning" on:click={askForRestart}>
          <MaterialIcon>restart_alt</MaterialIcon>
          Start over
        </button>
      {/if}
    {/if}
  </div>
  <div class="section right">
    {emoji.unlife.repeat(STARTING_LIVES - $currentGame.lives)}{emoji.life.repeat($currentGame.lives)}
  </div>
</div>

<style>
  .bar {
    padding: 8px 0;
    display: flex;
    flex-flow: row wrap;
  }
  .section {
    width: 33.3%;
    flex: 1 0 auto;
    text-align: center;
    font-size: 24px;
  }
  .btn {
    padding: 2px 8px;
    font-size: 16px;
    vertical-align: bottom;
  }

  .mid {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
  }

  .right {
    color: rgba(0, 255, 0, 0.8);
    text-shadow: 0px 0px 12px rgb(var(--bs-body-color-rgb), 0.4);
    font-size: 150%;
    letter-spacing: 4px;
  }

  @media all and (max-width: 400px) {
    .bar {
      flex-flow: row wrap;
    }
    .section {
      margin: 8px 0;
      font-size: 12px;
    }
    .btn {
      font-size: 10px;
    }
  }
</style>
