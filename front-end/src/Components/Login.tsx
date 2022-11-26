import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/auth-context";
import { httpService } from "../Services/http-service";
import LandingPage from "./landingpage/LandingPage";
import "./Styles/style.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { auth, login } = useAuth();
  const [message, setMessage] = useState("");
  const [storeInfoMessage, setStoreInfoMessage] = useState("");

  const fetchUserMessage = async (userId: string) => {
    const { message } = await httpService.get(
      `/api/users/notification/${userId}`
    );
    setMessage(message);
  };

  const fetchStoreInfoMessage = async () => {
    const { message } = await httpService.get(`/api/products/notification`);
    setStoreInfoMessage(message);
  };

  useEffect(() => {
    fetchStoreInfoMessage();
    if (auth.isLoggedIn) {
      if (auth.user.isAdmin) {
        navigate("/");
      } else {
        fetchUserMessage(auth.user._id);
      }
    }
  }, [auth.isLoggedIn]);

  const startShopping = () => {
    navigate("/");
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("you must fill all the fields");
      return;
    }

    try {
      const result = await httpService.post("/api/users/login", {
        email,
        password,
      });
      if (!result.email) {
        throw new Error(result.message);
      }

      login(result);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        console.log(error);
      }
    }
  };
  return (
    <div>
      <div className="form-container">
        <p className="storeMessage">{storeInfoMessage}</p>
        {auth.isLoggedIn ? (
          <div>
            <p>{message}</p>

            <button className="btn-shopping" onClick={startShopping}>
              Start Shopping
            </button>
          </div>
        ) : null}

        <form>
          <h1>Sign in</h1>

          <input
            className="inpu-signin"
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="inpu-signin"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn-signin" type="submit" onClick={handleSubmit}>
            Sign In
          </button>
        </form>
        <div className="errormessage">{errorMsg}</div>

        <p className="para-question">Don`t you have an account? </p>
        <div>
          <Link to="/signup" className="link-to-register">
            Please Click here to register!
          </Link>
        </div>
      </div>
      <div>
        <LandingPage />
      </div>
    </div>
  );
}
