<script>
  import BaseStatsTable from "$lib/elements/BaseStatsTable.svelte";
  import game from "$lib/utils/state";
</script>

<BaseStatsTable>
  <tr>
    <td>Attempts:</td>
    <td><b>{$game.stats.games}</b></td>
  </tr>
  <tr>
    <td>Finished runs:</td>
    <td><b>{$game.stats.runs}</b></td>
  </tr>
  <tr>
    <td>Average run:</td>
    <td><b>{$game.stats.avgRound.toFixed(2)}</b> levels</td>
  </tr>
  <tr>
    <td>Best run:</td>
    <td>Level <b>{$game.stats.bestRound}</b></td>
  </tr>
  <tr>
    <td>Last run:</td>
    <td>Level <b>{$game.stats.lastRound}</b></td>
  </tr>
</BaseStatsTable>
