import React, { useEffect, useState } from "react";
import { httpService } from "../Services/http-service";
import { CartItem, Product } from "../types";
import { useAuth } from "./auth-context";

export interface ICartContext {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const cartContextDefaults: ICartContext = {
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
};

export const CartContext =
  React.createContext<ICartContext>(cartContextDefaults);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (auth.isLoggedIn) {
      console.log(auth.user.cart);
      setCart(auth.user.cart ?? []);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isLoggedIn]);

  useEffect(() => {
    if (auth.isLoggedIn) {
      // sending the entire updated cart
      httpService.post(`/api/users/cart/${auth.user._id}`, cart);
    }
    /// effects runs when auth or cart changes
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  const removeFromCart = (productId: string) => {
    setCart((cartItems) =>
      cartItems.filter((product) => product._id !== productId)
    );
  };
  const addToCart = (product: Product, quantity: number) => {
    const newCartItem = { ...product, quantity };
    setCart((prevItems) => {
      // בדיקה אם המוצר כבר נמצא בעגלה, ואם כן מה האינדקס שלו
      const index = prevItems.findIndex(
        (inner_product) => inner_product._id === product._id
      );

      if (index === -1) {
        return [...prevItems, newCartItem]; //...prevItems: משכפלים מה שיש
      } else {
        // משכפל א, המערך למערך חדש
        const newCart = [...prevItems];
        // מגדיל א, הכמו,
        const newQuantity = newCart[index].quantity + quantity;
        newCart[index] = { ...newCart[index], quantity: newQuantity };
        return newCart;
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = { cart, addToCart, clearCart, removeFromCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return React.useContext(CartContext);
};
