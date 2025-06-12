import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL + '/api/articles/';

// Get auth header
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// Get all articles
const getArticles = async (params = {}) => {
  const config = {
    headers: getAuthHeader(),
    params: params // status, author, category, limit, page
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get single article
const getArticleById = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

// Create article
const createArticle = async (articleData) => {
  const config = {
    headers: getAuthHeader()
  };
  const response = await axios.post(API_URL, articleData, config);
  return response.data;
};

// Update article
const updateArticle = async (id, articleData) => {
  const config = {
    headers: getAuthHeader()
  };
  const response = await axios.put(API_URL + id, articleData, config);
  return response.data;
};

// Delete article
const deleteArticle = async (id) => {
  const config = {
    headers: getAuthHeader()
  };
  const response = await axios.delete(API_URL + id, config);
  return response.data;
};

// Like article
const likeArticle = async (id) => {
  const response = await axios.post(API_URL + id + '/like');
  return response.data;
};

// Get article statistics
const getArticleStats = async () => {
  const config = {
    headers: getAuthHeader()
  };
  const response = await axios.get(API_URL + 'stats', config);
  return response.data;
};

// Search articles
const searchArticles = async (searchTerm, filters = {}) => {
  const params = {
    ...filters,
    search: searchTerm
  };
  return await getArticles(params);
};

// Get articles by status
const getArticlesByStatus = async (status) => {
  return await getArticles({ status });
};

// Get published articles (for public view)
const getPublishedArticles = async (params = {}) => {
  return await getArticles({ ...params, status: 'published' });
};

const ArticleService = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
  getArticleStats,
  searchArticles,
  getArticlesByStatus,
  getPublishedArticles
};

export default ArticleService;