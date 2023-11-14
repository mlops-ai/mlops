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
        title: "Models",
        path: "/models",
        icon: Monitoring,
    },
];

export const helpNavigationItems = [
    {
        title: "Github",
        path: "https://github.com/kajetsz/mlops",
        icon: Github
    },
    {
        title: "Documentation",
        path: "https://github.com/kajetsz/mlops/wiki",
        icon: FileText
    },
    {
        title: "Report issue",
        path: "https://github.com/kajetsz/mlops/issues",
        icon: AlertCircle
    },
];