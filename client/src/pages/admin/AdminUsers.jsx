import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api/services';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/helpers';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers().then(({ data }) => {
      setUsers(data.users);
      setLoading(false);
    });
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await adminAPI.updateUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container admin-page">
      <div className="section-header">
        <h1>User Management</h1>
        <Link to="/admin" className="btn btn-outline btn-sm">← Dashboard</Link>
      </div>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>{formatDate(user.createdAt)}</td>
              <td>
                {user.role !== 'admin' && (
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => handleDelete(user._id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
