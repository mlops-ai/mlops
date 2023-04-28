import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {Helmet} from "react-helmet";

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';

import Navigation from "./components/Navigation";

import Projects from "./pages/Projects";
import Experiments from "./pages/Experiments";

function App() {

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
            </Routes>
        </BrowserRouter>
    );
}

export default App;