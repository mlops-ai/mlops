import { Badge } from "@/components/ui/badge";

interface DatasetCardTagsProps {
    archived: boolean;
    tags: string;
    version: string;
}

const DatasetCardTags = ({ archived, tags, version }: DatasetCardTagsProps) => {
    const tagsArray = tags.split(",").filter((tag) => tag.trim() !== "");

    if (tagsArray.length === 0 && version === "" && !archived) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-3">
            {tagsArray.length > 0 &&
                tagsArray
                    .map((tag) => (
                        <Badge
                            key={tag}
                            variant="in_progress"
                            title="Dataset Tag"
                        >
                            {tag.trim()}
                        </Badge>
                    ))}
            {version !== "" && (
                <Badge variant="not_started" title="Dataset Version">
                    {version}
                </Badge>
            )}
            {archived && (
                <Badge variant="archived" title="Dataset is Archived">
                    Archived
                </Badge>
            )}
        </div>
    );
};

export default DatasetCardTags;
