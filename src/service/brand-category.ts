import https from "./config";

const brandCategory = {
   create: (data: string | number | boolean) => https.post("/brand-category/create", data),
   get: (params: string) => https.get("/brand-category/search",{params}),
   brandCategoryId: (id: number) => https.get(`/brand-category/brand/${id}`),
   update: (id:number, data:number | string | boolean) => https.patch(`/brand-category/update/${id}`, data),
   delete: (id: number) => https.delete(`/brand-category/delete/${id}`),
   getBrand: (id: number) => https.get(`/brand-category/brand/${id}`),
};

export default brandCategory;
