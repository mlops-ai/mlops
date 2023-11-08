import { IconProps } from "@/types/types";

const ClearSorting = ({ className }: IconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            className={className}
            fill="currentColor"
        >
            <path d="M771.078-104.001 103.386-771.078q-8.923-8.922-9.115-21.191-.192-12.269 9.115-21.577 9.308-9.307 21.384-9.307 12.077 0 21.384 9.307l667.692 667.692q8.923 8.923 9.115 20.884.192 11.961-9.115 21.269-9.308 9.307-21.384 9.307-12.077 0-21.384-9.307Zm-148.079-346-59.998-59.998h110.46q12.75 0 21.375 8.628 8.624 8.629 8.624 21.384 0 12.756-8.624 21.371-8.625 8.615-21.375 8.615h-50.462ZM433-640l-59.999-59.999h416.998q12.75 0 21.375 8.629t8.625 21.384q0 12.756-8.625 21.371Q802.749-640 789.999-640H433Zm8.154 379.999q-12.75 0-21.375-8.629-8.624-8.629-8.624-21.384 0-12.756 8.624-21.371Q428.404-320 441.154-320h77.307q12.75 0 21.375 8.629 8.625 8.628 8.625 21.384 0 12.755-8.625 21.37-8.625 8.616-21.375 8.616h-77.307Zm-16.691-190H286.154q-12.749 0-21.374-8.628-8.625-8.629-8.625-21.384 0-12.756 8.625-21.371 8.625-8.615 21.374-8.615h138.309v59.998ZM234.464-640h-64.463q-12.75 0-21.375-8.629-8.625-8.628-8.625-21.384 0-12.755 8.625-21.37 8.625-8.616 21.375-8.616h64.463V-640Z" />
        </svg>
    );
};

export default ClearSorting;
