import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [supplierRating, setSupplierRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const navigate = useNavigate();

  const addProduct = async (newProduct) => {
    try {
      console.log("Adding product:", newProduct);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) {
        throw new Error("Failed to add product");
      }
      return true;
    } catch (error) {
      console.error("Error adding product:", error);
      return false;
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    // Ensure rating is selected (1-5)
    if (!supplierRating || supplierRating < 1) {
      window.alert("Please select supplier rating (1-5)");
      return;
    }

    const newProduct = {
      title,
      category,
      description,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      supplier: {
        name: supplierName,
        contactEmail: supplierEmail,
        contactPhone: supplierPhone,
        rating: Number(supplierRating),
      },
    };

    const success = await addProduct(newProduct);
    if (success) {
      console.log("Product Added Successfully");
      navigate("/");
    } else {
      console.error("Failed to add the product");
    }
  };

  return (
    <div className="create">
      <h2>Add a New Product</h2>
      <form onSubmit={submitForm}>
        <label>Product title:</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Product category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="Furniture">Furniture</option>
          <option value="Other">Other</option>
        </select>

        <label>Product Description:</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <label>Price:</label>
        <input
          type="number"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <label>Stock Quantity:</label>
        <input
          type="number"
          required
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
        />
        <label>Supplier Name:</label>
        <input
          type="text"
          required
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
        />
        <label>Supplier Email:</label>
        <input
          type="email"
          required
          value={supplierEmail}
          onChange={(e) => setSupplierEmail(e.target.value)}
        />
        <label>Supplier Phone:</label>
        <input
          type="tel"
          required
          value={supplierPhone}
          onChange={(e) => setSupplierPhone(e.target.value)}
        />
        <label>Supplier Rating:</label>
        <div
          className="star-rating"
          role="group"
          aria-label="Supplier rating"
          style={{ display: "flex", gap: "4px", alignItems: "center" }}
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = (hoverRating || supplierRating) >= star;
            return (
              <button
                type="button"
                key={star}
                onClick={() => setSupplierRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${star} ${star > 1 ? "stars" : "star"}`}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  lineHeight: 1,
                  color: isActive ? "#f5c518" : "#cccccc",
                  padding: 0,
                }}
              >
                {isActive ? "★" : "☆"}
              </button>
            );
          })}
          <span style={{ marginLeft: "6px", fontSize: "0.95rem", color: "#666" }}>
            {supplierRating > 0 ? `${supplierRating}/5` : "Select rating"}
          </span>
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductPage;
