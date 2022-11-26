import { useEffect, useState } from "react";
import { httpService } from "../../Services/http-service";
import { Product } from "../../types";
import { Cart } from "../Cart/Cart";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import Button from "@mui/material/Button";
import { AdminPanel } from "../AdminPanel/AdminPanel";
import { TextField } from "@mui/material";

import BasicModal from "../Modal";
import "./Home.css";
import { useCart } from "../../Context/cart-context";
import { useAuth } from "../../Context/auth-context";

export interface HomeProps {
  searchValue: string;
}

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [addToCartModal, setAddToCartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [quantity, setQuantity] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  const { auth } = useAuth();
  const { addToCart } = useCart();

  const fetchProducts = async () => {
    try {
      const products = (await httpService.get("/api/products")) as Product[];
      if (products.length) {
        setProducts(products);
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
      console.log(err);
    }
  };

  const getProductsByCategory = async (categoryName: string) => {
    const products = await httpService.get(
      "/api/products/category/" + encodeURIComponent(categoryName)
    );
    setProducts(products);
  };

  const getProductBySearch = async (searchValue: string) => {
    const searchResults = await httpService.get(
      "/api/products/search/" + encodeURIComponent(searchValue)
    );
    setProducts(searchResults);
  };

  const fetchCategories = async () => {
    const categories = await httpService.get("/api/products/categories");
    console.log(categories);
    setCategories(categories);
  };

  useEffect(() => {
    if (searchValue) {
      getProductBySearch(searchValue);
    } else {
      fetchCategories();
      fetchProducts();
    }
  }, [searchValue]);

  const handleAddToCartClick = () => {
    console.log("add to cart");
    if (!selectedProduct) {
      return;
    }
    addToCart(selectedProduct, quantity);
    setAddToCartModal(false);
  };

  console.log(auth);
  return (
    <div id="home">
      <div id="cart">
        <div>
          <TextField
            className="textfield"
            id="outlined-name"
            label="Search Product"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {auth.isLoggedIn && auth.user.isAdmin ? (
          <AdminPanel
            productToEdit={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            setProducts={setProducts}
          />
        ) : (
          <Cart />
        )}
      </div>
      <div className="grid-wrapper">
        <div className="categories">
          <span className="category" onClick={() => fetchProducts()}>
            All Products
          </span>

          {searchValue
            ? null
            : categories.map((cateogry) => {
                return (
                  <span
                    className="category"
                    key={cateogry}
                    onClick={() => getProductsByCategory(cateogry)}
                  >
                    {cateogry}
                  </span>
                );
              })}
        </div>
        <div id="product-grid">
          {products.map((product, index) => {
            return (
              <div key={index} className="card">
                <img
                  src={"/images/products/" + product.image}
                  alt={product.name}
                />
                <div className="name">{product.name}</div>
                <div className="price">{product.price}ILS</div>
                <div className="description">{product.description}</div>

                <Button
                  variant="contained"
                  sx={{ m: 1 }}
                  color="secondary"
                  size="small"
                  onClick={() => {
                    setSelectedProduct(product);
                    if (auth.isLoggedIn && !auth.user.isAdmin) {
                      setAddToCartModal(true);
                    }
                  }}
                >
                  {auth.isLoggedIn && auth.user.isAdmin ? (
                    "Edit"
                  ) : (
                    <>
                      Add to Cart <AddShoppingCartRoundedIcon />
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      <BasicModal open={addToCartModal} setOpen={setAddToCartModal}>
        {selectedProduct && (
          <>
            <img
              className="selected-product-image"
              src={"/images/products/" + selectedProduct.image}
              alt={selectedProduct.name}
            />
            <div className="name">
              Proudct Name: {""}
              {selectedProduct.name}
            </div>
            <div className="price">
              Proudct Price: {""}
              {selectedProduct.price}ILS
            </div>
            <div>
              Please choose a quantity:{""}
              <input
                className="quantity-input"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.valueAsNumber)}
              />
            </div>

            <div>
              {" "}
              <button className="btn-modal" onClick={handleAddToCartClick}>
                Add
              </button>
            </div>
          </>
        )}
      </BasicModal>
    </div>
  );
};
