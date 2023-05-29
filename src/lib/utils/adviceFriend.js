import { browser } from "$app/environment"; // sveltekit environment
import { nullFunction } from "../game/consts";
import AdviceFriend from "$lib/elements/AdviceFriend.svelte";

export function showAdviceFriend(content, title = "", sanitize = false) {
  if (!browser) return;

  const root = document.createElement("div");
  root.classList = "fs-6 text-dark bg-white";

  if (title) {
    const headContent = document.createElement("div");
    headContent.classList = "fs-4";
    headContent[sanitize ? "innerText" : "innerHTML"] = title;
    root.appendChild(headContent);
  }

  const textContent = document.createElement("div");
  if (!sanitize) content = content.replace(/\n/g, "<br>");
  textContent[sanitize ? "innerText" : "innerHTML"] = content;
  root.appendChild(textContent);

  const adviceFriend = new AdviceFriend({
    props: {
      content: root,
    },
    target: document.body,
  });

  adviceFriend.$on("hide-advice", () => {
    adviceFriend.$destroy();
  });
}

export function showConfirmAdviceFriend(content, buttonText = "OK", actionCallback = nullFunction) {
  if (!browser) return;

  const root = document.createElement("div");
  root.classList = "d-flex flex-column fs-6 text-dark bg-white";

  const textContent = document.createElement("div");
  textContent.innerHTML = content;
  root.appendChild(textContent);

  const btn = document.createElement("button");
  btn.classList = "btn btn-success border-dark mt-1 my-auto";
  btn.innerHTML = buttonText;
  btn.addEventListener("click", function () {
    adviceFriend.$destroy();
    actionCallback.call(this, arguments);
  });
  root.appendChild(btn);

  const adviceFriend = new AdviceFriend({
    props: {
      interactive: true,
      content: root,
    },
    target: document.body,
  });

  adviceFriend.$on("hide-advice", () => {
    adviceFriend.$destroy();
  });
}
