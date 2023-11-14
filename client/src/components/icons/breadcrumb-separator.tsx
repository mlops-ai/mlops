import { IconProps } from "@/types/types";

const BreadcrumbSeparator = ({ className }: IconProps) => {
    return (
        <svg
            className={className}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
        >
            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z"></path>
        </svg>
    );
};

export default BreadcrumbSeparator;
