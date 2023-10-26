import { IconProps } from "@/types/types";

const Edit = ({ className }: IconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            className={className}
            fill="currentColor"
        >
            <path d="M206.154-200h49.461l370.387-370.386-49.461-49.462-370.387 370.387V-200Zm548.152-413.77L619.309-747.537l52.154-52.153q17.615-17.615 42.845-17.615t42.845 17.615l48.692 48.691q17.615 17.615 18.23 42.23.615 24.615-17 42.23l-52.769 52.769Zm-43.383 43.999-429.77 429.77H146.156v-134.998l429.769-429.77 134.998 134.998Zm-109.844-25.538-24.538-24.539 49.461 49.462-24.923-24.923Z" />
        </svg>
    );
};

export default Edit;
