const express = require("express");
const router = express.Router();
const {
  getSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

router.get("/suppliers", getSuppliers);
router.get("/suppliers/:sup_cd", getSupplierById);
router.post("/suppliers", addSupplier);
router.put("/suppliers/:sup_cd", updateSupplier);
router.delete("/suppliers/:sup_cd", deleteSupplier);

module.exports = router;
