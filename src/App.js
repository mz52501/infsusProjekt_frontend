import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Predmet from "./pages/Predmet";
import RealHome from "./pages/RealHome";
import AddIspit from "./pages/AddIspit";

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
