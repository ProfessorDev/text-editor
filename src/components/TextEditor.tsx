import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { EditorForm, FileResult } from "../types";
import { Editor, EditorProps } from "./Editor";
import { Preview } from "./Preview";
import { Toolbar } from "./Toolbar";
import { InformationCircleIcon } from "@heroicons/react/outline";

const Information = () => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className="px-2 pb-1"
            onMouseMove={() => {
                setHovered(true);
            }}
            onMouseOut={() => {
                setHovered(false);
            }}
        >
            <div className={`text-xs`}>
                <InformationCircleIcon className="h-4 inline" /> Hover for information
            </div>
            <div className={`${hovered ? "block" : "hidden"} text-xs`}>
                <InformationCircleIcon className="h-4 inline" /> Learn how to write in
                Markdown{" "}
                <a
                    href="https://www.markdownguide.org/basic-syntax/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 text-xs hover:underline"
                >
                    click here
                </a>
            </div>
            <div className={`${hovered ? "block" : "hidden"} text-xs`}>
                <InformationCircleIcon className="h-4 inline" /> Markdown Cheatsheet{" "}
                <a
                    href="https://www.markdownguide.org/cheat-sheet/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 text-xs hover:underline"
                >
                    click here
                </a>
            </div>
            <div className={`${hovered ? "block" : "hidden"} text-xs`}>
                <InformationCircleIcon className="h-4 inline" /> Generate Markdown Table{" "}
                <a
                    href="https://tableconvert.com/markdown-generator"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 text-xs hover:underline"
                >
                    click here
                </a>
            </div>
            <div className={`${hovered ? "block" : "hidden"} text-xs`}>
                <InformationCircleIcon className="h-4 inline" /> Creating and
                highlighting code blocks{" "}
                <a
                    href="https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 text-xs hover:underline"
                >
                    click here
                </a>
            </div>
        </div>
    );
};

export interface TextEditorProps {
    onFileUpload?: (file: File) => Promise<FileResult>;
    editorProps?: EditorProps;
}

export const TextEditor: React.FC<TextEditorProps> = ({
    onFileUpload,
    editorProps,
}) => {
    const [mode, setMode] = useState("write");
    const { setValue } = useFormContext<EditorForm>();

    return (
        <div className="flex flex-col border border-gray-300 rounded-md">
            <Toolbar
                onFilesUpload={async (files) => {
                    let count = 0;

                    setValue("fileUpload", {
                        doneCount: 0,
                        needCount: files.length,
                        loading: true,
                    });

                    return await Promise.all(
                        files.map(async (file): Promise<FileResult> => {
                            if (onFileUpload) {
                                const result = await onFileUpload(file);
                                count++;
                                setValue("fileUpload.doneCount", count);
                                return result;
                            }
                            count++;
                            setValue("fileUpload.doneCount", count);
                            return {
                                file: file,
                                type: "error",
                            };
                        }),
                    );
                }}
                mode={mode}
                setMode={setMode}
            />
            <div className="flex flex-col p-2">
                {mode === "write" && <Editor {...editorProps} />}
                {mode === "preview" && <Preview />}
            </div>
            <Information />
        </div>
    );
};
