<script>
  import Stats from "../stats/Jewels.svelte";
  import game from "$lib/utils/state";
</script>

<p>
  🥚 Your final score is:
  <b class="text-success">{$game.score}</b>

  {#if $game.score > 0 && $game.stats.lastScore === $game.stats.bestScore}
    <span class="ms-2 badge bg-success">🎖️ New best score!</span>
  {/if}
</p>

<div class="my-2" />

<Stats />
