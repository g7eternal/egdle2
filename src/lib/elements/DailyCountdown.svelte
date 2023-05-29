<script>
  import { today } from "../game/consts";
  import MaterialIcon from "./MaterialIcon.svelte";

  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  let timeLeft = "";

  function getTimeToReset() {
    let d = Math.floor((tomorrow.getTime() - Date.now()) / 1000);
    if (d <= 0) {
      d = 0;
      clearInterval(updaterTimer);
    }

    const hh = String(Math.floor(d / 3600)).padStart(2, "0");
    const mm = String(Math.floor((d % 3600) / 60)).padStart(2, "0");
    const ss = String(d % 60).padStart(2, "0");
    timeLeft = `${hh}:${mm}:${ss}`;
  }

  const updaterTimer = setInterval(getTimeToReset, 1000);
  getTimeToReset(); // immediate first run
</script>

<div>
  <MaterialIcon>alarm</MaterialIcon>
  Field will be reset in:
  <b class="text-success">{timeLeft}</b>
</div>
