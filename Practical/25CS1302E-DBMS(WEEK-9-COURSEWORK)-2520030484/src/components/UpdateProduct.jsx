import React, { useState } from "react";
import { updateProduct } from "../services/productService";

function UpdateProduct() {
  const [id, setId] = useState("");
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: ""
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProduct(id, product);
    alert("Product updated successfully!");
  };

  return (
    <div>
      <h2>Update Product</h2>

      <input
        placeholder="Product ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
      />

      <input
        name="description"
        placeholder="Description"
        onChange={handleChange}
      />

      <input
        name="price"
        placeholder="Price"
        onChange={handleChange}
      />

      <input
        name="quantity"
        placeholder="Quantity"
        onChange={handleChange}
      />

      <button onClick={handleSubmit}>Update Product</button>
    </div>
  );
}

export default UpdateProduct;