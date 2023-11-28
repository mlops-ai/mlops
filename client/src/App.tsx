import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ModalProvider from "./components/providers/modal-provider";
import { PrimeReactProvider } from "primereact/api";

import { ErrorBoundary } from "react-error-boundary";
import { fallbackRender } from "@/components/error-boundary/fallbackRenderer";

import MainLayout from "@/layouts/main/layout";

// import Projects from "@/pages/projects/Projects";
// import Experiments from "@/pages/experiments/Experiments";
// import Models from "./pages/models/Models";
// import Datasets from "./pages/datasets/Datasets";
// import Monitoring from "./pages/monitoring/Monitoring";
// import SingleIteration from "./pages/iterations/SingleIteration";
// import CompareIterations from "./pages/iterations/CompareIterations";

import Toast from "@/components/toast";
import { Tailwind } from "./components/treeselect/treeselect-styles";

import loadable from "@loadable/component";

const Projects = loadable(() => import("./pages/projects/Projects"));
const Experiments = loadable(() => import("./pages/experiments/Experiments"));
const SingleIteration = loadable(
    () => import("./pages/iterations/SingleIteration"),
    { fallback: <div>Loading...</div> }
);
const CompareIterations = loadable(
    () => import("./pages/iterations/CompareIterations")
);
const Datasets = loadable(() => import("./pages/datasets/Datasets"));
const Models = loadable(() => import("./pages/models/Models"));
const Monitoring = loadable(() => import("./pages/monitoring/Monitoring"));

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
                    <ModalProvider>
                        <ErrorBoundary fallbackRender={fallbackRender}>
                            <MainLayout>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={<Navigate to="/projects" />}
                                    />
                                    <Route
                                        path="/projects"
                                        element={<Projects />}
                                    />
                                    <Route
                                        path="/projects/:project_id/experiments"
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
