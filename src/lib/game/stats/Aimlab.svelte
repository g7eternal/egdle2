<script>
  import game from "$lib/utils/state";
  import tippy from "$lib/utils/tippy";
  import { formatTimer } from "$lib/utils/common";
  import BaseStatsTable from "$lib/elements/BaseStatsTable.svelte";
</script>

<BaseStatsTable header="Run stats">
  <tr>
    <td>Attempts:</td>
    <td class="data">{$game.stats.games}</td>
  </tr>
  <tr>
    <td>Finished runs:</td>
    <td class="data">{$game.stats.runs}</td>
  </tr>
  <tr>
    <td>Last time:</td>
    <td class="data">
      {formatTimer($game.stats.lastTime, true)}
      {#if $game.stats.lastTime > 0 && $game.stats.lastTime === $game.stats.bestTime}
        <span class="cursor-default" use:tippy={{ content: "Your best time!" }}>🎖️</span>
      {/if}
    </td>
  </tr>
  <tr>
    <td>Average time:</td>
    <td class="data">
      {formatTimer($game.stats.avgTime, true)}
    </td>
  </tr>
  <tr>
    <td>Best time:</td>
    <td class="data">
      {formatTimer($game.stats.bestTime, true)}
    </td>
  </tr>
</BaseStatsTable>

<BaseStatsTable header="Average click speed (ms)" headerspan="3">
  <tr>
    <td />
    <td class="like-th text-center">Last</td>
    <td class="like-th text-center">Best</td>
  </tr>
  <tr>
    <td>In one run:</td>
    <td class="data text-center">
      {Math.round($game.stats.lastClickTime)}
    </td>
    <td class="data text-center">
      {Math.round($game.stats.bestClickTime)}
    </td>
  </tr>
  <tr>
    <td>All-time average:</td>
    <td colspan="2" class="data text-center">
      {Math.round($game.stats.avgClickTime)}
    </td>
  </tr>
</BaseStatsTable>

<style>
  td.like-th {
    font-style: italic;
  }
  td.data {
    font-weight: 500;
  }
</style>
