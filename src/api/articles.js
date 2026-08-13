import api from "./axios";

export const getArticles = () => api.get("/articles");

export const getArticle = (id) => api.get(`/articles/${id}`);

export const createArticle = (data) => api.post("/articles", data);

export const updateArticle = (id, data) => api.patch(`/articles/${id}`, data);

export const deleteArticle = (id) => api.delete(`/articles/${id}`);

export const likeArticle = (id) => api.post(`/articles/${id}/like`);

export const unlikeArticle = (id) => api.post(`/articles/${id}/unlike`);