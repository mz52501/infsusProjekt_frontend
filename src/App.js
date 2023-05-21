import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./pages/Layout.js";
import Home from "./pages/Home.js";
import NoPage from "./pages/NoPage.js";
import Predmet from "./pages/Predmet.js";
import RealHome from "./pages/RealHome.js";
import AddIspit from "./pages/AddIspit.js";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<RealHome />}/>
            <Route path="ispiti/:predmetId/:ispitId" element={<Home />} />
            <Route path="*" element={<NoPage/>}/>
            <Route path="predmeti"  element={<Predmet />} />
              <Route path="dodajIspit" element={<AddIspit />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
