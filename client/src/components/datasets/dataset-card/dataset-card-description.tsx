import { ScrollShadow } from "@nextui-org/react";

interface DatasetCardDescriptionProps {
    description?: string;
}

const DatasetCardDescription = ({
    description,
}: DatasetCardDescriptionProps) => {
    return (
        <ScrollShadow
            className="mb-3 overflow-y-auto max-h-[calc(4*1.5*16px)]"
            title="Dataset Description"
        >
            {description ? (
                description
            ) : (
                <p className="text-sm text-zinc-400">No dataset description.</p>
            )}
        </ScrollShadow>
    );
};

export default DatasetCardDescription;
