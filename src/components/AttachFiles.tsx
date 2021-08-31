import { useCallback, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { EditorForm } from "../types";

export interface AttachFilesProps {}

export const AttachFiles: React.FC<AttachFilesProps> = () => {
    const { control, setValue } = useFormContext<EditorForm>();

    const setfileUploadLoading = useCallback(
        (value: boolean) => setValue("fileUpload.loading", value),
        [setValue]
    );

    const fileUpload = useWatch({
        control,
        name: "fileUpload",
    });

    useEffect(() => {
        if (fileUpload.doneCount === fileUpload.needCount) {
            setTimeout(() => {
                setfileUploadLoading(false);
            }, 2000);
        }
    }, [fileUpload.doneCount, fileUpload.needCount, setfileUploadLoading]);

    return (
        <div className="border-dashed border-t border-gray-300 px-2 p-1 text-sm">
            {fileUpload.loading
                ? `Uploading Files... (${fileUpload.doneCount}/${fileUpload.needCount})`
                : "Attach files by dragging & dropping, selecting or pasting them."}
        </div>
    );
};
