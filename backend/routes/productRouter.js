const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:productId", getProductById);

router.post("/", requireAuth, createProduct);
router.put("/:productId", requireAuth, updateProduct);
router.delete("/:productId", requireAuth, deleteProduct);

module.exports = router;
