import axios from "axios";

import React, { useEffect } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useSearchParams } from "react-router-dom";
import { useData } from "@/hooks/use-data-hook";

import { cn } from "@/lib/utils";

import { backendConfig } from "@/config/backend";

import NavigationSidebar from "@/components/navigation/sidebar/navigation-sidebar";
import NavigationTopbar from "@/components/navigation/topbar/navigation-topbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    console.log("MainLayout");

    const { showBoundary } = useErrorBoundary();

    /**
     * Extract backendConfig url and port for api requests
     */
    const { url, port } = backendConfig;

    const data = useData();

    /**
     * Fetch projects/datasets/models data from backend
     */
    useEffect(() => {
        let abortController = new AbortController();
        let signal = abortController.signal;

        (async () => {
            try {
                const projects = await axios.get(`${url}:${port}/projects/`, {
                    signal: signal,
                });
                const datasets = await axios.get(`${url}:${port}/datasets/`, {
                    signal: signal,
                });
                const models = await axios.get(`${url}:${port}/monitored-models/`, {
                    signal: signal,
                });
                data.setAll(projects.data, models.data, datasets.data);
            } catch (error: any) {
                if (!abortController.signal.aborted) {
                    showBoundary(error);
                }
            }
        })();

        return () => abortController.abort();
    }, []);

    const [searchParams] = useSearchParams({
        ne: "default",
    });

    const isCollapsedLg = searchParams.get("ne") === "collapsed-lg";
    const isExpandedMd = searchParams.get("ne") === "expanded-md";

    return (
        <div className="flex flex-col w-full">
            <NavigationTopbar />
            <div className="flex flex-shrink-0 flex-grow-0 w-full mt-[56px]">
                <NavigationSidebar />
                <main
                    className={cn(
                        "w-full p-5 ml-0 sm:pl-[84px] lg:pl-[300px] min-h-[calc(100vh-56px)]",
                        isCollapsedLg && "lg:pl-[84px]",
                        isExpandedMd && "sm:pl-[84px]"
                    )}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
