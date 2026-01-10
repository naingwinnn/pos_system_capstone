import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import UserHome from "./pages/UserHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user/home" element={<UserHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
