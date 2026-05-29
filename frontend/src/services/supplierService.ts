import { createLocalStore } from "@/lib/localStore";

export interface Supplier {
  sup_cd: number;
  [key: string]: unknown;
}

const SEED_SUPPLIERS: Supplier[] = [
  {
    sup_cd: 1,
    sup_name: "Steel Works India",
    sup_group: "Raw Material",
    sup_status: "Approved",
    sup_active: 1,
    sup_adr1: "Plot 12, MIDC",
    sup_adr2: "",
    sup_adr3: "",
    sup_state: "MH",
    sup_mob: "9988776655",
    sup_email: "sales@steelworks.in",
    sup_panno: "",
    sup_gstno: "27AAECS1234F1Z5",
    sup_gsttype: "Regular",
    sup_tds: null,
    sup_ratecat: "",
    sup_bankname: "",
    sup_branchname: "",
    sup_acno: "",
    sup_ifsc: "",
    sup_paymentduedays: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    sup_cd: 2,
    sup_name: "FastMove Logistics",
    sup_group: "Transport",
    sup_status: "Active",
    sup_active: 1,
    sup_adr1: "Transport Nagar",
    sup_adr2: "",
    sup_adr3: "",
    sup_state: "DL",
    sup_mob: "9012345678",
    sup_email: "ops@fastmove.com",
    sup_panno: "",
    sup_gstno: "",
    sup_gsttype: "Regular",
    sup_tds: null,
    sup_ratecat: "",
    sup_bankname: "",
    sup_branchname: "",
    sup_acno: "",
    sup_ifsc: "",
    sup_paymentduedays: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const store = createLocalStore<Supplier>("suppliers", "sup_cd", SEED_SUPPLIERS);

export const supplierService = {
  getAll: () => store.getAll(),

  getById: (id: number) => store.getById(id),

  create: (payload: Record<string, unknown>) => {
    const now = new Date().toISOString();
    return store.create({
      sup_group: "",
      sup_status: "",
      sup_adr1: "",
      sup_adr2: "",
      sup_adr3: "",
      sup_state: "",
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
      created_at: now,
      updated_at: now,
      ...payload,
    });
  },

  update: (id: number, payload: Record<string, unknown>) =>
    store.update(id, {
      ...payload,
      updated_at: new Date().toISOString(),
    }),

  delete: (id: number) => store.remove(id),
};
