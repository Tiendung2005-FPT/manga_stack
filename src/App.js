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
import MyList from "./components/MyList";

import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UsersCRUD from "./components/Admin/UsersCRUD";
import MangaCRUD from "./components/Admin/MangaCRUD";
import ChaptersCRUD from "./components/Admin/ChaptersCRUD";
import GenresCRUD from "./components/Admin/GenresCRUD";

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
            <Route path="/my-list" element={<MyList/>} />
            <Route path='/browse' element={<Browse />} />
            <Route path='/manga/:id' element={<MangaDetail />} />
            <Route path='/manga/:id/chapter/:chapterId' element={<ChapterReader />} />
            
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UsersCRUD />} />
              <Route path="mangas" element={<MangaCRUD />} />
              <Route path="chapters" element={<ChaptersCRUD />} />
              <Route path="genres" element={<GenresCRUD />} />
            </Route>
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;