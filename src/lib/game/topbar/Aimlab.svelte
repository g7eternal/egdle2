<script>
  import { scale } from "svelte/transition";
  import currentGame from "$lib/utils/state";
  import tippy from "$lib/utils/tippy";
  import { showConfirmAdviceFriend } from "$lib/utils/adviceFriend";
  import MaterialIcon from "$lib/elements/MaterialIcon.svelte";
  import { forceUpdateDOM } from "../../utils/state";

  // cannot do double subscription, have to resolve this reference:
  const displayTimerStore = $currentGame.displayTime;

  let countdown = -1;
  function startNewRun() {
    countdown = 3;
    const countTimer = setInterval(() => {
      countdown -= 1;
      if (countdown === 0) $currentGame.startNewRun();
      if (countdown < 0) clearInterval(countTimer);
    }, 1000);
  }

  function doRestart() {
    $currentGame.reset();
    forceUpdateDOM();
    startNewRun();
  }

  function askForRestart() {
    showConfirmAdviceFriend("Do you really want to reset the run?", "Yes, I do", doRestart);
  }
</script>

<div class="bar">
  <div class="section left">
    <span use:tippy={{ content: "Time remaining" }}>
      <MaterialIcon size="24px">timer</MaterialIcon>
    </span>
    <b class="timer text-success">
      {$displayTimerStore}
    </b>
  </div>
  <div class="section mid">
    {#if !$currentGame.result}
      {#if countdown >= 0}
        {#key countdown}
          <div class="countdown" in:scale>{countdown || "GO!"}</div>
        {/key}
      {:else if $currentGame.gameOver}
        <button class="btn btn-success" on:click={startNewRun}>
          <MaterialIcon>flag</MaterialIcon>
          Start game
        </button>
      {:else}
        <button class="btn btn-outline-warning" on:click={askForRestart}>
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
  .countdown {
    transform: scale(1.3);
    font-weight: 500;
    color: var(--bs-primary-text);
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
