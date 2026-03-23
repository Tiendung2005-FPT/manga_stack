import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import "./css/System.css"
import Container from "./components/Container";
import Home from "./components/Home";
import MangaDetail from "./components/MangaDetail";
import ChapterReader from "./components/ChapterReader";
import Auth from "./components/Auth";
import Profile from "./components/Profile";
import Browse from "./components/Browse";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path='/home' element={<Home />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/browse' element={<Browse />} />
            <Route path='/manga/:id' element={<MangaDetail />} />
            <Route path='/manga/:id/chapter/:chapterId' element={<ChapterReader />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;