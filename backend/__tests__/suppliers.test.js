const request = require("supertest");

// Mock DB layer
jest.mock("../models/db", () => {
  const fakeSql = {
    Int: "Int",
    NVarChar: "NVarChar",
    Bit: "Bit",
    Float: "Float",
    DateTime: "DateTime",
  };

  let table = [];
  let idSeq = 1;

  const buildRecord = (payload) => ({
    sup_cd: idSeq++,
    sup_name: "",
    sup_group: "",
    sup_status: "",
    sup_active: 0,
    sup_adr1: "",
    sup_adr2: "",
    sup_adr3: "",
    sup_state: "",
    sup_mob: "",
    sup_email: "",
    sup_panno: "",
    sup_gstno: "",
    sup_gsttype: "",
    sup_tds: null,
    sup_ratecat: "",
    sup_bankname: "",
    sup_branchname: "",
    sup_acno: "",
    sup_ifsc: "",
    sup_paymentduedays: null,
    created_at: new Date(),
    updated_at: new Date(),
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
          if (s.startsWith("select * from suppliermaster")) {
            if (s.includes("where sup_cd =")) {
              const id = inputs.sup_cd;
              const row = table.find((r) => r.sup_cd === id);
              return { recordset: row ? [row] : [] };
            }
            return { recordset: table.slice() };
          }
          if (s.startsWith("insert into suppliermaster")) {
            const rec = buildRecord(inputs);
            table.push(rec);
            return { recordset: [{ sup_cd: rec.sup_cd }] };
          }
          if (s.startsWith("update suppliermaster")) {
            const id = inputs.sup_cd;
            const idx = table.findIndex((r) => r.sup_cd === id);
            if (idx === -1) return { rowsAffected: [0] };
            table[idx] = { ...table[idx], ...inputs };
            return { rowsAffected: [1] };
          }
          if (s.startsWith("delete from suppliermaster")) {
            const id = inputs.sup_cd;
            const before = table.length;
            table = table.filter((r) => r.sup_cd !== id);
            return { rowsAffected: [before - table.length] };
          }
          throw new Error("Query not handled in test: " + sql);
        },
      };
    },
  };

  return { sql: fakeSql, poolPromise: Promise.resolve(fakePool) };
});

const app = require("../app");

describe("Supplier CRUD (mocked DB)", () => {
  it("creates supplier and returns id", async () => {
    const res = await request(app)
      .post("/api/suppliers")
      .send({
        sup_name: "RoadTrans",
        sup_email: "info@road.trans",
        sup_active: 1,
      });
    expect(res.status).toBe(201);
    expect(typeof res.body.id).toBe("number");
  });

  it("lists and updates supplier", async () => {
    const create = await request(app)
      .post("/api/suppliers")
      .send({ sup_name: "Alpha", sup_mob: "9876543210" });
    const id = create.body.id;

    const list = await request(app).get("/api/suppliers");
    expect(list.status).toBe(200);
    expect(list.body.find((s) => s.sup_cd === id)).toBeTruthy();

    const upd = await request(app)
      .put(`/api/suppliers/${id}`)
      .send({ sup_active: 0, sup_email: "team@alpha.com" });
    expect(upd.status).toBe(200);

    const single = await request(app).get(`/api/suppliers/${id}`);
    expect(single.status).toBe(200);
    expect(single.body.sup_email).toBe("team@alpha.com");
    expect(single.body.sup_active).toBe(0);
  });
});
