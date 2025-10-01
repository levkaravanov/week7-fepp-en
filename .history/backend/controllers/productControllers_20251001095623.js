const Job = require("../models/productModel");
const mongoose = require("mongoose");

//GET / jobs;
const getAllProduct = async (req, res) => {
  res.send("getAllProduct");
};

// POST /jobs
const createProduct = async (req, res) => {
  res.send("createProduct");
};

// GET /jobs/:jobId
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
  getAllProduct,
  getProductById,
  createProduct,
  updateJob,
  deleteJob,
};
