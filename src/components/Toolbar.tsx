import {
    ClipboardListIcon,
    CodeIcon,
    LinkIcon,
    MenuAlt3Icon,
    UploadIcon,
    ViewListIcon
} from "@heroicons/react/outline";
import { useFormContext } from "react-hook-form";
import { EditorForm, FileResult } from "../types";
import { FileButton } from "./FileButton";

export interface ToolbarProps {
    mode: string;
    setMode: (mode: string) => void;
    onFilesUpload: (files: Array<File>) => Promise<Array<FileResult>>;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    mode,
    setMode,
    onFilesUpload,
}) => {
    const { getValues, setValue } = useFormContext<EditorForm>();

    const getSelection = () => getValues("selection");
    const getText = () => getValues("text");
    const setText = (text: string) => {
        setValue("text", text);
    };
    const setSelection = (start: number, end: number) => {
        setValue("selection", {
            start,
            end,
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

    const onHeadingClick = () => {
        const selection = getSelection();
        const { beforeText, selectedText, afterText } = getSelections();

        const result = `${beforeText}### ${selectedText}${afterText}`;
        setText(result);
        setSelection(selection.start + 4, selection.end + 4);
    };

    const onBoldClick = () => {
        const selection = getSelection();
        const { beforeText, selectedText, afterText } = getSelections();

        const result = `${beforeText}**${selectedText}**${afterText}`;
        setText(result);
        setSelection(selection.start + 2, selection.end + 2);
    };

    const onItalicClick = () => {
        const selection = getSelection();
        const { beforeText, selectedText, afterText } = getSelections();

        const result = `${beforeText}_${selectedText}_${afterText}`;
        setText(result);
        setSelection(selection.start + 1, selection.end + 1);
    };

    const onQuoteClick = () => {
        const selection = getSelection();
        const { beforeText, selectedText, afterText } = getSelections();

        const result = `${beforeText}> ${selectedText}${afterText}`;
        setText(result);
        setSelection(selection.start + 2, selection.end + 2);
    };

    const onCodeClick = () => {
        const selection = getSelection();
        const { beforeText, selectedText, afterText } = getSelections();

        const result = `${beforeText}\`${selectedText}\`${afterText}`;
        setText(result);
        setSelection(selection.start + 1, selection.end + 1);
    };
    const onLinkClick = () => {
        const selection = getSelection();
        const { beforeText, selectedText, afterText } = getSelections();
        const urlRegex =
            "^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$";

        if (selectedText.match(urlRegex)) {
            const result = `${beforeText}[](${selectedText})${afterText}`;
            setText(result);
            setSelection(selection.start + 1, selection.start + 1);
        } else {
            const result = `${beforeText}[${selectedText}](url)${afterText}`;
            if (selectedText === "") {
                setText(result);
                setSelection(selection.start + 1, selection.end + 1);
            } else {
                setText(result);
                setSelection(selection.end + 3, selection.end + 6);
            }
        }
    };

    const onBulletedListClick = () => {
        const selection = getSelection();
        const { beforeText, selectedText, afterText } = getSelections();

        if (selectedText === "") {
            if (beforeText.match(/\n(\s)*$/) || beforeText === "") {
                const result = `${beforeText}- ${selectedText}${afterText}`;
                setText(result);
                setSelection(selection.start + 2, selection.start + 2);
            } else {
                const result = `${beforeText}\n- ${selectedText}${afterText}`;
                setText(result);
                setSelection(selection.start + 3, selection.start + 3);
            }
        } else {
            const result = `${beforeText}- ${selectedText}${afterText}`;
            setText(result);
            setSelection(selection.start + 2, selection.end + 2);
        }
    };
    const onNumberedListClick = () => {
        const selection = getSelection();
        const { beforeText, selectedText, afterText } = getSelections();

        if (selectedText === "") {
            if (beforeText.match(/\n(\s)*$/) || beforeText === "") {
                const result = `${beforeText}1. ${selectedText}${afterText}`;
                setText(result);
                setSelection(selection.start + 3, selection.start + 3);
            } else {
                const result = `${beforeText}\n1. ${selectedText}${afterText}`;
                setText(result);
                setSelection(selection.start + 4, selection.start + 4);
            }
        } else {
            const result = `${beforeText}1. ${selectedText}${afterText}`;
            setText(result);
            setSelection(selection.start + 3, selection.end + 3);
        }
    };

    const onFileSelect = async (files: Array<File>) => {
        const { beforeText, afterText } = getSelections();
        const result = `${beforeText}\n![uploading files...]()\n${afterText}`;

        setText(result);
        const results = await onFilesUpload(files);

        const send = results.flatMap((result) => {
            if (result.type === "success") {
                if (result.file.type.match(/^image\/.*$/)) {
                    return `![image](${result.url})`;
                } else if (result.file.type.match(/^video\/.*$/)) {
                    return `![video](${result.url})`;
                }
                return `[${result.file.name}](${result.url})`;
            }
            return [];
        });

        const text = getText();
        const textMatch = text.match(
            /^(.*)\n!\[uploading files\.\.\.\]\(\)\n(.*)$/s
        );

        if (textMatch) {
            const [, start, end] = textMatch;

            const result = `${start}\n${send.join("\n")}\n${end}`;
            setText(result);
        }
    };

    return (
        <div className="flex justify-between pt-2 px-2 border-b border-gray-300 text-gray-600">
            <div className="flex gap-1 text-sm">
                <button
                    type="button"
                    className={`py-1 px-4 relative rounded-t-md hover:text-gray-900 ${
                        mode === "write"
                            ? "border border-gray-300 text-gray-900"
                            : "border border-transparent"
                    }`}
                    style={{
                        top: "1px",
                        borderBottomColor:
                            mode === "write" ? "white" : undefined,
                    }}
                    onClick={() => {
                        setMode("write");
                    }}
                >
                    Write
                </button>
                <button
                    type="button"
                    className={`py-1 px-4 relative rounded-t-md hover:text-gray-900 ${
                        mode === "preview"
                            ? "border border-gray-300 text-gray-900"
                            : "border border-transparent"
                    }`}
                    style={{
                        top: "1px",
                        borderBottomColor:
                            mode === "preview" ? "white" : undefined,
                    }}
                    onClick={() => {
                        setMode("preview");
                    }}
                >
                    Preview
                </button>
            </div>
            <div className="pb-2 pt-2 flex gap-6">
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="hover:text-blue-600"
                        onClick={onHeadingClick}
                    >
                        H
                    </button>
                    <button
                        type="button"
                        className="hover:text-blue-600 font-bold"
                        onClick={onBoldClick}
                    >
                        B
                    </button>
                    <button
                        type="button"
                        className="hover:text-blue-600 italic"
                        onClick={onItalicClick}
                    >
                        I
                    </button>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="hover:text-blue-600"
                        onClick={onQuoteClick}
                    >
                        <MenuAlt3Icon className="h-6" />
                    </button>
                    <button
                        type="button"
                        className="hover:text-blue-600"
                        onClick={onCodeClick}
                    >
                        <CodeIcon className="h-6" />
                    </button>
                    <button
                        type="button"
                        className="hover:text-blue-600"
                        onClick={onLinkClick}
                    >
                        <LinkIcon className="h-6" />
                    </button>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="hover:text-blue-600"
                        onClick={onBulletedListClick}
                    >
                        <ClipboardListIcon className="h-6" />
                    </button>
                    <button
                        type="button"
                        className="hover:text-blue-600"
                        onClick={onNumberedListClick}
                    >
                        <ViewListIcon className="h-6" />
                    </button>
                </div>
                <div className="flex gap-2">
                    <FileButton
                        className="hover:text-blue-600"
                        multiple
                        onChange={(e) => {
                            onFileSelect(
                                Array.from(e.currentTarget.files || [])
                            );
                        }}
                    >
                        <UploadIcon className="h-6" />
                    </FileButton>
                </div>
            </div>
        </div>
    );
};
