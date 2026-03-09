import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import "./css/System.css"
import Container from "./components/Container";
import Home from "./components/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Header />
        <Container>
          <Routes>
            <Route path='/home' element={<Home />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;