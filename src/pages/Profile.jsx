import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { Container, Box, Typography, TextField, Button, Alert, Avatar, CircularProgress } from '@mui/material';

function Profile() {
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [file, setFile] = useState(null);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    api.get("/auth/profile")
      .then((res) => {
        setFormData({ username: res.data.username, email: res.data.email });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to load profile");
        setLoading(false);
      });
  }, [user, navigate]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  async function handlePictureUpload(e) {
    e.preventDefault();
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const response = await api.post("/auth/profile/picture", uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data);
      setSuccess("Profile picture updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload profile picture");
    }
  }

  function handleEdit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    api.put("/auth/profile", formData)
      .then((res) => {
        setSuccess("Profile updated successfully!");
        setUser(res.data); // update context
        setEditMode(false);
      })
      .catch((err) => setError(err.response?.data?.error || "Failed to update profile"));
  }

  if (loading) return (
    <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Container>
  );

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={user.profile_picture ? `${api.defaults.baseURL}/uploads/${user.profile_picture}` : ''} sx={{ width: 80, height: 80, mr: 2 }} />
          <form onSubmit={handlePictureUpload}>
            <Button variant="contained" component="label">
              
              Upload Picture
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            <Button type="submit" variant="contained" color="primary" sx={{ ml: 1 }}>Save Picture</Button>
          </form>
        </Box>
        <form onSubmit={handleEdit}>
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={!editMode}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!editMode}
            required
          />
          {editMode ? (
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained">Save</Button>
              <Button onClick={() => setEditMode(false)} sx={{ ml: 1 }}>Cancel</Button>
            </Box>
          ) : (
            <Button onClick={() => setEditMode(true)} variant="contained">Edit</Button>
          )}
        </form>
      </Box>
    </Container>
  );
}

export default Profile;