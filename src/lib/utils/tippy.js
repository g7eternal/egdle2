import "tippy.js/animations/shift-away-subtle.css";
import "tippy.js/themes/light-border.css";
import "tippy.js/themes/material.css";
import "tippy.js/dist/svg-arrow.css";
import { createTippy } from "svelte-tippy";
import { roundArrow } from "tippy.js";

export default createTippy({
  animation: "shift-away-subtle",
  arrow: roundArrow,
  trigger: "mouseenter",
  duration: [100, 0],
  theme: "material",
  offset: [0, 0],
  allowHTML: true,
});
