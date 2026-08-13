import api from "./axios";

export const getCommentaires = () => api.get("/commentaires");
export const getCommentaire = (id) => api.get(`/commentaires/${id}`);
export const createCommentaire = (data) => api.post("/commentaires", data);
export const updateCommentaire = (id, data) => api.patch(`/commentaires/${id}`, data);
export const deleteCommentaire = (id) => api.delete(`/commentaires/${id}`);
export const likeCommentaire = (id) => api.post(`/commentaires/${id}/like`);
export const unlikeCommentaire = (id) => api.post(`/commentaires/${id}/unlike`);