// customerController.js
const { sql, poolPromise } = require("../models/db");

// 📌 Get all customers
const getCustomers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM CustomerMaster");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// 📌 Get customer by ID
const getCustomerById = async (req, res) => {
  try {
    const { led_cd } = req.params;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("led_cd", sql.Int, led_cd)
      .query("SELECT * FROM CustomerMaster WHERE led_cd = @led_cd");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// 📌 Add new customer (schema-aware dynamic insert)
const addCustomer = async (req, res) => {
  try {
    const pool = await poolPromise;

    const allowedColumns = new Set([
      // Core/new columns
      "led_shortname",
      "led_name",
      "led_cat",
      "led_adr1",
      "led_adr2",
      "led_adr3",
      "led_pin",
      "led_stcd",
      "led_mob",
      "led_email",
      "led_panno",
      "led_gstno",
      "led_gsttype",
      "led_tds",
      "led_bankname",
      "led_branchname",
      "led_acno",
      "led_ifsc",
      "led_uid",
      "led_active",
      // Dates/udt
      "led_udt",
      "led_udt1",
      "led_udt2",
      // Optional audit fields if present in table
      "led_crby",
      "led_crdt",
      "led_upby",
      "led_updt",
    ]);

    const payload = Object.entries(req.body)
      .filter(([key]) => allowedColumns.has(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    if (!payload.led_name) {
      return res.status(400).json({ error: "led_name is required" });
    }

    // Fetch non-nullable, non-identity columns from schema
    const schemaResult = await pool.request().query(`
      SELECT c.COLUMN_NAME, c.DATA_TYPE, c.IS_NULLABLE,
             COLUMNPROPERTY(object_id(c.TABLE_SCHEMA + '.' + c.TABLE_NAME), c.COLUMN_NAME, 'IsIdentity') AS IsIdentity
      FROM INFORMATION_SCHEMA.COLUMNS c
      WHERE c.TABLE_NAME = 'CustomerMaster'
    `);

    const requiredCols = schemaResult.recordset.filter(
      (col) =>
        col.IS_IDENTITY !== 1 &&
        col.IsIdentity !== 1 &&
        col.IS_NULLABLE === "NO" &&
        col.COLUMN_NAME !== "led_cd"
    );

    // Fill defaults for required columns not provided
    for (const col of requiredCols) {
      if (payload[col.COLUMN_NAME] !== undefined) continue;
      const name = col.COLUMN_NAME;
      const type = (col.DATA_TYPE || "").toLowerCase();
      switch (type) {
        case "int":
        case "smallint":
        case "tinyint":
        case "bigint":
        case "decimal":
        case "numeric":
        case "float":
        case "real":
          payload[name] = 0;
          break;
        case "bit":
          payload[name] = 0;
          break;
        case "date":
        case "datetime":
        case "datetime2":
        case "smalldatetime":
        case "time":
          payload[name] = new Date();
          break;
        default:
          payload[name] = "";
      }
    }

    const columns = Object.keys(payload);
    const placeholders = columns.map((c) => `@${c}`);
    const request = pool.request();

    for (const [key, rawValue] of Object.entries(payload)) {
      switch (key) {
        case "led_cat": {
          const val =
            rawValue === "" || rawValue === null || rawValue === undefined
              ? 0
              : parseInt(rawValue, 10);
          request.input(key, sql.Int, Number.isFinite(val) ? val : 0);
          break;
        }
        case "led_active": {
          const bitVal =
            rawValue === true || rawValue === 1 || rawValue === "1" ? 1 : 0;
          request.input(key, sql.Bit, bitVal);
          break;
        }
        case "led_tds": {
          const val =
            rawValue === "" || rawValue === null || rawValue === undefined
              ? 0
              : parseFloat(rawValue);
          request.input(key, sql.Float, Number.isFinite(val) ? val : 0);
          break;
        }
        case "led_udt":
        case "led_udt2":
        case "led_crdt":
        case "led_updt": {
          const val = rawValue ? new Date(rawValue) : new Date();
          request.input(
            key,
            sql.DateTime,
            isNaN(val?.getTime?.()) ? new Date() : val
          );
          break;
        }
        default: {
          request.input(key, sql.NVarChar, rawValue ?? "");
        }
      }
    }

    const insertSql = `INSERT INTO CustomerMaster (${columns.join(
      ", "
    )}) OUTPUT INSERTED.led_cd VALUES (${placeholders.join(", ")})`;
    const result = await request.query(insertSql);

    res
      .status(201)
      .json({ message: "Customer added", id: result.recordset[0].led_cd });
  } catch (err) {
    console.error("Error adding customer:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// 📌 Update customer
const updateCustomer = async (req, res) => {
  try {
    const { led_cd } = req.params;
    const pool = await poolPromise;

    const allowedColumns = new Set([
      "led_shortname",
      "led_name",
      "led_cat",
      "led_adr1",
      "led_adr2",
      "led_adr3",
      "led_pin",
      "led_stcd",
      "led_mob",
      "led_email",
      "led_panno",
      "led_gstno",
      "led_gsttype",
      "led_tds",
      "led_bankname",
      "led_branchname",
      "led_acno",
      "led_ifsc",
      "led_uid",
      "led_active",
      "led_udt",
      "led_udt1",
      "led_udt2",
      "led_crby",
      "led_crdt",
      "led_upby",
      "led_updt",
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
    request.input("led_cd", sql.Int, parseInt(led_cd, 10));

    for (const [key, rawValue] of Object.entries(payload)) {
      switch (key) {
        case "led_cat": {
          const val =
            rawValue === "" || rawValue === null || rawValue === undefined
              ? null
              : parseInt(rawValue, 10);
          request.input(key, sql.Int, Number.isFinite(val) ? val : null);
          break;
        }
        case "led_active": {
          const bitVal =
            rawValue === true || rawValue === 1 || rawValue === "1" ? 1 : 0;
          request.input(key, sql.Bit, bitVal);
          break;
        }
        case "led_tds": {
          const val =
            rawValue === "" || rawValue === null || rawValue === undefined
              ? null
              : parseFloat(rawValue);
          request.input(key, sql.Float, Number.isFinite(val) ? val : null);
          break;
        }
        case "led_udt":
        case "led_udt2":
        case "led_crdt":
        case "led_updt": {
          const val = rawValue ? new Date(rawValue) : null;
          request.input(
            key,
            sql.DateTime,
            isNaN(val?.getTime?.()) ? null : val
          );
          break;
        }
        default: {
          request.input(key, sql.NVarChar, rawValue ?? null);
        }
      }
    }

    const result = await request.query(
      `UPDATE CustomerMaster SET ${setClauses.join(
        ", "
      )} WHERE led_cd = @led_cd`
    );

    if (!result.rowsAffected || result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer updated successfully" });
  } catch (err) {
    console.error("Error updating customer:", err);
    res.status(500).json({ error: "Failed to update customer" });
  }
};

// 📌 Delete customer
const deleteCustomer = async (req, res) => {
  try {
    const { led_cd } = req.params;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("led_cd", sql.Int, led_cd)
      .query("DELETE FROM CustomerMaster WHERE led_cd = @led_cd");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer deleted" });
  } catch (err) {
    console.error("Error deleting customer:", err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};
