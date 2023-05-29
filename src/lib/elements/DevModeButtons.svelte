<script>
  import MaterialIcon from "./MaterialIcon.svelte";
  import currentGame, { forceUpdateDOM } from "../utils/state";
  import { tryShowDailyEggFact } from "../utils/dailyFact";

  function doFullAppReset() {
    localStorage.clear();
    window.location.reload();
  }

  function doEggReveal() {
    if (!$currentGame) return;
    $currentGame.field.showCells();
    forceUpdateDOM();
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
  <button class="btn btn-outline-secondary" on:click={tryShowDailyEggFact}>
    🥚 Show random egg fact
  </button>

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
