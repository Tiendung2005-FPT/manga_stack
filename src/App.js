import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import "./css/System.css"
import Container from "./components/Container";
import Home from "./components/Home";
import MangaDetail from "./components/MangaDetail";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path='/home' element={<Home />} />
            <Route path='/manga/:id' element={<MangaDetail />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;