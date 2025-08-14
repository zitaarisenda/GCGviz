export const seedUser = [
  {
    id: 1,
    email: "arsippostgcg@gmail.com",
    password: "postarsipGCG.", // Untuk produksi, hash password!
    role: "superadmin",
    name: "Super Admin",
    direktorat: "Direktorat Keuangan",
    subdirektorat: "Sub Direktorat Financial Policy and Asset Management",
    divisi: "Divisi Kebijakan Keuangan"
  },
  {
    id: 2,
    email: "admin@posindonesia.co.id",
    password: "admin123",
    role: "admin",
    name: "Administrator",
    direktorat: "Direktorat Operasional",
    subdirektorat: "Sub Direktorat Courier and Logistic Operation",
    divisi: "Divisi Operasional Logistik"
  },
  {
    id: 3,
    email: "user@posindonesia.co.id",
    password: "user123",
    role: "user",
    name: "User",
    direktorat: "Direktorat Pemasaran",
    subdirektorat: "Sub Direktorat Retail Business",
    divisi: "Divisi Ritel"
  }
]; 