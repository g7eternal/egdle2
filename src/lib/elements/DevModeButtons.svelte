<script>
  import MaterialIcon from "./MaterialIcon.svelte";
  import currentGame, { forceUpdateDOM } from "../utils/state";

  function doFullAppReset() {
    localStorage.clear();
    window.location.reload();
  }

  function doEggReveal() {
    $currentGame.field.showCells();
    forceUpdateDOM();
  }
</script>

<button class="btn btn-primary" on:click={doEggReveal}>
  <MaterialIcon>preview</MaterialIcon>
  Reveal all cells
</button>

<button class="btn btn-warning" on:click={doFullAppReset}>
  <MaterialIcon>restart_alt</MaterialIcon>
  Clear all data and restart
</button>

<style>
  button {
    margin: 8px;
  }
</style>
