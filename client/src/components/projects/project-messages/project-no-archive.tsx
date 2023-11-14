import { DataArchive } from "@/components/icons";

const ProjectNoArchive = () => {
    return (
        <div className="flex flex-col items-center justify-center m-16">
            <DataArchive className="flex-grow-0 flex-shrink-0 w-16 h-16 text-mlops-primary-tx dark:text-mlops-primary-tx-dark" />
            <p className="mt-3 mb-1 text-xl font-semibold text-center text-mlops-gray dark:text-zinc-400">
                No archived projects.
            </p>
            <p className="text-sm text-center">
                There are no archived projects in database.
            </p>
        </div>
    );
};

export default ProjectNoArchive;
