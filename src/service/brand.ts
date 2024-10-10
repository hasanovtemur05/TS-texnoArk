import https from "./config";

const brand = {
  create: (data: number | string | boolean) => https.post("/brand/create", data), 
  get: (_p0: string, paramsObj: { params: { search: string; page: number; limit: number; }; }) => https.get("/brand/search", paramsObj), // params ni o'zgartirdik
  getBrandId: (id: number) => https.get(`/brand/category/${id}`),
  update: (id: number, data: number | string | boolean) => https.patch(`/brand/update/${id}`, data),
  delete: (id: number) => https.delete(`/brand/delete/${id}`)
};

export default brand;
