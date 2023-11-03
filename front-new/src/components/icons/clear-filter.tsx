import { IconProps } from "@/types/types";

const ClearFilter = ({ className }: IconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            className={className}
            fill="currentColor"
        >
            <path d="M577.768-495.232 535-538l143-182H353l-59.999-59.999h446.613q18.846 0 27.345 16.615 8.5 16.615-3.038 32L577.768-495.232ZM539.999-335.08v119.694q0 15.077-10.154 25.231-10.154 10.154-25.231 10.154h-49.228q-15.077 0-25.231-10.154-10.154-10.154-10.154-25.231v-239.692l-316-316q-8.307-8.307-8.5-20.576-.192-12.269 8.5-21.576 9.308-9.308 21.385-9.308 12.076 0 21.384 9.308l667.076 667.076q8.923 8.923 8.807 20.884-.115 11.961-9.423 21.269-9.307 8.692-21.076 9-11.769.307-21.076-9L539.999-335.08ZM535-538Z" />
        </svg>
    );
};

export default ClearFilter;
