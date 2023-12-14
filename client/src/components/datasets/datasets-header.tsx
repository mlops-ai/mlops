import Tabs from "../tabs/tabs";
import { DataArchive } from "../icons";
import { VscFolderActive } from "react-icons/vsc";
import TabItem from "../tabs/tab-item";
import { Database } from "lucide-react";
import PageHeader from "../page-header";
import Breadcrumb from "../breadcrumb";

const DatasetsHeader = () => {
    return (
        <>
            <div className="mb-4">
                <PageHeader title="Datasets" />
                <Breadcrumb
                    items={[
                        {
                            name: "Datasets",
                            Icon: Database,
                            href: "/datasets",
                        },
                    ]}
                />
            </div>
            <div className="text-base border-b-2 border-gray-200 dark:border-gray-700">
                <Tabs>
                    <TabItem
                        title="Active datasets"
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

export default DatasetsHeader;
