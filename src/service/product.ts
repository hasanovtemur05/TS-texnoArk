import https from "./config";

const product = {
  create: (data: string | number | boolean) => https.post("/products/create", data ), 
  get: (params: string) => https.get("/products/search", {params}),
  update: (id: number, data: string | number | boolean) => https.patch(`/products/update/${id}`, data),
  delete: (id: number) => https.delete(`/products/delete/${id}`)
};


export default product;