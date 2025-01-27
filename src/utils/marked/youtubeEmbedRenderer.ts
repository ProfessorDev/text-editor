import { Renderer } from "marked";

export const youtubeRenderer: Partial<Renderer<false>> = {
  image(href, _title, text) {
    if (text.endsWith("youtube")) {
      return `
<iframe
  style="width: 100%"
  height="400"
  src="${href}"
  title="YouTube video player (${text})"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>
`;
    }
    return false;
  },
};
