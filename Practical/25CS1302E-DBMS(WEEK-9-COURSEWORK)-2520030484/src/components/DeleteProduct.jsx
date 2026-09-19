import React, { useState } from "react";
import { deleteProduct } from "../services/productService";

function DeleteProduct() {
  const [id, setId] = useState("");

  const handleDelete = async () => {
    await deleteProduct(id);
    alert("Product deleted successfully!");
    setId("");
  };

  return (
    <div>
      <h2>Delete Product</h2>

      <input
        placeholder="Product ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <button onClick={handleDelete}>Delete Product</button>
    </div>
  );
}

export default DeleteProduct;