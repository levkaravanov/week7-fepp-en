const Job = require("../models/productModel");
const mongoose = require("mongoose");

//GET / products;
const getAllJobs = async (req, res) => {
  res.send("getAllJobs");
};

// POST /products
const createProduct = async (req, res) => {
  res.send("createProduct");
};

// GET /products/:productId
const getProductById = async (req, res) => {
  res.send("getProductById");
};

// PUT /jobs/:jobId
const updateJob = async (req, res) => {
  res.send("updateJob");
};

// DELETE /jobs/:jobId
const deleteJob = async (req, res) => {
  res.send("deleteJob");
};

module.exports = {
  getAllJobs,
  getProductById,
  createProduct,
  updateJob,
  deleteJob,
};
