const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
  getArticleStats,
} = require('../controllers/articleController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getArticles); // Get articles (public can see published, authenticated can see based on role)
router.get('/stats', protect, getArticleStats); // Get statistics (admin/editor only)
router.get('/:id', getArticleById); // Get single article
router.post('/:id/like', likeArticle); // Like article

// Protected routes (require authentication)
router.post('/', protect, createArticle); // Create article
router.put('/:id', protect, updateArticle); // Update article
router.delete('/:id', protect, deleteArticle); // Delete article

module.exports = router;