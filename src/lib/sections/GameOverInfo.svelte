<script>
  import ShareButton from "../elements/ShareButton.svelte";
  import currentGame from "../utils/state";
</script>

<div class="modal-content">
  <div class="modal-header">
    <h5 class="modal-title fs-5" id="mdlGameOverTitle">
      <img
        class="align-text-bottom me-1"
        src="icon/favicon-32x32.png"
        alt="Okayeg"
        width="28"
        height="28"
      />
      Game over!
    </h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
  </div>
  <div class="modal-body">
    <svelte:component this={$currentGame.gameOverComponent} />
  </div>
  <div class="modal-footer">
    <ShareButton />
  </div>
</div>
