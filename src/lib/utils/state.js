import { writable } from "svelte/store";

const currentGame = writable(null);

/*
currentGame.subscribe((s) => {
  console.info("Active game:", s?.id);
});
*/

export function forceUpdateDOM() {
  currentGame.update((s) => s);
}

export default currentGame;
