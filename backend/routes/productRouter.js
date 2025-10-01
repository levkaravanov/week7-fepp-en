const express = require("express");
const {
  getAllJobs,
  getJobById,
  createProduct,
  updateJob,
  deleteProduct,
} = require("../controllers/productControllers");

const router = express.Router();

router.get("/", getAllJobs);
router.post("/", createProduct);
router.get("/:productId", getJobById);
router.put("/:jobId", updateJob);
router.delete("/:jobId", deleteProduct);

module.exports = router;
