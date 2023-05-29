<script>
  import MainMenu from "$lib/sections/MainMenu.svelte";
  import NavBar from "$lib/sections/NavBar.svelte";
  import game from "$lib/utils/state";
  import EggField from "../lib/sections/EggField.svelte";

  function doOpenGame(event) {
    $game = event.detail;
  }
</script>

<div>
  <NavBar />

  {#if $game}
    <EggField />
  {:else}
    <MainMenu on:opengame={doOpenGame} />
  {/if}
</div>

<style>
  :global(body) {
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  div {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-flow: column nowrap;
  }
</style>
