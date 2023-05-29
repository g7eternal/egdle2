<script>
  import MaterialIcon from "./MaterialIcon.svelte";

  function doFullAppReset() {
    localStorage.clear();
    window.location.reload();
  }
</script>

<button class="btn btn-warning" on:click={doFullAppReset}>
  <MaterialIcon>restart_alt</MaterialIcon>
  Clear all data and restart
</button>
