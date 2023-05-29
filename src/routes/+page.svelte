<script>
  import { onMount } from "svelte";
  import { appReady } from "../lib/utils/settings";
  import game from "$lib/utils/state";

  import MainMenu from "$lib/sections/MainMenu.svelte";
  import NavBar from "$lib/sections/NavBar.svelte";
  import EggField from "../lib/sections/EggField.svelte";

  function doOpenGame(event) {
    $game = event.detail;
  }

  let pageReady = false;
  onMount(() => {
    pageReady = true;
  });
</script>

{#if pageReady && $appReady}
  <div class="app">
    <NavBar />

    {#if $game}
      <EggField />
    {:else}
      <MainMenu on:opengame={doOpenGame} />
    {/if}
  </div>
{:else}
  <div class="loader">
    <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
{/if}

<style>
  :global(body) {
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .app {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-flow: column nowrap;
  }

  .loader {
    height: 50vh;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
