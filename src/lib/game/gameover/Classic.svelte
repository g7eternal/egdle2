<script>
  import Stats from "../stats/Classic.svelte";
  import game from "../../utils/state";
  import DailyCountdown from "../../elements/DailyCountdown.svelte";

  const flavors = [
    "Wow, that was amazing!",
    "Impressive!",
    "Very nice!",
    "Good job!",
    "Solid performance today!",
    "Nice try!",
    "That was OK.",
    "Not bad. Not good either.",
    "Much room for improvement.",
    "Come on, you can do better than that.",
    "That was… bad. Really bad.",
    "You are just having a bad day, aren't you?",
    "<img src='emotes/forsenswa.webp' alt='' width='24' height='24'> Unlucky.",
  ];
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
