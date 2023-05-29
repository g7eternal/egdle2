<script>
  import { tweened } from "svelte/motion";
  import currentGame from "$lib/utils/state";
  import tippy from "$lib/utils/tippy";
  import MaterialIcon from "$lib/elements/MaterialIcon.svelte";
  import { showConfirmAdviceFriend } from "$lib/utils/adviceFriend";
  import { forceUpdateDOM } from "$lib/utils/state";

  const timer = $currentGame.time;
  let progress = 100;
  $: progress = Math.max(0, (100 * $timer) / $currentGame.maxTime);

  const gameScore = tweened($currentGame.score, {
    duration: 200,
  });
  $: gameScore.set($currentGame.score);

  function startNewRun() {
    $currentGame?.startNewRun();
  }

  let isRestartHappening = false;
  function doRestart() {
    isRestartHappening = true;

    $currentGame.reset();
    forceUpdateDOM();

    setTimeout(() => {
      isRestartHappening = false;
      startNewRun();
    }, 500);
  }
  function askForRestart() {
    showConfirmAdviceFriend("Do you really want to restart?", "Yes, I do", doRestart);
  }
</script>

<div class="timer-bar">
  <div class="progress" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
    <div
      class="progress-bar bg-success"
      class:progress-bar-striped={!$currentGame.gameOver}
      style:width={progress + "%"}
      class:bg-warning={progress < 35}
      class:bg-danger={progress < 15}
    />
  </div>
</div>

<div class="bar">
  <div class="section left">
    💎 {$currentGame.name}
  </div>
  <div class="section mid">
    {#if !$currentGame.result}
      {#if $currentGame.gameOver}
        <button class="btn btn-success" on:click={startNewRun}>
          <MaterialIcon>flag</MaterialIcon>
          Start game
        </button>
      {:else if !isRestartHappening}
        <button class="btn btn-outline-warning" on:click={askForRestart}>
          <MaterialIcon>restart_alt</MaterialIcon>
          Start over
        </button>
      {/if}
    {/if}
  </div>
  <div class="section right">
    <span use:tippy={{ content: "Score" }}>
      <MaterialIcon size="24px">pin</MaterialIcon>
    </span>
    <b class="score text-success">
      {$gameScore | 0}
    </b>
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

  .score {
    color: inherit;
    transition: color 1s ease-out;
  }

  .timer-bar {
    width: 100%;
    padding: 0;
    margin: 0;
  }
  .progress-bar {
    transition: background-color 1s ease-in;
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
