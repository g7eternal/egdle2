<script>
  import { today } from "../game/consts";
  import MaterialIcon from "./MaterialIcon.svelte";

  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  let timeLeft = "",
    timeDiff = 0;

  function getTimeToReset() {
    timeDiff = Math.floor((tomorrow.getTime() - Date.now()) / 1000);
    if (timeDiff <= 0) {
      timeDiff = -1;
      clearInterval(updaterTimer);
    }

    const hh = String(Math.floor(timeDiff / 3600)).padStart(2, "0");
    const mm = String(Math.floor((timeDiff % 3600) / 60)).padStart(2, "0");
    const ss = String(timeDiff % 60).padStart(2, "0");
    timeLeft = `${hh}:${mm}:${ss}`;
  }

  const updaterTimer = setInterval(getTimeToReset, 1000);
  getTimeToReset(); // immediate first run
</script>

<div>
  {#if timeDiff >= 0}
    <MaterialIcon>alarm</MaterialIcon>
    Field will be reset in:
    <b class="text-success">{timeLeft}</b>
  {:else}
    <MaterialIcon>alarm_on</MaterialIcon>
    New issue is ready!
    <a href={window.location.href} target="_self">Refresh</a>
    to play now!
  {/if}
</div>
