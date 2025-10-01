// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const EditProductPage = () => {
//   const [product, setproduct] = useState(null); // Initialize job state
//   const [loading, setLoading] = useState(true); // Loading state
//   const [error, setError] = useState(null); // Error state
//   const { id } = useParams();

//   // Declare state variables for form fields
//   const [title, setTitle] = useState("");
//   const [type, setType] = useState("");
//   const [description, setDescription] = useState("");
//   const [companyName, setCompanyName] = useState("");
//   const [contactEmail, setContactEmail] = useState("");
//   const [contactPhone, setContactPhone] = useState("");

//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = user ? user.token : null;

//   const navigate = useNavigate();

//   const updateProduct = async (product) => {
//     try {
//       console.log("Updating product:", product);
//       const res = await fetch(`/api/product/${product.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(product),
//       });
//       if (!res.ok) throw new Error("Failed to update product");
//       return res.ok;
//     } catch (error) {
//       console.error("Error updating product:", error);
//       return false;
//     }
//   };

//   // Fetch job data
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await fetch(`/api/products/${id}`);
//         if (!res.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await res.json();
//         setJob(data); // Set the job data

//         // Initialize form fields with fetched job data
//         setTitle(data.title);
//         setType(data.type);
//         setDescription(data.description);
//         setCompanyName(data.company.name);
//         setContactEmail(data.company.contactEmail);
//         setContactPhone(data.company.contactPhone);
//       } catch (error) {
//         console.error("Failed to fetch product:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false); // Stop loading after fetch
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   // Handle form submission
//   const submitForm = async (e) => {
//     e.preventDefault();

//     const updatedProduct = {
//       id,
//       title,
//       type,
//       description,
//       company: {
//         name: companyName,
//         contactEmail,
//         contactPhone,
//       },
//     };

//     const success = await updateProduct(updatedProduct);
//     if (success) {
//       console.log("Product Updated Successfully");
//       navigate(`/products/${id}`);
//     } else {
//       console.error("Failed to update the product");
//     }
//   };

//   return (
//     <div className="create">
//       <h2>Update Product</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : (
//         <form onSubmit={submitForm}>
//           <label>Product title:</label>
//           <input
//             type="text"
//             required
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//           <label>Product type:</label>
//           <select value={type} onChange={(e) => setType(e.target.value)}>
//             <option value="Full-Time">Full-Time</option>
//             <option value="Part-Time">Part-Time</option>
//             <option value="Remote">Remote</option>
//             <option value="Internship">Internship</option>
//           </select>

//           <label>Product Description:</label>
//           <textarea
//             required
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           ></textarea>
//           <label>Company Name:</label>
//           <input
//             type="text"
//             required
//             value={companyName}
//             onChange={(e) => setCompanyName(e.target.value)}
//           />
//           <label>Contact Email:</label>
//           <input
//             type="text"
//             required
//             value={contactEmail}
//             onChange={(e) => setContactEmail(e.target.value)}
//           />
//           <label>Contact Phone:</label>
//           <input
//             type="text"
//             required
//             value={contactPhone}
//             onChange={(e) => setContactPhone(e.target.value)}
//           />
//           <button>Update Product</button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default EditProductPage;
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // product & UI states
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [rating, setRating] = useState(3);

  // auth token (if available)
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;
  const token = user ? user.token : null;

  // fetch product on mount
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        // Adjust endpoint if your backend expects a different path.
        const res = await fetch(`/api/products/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch product");
        }
        const data = await res.json();
        setProduct(data);

        // populate form fields (use fallback for nested supplier)
        setTitle(data.title ?? "");
        setCategory(data.category ?? "");
        setDescription(data.description ?? "");
        setPrice(data.price != null ? String(data.price) : "");
        setStockQuantity(data.stockQuantity != null ? String(data.stockQuantity) : "");
        setSupplierName(data.supplier?.name ?? "");
        setContactEmail(data.supplier?.contactEmail ?? "");
        setContactPhone(data.supplier?.contactPhone ?? "");
        setRating(data.supplier?.rating ?? 3);
      } catch (err) {
        console.error("Fetch product error:", err);
        setError(err.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

  // basic client-side validation
  const validate = () => {
    if (!title.trim()) return "Title is required";
    if (!category.trim()) return "Category is required";
    if (!description.trim()) return "Description is required";
    if (price === "" || Number.isNaN(Number(price)) || Number(price) < 0) return "Price must be a number >= 0";
    if (stockQuantity === "" || !Number.isInteger(Number(stockQuantity)) || Number(stockQuantity) < 0)
      return "Stock quantity must be an integer >= 0";
    if (!supplierName.trim()) return "Supplier name is required";
    if (!/^\S+@\S+\.\S+$/.test(contactEmail)) return "Invalid contact email";
    if (!/^\+?[0-9\- ]{7,20}$/.test(contactPhone)) return "Invalid contact phone";
    if (!(rating >= 1 && rating <= 5)) return "Rating must be between 1 and 5";
    return null;
  };

  const updateProduct = async (payload) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update product");
      }

      const updated = await res.json();
      return { ok: true, data: updated };
    } catch (err) {
      console.error("Update error:", err);
      return { ok: false, error: err.message || "Update failed" };
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError(null);

    const clientValidationError = validate();
    if (clientValidationError) {
      setError(clientValidationError);
      return;
    }

    const payload = {
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      price: Number(parseFloat(price)),
      stockQuantity: Number(parseInt(stockQuantity, 10)),
      supplier: {
        name: supplierName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        rating: Number(rating),
      },
    };

    setSaving(true);
    const result = await updateProduct(payload);
    setSaving(false);

    if (result.ok) {
      // you can update local state or redirect
      navigate(`/products/${id}`);
    } else {
      setError(result.error || "Failed to update product");
    }
  };

  if (loading) return <div className="create"><h2>Update Product</h2><p>Loading...</p></div>;
  if (error && !product) return <div className="create"><h2>Update Product</h2><p style={{ color: "red" }}>{error}</p></div>;

  return (
    <div className="create">
      <h2>Update Product</h2>

      {error && product && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={submitForm}>
        <label>Product title:</label>
        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Category:</label>
        <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} />

        <label>Product Description:</label>
        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Price (USD):</label>
        <input
          type="number"
          step="0.01"
          min="0"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label>Stock Quantity:</label>
        <input
          type="number"
          step="1"
          min="0"
          required
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
        />

        <hr />

        <label>Supplier Name:</label>
        <input type="text" required value={supplierName} onChange={(e) => setSupplierName(e.target.value)} />

        <label>Contact Email:</label>
        <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />

        <label>Contact Phone:</label>
        <input type="tel" required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />

        <label>Supplier Rating (1-5):</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
