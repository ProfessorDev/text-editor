import katex, { KatexOptions } from "katex";
import { MarkedExtension, RendererExtension, TokenizerExtension } from "marked";

const inlineStartRule = /(\s|^)\${1,2}(?!\$)/;
const inlineRule =
  /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n$]))\1(?=[\s?!.,:]|$)/;
const blockRule = /^(\${1,2})\n((?:\\[^]|[^\\])+?)\n\1(?:\n|$)/;

export default function katexExtension(
  options: KatexOptions = {},
): MarkedExtension {
  return {
    extensions: [
      inlineKatex(createRenderer(options, false)),
      blockKatex(createRenderer(options, true)),
    ],
  };
}

function createRenderer(
  options: KatexOptions,
  newlineAfter: boolean,
): RendererExtension["renderer"] {
  return (token) =>
    katex.renderToString(token.text, {
      ...options,
      displayMode: token.displayMode,
    }) + (newlineAfter ? "\n" : "");
}

function inlineKatex(
  renderer: RendererExtension["renderer"],
): TokenizerExtension & RendererExtension {
  return {
    name: "inlineKatex",
    level: "inline",
    start(src) {
      const match = src.match(inlineStartRule);
      if (!match) {
        return -1;
      }

      const index = match.index ?? 0 + match[1].length;
      const possibleKatex = src.substring(index);

      if (possibleKatex.match(inlineRule)) {
        return index;
      }
      return -1;
    },
    tokenizer(src) {
      const match = src.match(inlineRule);
      if (match) {
        const raw = match[0];
        const text = match[2].trim();
        const sign = match[1]; // $ or $$
        const displayMode = sign.length === 2;

        return {
          type: "inlineKatex",
          raw,
          text,
          displayMode,
        };
      }
    },
    renderer,
  };
}

function blockKatex(
  renderer: RendererExtension["renderer"],
): TokenizerExtension & RendererExtension {
  return {
    name: "blockKatex",
    level: "block",
    start(src) {
      return src.indexOf("\n$");
    },
    tokenizer(src) {
      const match = src.match(blockRule);
      if (match) {
        const raw = match[0];
        const text = match[2].trim();
        const sign = match[1]; // $ or $$
        const displayMode = sign.length === 2;

        return {
          type: "blockKatex",
          raw,
          text,
          displayMode,
        };
      }
    },
    renderer,
  };
}
