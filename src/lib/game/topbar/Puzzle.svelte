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
    $currentGame.disabledSettings.add("gridSizes");
    countdown = true;
    forceUpdateDOM();
  }

  function doStop() {
    $currentGame.reset();
    forceUpdateDOM();
  }

  function askForStop() {
    showConfirmAdviceFriend("No stats will be recorded. Stop this game?", "Yes, please", doStop);
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
    <span class="padder mx-1" />
    <span use:tippy={{ content: "Swap count" }}>
      <MaterialIcon size="24px">ads_click</MaterialIcon>
    </span>
    <b class="text-success">{$currentGame.clicks}</b>
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
        <button class="btn btn-warning" on:click={askForStop}>
          <MaterialIcon>front_hand</MaterialIcon>
          End the run
        </button>
      {/if}
    {/if}
  </div>
  <div class="section right">
    <span
      class="btn btn-secondary"
      use:tippy={{
        trigger: "click",
        content: `<img src="example/puzzle-pic.png" alt="Puzzle" width="250" height="250">`,
      }}
    >
      <MaterialIcon>try</MaterialIcon>
      Peek image
    </span>
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

  .mid,
  .right {
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
    .mid,
    .right {
      gap: 2px;
    }
  }
</style>
