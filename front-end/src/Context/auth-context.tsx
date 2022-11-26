import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../types";

export interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  city: string;
  address: string;
  email: string;
  isAdmin: Boolean;
  cart: CartItem[];
}

export interface NotLoggedIn {
  isLoggedIn: false;
}
export interface LoggedIn {
  isLoggedIn: true;
  user: UserData;
}

export type Auth = NotLoggedIn | LoggedIn;

export interface IAuthContext {
  auth: Auth;
  login: (data: UserData) => void;
  logout: () => void;
}

export const defaultAuth: Auth = { isLoggedIn: false };
export const authContextDefaults: IAuthContext = {
  auth: defaultAuth,
  login: () => {},
  logout: () => {},
};

export const AuthContext =
  React.createContext<IAuthContext>(authContextDefaults);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<Auth>(defaultAuth);
  const navigate = useNavigate();

  const login = (userData: UserData) => {
    setAuth({ isLoggedIn: true, user: userData });
  };

  const logout = () => {
    setAuth(defaultAuth);
    fetch("http://localhost:5000/api/users/logout", {
      method: "delete",
      credentials: "include",
    });

    navigate("/login");
  };

  const value = { auth, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
