<script>
  import game from "$lib/utils/state";
  import { formatTimer } from "$lib/utils/common";
  import tippy from "$lib/utils/tippy";
  import BaseStatsTable from "$lib/elements/BaseStatsTable.svelte";
  import MaterialIcon from "$lib/elements/MaterialIcon.svelte";

  let statRef;
  $: statRef = $game.stats[$game.options.gridSizes[$game.settings.gridSizes]];
</script>

<BaseStatsTable>
  <tr>
    <td colspan="2">
      <h5 class="text-secondary my-2">
        For <span class="fw-bold text-success">{$game.options.gridSizes[$game.settings.gridSizes]}</span> grid:
      </h5>
    </td>
  </tr>
  <tr>
    <td>Attempts:</td>
    <td>{statRef.games}</td>
  </tr>
  <tr>
    <td>Finished runs:</td>
    <td>{statRef.runs}</td>
  </tr>
  <tr>
    <td>Average run:</td>
    <td>
      <MaterialIcon>timer</MaterialIcon>
      ~{formatTimer(statRef.avgTime, true)} <br />
      <MaterialIcon>ads_click</MaterialIcon>
      {statRef.avgClicks.toFixed(2)} swaps
    </td>
  </tr>
  <tr>
    <td>Last run:</td>
    <td>
      <MaterialIcon>timer</MaterialIcon>
      {formatTimer(statRef.lastTime, true)}
      {#if statRef.lastTime > 0 && statRef.lastTime === statRef.bestTime}
        <span class="cursor-default" use:tippy={{ content: "Your best time!" }}>🎖️</span>
      {/if}
      <br />
      <MaterialIcon>ads_click</MaterialIcon>
      {statRef.lastClicks} swaps
      {#if statRef.lastClicks > 0 && statRef.lastClicks === statRef.bestClicks}
        <span class="cursor-default" use:tippy={{ content: "Your lowest action count!" }}>🎖️</span>
      {/if}
    </td>
  </tr>
  <tr>
    <td>Best (lowest) time:</td>
    <td>
      <MaterialIcon>timer</MaterialIcon>
      {formatTimer(statRef.bestTime, true)}
    </td>
  </tr>
  <tr>
    <td>Best (lowest) swap count:</td>
    <td>
      <MaterialIcon>ads_click</MaterialIcon>
      {statRef.bestClicks}
    </td>
  </tr>
</BaseStatsTable>
