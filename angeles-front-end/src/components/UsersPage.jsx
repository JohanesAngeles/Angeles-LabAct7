import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  PersonAdd,
  AdminPanelSettings,
  Edit as EditIcon,
  Person,
  Close,
  Visibility,
  VisibilityOff,
  Email,
  Lock
} from '@mui/icons-material';
import axios from 'axios';
import UserService from '../services/UserService';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    mobile: '',
    address: '',
    email: '',
    username: '',
    password: '',
    role: 'user'
  });

  const navigate = useNavigate();
  const currentUser = UserService.getCurrentUser();

  // Check if user has admin access
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/articles'); // Redirect non-admin users
      return;
    }
    fetchUsers();
  }, []); // Remove currentUser and navigate from dependencies

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users...'); // Debug log
      const user = JSON.parse(localStorage.getItem('user'));
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/users`, config);
      console.log('Users fetched successfully:', response.data); // Debug log
      setUsers(response.data || []); // Ensure it's an array
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // Set empty array on error
      setSnackbar({
        open: true,
        message: 'Error fetching users',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      age: user.age || '',
      gender: user.gender || '',
      mobile: user.mobile || '',
      address: user.address || '',
      email: user.email,
      username: user.username,
      password: '', // Don't pre-fill password for security
      role: user.role
    });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      // Only include password in the request if it's provided
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/users/${selectedUser._id}`,
        updateData,
        config
      );
      setShowModal(false);
      setSnackbar({
        open: true,
        message: 'User updated successfully!',
        severity: 'success'
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error updating user',
        severity: 'error'
      });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/users`,
        formData,
        config
      );
      setShowModal(false);
      setSnackbar({
        open: true,
        message: 'User created successfully!',
        severity: 'success'
      });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error creating user',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (userId, displayName) => {
    if (window.confirm(`Are you sure you want to delete user "${displayName}"?`)) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/api/users/${userId}`, config);
        setSnackbar({
          open: true,
          message: 'User deleted successfully!',
          severity: 'success'
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setSnackbar({
          open: true,
          message: 'Error deleting user',
          severity: 'error'
        });
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'editor': return 'warning';
      case 'user': return 'primary';
      default: return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <AdminPanelSettings />;
      case 'editor': return <EditIcon />;
      case 'user': return <Person />;
      default: return <Person />;
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const getUserDisplayName = (user) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username || 'Unknown User';
  };

  const getUserInitial = (user) => {
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Access Denied. Only administrators can access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
                User Management Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Manage system users and their permissions
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Total Users: <strong>{users.length}</strong>
              </Typography>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                sx={{ borderRadius: '12px' }}
                onClick={() => {
                  setSelectedUser(null);
                  setFormData({ 
                    firstName: '',
                    lastName: '',
                    age: '',
                    gender: '',
                    mobile: '',
                    address: '',
                    email: '',
                    username: '',
                    password: '',
                    role: 'user'
                  });
                  setShowModal(true);
                }}
              >
                Add User
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {['admin', 'editor', 'user'].map((role) => {
          const count = users.filter(user => user.role === role).length;
          return (
            <Grid item xs={12} sm={4} key={role}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Avatar sx={{ 
                    mx: 'auto', 
                    mb: 2, 
                    bgcolor: `${getRoleColor(role)}.main`,
                    width: 56, 
                    height: 56 
                  }}>
                    {getRoleIcon(role)}
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">
                    {count}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                    {role}s
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Users Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : !Array.isArray(users) || users.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No users found
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(25, 118, 210, 0.04)' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: `${getRoleColor(user.role)}.main` }}>
                            {getUserInitial(user)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {getUserDisplayName(user)}
                            </Typography>
                            {user.firstName && user.lastName && user.username && (
                              <Typography variant="body2" color="text.secondary">
                                @{user.username}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Email fontSize="small" color="action" />
                          {user.email}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={getRoleColor(user.role)}
                          variant="outlined"
                          icon={getRoleIcon(user.role)}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Edit User">
                            <IconButton 
                              color="primary" 
                              onClick={() => handleEdit(user)}
                              sx={{ '&:hover': { backgroundColor: 'primary.light', color: 'white' } }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton 
                              color="error" 
                              onClick={() => handleDelete(user._id, getUserDisplayName(user))}
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

      {/* Enhanced Modal */}
      <Dialog 
        open={showModal} 
        onClose={() => setShowModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          pb: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              {selectedUser ? <Edit /> : <PersonAdd />}
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" fontWeight="bold">
                {selectedUser ? 'Edit User' : 'Add New User'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {selectedUser ? 'Update user information and permissions' : 'Create a new user account'}
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={() => setShowModal(false)}
            sx={{ 
              color: 'white',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'rotate(90deg)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <Box component="form" onSubmit={selectedUser ? handleUpdate : handleCreate}>
          <DialogContent sx={{ pt: 4, pb: 2 }}>
            {/* Personal Information Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" color="primary.main" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person /> Personal Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: '12px',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      } 
                    }}
                    placeholder="Enter first name"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: '12px',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      } 
                    }}
                    placeholder="Enter last name"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: '12px',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      } 
                    }}
                    placeholder="Enter age"
                    inputProps={{ min: 1, max: 120 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={formData.gender}
                      label="Gender"
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      sx={{ 
                        borderRadius: '12px',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>Select Gender</em>
                      </MenuItem>
                      <MenuItem value="male">👨 Male</MenuItem>
                      <MenuItem value="female">👩 Female</MenuItem>
                      <MenuItem value="other">🌟 Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Contact Information Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" color="primary.main" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email /> Contact Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: '12px',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      } 
                    }}
                    placeholder="Enter email address"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: '12px',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      } 
                    }}
                    placeholder="Enter mobile number"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    variant="outlined"
                    multiline
                    rows={2}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: '12px',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      } 
                    }}
                    placeholder="Enter full address"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Account Information Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="primary.main" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AdminPanelSettings /> Account Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: '12px',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      } 
                    }}
                    placeholder="Enter username"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>User Role</InputLabel>
                    <Select
                      value={formData.role}
                      label="User Role"
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      sx={{ 
                        borderRadius: '12px',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <MenuItem value="user">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person color="primary" /> User
                        </Box>
                      </MenuItem>
                      <MenuItem value="editor">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EditIcon color="warning" /> Editor
                        </Box>
                      </MenuItem>
                      <MenuItem value="admin">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AdminPanelSettings color="error" /> Admin
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required={!selectedUser}
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: '12px',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      } 
                    }}
                    placeholder={selectedUser ? "Leave blank to keep current password" : "Enter secure password"}
                    helperText={selectedUser ? "💡 Leave blank to keep current password" : "🔒 Password must be at least 6 characters"}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                          <Lock color="action" />
                        </Box>
                      ),
                      endAdornment: (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{
                            '&:hover': {
                              backgroundColor: 'primary.light',
                              color: 'white'
                            }
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 1, background: 'rgba(0,0,0,0.02)' }}>
            <Button 
              onClick={() => setShowModal(false)}
              variant="outlined"
              size="large"
              sx={{ 
                borderRadius: '12px',
                px: 4,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained"
              size="large"
              sx={{ 
                borderRadius: '12px',
                px: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                }
              }}
            >
              {selectedUser ? '✓ Update User' : '+ Create User'}
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

export default UsersPage;