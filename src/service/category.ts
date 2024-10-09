import https from "./config";

const category = {
  create: (data: number | string | boolean) => https.post("/category/create", data),
  get: (params: string) => https.get('/category/search', { params:params }),
  update: (id : number, data: number | string | boolean) => https.patch(`/category/update/${id}`, data),
  delete: (id: number) => https.delete(`/category/delete/${id}`)
};

export default category;
