import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { useCart } from "../../Context/cart-context";
import { Highlighted } from "./Highlighted";
import { useState } from "react";

export interface CartProps {}

export const Cart = ({}: CartProps) => {
  const navigate = useNavigate();
  const { removeFromCart, clearCart, cart } = useCart();
  const [cartSearch, setCartSearch] = useState("");
  const { pathname } = useLocation();
  const isOrderPage = pathname.includes("order");

  const nextOrderDetails = () => {
    navigate("/order");
  };

  const tableRows = cart.map((item, index) => {
    return (
      <tr className="product-incart" key={index}>
        <td>
          <img
            className="productimage-incart"
            src={"/images/products/" + item.image}
            alt={item.name}
          />
        </td>
        <td>
          <Highlighted highlight={cartSearch} text={item.name} />
        </td>
        <td>
          {item.quantity}x{item.price}={item.price * item.quantity}
        </td>

        {isOrderPage ? null : (
          <td>
            <button onClick={() => removeFromCart(item._id)}>
              <DeleteIcon color="secondary" />
            </button>
          </td>
        )}
      </tr>
    );
  });

  // acc - accumalator - we sum the total row into this variable
  const totalCart = cart.reduce((acc, product) => {
    return acc + product.price * product.quantity;
  }, 0);
  // 0 - initial acc

  return (
    <div className="cart-container">
      <h2 className="cart-header">My Cart</h2>
      <div className="cart">
        <div className="count">{cart.length}</div>

        <ShoppingCartRoundedIcon />
      </div>
      <input
        type="text"
        placeholder="Search in cart"
        value={cartSearch}
        onChange={(e) => setCartSearch(e.target.value)}
      />
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product Picture</th>
              <th>Prouct Name</th>
              <th>Quantity & Price</th>
              {isOrderPage ? null : <th>Delete</th>}
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
        {isOrderPage ? null : (
          <div className="total-Amount">
            Total: {totalCart}
            {""} ILS
          </div>
        )}
      </div>
      <div></div>
      {isOrderPage ? null : (
        <>
          <div>
            <Button
              className="clean-cart"
              variant="contained"
              sx={{ m: 1 }}
              color="primary"
              onClick={clearCart}
            >
              clean cart
            </Button>
          </div>

          <div>
            <Button
              className="cart-order"
              variant="contained"
              sx={{ m: 1 }}
              color="primary"
              onClick={nextOrderDetails}
            >
              Order
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
