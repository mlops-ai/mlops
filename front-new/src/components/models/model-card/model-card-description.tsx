import { ScrollShadow } from "@nextui-org/react";

interface ModelCardDescriptionProps {
    description?: string;
}

const ModelCardDescription = ({
    description,
}: ModelCardDescriptionProps) => {
    return (
        <ScrollShadow
            className="mb-3 overflow-y-auto max-h-[calc(4*1.5*16px)]"
            title="Model Description"
        >
            {description ? (
                description
            ) : (
                <p className="text-sm text-zinc-400">No model description.</p>
            )}
        </ScrollShadow>
    );
};

export default ModelCardDescription;
