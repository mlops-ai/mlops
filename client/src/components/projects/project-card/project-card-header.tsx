import { useNavigate, useSearchParams } from "react-router-dom";

import { PinFilled } from "@/components/icons";

import ProjectDropdownActions from "@/components/projects/project-dropdown-actions";

import { Project } from "@/types/project";

interface ProjectCardProps {
    project: Project;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectCardHeader = ({ project, setLoading }: ProjectCardProps) => {
    const [searchParams, setSearchParams] = useSearchParams({
        ne: "default",
    });

    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between mb-2 font-semibold">
            <span className="flex items-center mr-2 cursor-pointer text-mlops-primary-tx dark:text-mlops-primary-tx-dark hover:underline">
                {project.pinned && (
                    <div title="Project is pinned">
                        <PinFilled className="flex-shrink-0 w-5 h-5 mr-1 text-mlops-primary" />
                    </div>
                )}{" "}
                <a
                    href={`/projects/${project._id}/experiments${
                        searchParams.get("ne") !== "default"
                            ? `?ne=${searchParams.get("ne")}`
                            : ""
                    }`}
                >
                    {project.title}
                </a>
            </span>
            <ProjectDropdownActions project={project} setLoading={setLoading} />
        </div>
    );
};

export default ProjectCardHeader;
