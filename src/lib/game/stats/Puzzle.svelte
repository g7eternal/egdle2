<script>
  import game from "$lib/utils/state";
  import { formatTimer } from "$lib/utils/common";
  import tippy from "$lib/utils/tippy";
  import BaseStatsTable from "$lib/elements/BaseStatsTable.svelte";
  import MaterialIcon from "$lib/elements/MaterialIcon.svelte";
</script>

<BaseStatsTable>
  <tr>
    <td>Attempts:</td>
    <td>{$game.stats.games}</td>
  </tr>
  <tr>
    <td>Finished runs:</td>
    <td>{$game.stats.runs}</td>
  </tr>
  <tr>
    <td>Average run:</td>
    <td>
      <MaterialIcon>timer</MaterialIcon>
      ~{formatTimer($game.stats.avgTime, true)} <br />
      <MaterialIcon>ads_click</MaterialIcon>
      {$game.stats.avgClicks.toFixed(2)} swaps
    </td>
  </tr>
  <tr>
    <td>Last run:</td>
    <td>
      <MaterialIcon>timer</MaterialIcon>
      {formatTimer($game.stats.lastTime, true)}
      {#if $game.stats.lastTime > 0 && $game.stats.lastTime === $game.stats.bestTime}
        <span class="cursor-default" use:tippy={{ content: "Your best time!" }}>🎖️</span>
      {/if}
      <br />
      <MaterialIcon>ads_click</MaterialIcon>
      {$game.stats.lastClicks} swaps
      {#if $game.stats.lastClicks > 0 && $game.stats.lastClicks === $game.stats.bestClicks}
        <span class="cursor-default" use:tippy={{ content: "Your lowest action count!" }}>🎖️</span>
      {/if}
    </td>
  </tr>
  <tr>
    <td>Best (lowest) time:</td>
    <td>
      <MaterialIcon>timer</MaterialIcon>
      {formatTimer($game.stats.bestTime, true)}
    </td>
  </tr>
  <tr>
    <td>Best (lowest) swap count:</td>
    <td>
      <MaterialIcon>ads_click</MaterialIcon>
      {$game.stats.bestClicks}
    </td>
  </tr>
</BaseStatsTable>
