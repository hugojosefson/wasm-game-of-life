// @deno-types="../pkg/wasm_game_of_life.d.ts"
import { Cell, getUint8Memory0, Universe } from "./pkg/wasm_game_of_life.js";

const universe = Universe.new();

const width = universe.width;
const height = universe.height;
const cells = new Uint8Array(
  getUint8Memory0().buffer,
  universe.cellsPointer,
  width * height,
);

const CURSOR_TOP_LEFT = "\x1b[1;1H";
const CURSOR_HIDE = "\x1b[?25l";
const CURSOR_SHOW = "\x1b[?25h";

const cellOf = (cell: Cell): string => cell === Cell.Alive ? "◼" : " ";

const getRow = (startOffset: number) =>
  Array.from(
    { length: width },
    (_, x) => cellOf(cells[startOffset + x]),
  )
    .join("");

let done = false;

function render() {
  return Array.from(
    { length: height },
    (_, y) => getRow(y * width),
  ).join("\n");
}

function next() {
  universe.tick();

  const output = CURSOR_TOP_LEFT + /*universe.*/ render();
  console.log(output);

  if (!done) {
    return setTimeout(next);
  }
  console.log(CURSOR_SHOW);
}

Deno.addSignalListener("SIGINT", () => {
  done = true;
});
console.log(CURSOR_HIDE);
console.clear();
next();
