import { ScrollShadow } from "@nextui-org/react";

interface ProjectCardDescriptionProps {
    description?: string;
}

const ProjectCardDescription = ({
    description,
}: ProjectCardDescriptionProps) => {
    return (
        <ScrollShadow
            className="mb-3 overflow-y-auto max-h-[calc(4*1.5*16px)]"
            title="Project Description"
        >
            {description ? (
                description
            ) : (
                <p className="text-sm text-zinc-400">No project description.</p>
            )}
        </ScrollShadow>
    );
};

export default ProjectCardDescription;
