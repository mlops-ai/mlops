import Tabs from "../tabs/tabs";
import { DataArchive } from "../icons";
import TabItem from "../tabs/tab-item";
import { VscFolderActive } from "react-icons/vsc";
import Breadcrumb from "../breadcrumb";
import PageHeader from "../page-header";
import { LayoutDashboard } from "lucide-react";

const ProjectsHeader = () => {
    return (
        <>
            <div className="mb-4">
                <PageHeader title="Projects dashboard" />
                <Breadcrumb
                    items={[
                        {
                            name: "Projects",
                            Icon: LayoutDashboard,
                            href: "/projects",
                        },
                    ]}
                />
            </div>
            <div className="text-base border-b-2 border-gray-200 dark:border-gray-700">
                <Tabs>
                    <TabItem
                        title="Active projects"
                        Icon={VscFolderActive}
                        param="archived"
                        value="false"
                    />
                    <TabItem
                        title="Archive"
                        Icon={DataArchive}
                        param="archived"
                        value="true"
                    />
                </Tabs>
            </div>
        </>
    );
};

export default ProjectsHeader;
