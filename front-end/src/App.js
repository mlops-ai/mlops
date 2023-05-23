import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {Helmet} from "react-helmet";

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';

import Navigation from "./components/Navigation";

import Projects from "./pages/Projects";
import Experiments from "./pages/Experiments";
import Iteration from "./pages/Iteration";
import Datasets from "./pages/Datasets";
import IterationsCompare from "./pages/IterationsCompare";
function App() {

    let perfEntries = performance.getEntriesByType("navigation");

    if (perfEntries[0].type === "back_forward") {
        window.location.reload();
    }

    return (
        <BrowserRouter>
            <Helmet>
                {/*<script src="./js/main.js" type="text/babel"></script>*/}
            </Helmet>

            <Navigation />

            <Routes>
                <Route exact path='/' element={<Navigate replace={true} to="/projects" />} />
                <Route path='/projects' exact element={<Projects />} />
                <Route path='/projects/:project_id/experiments' exact element={<Experiments />} />
                <Route path='/projects/:project_id/experiments/:experiment_id/iterations/:iteration_id' exact element={<Iteration />} />
                <Route path="/projects/:project_id/iterations-compare" exact element={<IterationsCompare />} />
                <Route path='/datasets' exact element={<Datasets />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
