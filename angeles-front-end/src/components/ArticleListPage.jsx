import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Chip,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CardActions,
  Divider,
  IconButton,
  Stack,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Search,
  Visibility,
  Person,
  CalendarToday,
  Article as ArticleIcon,
  Create,
  Publish,
  Archive,
  ReadMore,
  ThumbUp,
  Share,
  Bookmark,
  AccessTime,
  Category
} from '@mui/icons-material';
import UserService from '../services/UserService';

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('published');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const currentUser = UserService.getCurrentUser();

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, statusFilter]);

  // Mock data for articles
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const mockArticles = [
        {
          _id: '1',
          title: 'Introduction to MERN Stack Development',
          content: 'Learn the fundamentals of MongoDB, Express.js, React, and Node.js to build full-stack web applications. This comprehensive guide covers everything from setting up your development environment to deploying your first MERN application.',
          author: 'Johan Angeles',
          status: 'published',
          createdAt: new Date('2024-01-15').toISOString(),
          views: 342,
          excerpt: 'Learn the fundamentals of MongoDB, Express.js, React, and Node.js to build full-stack web applications...',
          readTime: '5 min read',
          category: 'Web Development'
        },
        {
          _id: '2',
          title: 'React Best Practices and Patterns',
          content: 'Essential tips and patterns for writing clean, maintainable React code that scales with your application.',
          author: 'Jane Smith',
          status: 'published',
          createdAt: new Date('2024-02-10').toISOString(),
          views: 128,
          excerpt: 'Essential tips and patterns for writing clean, maintainable React code that scales with your application...',
          readTime: '3 min read',
          category: 'React'
        },
        {
          _id: '3',
          title: 'MongoDB Schema Design Principles',
          content: 'How to structure your MongoDB collections for optimal performance and maintainability.',
          author: 'Bob Johnson',
          status: 'published',
          createdAt: new Date('2024-01-28').toISOString(),
          views: 267,
          excerpt: 'How to structure your MongoDB collections for optimal performance and maintainability...',
          readTime: '7 min read',
          category: 'Database'
        },
        {
          _id: '4',
          title: 'Advanced Node.js Techniques',
          content: 'Explore advanced Node.js concepts including streams, clusters, and performance optimization.',
          author: 'Alice Chen',
          status: 'published',
          createdAt: new Date('2024-02-05').toISOString(),
          views: 189,
          excerpt: 'Explore advanced Node.js concepts including streams, clusters, and performance optimization...',
          readTime: '6 min read',
          category: 'Backend'
        },
        {
          _id: '5',
          title: 'State Management in React Applications',
          content: 'Compare different state management solutions including Context API, Redux, and Zustand.',
          author: 'Mike Davis',
          status: 'published',
          createdAt: new Date('2024-01-20').toISOString(),
          views: 95,
          excerpt: 'Compare different state management solutions including Context API, Redux, and Zustand...',
          readTime: '4 min read',
          category: 'React'
        },
        {
          _id: '6',
          title: 'Building RESTful APIs with Express.js',
          content: 'Complete guide to building robust RESTful APIs using Express.js.',
          author: 'Sarah Wilson',
          status: 'published',
          createdAt: new Date('2024-02-12').toISOString(),
          views: 156,
          excerpt: 'Complete guide to building robust RESTful APIs using Express.js with middleware and authentication...',
          readTime: '8 min read',
          category: 'Backend'
        }
      ];
      
      setArticles(mockArticles);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(article => article.status === statusFilter);
    }

    setFilteredArticles(filtered);
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'primary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return <Publish />;
      case 'draft': return <Create />;
      case 'archived': return <Archive />;
      default: return <ArticleIcon />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'web development': return 'primary';
      case 'react': return 'info';
      case 'database': return 'success';
      case 'backend': return 'warning';
      default: return 'default';
    }
  };

  // Pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleReadMore = (articleId) => {
    console.log('Read more:', articleId);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 6,
          mb: 4,
          borderRadius: 4,
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" component="h1" fontWeight="bold" sx={{ mb: 2 }}>
          📚 Article Library
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          Discover insights, tutorials, and best practices in web development
        </Typography>
        
        {/* Search and Filter Bar */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="center" 
          alignItems="center"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          <TextField
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              flex: 1,
              minWidth: { xs: '100%', sm: 300 },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,1)',
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor') && (
            <FormControl 
              sx={{ 
                minWidth: 140,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 3,
                }
              }}
            >
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          )}
        </Stack>
      </Paper>

      {/* Statistics Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                textAlign: 'center',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <ArticleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {filteredArticles.length}
              </Typography>
              <Typography variant="body1">
                Articles Available
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                textAlign: 'center',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white'
              }}
            >
              <Visibility sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {articles.reduce((total, article) => total + article.views, 0).toLocaleString()}
              </Typography>
              <Typography variant="body1">
                Total Views
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                textAlign: 'center',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white'
              }}
            >
              <Category sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {[...new Set(articles.map(a => a.category))].length}
              </Typography>
              <Typography variant="body1">
                Categories
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                textAlign: 'center',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white'
              }}
            >
              <Person sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {[...new Set(articles.map(a => a.author))].length}
              </Typography>
              <Typography variant="body1">
                Authors
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Articles Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
              Loading articles...
            </Typography>
          </Stack>
        </Box>
      ) : currentArticles.length === 0 ? (
        <Paper elevation={1} sx={{ textAlign: 'center', py: 8, borderRadius: 3 }}>
          <ArticleIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
            No articles found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search terms or filters
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {currentArticles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article._id}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '450px', // Fixed height for ALL cards
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  }
                }}
              >
                {/* Article Content */}
                <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Category and Status - 35px */}
                  <Box sx={{ height: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Chip
                      label={article.category}
                      size="small"
                      color={getCategoryColor(article.category)}
                      variant="filled"
                      icon={<Category />}
                      sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                    />
                    <Chip
                      label={article.status}
                      size="small"
                      color={getStatusColor(article.status)}
                      icon={getStatusIcon(article.status)}
                      variant="outlined"
                      sx={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: '0.75rem' }}
                    />
                  </Box>

                  {/* Title - 65px */}
                  <Box sx={{ height: '65px', mb: 1.5 }}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      fontWeight="bold" 
                      sx={{ 
                        fontSize: '1.1rem',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {article.title}
                    </Typography>
                  </Box>

                  {/* Excerpt - 75px */}
                  <Box sx={{ height: '75px', mb: 2 }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: '0.85rem',
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {article.excerpt}
                    </Typography>
                  </Box>

                  {/* Author - 45px */}
                  <Box sx={{ height: '45px', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Avatar 
                      sx={{ 
                        width: 28, 
                        height: 28, 
                        bgcolor: 'primary.main',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {article.author.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.85rem' }} noWrap>
                        {article.author}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        Author
                      </Typography>
                    </Box>
                  </Box>

                  {/* Meta Info - 25px */}
                  <Box sx={{ height: '25px', display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                      <CalendarToday sx={{ fontSize: 12, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {new Date(article.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                      <Visibility sx={{ fontSize: 12, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {article.views}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                      <AccessTime sx={{ fontSize: 12, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {article.readTime}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <Divider />

                {/* Actions - 55px */}
                <CardActions sx={{ height: '55px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.5, py: 1.5 }}>
                  <Button
                    variant="contained"
                    startIcon={<ReadMore />}
                    onClick={() => handleReadMore(article._id)}
                    sx={{ 
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      px: 2,
                      py: 0.8
                    }}
                  >
                    Read More
                  </Button>
                  
                  <Box sx={{ display: 'flex', gap: 0.3 }}>
                    <IconButton size="small" color="primary" sx={{ p: 0.5 }}>
                      <ThumbUp sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" color="primary" sx={{ p: 0.5 }}>
                      <Bookmark sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" color="primary" sx={{ p: 0.5 }}>
                      <Share sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default ArticleListPage;