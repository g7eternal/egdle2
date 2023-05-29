<script>
  import MaterialIcon from "$lib/elements/MaterialIcon.svelte";
  import game from "$lib/utils/state";
  import { formatTimer } from "$lib/utils/common";
  import Stats from "../stats/Filler.svelte";
</script>

<p>Stats for this run:</p>
<ul>
  <li>
    <MaterialIcon>timer</MaterialIcon>
    Time elapsed:
    <b class="text-success">{formatTimer($game.stats.lastTime, true)}</b>
    {#if $game.stats.lastTime > 0 && $game.stats.lastTime === $game.stats.bestTime}
      <span class="badge bg-success">🎖️ New best!</span>
    {/if}
  </li>
  <li>
    <MaterialIcon>ads_click</MaterialIcon>
    <b class="text-success">{$game.stats.lastClicks}</b> clicks
    {#if $game.stats.lastClicks > 0 && $game.stats.lastClicks === $game.stats.bestClicks}
      <span class="badge bg-success">🎖️ New best!</span>
    {/if}
  </li>
</ul>

<Stats />

<style>
  p {
    margin: 0 0 4px 0;
  }
  ul {
    padding: 0;
    margin-bottom: 16px;
  }
  li {
    list-style-type: none;
    margin-bottom: 4px;
  }
  ul :global(.material-icons) {
    margin-right: 0.2rem;
  }
  .badge {
    margin-left: 4px;
  }
</style>
