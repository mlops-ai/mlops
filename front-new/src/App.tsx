import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ModalProvider from "./components/providers/modal-provider";
import { PrimeReactProvider } from "primereact/api";

import { ErrorBoundary } from "react-error-boundary";
import { fallbackRender } from "@/components/error-boundary/fallbackRenderer";

import MainLayout from "@/layouts/main/layout";

import Projects from "@/pages/projects/Projects";
import Experiments from "@/pages/experiments/Experiments";

import Toast from "@/components/toast";
import Models from "./pages/models/Models";
import { Tailwind } from "./components/treeselect/treeselect-styles";
import Monitoring from "./pages/monitoring/Monitoring";
import Datasets from "./pages/datasets/Datasets";
import SingleIteration from "./pages/iterations/SingleIteration";
import CompareIterations from "./pages/iterations/CompareIterations";
import { lazy } from "react";

// const Projects = lazy(() => import("./pages/projects/Projects"));
// // @ts-ignore
// const Experiments = lazy(() => import("./pages/experiments/Experiments"));
// const Datasets = lazy(() => import("./pages/datasets/Datasets"));
// const Models = lazy(() => import("./pages/models/Models"));
// const SingleIteration = lazy(
//     () => import("./pages/iterations/SingleIteration")
// );
// const CompareIterations = lazy(
//     () => import("./pages/iterations/CompareIterations")
// );

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
                    <ModalProvider>
                        <ErrorBoundary fallbackRender={fallbackRender}>
                            <MainLayout>
                                <Routes>
                                    <Route path="/" element={<Projects />} />
                                    <Route
                                        path="/projects"
                                        element={<Projects />}
                                    />
                                    <Route
                                        path="/projects/:project_id/experiments"
                                        // @ts-ignore
                                        element={<Experiments />}
                                    />
                                    <Route
                                        path="/datasets"
                                        element={<Datasets />}
                                    />
                                    <Route
                                        path="/models"
                                        element={<Models />}
                                    />
                                    <Route
                                        path="/models/:model_id/monitoring"
                                        element={<Monitoring />}
                                    />
                                    <Route
                                        path="/projects/:project_id/experiments/:experiment_id/iterations/:iteration_id"
                                        element={<SingleIteration />}
                                    />
                                    <Route
                                        path="/projects/:project_id/iterations-compare"
                                        element={<CompareIterations />}
                                    />
                                </Routes>
                                <Toast />
                            </MainLayout>
                        </ErrorBoundary>
                    </ModalProvider>
                </PrimeReactProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
