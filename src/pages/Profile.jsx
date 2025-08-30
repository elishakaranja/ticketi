import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Profile() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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
        setError(err.message);
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

  if (loading) return <div>Loading...</div>;

  return (
    <div >
      <h1>User Profile</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleEdit}>
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
        <br />
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
        <br />
        {editMode ? (
          <>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setEditMode(true)}>
            Edit
          </button>
        )}
      </form>
    </div>
  );
}

export default Profile;