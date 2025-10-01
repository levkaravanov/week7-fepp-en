const Product = require("../models/productModel");
// const Job = require("../models/productModel");
const mongoose = require("mongoose");

//GET / products;
const getAllJobs = async (req, res) => {
  res.send("getAllJobs");
};

// POST /products
const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create({ ...req.body });
    res.status(201).json(newProduct);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create Product", error: error.message });
  }
};
// GET /products/:productId
const getJobById = async (req, res) => {
  res.send("getJobById");
};

// PUT /jobs/:jobId
const updateJob = async (req, res) => {
  res.send("updateJob");
};

// DELETE /products/:productsId
const deleteProduct = async (req, res) => {
  res.send("deleteProduct");
};

module.exports = {
  getAllJobs,
  getJobById,
  createProduct,
  updateJob,
  deleteProduct,
};
