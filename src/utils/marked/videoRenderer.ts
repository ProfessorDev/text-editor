import { Renderer } from "marked";

export const videoRenderer: Partial<Renderer<false>> = {
    image(href, title, text) {
        if (text.endsWith("video")) {
            return `
            <details class="details-reset border border-gray-300 rounded-md" open="">
                <summary class="px-3 py-2 border-b border-gray-300">video</summary>
                <video 
                    src="${href}"
                    title="${title}"
                    alt="${text}" 
                    controls=""
                    muted="true"
                    class="max-w-full rounded-b-md"
                ></video>
            </details>
            `;
        }
        return false;
    },
};