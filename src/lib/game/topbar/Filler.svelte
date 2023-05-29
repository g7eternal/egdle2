<script>
  import currentGame from "$lib/utils/state";
  import tippy from "../../utils/tippy";
  import { showConfirmAdviceFriend } from "../../utils/adviceFriend";
  import MaterialIcon from "../../elements/MaterialIcon.svelte";
  import { cellColors } from "../consts";

  // cannot do double subscription, have to resolve this reference:
  const displayTimerStore = $currentGame.displayTime;

  function startNewRun() {
    $currentGame.startNewRun();
  }

  function askForRestart() {
    showConfirmAdviceFriend("Do you really want to reset the run?", "Yes, I do", startNewRun);
  }

  function setActiveColor(color) {
    $currentGame.doColorFill(color);
  }
</script>

<div class="bar">
  <div class="section left">
    <span use:tippy={{ content: "Time elapsed" }}>
      <MaterialIcon size="24px">timer</MaterialIcon>
    </span>
    <b class="text-success">{$displayTimerStore}</b>
  </div>
  <div class="section mid">
    {#if !$currentGame.result}
      {#if $currentGame.gameOver}
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
    <span use:tippy={{ content: "Click count" }}>
      <MaterialIcon size="24px">ads_click</MaterialIcon>
    </span>
    <b class="text-success">{$currentGame.clicks}</b>
  </div>
</div>

<div class="bar">
  <div class="section mid" class:disabled={$currentGame.gameOver}>
    {#each $currentGame.colors as color}
      <button
        class="btn color-picker"
        disabled={color === $currentGame.activeColor}
        style:background-color={cellColors[color]}
        style:box-shadow-color={cellColors[color]}
        on:click={() => setActiveColor(color)}
      >
        {#if $currentGame.settings.visualAidMode}
          {color}
        {/if}
      </button>
    {/each}
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

  .section.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  .color-picker {
    width: 75px;
    max-width: 15%;
    height: 35px;
    border: 1px solid gray;
    box-shadow: none;
    text-transform: uppercase;
    font-size: 10px;
    font-weight: bold;
    color: inherit;
    filter: brightness(1) contrast(2);
    opacity: 1;
    transform: none;
    transition: opacity 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  }
  .color-picker:disabled {
    border-color: transparent;
    opacity: 0.5;
    cursor: not-allowed;
  }
  .color-picker:hover {
    filter: brightness(1) contrast(2) saturate(1.1);
    box-shadow: 0px 0px 12px var(--bs-border-color-translucent);
  }
  .color-picker:active {
    transform: scale(0.9);
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
    .color-picker {
      width: 50px;
      height: 50px;
    }
  }
</style>
