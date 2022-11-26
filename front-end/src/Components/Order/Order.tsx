import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useCart } from "../../Context/cart-context";
import { useNavigate } from "react-router-dom";
import { Cart } from "../Cart/Cart";
import "./Order.css";
import { useAuth } from "../../Context/auth-context";
import { httpService } from "../../Services/http-service";
import BasicModal from "../Modal";

export function Order() {
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [succesfulOrder, setSuccessfulOrder] = useState(false);
  const [creditCard, setCreditCard] = useState("");
  const [modalMessage, setModalMessage] = useState<boolean | string>("");
  const [shippingDate, setShippingDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { cart } = useCart();
  const { auth } = useAuth();

  const navigate = useNavigate();

  const backToShop = () => {
    navigate("/");
  };

  const totalCart = cart.reduce((acc, product) => {
    return acc + product.price * product.quantity;
  }, 0);

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!auth.isLoggedIn) {
        throw new Error("must be logged in");
      }

      if (!/^\d+/.test(creditCard) || creditCard.length !== 16) {
        throw new Error("Invalid credit card");
      }
      const order = {
        orderItems: cart,
        shippingAddress: city + " " + street,
        paymentMethod: creditCard,
        totalPrice: totalCart,
        shippingDate: shippingDate,
        user: auth.user._id,
      };
      const newOrder = await httpService.post("/api/orders", order);
      setModalMessage(newOrder.message);
      setSuccessfulOrder(true);
    } catch (err) {
      console.log(err);
      if (err instanceof Error) setModalMessage(err.message);
    }
  };

  const handleReciptClick = () => {
    let content = "";
    for (const item of cart) {
      content += `name: ${item.name} price: ${item.price} quantity: ${
        item.quantity
      } total price: ${item.price * item.quantity}\r\n`;
    }
    download("recipt", content);
  };

  return (
    <div id="order" className="order-container">
      <div className="back-order-btn">
        <Button
          variant="contained"
          sx={{ m: 1 }}
          color="secondary"
          size="small"
          onClick={backToShop}
        >
          Back To Shop
        </Button>
      </div>
      <div className="cartitems-order">
        <div className="allcards-order">
          <Cart />
        </div>
        <div className="pay-Amount">
          Total Amount To Pay: {totalCart}
          {""} ILS
        </div>
      </div>
      <div className="line"></div>

      <div className="cartitems-details">
        <form onSubmit={submitOrder}>
          <h2 className="order-titles">Order</h2>
          <h2 className="order-titles">Shipping Details</h2>
          <table className="table-order-details">
            <tr>
              <td>
                {" "}
                <label htmlFor="city">City</label>
              </td>
              <td>
                {" "}
                <select
                  onDoubleClick={() => {
                    if (auth.isLoggedIn && !auth.user.isAdmin) {
                      console.log({ city: auth.user });
                      setCity(auth.user.city);
                    }
                  }}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  name="city"
                  id="city"
                  value={city}
                >
                  <option value="jerusalem" selected>
                    Jerusalem
                  </option>
                  <option value="Tel Aviv">Tel Aviv</option>
                  <option value="Beer Sheva">Beer Sheva</option>
                  <option value="Haifa">Haifa</option>
                  <option value="Bnei Brak">Bnei Brak</option>
                  <option value="Rishon Lezyon">Rishon Lezyon</option>
                  <option value="Petah Tikva">Petah Tikva</option>
                  <option value="Netanya">Netanya</option>
                  <option value="Ashdod">Ashdod</option>
                  <option value="Holon">Holon</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="Street">Street</label>
              </td>
              <td>
                <input
                  type="text"
                  value={street}
                  onDoubleClick={() => {
                    if (auth.isLoggedIn && !auth.user.isAdmin) {
                      setStreet(auth.user.address);
                    }
                  }}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                {" "}
                <label htmlFor="Shipping Date">Shipping Date</label>
              </td>
              <td>
                <input
                  type="date"
                  value={shippingDate}
                  onChange={(e) => setShippingDate(e.target.value)}
                  required
                />
              </td>
            </tr>
            <h2 className="order-titles">Payments</h2>
            <tr>
              <td>
                <label htmlFor="Credit Card">Credit Card</label>{" "}
              </td>
              <td>
                <input
                  type="text"
                  value={creditCard}
                  onChange={(e) => setCreditCard(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <div className="order-btn">
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ m: 1 }}
                    color="secondary"
                    size="large"
                  >
                    Order
                  </Button>{" "}
                </div>
              </td>
            </tr>
          </table>
        </form>
      </div>
      <div className="modal-container">
        <BasicModal open={!!modalMessage} setOpen={() => setModalMessage("")}>
          {modalMessage}
          {succesfulOrder ? <div>להורדת הקבלה</div> : null}
          <div className="btn-modal-order">
            <Button
              variant="contained"
              sx={{ m: 1 }}
              color="secondary"
              size="small"
              onClick={handleReciptClick}
            >
              לחץ כאן{" "}
            </Button>
          </div>

          <div className="btn-modal-order">
            <Button
              variant="contained"
              sx={{ m: 1 }}
              color="secondary"
              size="small"
              onClick={() => setModalMessage("")}
            >
              אישור
            </Button>
          </div>
        </BasicModal>
      </div>
    </div>
  );
}

function download(filename: string, text: string) {
  const el = document.createElement("a");
  el.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  el.setAttribute("download", filename);
  el.style.display = "none";
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
}
