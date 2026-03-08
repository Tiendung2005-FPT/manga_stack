import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import "./css/System.css"

function App() {
  return (
    <div className="system">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/home' element={<div></div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
