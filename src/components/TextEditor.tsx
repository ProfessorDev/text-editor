import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { EditorForm, FileResult } from "../types";
import { Editor } from "./Editor";
import { Preview } from "./Preview";
import { Toolbar } from "./Toolbar";

export interface TextEditorProps {
    onFileUpload?: (file: File) => Promise<FileResult>;
}

export const TextEditor: React.FC<TextEditorProps> = ({ onFileUpload }) => {
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
                        })
                    );
                }}
                mode={mode}
                setMode={setMode}
            />
            <div className="flex flex-col p-2">
                {mode === "write" && <Editor />}
                {mode === "preview" && <Preview />}
            </div>
        </div>
    );
};
