import PageHeader from "../page-header";
import Breadcrumb from "../breadcrumb";
import Tabs from "../tabs/tabs";
import TabItem from "../tabs/tab-item";
import { VscFolderActive } from "react-icons/vsc";
import { DataArchive, Monitoring } from "../icons";

const ModelsHeader = () => {
    return (
        <>
            <div className="mb-4">
                <PageHeader title="Monitored models" />
                <Breadcrumb
                    items={[
                        {
                            name: "Monitored models",
                            Icon: Monitoring,
                            href: "/models",
                        },
                    ]}
                />
            </div>
            <div className="text-base border-b-2 border-gray-200 dark:border-gray-700">
                <Tabs>
                    <TabItem
                        title="Active/Idle models"
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

export default ModelsHeader;
