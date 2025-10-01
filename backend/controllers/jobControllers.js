const Job = require("../models/jobModel");
const mongoose = require("mongoose");

//GET / jobs;
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve jobs" });
  }
};

// POST /jobs
const createJob = async (req, res) => {
  res.send("createJob");
};

// GET /jobs/:jobId
const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve job" });
  }
};

// PUT /jobs/:jobId
const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { title, type, description, company } = req.body;
    const job = await Job.findByIdAndUpdate(jobId, { title, type, description, company }, { new: true });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to update job" });
  }
};

// DELETE /jobs/:jobId
const deleteJob = async (req, res) => {
  res.send("deleteJob");
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
