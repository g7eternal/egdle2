<script>
  import Stats from "../stats/Classic.svelte";
  import game from "../../utils/state";
  import { resultFlavorTexts as flavors } from "../consts";
  import DailyCountdown from "../../elements/DailyCountdown.svelte";
</script>

{#if $game.result}
  <h6>🥳 You found the egg! 🥚</h6>
  <p>
    {#if $game.stats.lastClicks > 1}
      It took
      <b class="text-success">{$game.stats.lastClicks}</b>
      tries for you to find the egg today.
      <br />
      {@html flavors[Math.min(Math.floor($game.stats.lastClicks / 3), flavors.length - 1)]}
    {:else}
      No way! You managed to find an egg in just
      <b class="text-success">{$game.stats.lastClicks}</b>
      click!
      <br />
      Are you a wizard? Or a champion?
    {/if}
  </p>
{:else}
  <h6>😠 What is this game about? 🍳</h6>
  <p>
    {#if $game.stats.lastClicks > 1}
      You found a broken egg in
      <b class="text-success">{$game.stats.lastClicks}</b>
      tries.
      <br />
      Better luck next time!
    {:else}
      Impressively bad. A broken egg in just
      <b class="text-success">{$game.stats.lastClicks}</b>
      click!
      <br />
      Wow, are you ever lucky? 😏
    {/if}
  </p>
{/if}

<Stats />

<DailyCountdown />

<style>
  p {
    margin: 16px 0;
  }
  :global(img) {
    vertical-align: text-bottom;
  }
</style>
