<script>
  import currentGame from "$lib/utils/state";
  import MaterialIcon from "$lib/elements/MaterialIcon.svelte";
  import Stats from "../stats/Aimlab.svelte";

  const timeStore = $currentGame.displayTime;
</script>

<p>
  Enough clicking around. The run has ended.
  <br />
  Your time is:
  <MaterialIcon>timer</MaterialIcon>
  <b class="text-success">{$timeStore}</b>
</p>

<Stats />

<style>
  p {
    margin: 0 0 16px 0;
  }
</style>
