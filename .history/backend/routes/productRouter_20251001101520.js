const express = require("express");
const {
  getAllJobs,
  getProductById,
  createProduct,
  updateJob,
  deleteProduct,
} = require("../controllers/productControllers");

const router = express.Router();

router.get("/", getAllJobs);
router.post("/", createProduct);
router.get("/:productId", getProductById);
router.put("/:jobId", updateJob);
router.delete("/:jobId", deleteProduct);

module.exports = router;
