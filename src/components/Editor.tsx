import { KeyboardEvent, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { AttachFiles } from "./AttachFiles";
import { UpdateEditorSelection } from "./UpdateEditorSelection";

export interface EditorProps
    extends React.HTMLAttributes<HTMLTextAreaElement> { }

export const Editor: React.FC<EditorProps> = (props) => {
    const { register, getValues, setValue } = useFormContext();
    const editorRef = useRef<HTMLTextAreaElement | null>();
    const textRegister = register("text");

    const getSelection = () => getValues("selection");
    const getText = () => getValues("text");
    const setText = (text: string) => {
        setValue("text", text);
    };

    const setSelection = (start: number, end: number) => {
        setValue("selection", {
            start: start,
            end: end,
        });
    };

    const getSelections = () => {
        const selection = getSelection();
        const text = getText();
        const beforeText = text.substring(0, selection.start);
        const selectedText = text.substring(selection.start, selection.end);
        const afterText = text.substring(selection.end);
        return { beforeText, selectedText, afterText };
    };

    const onEnter = (e: KeyboardEvent) => {
        const { beforeText, selectedText, afterText } = getSelections();
        const [lastLineBeforeText] = beforeText.split("\n").slice(-1);

        const orderedList = lastLineBeforeText.match(/^(\s*)([0-9]+)\.\s/);
        const unorderedList = lastLineBeforeText.match(/^(\s*)-\s/);

        if (orderedList) {
            e.preventDefault();
            const [, spaces, number] = orderedList;
            const num = parseInt(number) + 1;
            const result = `${beforeText}\n${spaces}${num}. ${selectedText}${afterText}`;
            setText(result);
        } else if (unorderedList) {
            const [, spaces] = unorderedList;
            e.preventDefault();
            const result = `${beforeText}\n${spaces}- ${selectedText}${afterText}`;
            setText(result);
        }
    };

    const onTab = (e: KeyboardEvent) => {
        const { beforeText, selectedText, afterText } = getSelections();
        const lines = beforeText.split("\n");
        const [lastLineBeforeText] = lines.splice(-1, 1);

        const orderedList = lastLineBeforeText.match(/^(\s*)[0-9]+\.\s(.*)/);
        const unorderedList = lastLineBeforeText.match(/^(\s*)-\s/);

        if (orderedList) {
            e.preventDefault();
            const [, spaces, rem] = orderedList;
            const result = `${lines.join(
                "\n",
            )}\n    ${spaces}1. ${rem}${selectedText}${afterText}`;
            setText(result);
        } else if (unorderedList) {
            e.preventDefault();
            const result = `${lines.join(
                "\n",
            )}\n    ${lastLineBeforeText}${selectedText}${afterText}`;
            setText(result);
        }
    };

    const onShiftTab = (e: KeyboardEvent) => {
        const { beforeText, selectedText, afterText } = getSelections();
        const lines = beforeText.split("\n");
        const [lastLineBeforeText] = lines.splice(-1, 1);

        const orderedList = lastLineBeforeText.match(/^(\s*)([0-9]+\.\s.*)/);
        const unorderedList = lastLineBeforeText.match(/^(\s*)(-\s.*)/);

        if (orderedList) {
            e.preventDefault();
            const [, spaces, text] = orderedList;

            const spacesMatch = spaces.match(/^\s{4}(\s*)/);

            let newSpaces = "";
            if (spacesMatch) {
                [, newSpaces] = spacesMatch;
            }
            const result = `${lines.join(
                "\n",
            )}\n${newSpaces}${text}${selectedText}${afterText}`;
            setText(result);
        } else if (unorderedList) {
            e.preventDefault();
            const [, spaces, text] = unorderedList;
            const spacesMatch = spaces.match(/^\s{4}(\s*)/);

            let newSpaces = "";
            if (spacesMatch) {
                [, newSpaces] = spacesMatch;
            }

            const result = `${lines.join(
                "\n",
            )}\n${newSpaces}${text}${selectedText}${afterText}`;
            setText(result);
        }
    };

    return (
        <div className="flex flex-col bg-gray-100 rounded-md border border-gray-300">
            <UpdateEditorSelection editorRef={editorRef} />
            <textarea
                {...props}
                {...textRegister}
                className="bg-transparent max-h-96 p-2 text-sm placeholder-gray-700 focus:bg-white"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onEnter(e);
                    } else if (e.shiftKey && e.key === "Tab") {
                        onShiftTab(e);
                    } else if (e.key === "Tab") {
                        onTab(e);
                    }
                    props?.onKeyDown?.(e);
                }}
                style={{
                    minHeight: "12rem",
                    ...props.style,
                }}
                ref={(instance) => {
                    textRegister.ref(instance);
                    editorRef.current = instance;
                }}
                placeholder="Leave a comment"
                onSelect={(e) => {
                    setSelection(
                        e.currentTarget.selectionStart,
                        e.currentTarget.selectionEnd,
                    );
                    props?.onSelect?.(e);
                }}
            ></textarea>
            <AttachFiles />
        </div>
    );
};
