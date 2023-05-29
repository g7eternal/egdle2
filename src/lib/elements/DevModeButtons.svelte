<script>
  import MaterialIcon from "./MaterialIcon.svelte";
  import currentGame, { forceUpdateDOM } from "../utils/state";
  import { tryShowDailyEggFact } from "../utils/dailyFact";
  import { Confetti } from "svelte-confetti";

  function doFullAppReset() {
    localStorage.clear();
    window.location.reload();
  }

  function doEggReveal() {
    if (!$currentGame) return;
    $currentGame.field.showCells();
    forceUpdateDOM();
  }

  function doPuzzleSolve() {
    if (!$currentGame) return;
    $currentGame.field.cells.sort((a, b) => a.puzzleId - b.puzzleId);
    $currentGame.field.cells.push($currentGame.field.cells.shift()); // move the empty cell to the end
    forceUpdateDOM();
  }

  let debugConfetti = false;
  function doConfettiTest() {
    debugConfetti = !debugConfetti;
  }

  const chromaKeys = ["", "lime", "cyan", "red", "blue", "purple"];
  let chromaIndex = 0;
  function forceChromaKey() {
    chromaIndex = (chromaIndex + 1) % chromaKeys.length;
    const key = chromaKeys[chromaIndex];

    document.body.style.backgroundColor = key;
    document.body.classList.toggle("chroma-keyed", key.length > 0);
  }
</script>

<div class="d-flex flex-wrap justify-content-center">
  {#if $currentGame?.id === "puzzle"}
    <button class="btn btn-success" on:click={doPuzzleSolve}>
      <MaterialIcon>extension</MaterialIcon>
      Instantly solve the puzzle
    </button>
  {/if}

  <button class="btn btn-outline-secondary" on:click={doConfettiTest}>
    {#if debugConfetti}
      <Confetti
        rounded
        size="12"
        amount="30"
        noGravity
        x={[-0.3, 0.3]}
        y={[0, 0.5]}
        duration="1400"
        colorArray={["#ffda4a78", "#ffcf8a77", "#ffe99e69", "#ba9f6676", "#e6be6097"]}
      />
    {/if}
    🎉 Confetti
  </button>

  <button class="btn btn-outline-secondary" on:click={tryShowDailyEggFact}> 🥚 Show random egg fact </button>

  <button class="btn btn-secondary" on:click={forceChromaKey}>
    <MaterialIcon>gradient</MaterialIcon>
    Toggle chroma key
  </button>

  <button class="btn btn-primary" on:click={doEggReveal}>
    <MaterialIcon>preview</MaterialIcon>
    Reveal all cells
  </button>

  <button class="btn btn-warning" on:click={doFullAppReset}>
    <MaterialIcon>restart_alt</MaterialIcon>
    Clear all data and restart
  </button>
</div>

<style>
  button {
    margin: 8px;
  }
</style>
