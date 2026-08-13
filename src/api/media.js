import api from "./axios";

export const getMedias = () => api.get("/medias");
export const getMedia = (id) => api.get(`/medias/${id}`);
export const createMedia = (data) => api.post("/medias", data);
export const updateMedia = (id, data) => api.patch(`/medias/${id}`, data);
export const deleteMedia = (id) => api.delete(`/medias/${id}`);