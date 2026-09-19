import React, { useState } from "react";
import { addProduct } from "../services/productService";

function AddProduct() {
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
    await addProduct(product);
    alert("Product added successfully!");
  };

  return (
    <div>
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>
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

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;