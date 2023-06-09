import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {Helmet} from "react-helmet";

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './styles/main.css';
import './styles/material-symbols-rounded.css';

import Navigation from "./components/Navigation";

import Projects from "./pages/Projects";
import Experiments from "./pages/Experiments";
import Iteration from "./pages/Iteration";
import Datasets from "./pages/Datasets";
import IterationsCompare from "./pages/IterationsCompare";
import Searchbar from "./components/topbar-navbar/Searchbar";
import {createContext, useContext, useState} from "react";

export const OptionsContext = createContext()

function App() {

    let perfEntries = performance.getEntriesByType("navigation");

    if (perfEntries[0].type === "back_forward") {
        window.location.reload();
    }

    const [refresher, setRefresher] = useState(0)

    return (
        <BrowserRouter>
            <OptionsContext.Provider value={[refresher, setRefresher]}>
                <Navigation />
                <Routes>
                    <Route exact path='/' element={<Navigate replace={true} to="/projects" />} />
                    <Route path='/projects' exact element={<Projects />} />
                    <Route path='/projects/:project_id/experiments' exact element={<Experiments />} />
                    <Route path='/projects/:project_id/experiments/:experiment_id/iterations/:iteration_id' exact element={<Iteration /> } />
                    <Route path="/projects/:project_id/iterations-compare" exact element={<IterationsCompare />} />
                    <Route path='/datasets' exact element={<Datasets />} />
                    <Route path='/searchbar' exact element={<Searchbar />} />
                </Routes>
            </OptionsContext.Provider>
        </BrowserRouter>
    );
}

export default App;
