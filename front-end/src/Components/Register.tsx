import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/auth-context";
import { httpService } from "../Services/http-service";
import "./Styles/style.css";

export function Register() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerPhase, setRegisterPhase] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();
  const validateFirstPhase = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!password || !confirmPassword || !email || !userId) {
      setErrorMessage("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const [mailUser, mailDomain] = email.split("@");
    if (
      !mailUser ||
      !mailDomain ||
      mailDomain.length < 3 ||
      !mailDomain.includes(".")
    ) {
      setErrorMessage("Email is not valid");
      return;
    }

    try {
      const result = await httpService.get(`/api/users/check-id/${userId}`);
      console.log(result);
      if (result.available) {
        setRegisterPhase(2);
        setErrorMessage("");
      } else {
        setErrorMessage("Id already exist");
      }
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    }
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const newUser = {
        idNumber: userId,
        email,
        password,
        firstName,
        lastName,
        city,
        address,
      };
      const result = await httpService.post("/api/users/signup", newUser);
      console.log(result);
      login(result);

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="form-container">
      <form>
        <h1>SignUp</h1>

        <div
          id="phase-1"
          style={{ display: registerPhase === 2 ? "none" : undefined }}
        >
          <input
            className="inpu-signup"
            type="string"
            placeholder="id number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            className="inpu-signup"
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="inpu-signup"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="inpu-signup"
            type="password"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="btn-signup" onClick={validateFirstPhase}>
            Next
          </button>
        </div>
        <div
          id="phase-2"
          style={{ display: registerPhase === 2 ? undefined : "none" }}
        >
          <select
            className="inpu-signup"
            onChange={(e) => setCity(e.target.value)}
            required
            name="city"
            id="city"
            placeholder="city"
          >
            <option value="jerusalem" selected>
              Jerusalem
            </option>
            <option value="tel-aviv">Tel Aviv</option>
            <option value="beer-sheva">Beer Sheva</option>
            <option value="haifa">Haifa</option>
            <option value="bnei-brak">Bnei Brak</option>
            <option value="rishon-lezyon">Rishon Lezyon</option>
            <option value="petah-tikva">Petah Tikva</option>
            <option value="netanya">Netanya</option>
            <option value="ashdod">Ashdod</option>
            <option value="holon">Holon</option>
          </select>
          <input
            className="inpu-signup"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            required
            type="text"
            name="street"
            id="street"
            placeholder="street"
          />
          <input
            className="inpu-signup"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            required
            type="text"
            name="first-name"
            id="first-name"
            placeholder="first-name"
          />
          <input
            className="inpu-signup"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            required
            type="text"
            name="last-name"
            id="last-name"
            placeholder="last-name"
          />
          <button className="btn-signup" onClick={() => setRegisterPhase(1)}>
            Back
          </button>
          <button className="btn-signup" type="submit" onClick={handleSubmit}>
            Register
          </button>
        </div>
      </form>

      <div>{errorMessage}</div>
    </div>
  );
}
