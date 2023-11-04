import { ScrollShadow } from "@nextui-org/react";

interface ModelDescriptionProps {
    description: string;
}

const ModelDescription = ({ description }: ModelDescriptionProps) => {
    return (
        <>
            <ScrollShadow
                className="overflow-y-auto max-h-[calc(4*1.5*16px)] mb-4"
                title="Model Description"
            >
                {description ? (
                    description
                ) : (
                    <p className="text-sm text-zinc-400">
                        No model description.
                    </p>
                )}
            </ScrollShadow>
        </>
    );
};

export default ModelDescription;
