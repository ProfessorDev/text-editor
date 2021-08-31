import React, { MutableRefObject, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { EditorForm } from "../types";

interface UpdateEditorSelectionProps {
    editorRef: MutableRefObject<HTMLTextAreaElement | null | undefined>;
}

export const UpdateEditorSelection: React.FC<UpdateEditorSelectionProps> = ({
    editorRef,
}) => {
    const {control} = useFormContext<EditorForm>();
    const editor = editorRef.current;
    const selection = useWatch({
        control,
        name: "selection",
    });

    useEffect(() => {
        if (editor) {
            editor.focus();
            editor.selectionStart = selection.start;
            editor.selectionEnd = selection.end;
        }
    }, [selection, editor]);
    return null;
};
