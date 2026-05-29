import { createLocalStore } from "@/lib/localStore";

export interface Customer {
  led_cd: number;
  [key: string]: unknown;
}

const SEED_CUSTOMERS: Customer[] = [
  {
    led_cd: 1,
    led_shortname: "ACME",
    led_name: "ACME Corporation",
    led_cat: 2,
    led_adr1: "123 Industrial Area",
    led_adr2: "",
    led_adr3: "",
    led_pin: "400001",
    led_stcd: "MH",
    led_mob: "9876543210",
    led_email: "info@acme.com",
    led_panno: "",
    led_gstno: "27AABCU9603R1ZM",
    led_gsttype: "Regular",
    led_tds: null,
    led_bankname: "",
    led_branchname: "",
    led_acno: "",
    led_ifsc: "",
    led_uid: "",
    led_active: 1,
    led_udt: null,
    led_udt1: "",
    led_udt2: null,
    led_crby: "admin",
    led_crdt: new Date().toISOString(),
    led_upby: "admin",
    led_updt: new Date().toISOString(),
  },
  {
    led_cd: 2,
    led_shortname: "Beta",
    led_name: "Beta Traders Pvt Ltd",
    led_cat: 1,
    led_adr1: "45 Market Road",
    led_adr2: "",
    led_adr3: "",
    led_pin: "380001",
    led_stcd: "GJ",
    led_mob: "9123456780",
    led_email: "contact@beta.com",
    led_panno: "",
    led_gstno: "",
    led_gsttype: "Unregistered",
    led_tds: null,
    led_bankname: "",
    led_branchname: "",
    led_acno: "",
    led_ifsc: "",
    led_uid: "",
    led_active: 1,
    led_udt: null,
    led_udt1: "",
    led_udt2: null,
    led_crby: "admin",
    led_crdt: new Date().toISOString(),
    led_upby: "admin",
    led_updt: new Date().toISOString(),
  },
];

const store = createLocalStore<Customer>("customers", "led_cd", SEED_CUSTOMERS);

export const customerService = {
  getAll: () => store.getAll(),

  getById: (id: number) => store.getById(id),

  create: (payload: Record<string, unknown>) => {
    const { led_cd: _removed, ...rest } = payload;
    const name = String(rest.led_name ?? "").trim();
    if (!name) {
      throw new Error("Customer name is required");
    }

    const now = new Date().toISOString();
    return store.create({
      led_shortname: "",
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
      led_udt: null,
      led_udt1: "",
      led_udt2: null,
      led_crby: "admin",
      led_crdt: now,
      led_upby: "admin",
      led_updt: now,
      ...rest,
      led_name: name,
    });
  },

  update: (id: number, payload: Record<string, unknown>) => {
    const { led_cd: _removed, ...rest } = payload;
    return store.update(id, {
      ...rest,
      led_upby: "admin",
      led_updt: new Date().toISOString(),
    });
  },

  delete: (id: number) => store.remove(id),
};
