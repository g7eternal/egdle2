<script>
  import BaseStatsTable from "$lib/elements/BaseStatsTable.svelte";
  import game from "$lib/utils/state";
</script>

<BaseStatsTable>
  <tr>
    <td>Last score:</td>
    <td>{$game.stats.lastScore}</td>
  </tr>
  <tr>
    <td>Best score:</td>
    <td>{$game.stats.bestScore}</td>
  </tr>
  <tr>
    <td>Games completed:</td>
    <td>{$game.stats.runs}</td>
  </tr>
</BaseStatsTable>
