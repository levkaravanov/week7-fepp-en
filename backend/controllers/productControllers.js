const Product = require("../models/productModel");
const mongoose = require("mongoose");

//GET / products;
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({ message: "Failed to retrieve products" });
  }
};

// POST /products
const createProduct = async (req, res) => {
  try {
    const user_id = req.user._id;
    const newProduct = new Product({ ...req.body, user_id });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

// GET /products/:productId
const getProductById = async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(404).json({ error: "No such product" });
  }
  try {
    const product = await Product.findById(productId);
    if (!product) {
      console.error("Product not found");
      return res.status(404).json({ error: "No such product" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Failed to retrieve product" });
  }
};

// PUT /products/:productId
const updateProduct = async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(404).json({ error: "No such product" });
  }
  try {
    const user_id = req.user._id;
    const product = await Product.findOneAndUpdate(
      { _id: productId, user_id },
      { ...req.body },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: "No such product" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// DELETE /products/:productId
const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(404).json({ error: "No such product" });
  }
  try {
    const user_id = req.user._id;
    const product = await Product.findOneAndDelete({ _id: productId, user_id });
  if (!product) {
    return res.status(404).json({ error: "No such product" });
  }
  res.status(200).json(product);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
