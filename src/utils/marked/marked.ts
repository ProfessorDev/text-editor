import hljs from "highlight.js";
import marked from "marked";
import katexExtension from "./katexExtension";
import { videoRenderer } from "./videoRenderer";
import { youtubeRenderer } from "./youtubeEmbedRenderer";

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: "hljs language-", // highlight.js css expects a top-level 'hljs' class.
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

marked.use({
  renderer: videoRenderer,
});
marked.use({
  renderer: youtubeRenderer,
});

marked.use(
  katexExtension({
    throwOnError: false,
  }),
);

export { marked };
