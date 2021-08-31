import { DetailedHTMLProps, InputHTMLAttributes, useRef } from "react";

export type FileButtonProps = DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
>;

export const FileButton: React.FC<FileButtonProps> = ({
    children,
    className,
    style,
    ...props
}) => {
    const ref = useRef<HTMLInputElement>(null);

    return (
        <button
            type="button"
            className={className}
            style={style}
            onClick={() => {
                ref.current?.click();
            }}
        >
            <input type="file" className="hidden" ref={ref} {...props} />
            {children}
        </button>
    );
};