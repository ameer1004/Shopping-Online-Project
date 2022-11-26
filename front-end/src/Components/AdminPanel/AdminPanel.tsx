import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { httpService } from "../../Services/http-service";
import { Product } from "../../types";

export type NewProduct = Omit<Product, "_id" | "createdAt" | "updatedAt">;

export interface AdminPanelProps {
  productToEdit?: Product;
  setSelectedProduct: (product?: Product) => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const AdminPanel = ({
  productToEdit,
  setSelectedProduct,
  setProducts,
}: AdminPanelProps) => {
  const isEditing = !!productToEdit;

  const [product, setProduct] = useState<NewProduct>({
    name: "",
    image: "",
    category: "",
    description: "",
    price: 0,
    countInStock: 0,
    rating: 0,
    numReviews: 0,
  });

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    }
  }, [productToEdit]);
  //------ popover-------

  const handleAddProduct = async () => {
    const newProduct = { ...product };
    const result = await httpService.post("/api/products", newProduct);
    if (result) {
      setProducts((prevProducts: any) => [...prevProducts, newProduct]);
    }
    console.log(result);
  };
  const handleUpdateProduct = async () => {
    const updatedProduct = { ...product };
    const result = await httpService.put("/api/products", updatedProduct);
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) => {
        if (product._id === productToEdit!._id) {
          return { ...product, ...updatedProduct };
        }
        return product;
      });
      return updatedProducts;
    });
    console.log(result);
  };

  const clear = () => {
    setProduct({
      name: "",
      image: "",
      category: "",
      description: "",
      price: 0,
      countInStock: 0,
      rating: 0,
      numReviews: 0,
    });
    setSelectedProduct();
  };

  return (
    <div>
      <div>
        <h2>Add Or Edit products</h2>
        <div className="form-admin">
          <TextField
            id="outlined-required"
            placeholder="Product name"
            label="Product name"
            value={product.name}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <TextField
            id="outlined-required"
            placeholder="Product image"
            label="Product image"
            value={product.image}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, image: e.target.value }))
            }
          />
          <TextField
            id="outlined-required"
            placeholder="Product category"
            label="Product category"
            value={product.category}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
          />
          <TextField
            id="outlined-required"
            placeholder="Product description"
            label="Product description"
            value={product.description}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          <TextField
            id="outlined-required"
            placeholder="Product price"
            label="Product price"
            type="number"
            value={product.price >= 0 ? product.price : ""}
            onChange={(e) => {
              setProduct((prev) => ({
                ...prev,
                price: e.target.value ? parseInt(e.target.value) : -1,
              }));
            }}
          />
          <TextField
            id="outlined-required"
            placeholder="Product stock"
            label="Product stock"
            type="number"
            value={product.countInStock >= 0 ? product.countInStock : ""}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                countInStock: e.target.value ? parseInt(e.target.value) : -1,
              }))
            }
          />
          <TextField
            id="outlined-required"
            placeholder="Product rating"
            type="number"
            label="Product rating"
            value={product.rating >= 0 ? product.rating : ""}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                rating: e.target.value ? parseInt(e.target.value) : -1,
              }))
            }
          />
          <TextField
            id="outlined-required"
            placeholder="Product numReviews"
            type="number"
            label="Product numReviews"
            value={product.numReviews >= 0 ? product.numReviews : ""}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                numReviews: e.target.value ? parseInt(e.target.value) : -1,
              }))
            }
          />
        </div>
        <Button
          className="addtocart"
          variant="contained"
          sx={{ m: 1 }}
          color="secondary"
          style={{ left: "7rem" }}
          onClick={() => {
            isEditing ? handleUpdateProduct() : handleAddProduct();
          }}
        >
          {isEditing ? "Edit" : "Add"}
        </Button>
        <Button
          className="addtocart"
          variant="contained"
          sx={{ m: 1 }}
          color="secondary"
          style={{ left: "7rem" }}
          onClick={clear}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
