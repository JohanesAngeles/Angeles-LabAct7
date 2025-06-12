import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Container,
  Grid,
  Avatar,
  Tooltip,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Article,
  Visibility,
  Close,
  Person,
  CalendarToday,
  TrendingUp,
  Create,
  Publish,
  Archive
} from '@mui/icons-material';
import UserService from '../services/UserService';

const DashArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    status: 'draft'
  });

  const currentUser = UserService.getCurrentUser();

  useEffect(() => {
    fetchArticles();
  }, []);

  // Mock data for articles
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const mockArticles = [
        {
          _id: '1',
          title: 'Introduction to MERN Stack Development',
          content: 'Learn the fundamentals of MongoDB, Express.js, React, and Node.js to build full-stack web applications.',
          author: 'Johan Angeles',
          status: 'published',
          createdAt: new Date('2024-01-15').toISOString(),
          views: 342
        },
        {
          _id: '2',
          title: 'React Best Practices and Patterns',
          content: 'Essential tips and patterns for writing clean, maintainable React code that scales with your application.',
          author: 'Jane Smith',
          status: 'draft',
          createdAt: new Date('2024-02-10').toISOString(),
          views: 128
        },
        {
          _id: '3',
          title: 'MongoDB Schema Design Principles',
          content: 'How to structure your MongoDB collections for optimal performance and maintainability.',
          author: 'Bob Johnson',
          status: 'published',
          createdAt: new Date('2024-01-28').toISOString(),
          views: 267
        },
        {
          _id: '4',
          title: 'Advanced Node.js Techniques',
          content: 'Explore advanced Node.js concepts including streams, clusters, and performance optimization.',
          author: 'Alice Chen',
          status: 'published',
          createdAt: new Date('2024-02-05').toISOString(),
          views: 189
        },
        {
          _id: '5',
          title: 'State Management in React Applications',
          content: 'Compare different state management solutions including Context API, Redux, and Zustand.',
          author: 'Mike Davis',
          status: 'archived',
          createdAt: new Date('2024-01-20').toISOString(),
          views: 95
        }
      ];
      
      setArticles(mockArticles);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching articles',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      author: article.author,
      status: article.status
    });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedArticles = articles.map(article => 
        article._id === selectedArticle._id 
          ? { ...article, ...formData }
          : article
      );
      setArticles(updatedArticles);
      setShowModal(false);
      setSelectedArticle(null);
      setSnackbar({
        open: true,
        message: 'Article updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating article:', error);
      setSnackbar({
        open: true,
        message: 'Error updating article',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (articleId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const updatedArticles = articles.filter(article => article._id !== articleId);
        setArticles(updatedArticles);
        setSnackbar({
          open: true,
          message: 'Article deleted successfully!',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error deleting article:', error);
        setSnackbar({
          open: true,
          message: 'Error deleting article',
          severity: 'error'
        });
      }
    }
  };

  const handleCreateNew = () => {
    setSelectedArticle(null);
    setFormData({
      title: '',
      content: '',
      author: currentUser?.username || '',
      status: 'draft'
    });
    setShowModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newArticle = {
        _id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        views: 0
      };
      setArticles([...articles, newArticle]);
      setShowModal(false);
      setSnackbar({
        open: true,
        message: 'Article created successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error creating article:', error);
      setSnackbar({
        open: true,
        message: 'Error creating article',
        severity: 'error'
      });
    }
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
      default: return <Article />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
                Article Management Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Manage your articles and track their performance
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Total Articles: <strong>{articles.length}</strong>
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{ borderRadius: '12px' }}
                onClick={handleCreateNew}
              >
                Create Article
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Avatar sx={{ 
                    mx: 'auto', 
                    mb: 2, 
                    bgcolor: 'primary.main',
                    width: 56, 
                    height: 56 
                  }}>
                    <Article />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {articles.length}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Total Articles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Avatar sx={{ 
                    mx: 'auto', 
                    mb: 2, 
                    bgcolor: 'success.main',
                    width: 56, 
                    height: 56 
                  }}>
                    <Publish />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {articles.filter(article => article.status === 'published').length}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Published
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Avatar sx={{ 
                    mx: 'auto', 
                    mb: 2, 
                    bgcolor: 'warning.main',
                    width: 56, 
                    height: 56 
                  }}>
                    <Create />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {articles.filter(article => article.status === 'draft').length}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Drafts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Avatar sx={{ 
                    mx: 'auto', 
                    mb: 2, 
                    bgcolor: 'info.main',
                    width: 56, 
                    height: 56 
                  }}>
                    <TrendingUp />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {articles.reduce((total, article) => total + (article.views || 0), 0)}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Total Views
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Articles Table */}
          <Card>
            <CardContent>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'rgba(25, 118, 210, 0.04)' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Article</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Created Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Views</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {articles.map((article) => (
                        <TableRow key={article._id} hover>
                          <TableCell>
                            <Box sx={{ maxWidth: 300 }}>
                              <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
                                {article.title}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ 
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical'
                                }}
                              >
                                {article.content}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Person fontSize="small" color="action" />
                              {article.author}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={article.status}
                              color={getStatusColor(article.status)}
                              variant="outlined"
                              icon={getStatusIcon(article.status)}
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarToday fontSize="small" color="action" />
                              {new Date(article.createdAt).toLocaleDateString()}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Visibility fontSize="small" color="action" />
                              {article.views || 0}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Tooltip title="View Article">
                                <IconButton 
                                  color="info"
                                  sx={{ '&:hover': { backgroundColor: 'info.light', color: 'white' } }}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Article">
                                <IconButton 
                                  color="primary" 
                                  onClick={() => handleEdit(article)}
                                  sx={{ '&:hover': { backgroundColor: 'primary.light', color: 'white' } }}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Article">
                                <IconButton 
                                  color="error" 
                                  onClick={() => handleDelete(article._id, article.title)}
                                  sx={{ '&:hover': { backgroundColor: 'error.light', color: 'white' } }}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Modal for Create/Edit Article */}
          <Dialog 
            open={showModal} 
            onClose={() => setShowModal(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ 
              pb: 1, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: 'primary.main',
              color: 'white'
            }}>
              <Typography variant="h6" component="div">
                {selectedArticle ? 'Edit Article' : 'Create New Article'}
              </Typography>
              <IconButton 
                onClick={() => setShowModal(false)}
                sx={{ color: 'white' }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            
            <Box component="form" onSubmit={selectedArticle ? handleUpdate : handleCreate}>
              <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Article Title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      placeholder="Enter an engaging article title..."
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Author"
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      required
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.status}
                        label="Status"
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        sx={{ borderRadius: '12px' }}
                      >
                        <MenuItem value="draft">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Create /> Draft
                          </Box>
                        </MenuItem>
                        <MenuItem value="published">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Publish /> Published
                          </Box>
                        </MenuItem>
                        <MenuItem value="archived">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Archive /> Archived
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Article Content"
                      multiline
                      rows={6}
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      required
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      placeholder="Write your article content here..."
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              
              <DialogActions sx={{ p: 3, pt: 2 }}>
                <Button 
                  onClick={() => setShowModal(false)}
                  variant="outlined"
                  sx={{ borderRadius: '12px' }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  variant="contained"
                  sx={{ borderRadius: '12px' }}
                >
                  {selectedArticle ? 'Update Article' : 'Create Article'}
                </Button>
              </DialogActions>
            </Box>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert 
              onClose={() => setSnackbar({ ...snackbar, open: false })} 
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      );
    };

    export default DashArticleListPage;