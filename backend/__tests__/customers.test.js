const request = require("supertest");
jest.mock("../models/db", () => {
  const actual = jest.requireActual("../models/db");
  // Provide a fake mssql object with minimal shape used by the controller
  const fakeSql = {
    Int: "Int",
    NVarChar: "NVarChar",
    Bit: "Bit",
    Float: "Float",
    DateTime: "DateTime",
  };
  // Build a simple in-memory table for CustomerMaster
  let table = [];
  let idSeq = 1;

  const buildRecord = (payload) => ({
    led_cd: idSeq++,
    led_shortname: "",
    led_name: "",
    led_cat: null,
    led_adr1: "",
    led_adr2: "",
    led_adr3: "",
    led_pin: "",
    led_stcd: "",
    led_mob: "",
    led_email: "",
    led_panno: "",
    led_gstno: "",
    led_gsttype: "",
    led_tds: null,
    led_bankname: "",
    led_branchname: "",
    led_acno: "",
    led_ifsc: "",
    led_uid: "",
    led_active: 0,
    led_udt: null,
    led_udt1: "",
    led_udt2: null,
    led_crby: "test",
    led_crdt: new Date(),
    led_upby: "test",
    led_updt: new Date(),
    ...payload,
  });

  const fakePool = {
    request() {
      const inputs = {};
      return {
        input(name, _type, value) {
          inputs[name] = value;
          return this;
        },
        async query(sql) {
          const s = String(sql).toLowerCase();
          if (s.startsWith("select * from customermaster")) {
            if (s.includes("where led_cd =")) {
              const id = inputs.led_cd;
              const row = table.find((r) => r.led_cd === id);
              return { recordset: row ? [row] : [] };
            }
            return { recordset: table.slice() };
          }
          if (s.startsWith("insert into customermaster")) {
            const rec = buildRecord(inputs);
            table.push(rec);
            return { recordset: [{ led_cd: rec.led_cd }] };
          }
          if (s.startsWith("update customermaster")) {
            const id = inputs.led_cd;
            const idx = table.findIndex((r) => r.led_cd === id);
            if (idx === -1) return { rowsAffected: [0] };
            table[idx] = { ...table[idx], ...inputs };
            return { rowsAffected: [1] };
          }
          if (s.startsWith("delete from customermaster")) {
            const id = inputs.led_cd;
            const before = table.length;
            table = table.filter((r) => r.led_cd !== id);
            return { rowsAffected: [before - table.length] };
          }
          if (s.includes("information_schema.columns")) {
            // minimal schema response for required cols detection; mark everything nullable
            return { recordset: [] };
          }
          throw new Error("Query not handled in test: " + sql);
        },
      };
    },
  };

  return { sql: fakeSql, poolPromise: Promise.resolve(fakePool) };
});

const app = require("../app");

describe("Customer CRUD (mocked DB)", () => {
  it("creates a customer and returns new id", async () => {
    const res = await request(app)
      .post("/api/customers")
      .send({
        led_name: "ACME Corp",
        led_email: "info@acme.com",
        led_active: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(typeof res.body.id).toBe("number");
  });

  it("lists customers and updates one", async () => {
    // create first
    const create = await request(app)
      .post("/api/customers")
      .send({ led_name: "Beta Ltd", led_mob: "9999999999" });
    const id = create.body.id;

    // list
    const list = await request(app).get("/api/customers");
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.find((c) => c.led_cd === id)).toBeTruthy();

    // update
    const upd = await request(app)
      .put(`/api/customers/${id}`)
      .send({ led_email: "support@beta.com", led_active: 0 });
    expect(upd.status).toBe(200);

    // verify
    const single = await request(app).get(`/api/customers/${id}`);
    expect(single.status).toBe(200);
    expect(single.body.led_email).toBe("support@beta.com");
    expect(single.body.led_active).toBe(0);
  });
});
