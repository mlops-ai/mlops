import { Monitoring } from "@/components/icons";
import { AlertCircle, Database, FileText, Github, LayoutDashboard } from "lucide-react";

export const mainNavigationItems = [
    {
        title: "Projects",
        path: "/projects",
        icon: LayoutDashboard,
    },
    {
        title: "Datasets",
        path: "/datasets",
        icon: Database,
    },
    {
        title: "Monitored models",
        path: "/models",
        icon: Monitoring,
    },
];

export const helpNavigationItems = [
    {
        title: "Github",
        path: "https://github.com/mlops-ai/mlops",
        icon: Github
    },
    {
        title: "Documentation",
        path: "https://github.com/mlops-ai/mlops/wiki",
        icon: FileText
    },
    {
        title: "Report issue",
        path: "https://github.com/mlops-ai/mlops/issues",
        icon: AlertCircle
    },
];