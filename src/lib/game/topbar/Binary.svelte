<script>
  import { scale } from "svelte/transition";
  import currentGame from "$lib/utils/state";
  import tippy from "$lib/utils/tippy";
  import GameStartCountdown from "$lib/elements/GameStartCountdown.svelte";
  import MaterialIcon from "$lib/elements/MaterialIcon.svelte";

  // cannot do double subscription, have to resolve this reference:
  const displayTimerStore = $currentGame.displayTime;

  function startNewRun() {
    $currentGame?.startNewRun();
  }

  let countdown = false;
  function doStart() {
    countdown = true;
  }
</script>

<div class="bar">
  <div class="section left">
    🥚 {$currentGame.name}
    <b>#{$currentGame.issue}</b>
  </div>
  <div class="section mid">
    {#if !$currentGame.startTime}
      {#if countdown}
        <GameStartCountdown bind:isVisible={countdown} runFunction={startNewRun} />
      {:else}
        <button class="btn btn-success" on:click={doStart}>
          <MaterialIcon>flag</MaterialIcon>
          Start game
        </button>
      {/if}
    {:else if $currentGame.result}
      <div
        class="badge rounded-pill border border-success text-success"
        in:scale
        use:tippy={{ content: "Puzzle solved!" }}
      >
        <MaterialIcon>check</MaterialIcon>
      </div>
    {:else if $currentGame.fieldError}
      <div class="badge rounded-pill bg-warning text-black" in:scale use:tippy={{ content: $currentGame.fieldError }}>
        <MaterialIcon>error</MaterialIcon>
      </div>
    {/if}
  </div>
  <div class="section right">
    <div class="right-flex">
      <span use:tippy={{ content: "Click counter" }}>
        <MaterialIcon size="24px">ads_click</MaterialIcon>
      </span>
      <b class={$currentGame.clicks ? "text-success" : "text-muted"}>{$currentGame.clicks}</b>
    </div>
    <div class="right-flex">
      <div class="padder" />
      <span use:tippy={{ content: "Time elapsed" }}>
        <MaterialIcon size="24px">timer</MaterialIcon>
      </span>
      <b class={$currentGame.startTime ? "timer text-success" : "timer text-muted"}>
        {$displayTimerStore}
      </b>
    </div>
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
  .right {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    gap: 1rem;
  }
  .right b {
    margin-left: 4px;
  }
  .right-flex {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
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
    .right {
      flex-flow: column nowrap;
      align-items: center;
    }
  }
</style>
