const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      lowercase: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  }
);

// Create indexes for better performance
ArticleSchema.index({ title: 1 });
ArticleSchema.index({ author: 1 });
ArticleSchema.index({ status: 1 });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ createdAt: -1 });

// Generate excerpt automatically if not provided
ArticleSchema.pre('save', function(next) {
  if (!this.excerpt && this.content) {
    // Generate excerpt from content (first 150 characters)
    this.excerpt = this.content.length > 150 
      ? this.content.substring(0, 150) + '...'
      : this.content;
  }
  
  // Estimate read time based on word count (average 200 words per minute)
  if (this.content) {
    const wordCount = this.content.split(' ').length;
    const readTimeMinutes = Math.ceil(wordCount / 200);
    this.readTime = `${readTimeMinutes} min read`;
  }
  
  next();
});

// Method to increment views
ArticleSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment likes
ArticleSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

// Static method to get published articles
ArticleSchema.statics.getPublished = function() {
  return this.find({ status: 'published', isActive: true })
    .sort({ createdAt: -1 });
};

// Static method to get articles by author
ArticleSchema.statics.getByAuthor = function(authorId) {
  return this.find({ authorId, isActive: true })
    .sort({ createdAt: -1 });
};

// Virtual for URL-friendly slug (if needed later)
ArticleSchema.virtual('slug').get(function() {
  return this.title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
});

// Ensure virtual fields are serialized
ArticleSchema.set('toJSON', {
  virtuals: true
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;