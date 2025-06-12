const asyncHandler = require('express-async-handler');
const Article = require('../models/Article');
const User = require('../models/User');

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public (but can be filtered by status for logged-in users)
const getArticles = asyncHandler(async (req, res) => {
  try {
    const { status, author, category, limit = 50, page = 1 } = req.query;
    
    let query = { isActive: true };
    
    // If user is not admin/editor, only show published articles
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'editor')) {
      query.status = 'published';
    } else if (status && status !== 'all') {
      query.status = status;
    }
    
    // Additional filters
    if (author) query.author = { $regex: author, $options: 'i' };
    if (category) query.category = { $regex: category, $options: 'i' };
    
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('authorId', 'firstName lastName username');
    
    const total = await Article.countDocuments(query);
    
    res.json({
      articles,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: total
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching articles');
  }
});

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = asyncHandler(async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('authorId', 'firstName lastName username');
    
    if (!article || !article.isActive) {
      res.status(404);
      throw new Error('Article not found');
    }
    
    // Increment views
    await article.incrementViews();
    
    res.json(article);
  } catch (error) {
    res.status(404);
    throw new Error('Article not found');
  }
});

// @desc    Create new article
// @route   POST /api/articles
// @access  Private (all authenticated users)
const createArticle = asyncHandler(async (req, res) => {
  try {
    const { title, content, status, category, tags } = req.body;
    
    if (!title || !content) {
      res.status(400);
      throw new Error('Title and content are required');
    }
    
    // Get author info from authenticated user
    const authorName = req.user.firstName && req.user.lastName 
      ? `${req.user.firstName} ${req.user.lastName}`
      : req.user.username;
    
    const article = await Article.create({
      title,
      content,
      author: authorName,
      authorId: req.user._id,
      status: status || 'draft',
      category: category || 'General',
      tags: tags || [],
    });
    
    const populatedArticle = await Article.findById(article._id)
      .populate('authorId', 'firstName lastName username');
    
    res.status(201).json(populatedArticle);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400);
      throw new Error(`Validation failed: ${messages.join(', ')}`);
    } else {
      res.status(400);
      throw new Error('Failed to create article');
    }
  }
});

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private (author, admin, or editor)
const updateArticle = asyncHandler(async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article || !article.isActive) {
      res.status(404);
      throw new Error('Article not found');
    }
    
    // Check if user can edit this article
    const canEdit = req.user.role === 'admin' || 
                   req.user.role === 'editor' || 
                   article.authorId.toString() === req.user._id.toString();
    
    if (!canEdit) {
      res.status(403);
      throw new Error('Not authorized to edit this article');
    }
    
    const { title, content, status, category, tags } = req.body;
    
    // Update fields
    if (title) article.title = title;
    if (content) article.content = content;
    if (status) article.status = status;
    if (category) article.category = category;
    if (tags) article.tags = tags;
    
    const updatedArticle = await article.save();
    
    const populatedArticle = await Article.findById(updatedArticle._id)
      .populate('authorId', 'firstName lastName username');
    
    res.json(populatedArticle);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400);
      throw new Error(`Validation failed: ${messages.join(', ')}`);
    } else {
      res.status(400);
      throw new Error('Failed to update article');
    }
  }
});

// @desc    Delete article (soft delete)
// @route   DELETE /api/articles/:id
// @access  Private (author, admin, or editor)
const deleteArticle = asyncHandler(async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article || !article.isActive) {
      res.status(404);
      throw new Error('Article not found');
    }
    
    // Check if user can delete this article
    const canDelete = req.user.role === 'admin' || 
                     req.user.role === 'editor' || 
                     article.authorId.toString() === req.user._id.toString();
    
    if (!canDelete) {
      res.status(403);
      throw new Error('Not authorized to delete this article');
    }
    
    // Soft delete
    article.isActive = false;
    await article.save();
    
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(400);
    throw new Error('Failed to delete article');
  }
});

// @desc    Like article
// @route   POST /api/articles/:id/like
// @access  Public
const likeArticle = asyncHandler(async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article || !article.isActive) {
      res.status(404);
      throw new Error('Article not found');
    }
    
    await article.incrementLikes();
    
    res.json({ message: 'Article liked', likes: article.likes });
  } catch (error) {
    res.status(400);
    throw new Error('Failed to like article');
  }
});

// @desc    Get article statistics
// @route   GET /api/articles/stats
// @access  Private (admin, editor)
const getArticleStats = asyncHandler(async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      res.status(403);
      throw new Error('Not authorized to view statistics');
    }
    
    const totalArticles = await Article.countDocuments({ isActive: true });
    const publishedArticles = await Article.countDocuments({ status: 'published', isActive: true });
    const draftArticles = await Article.countDocuments({ status: 'draft', isActive: true });
    const archivedArticles = await Article.countDocuments({ status: 'archived', isActive: true });
    
    const totalViews = await Article.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    
    const totalLikes = await Article.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
    ]);
    
    res.json({
      totalArticles,
      publishedArticles,
      draftArticles,
      archivedArticles,
      totalViews: totalViews[0]?.totalViews || 0,
      totalLikes: totalLikes[0]?.totalLikes || 0,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching statistics');
  }
});

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
  getArticleStats,
};