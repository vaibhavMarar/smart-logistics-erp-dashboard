const { sql, poolPromise } = require("../models/db");

// Get all suppliers
const getSuppliers = async (_req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM SupplierMaster");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching suppliers:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// Get supplier by id
const getSupplierById = async (req, res) => {
  try {
    const { sup_cd } = req.params;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("sup_cd", sql.Int, parseInt(sup_cd, 10))
      .query("SELECT * FROM SupplierMaster WHERE sup_cd = @sup_cd");
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching supplier:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// Add supplier (supports all columns)
const addSupplier = async (req, res) => {
  try {
    const pool = await poolPromise;

    const allowedColumns = new Set([
      "sup_name",
      "sup_group",
      "sup_status",
      "sup_active",
      "sup_adr1",
      "sup_adr2",
      "sup_adr3",
      "sup_state",
      "sup_mob",
      "sup_email",
      "sup_panno",
      "sup_gstno",
      "sup_gsttype",
      "sup_tds",
      "sup_ratecat",
      "sup_bankname",
      "sup_branchname",
      "sup_acno",
      "sup_ifsc",
      "sup_paymentduedays",
      "created_at",
      "updated_at",
    ]);

    const payload = Object.entries(req.body)
      .filter(([key]) => allowedColumns.has(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    if (!payload.sup_name) {
      return res.status(400).json({ error: "sup_name is required" });
    }

    const columns = Object.keys(payload);
    const placeholders = columns.map((c) => `@${c}`);
    const request = pool.request();

    for (const [key, rawValue] of Object.entries(payload)) {
      switch (key) {
        case "sup_paymentduedays": {
          const val =
            rawValue === undefined || rawValue === null || rawValue === ""
              ? 0
              : parseInt(rawValue, 10);
          request.input(key, sql.Int, Number.isFinite(val) ? val : 0);
          break;
        }
        case "sup_active": {
          const bitVal =
            rawValue === true || rawValue === 1 || rawValue === "1" ? 1 : 0;
          request.input(key, sql.Bit, bitVal);
          break;
        }
        case "sup_tds": {
          const val =
            rawValue === undefined || rawValue === null || rawValue === ""
              ? 0
              : parseFloat(rawValue);
          request.input(key, sql.Float, Number.isFinite(val) ? val : 0);
          break;
        }
        case "created_at":
        case "updated_at": {
          const dateVal = rawValue ? new Date(rawValue) : new Date();
          request.input(
            key,
            sql.DateTime,
            isNaN(dateVal?.getTime?.()) ? new Date() : dateVal
          );
          break;
        }
        default: {
          request.input(key, sql.NVarChar, rawValue ?? "");
        }
      }
    }

    const insertSql = `INSERT INTO SupplierMaster (${columns.join(
      ", "
    )}) OUTPUT INSERTED.sup_cd VALUES (${placeholders.join(", ")})`;
    const result = await request.query(insertSql);
    res
      .status(201)
      .json({ message: "Supplier added", id: result.recordset[0].sup_cd });
  } catch (err) {
    console.error("Error adding supplier:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// Update supplier (dynamic set)
const updateSupplier = async (req, res) => {
  try {
    const { sup_cd } = req.params;
    const pool = await poolPromise;

    const allowedColumns = new Set([
      "sup_name",
      "sup_group",
      "sup_status",
      "sup_active",
      "sup_adr1",
      "sup_adr2",
      "sup_adr3",
      "sup_state",
      "sup_mob",
      "sup_email",
      "sup_panno",
      "sup_gstno",
      "sup_gsttype",
      "sup_tds",
      "sup_ratecat",
      "sup_bankname",
      "sup_branchname",
      "sup_acno",
      "sup_ifsc",
      "sup_paymentduedays",
      "created_at",
      "updated_at",
    ]);

    const payload = Object.entries(req.body)
      .filter(([key]) => allowedColumns.has(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    if (Object.keys(payload).length === 0) {
      return res
        .status(400)
        .json({ error: "No valid fields provided for update" });
    }

    const setClauses = Object.keys(payload).map((c) => `${c} = @${c}`);
    const request = pool.request();
    request.input("sup_cd", sql.Int, parseInt(sup_cd, 10));

    for (const [key, rawValue] of Object.entries(payload)) {
      switch (key) {
        case "sup_paymentduedays": {
          const val =
            rawValue === undefined || rawValue === null || rawValue === ""
              ? null
              : parseInt(rawValue, 10);
          request.input(key, sql.Int, Number.isFinite(val) ? val : null);
          break;
        }
        case "sup_active": {
          const bitVal =
            rawValue === true || rawValue === 1 || rawValue === "1" ? 1 : 0;
          request.input(key, sql.Bit, bitVal);
          break;
        }
        case "sup_tds": {
          const val =
            rawValue === undefined || rawValue === null || rawValue === ""
              ? null
              : parseFloat(rawValue);
          request.input(key, sql.Float, Number.isFinite(val) ? val : null);
          break;
        }
        case "created_at":
        case "updated_at": {
          const dateVal = rawValue ? new Date(rawValue) : null;
          request.input(
            key,
            sql.DateTime,
            isNaN(dateVal?.getTime?.()) ? null : dateVal
          );
          break;
        }
        default: {
          request.input(key, sql.NVarChar, rawValue ?? null);
        }
      }
    }

    const result = await request.query(
      `UPDATE SupplierMaster SET ${setClauses.join(
        ", "
      )} WHERE sup_cd = @sup_cd`
    );

    if (!result.rowsAffected || result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json({ message: "Supplier updated successfully" });
  } catch (err) {
    console.error("Error updating supplier:", err);
    res.status(500).json({ error: "Failed to update supplier" });
  }
};

// Delete supplier
const deleteSupplier = async (req, res) => {
  try {
    const { sup_cd } = req.params;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("sup_cd", sql.Int, parseInt(sup_cd, 10))
      .query("DELETE FROM SupplierMaster WHERE sup_cd = @sup_cd");
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    console.error("Error deleting supplier:", err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier,
};
