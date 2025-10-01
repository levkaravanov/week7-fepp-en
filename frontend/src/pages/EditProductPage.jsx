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
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [rating, setRating] = useState(3);
  const [canEdit, setCanEdit] = useState(true);
  const [showNoAccessModal, setShowNoAccessModal] = useState(false);

  // auth token (if available)
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;
  const token = user ? user.token : null;

  const getUserIdFromToken = (jwtToken) => {
    if (!jwtToken) return null;
    try {
      const base64Payload = jwtToken.split(".")[1];
      const json = JSON.parse(atob(base64Payload));
      return json?._id || json?.id || null;
    } catch (_e) {
      return null;
    }
  };

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
        setSupplierEmail(data.supplier?.contactEmail ?? "");
        setSupplierPhone(data.supplier?.contactPhone ?? "");
        setRating(data.supplier?.rating ?? 3);

        // determine edit permission (owner only)
        const currentUserId = getUserIdFromToken(token);
        const ownerId = data.user_id || data.userId || null;
        const allowed = ownerId ? currentUserId === ownerId : true;
        setCanEdit(allowed);
        if (!allowed) {
          setShowNoAccessModal(true);
        }
      } catch (err) {
        console.error("Fetch product error:", err);
        setError(err.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

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
        // Return structured error with status for better UX
        return { ok: false, status: res.status, error: text || "Failed to update product" };
      }

      const updated = await res.json();
      return { ok: true, data: updated };
    } catch (err) {
      console.error("Update error:", err);
      return { ok: false, status: 0, error: err.message || "Update failed" };
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError(null);

    if (!canEdit) {
      setError("You cannot edit this product because you are not the owner.");
      setShowNoAccessModal(true);
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
        contactEmail: supplierEmail.trim(),
        contactPhone: supplierPhone.trim(),
        rating: Number(rating),
      },
    };

    setSaving(true);
    const result = await updateProduct(payload);
    setSaving(false);

    if (result.ok) {
      navigate(`/products/${id}`);
    } else {
      if (result.status === 404) {
        setError("Product not found or you do not have permission to edit it.");
      } else if (result.status === 401 || result.status === 403) {
        setError("You must be logged in and own this product to edit it.");
      } else {
        setError(result.error || "Failed to update product");
      }
    }
  };

  if (loading) return <div className="create"><h2>Update Product</h2><p>Loading...</p></div>;
  if (error && !product) return <div className="create"><h2>Update Product</h2><p style={{ color: "red" }}>{error}</p></div>;

  return (
    <div className="create">
      <h2>Update Product</h2>

      {error && product && <p style={{ color: "red" }}>{error}</p>}
      {!canEdit && (
        <p style={{ color: "#c00", background: "#ffecec", padding: "8px 12px", borderRadius: 6 }}>
          You are viewing a product that you do not own. Editing is disabled.
        </p>
      )}

      <form onSubmit={submitForm}>
        <label>Product title:</label>
        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} disabled={!canEdit} />

        <label>Category:</label>
        <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} disabled={!canEdit} />

        <label>Product Description:</label>
        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} disabled={!canEdit} />

        <label>Price (USD):</label>
        <input
          type="number"
          step="0.01"
          min="0"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={!canEdit}
        />

        <label>Stock Quantity:</label>
        <input
          type="number"
          step="1"
          min="0"
          required
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          disabled={!canEdit}
        />

        <hr />

        <label>Supplier Name:</label>
        <input type="text" required value={supplierName} onChange={(e) => setSupplierName(e.target.value)} disabled={!canEdit} />

        <label>Supplier Email:</label>
        <input type="email" required value={supplierEmail} onChange={(e) => setSupplierEmail(e.target.value)} disabled={!canEdit} />

        <label>Supplier Phone:</label>
        <input type="tel" required value={supplierPhone} onChange={(e) => setSupplierPhone(e.target.value)} disabled={!canEdit} />

        <label>Supplier Rating (1-5):</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} disabled={!canEdit}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>

        <button type="submit" disabled={saving || !canEdit} aria-disabled={!canEdit}>
          {saving ? "Saving..." : "Update Product"}
        </button>
      </form>

      {showNoAccessModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowNoAccessModal(false)}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 8, width: "min(92vw, 420px)", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Editing disabled</h3>
            <p style={{ marginBottom: 16 }}>You cannot edit this product because you are not the owner.</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowNoAccessModal(false)}>Close</button>
              <button onClick={() => navigate(`/products/${id}`)}>Go to product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProductPage;
