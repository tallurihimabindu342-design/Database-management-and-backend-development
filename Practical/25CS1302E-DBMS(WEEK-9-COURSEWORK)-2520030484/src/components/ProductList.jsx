import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const response = await getProducts();
    setProducts(response.data);
  };

  return (
    <div>
      <h2>Product List</h2>

      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: ₹{product.price}</p>
          <p>Quantity: {product.quantity}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductList;