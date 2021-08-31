export type EditorForm = {
    text: string;
    selection: {
        start: number;
        end: number;
    };
    fileUpload: {
        loading: boolean;
        needCount: number;
        doneCount: number;
    };
};

export type FileResult = {
    file: File;
    type: "error" | "success";
    url?: string;
};