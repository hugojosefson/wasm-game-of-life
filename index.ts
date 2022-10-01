// @deno-types="../pkg/wasm_game_of_life.d.ts"
import { Universe } from "./pkg/wasm_game_of_life.js";

const universe = Universe.new();

const CURSOR_TOP_LEFT = "\x1b[1;1H";
const CURSOR_HIDE = "\x1b[?25l";
const CURSOR_SHOW = "\x1b[?25h";

let done = false;

function anotherTickPlease(): void {
  universe.tick();
  console.log(CURSOR_TOP_LEFT + universe.render());

  if (done) {
    return;
  }
  setTimeout(anotherTickPlease);
}

Deno.addSignalListener("SIGINT", () => {
  done = true;
});
addEventListener("unload", () => {
  console.log(CURSOR_SHOW);
});
console.log(CURSOR_HIDE);
console.clear();
anotherTickPlease();
