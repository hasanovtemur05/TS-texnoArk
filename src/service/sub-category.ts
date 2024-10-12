/* eslint-disable @typescript-eslint/no-unused-vars */
import https from "./config";

const subcategory = {
  create: (data: string | number | boolean, _numericId: number) => https.post("/sub-category/create", data),
  get: (parent_id:number, params: string) => https.get(`/sub-category/search/${parent_id}`,{params}),
  update: (id: number, data: string | number | boolean, _numericId: number) => https.patch(`/sub-category/update/${id}`, data),
  delete: (id: number) => https.delete(`/sub-category/delete/${id}`)
};

export default subcategory;