<script>
  import currentGame from "$lib/utils/state";
  import tippy from "$lib/utils/tippy";
  import { forceUpdateDOM } from "$lib/utils/state";
  import { showConfirmAdviceFriend } from "$lib/utils/adviceFriend";
  import MaterialIcon from "$lib/elements/MaterialIcon.svelte";
  import GameStartCountdown from "$lib/elements/GameStartCountdown.svelte";

  // cannot do double subscription, have to resolve this reference:
  const displayTimerStore = $currentGame.displayTime;

  let countdown = false;

  function startNewRun() {
    $currentGame?.startNewRun();
  }

  function doStart() {
    countdown = true;
  }

  function doRestart() {
    $currentGame.reset();
    forceUpdateDOM();
    doStart();
  }

  function askForRestart() {
    showConfirmAdviceFriend("Do you really want to reset the run?", "Yes, I do", doRestart);
  }
</script>

<div class="bar">
  <div class="section left">
    <span use:tippy={{ content: "Time elapsed" }}>
      <MaterialIcon size="24px">timer</MaterialIcon>
    </span>
    <b class="timer text-success">
      {$displayTimerStore}
    </b>
  </div>
  <div class="section mid">
    {#if !$currentGame.result}
      {#if countdown}
        <GameStartCountdown bind:isVisible={countdown} runFunction={startNewRun} />
      {:else if $currentGame.gameOver}
        <button class="btn btn-success" on:click={doStart}>
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
    <span use:tippy={{ content: "Score" }}>
      <MaterialIcon size="24px">ads_click</MaterialIcon>
    </span>
    <b class="text-success">{$currentGame.clicks}</b>
    /
    <b>{$currentGame.field.size}</b>
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
    font-size: 20px;
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
    gap: 8px;
  }

  .timer {
    color: inherit;
    transition: color 1s ease-out;
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
    .mid {
      gap: 2px;
    }
  }
</style>
