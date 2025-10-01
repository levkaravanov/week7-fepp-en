import { Link } from "react-router-dom";

/* {
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  supplier: {
    name: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
},
{ timestamps: true, versionKey: false } */

const ProductListings = ({ products }) => {
  return (
    <div className="product-list">
      {products.map((product) => (

        <div className="product-preview" key={product.id}>
          <Link to={`/products/${product.id}`}>
            <h2>{product.title}</h2>
          </Link>
          <p>Type: {product.category}</p>
          <p>Price: {product.price}</p>
          <p>Stock Quantity: {product.stockQuantity}</p>
          <p>Supplier: {product.supplier.name}</p>
          <p>Supplier Email: {product.supplier.contactEmail}</p>
          <p>Supplier Phone: {product.supplier.contactPhone}</p>
          <p>Supplier Rating: {product.supplier.rating}</p>
          <p>User ID: {product.user_id}</p>
          <p>Created At: {product.createdAt}</p>
          <p>Updated At: {product.updatedAt}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductListings;
