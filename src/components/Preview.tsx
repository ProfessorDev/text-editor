import parse from "html-react-parser";
import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { EditorForm } from "../types";
import { marked } from "../utils/marked/marked";

export interface PreviewProps {}

export const Preview: React.FC<PreviewProps> = () => {
  const { getValues } = useFormContext<EditorForm>();

  const [preview, setPreview] = useState<string | JSX.Element | JSX.Element[]>(
    "",
  );

  const getText = useCallback(() => getValues("text"), [getValues]);

  useEffect(() => {
    const text = getText();
    const preview = parse(marked(text));
    setPreview(preview);
  }, [getText]);

  return (
    <div
      className="p-2 markdown-body"
      style={{
        minHeight: "12rem",
      }}
    >
      {preview}
    </div>
  );
};
