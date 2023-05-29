<script>
  import BaseStatsTable from "$lib/elements/BaseStatsTable.svelte";
  import game from "$lib/utils/state";
</script>

<BaseStatsTable>
  <tr>
    <td>Games played:</td>
    <td>{$game.stats.games}</td>
  </tr>
  <tr>
    <td>Streak:</td>
    <td>{$game.stats.streak}</td>
  </tr>
  <tr>
    <td>Average clicks:</td>
    <td>{$game.stats.avgClicks.toFixed(2)}</td>
  </tr>
  <tr>
    <td>Minimum clicks:</td>
    <td>{$game.stats.minClicks}</td>
  </tr>
  <tr>
    <td>Maximum clicks:</td>
    <td>{$game.stats.maxClicks}</td>
  </tr>
</BaseStatsTable>
