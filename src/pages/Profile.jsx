import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Profile() {
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);
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
    <div>Loading...</div>
  );

  return (
    <div>
      <h1>User Profile</h1>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
      <form onSubmit={handleEdit}>
        <div>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </label>
        </div>
        {editMode ? (
          <div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        ) : (
          <button type="button" onClick={() => setEditMode(true)}>Edit</button>
        )}
      </form>
    </div>
  );
}

export default Profile;