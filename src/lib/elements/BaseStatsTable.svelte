<table class="table table-striped">
  <tbody>
    <slot />
  </tbody>
</table>

<style>
  tbody :global(tr:first-child) {
    border-top-width: var(--bs-border-width);
  }
</style>
