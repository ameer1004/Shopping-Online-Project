import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./Components/Header";
import { Home } from "./Components/Home/Home";
import { Login } from "./Components/Login";
import { Order } from "./Components/Order/Order";
import { Register } from "./Components/Register";
import { useAuth } from "./Context/auth-context";

function App() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    if (!auth.isLoggedIn) {
      navigate("/login");
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </div>
  );
}

export default App;
