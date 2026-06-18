import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../../api/services';
import LoadingSpinner from '../../components/LoadingSpinner';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editing, setEditing] = useState(null);

  const fetchCategories = async () => {
    const { data } = await categoryAPI.getAll();
    setCategories(data.categories);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await categoryAPI.update(editing, form);
      else await categoryAPI.create(form);
      setForm({ name: '', description: '' });
      setEditing(null);
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat._id);
    setForm({ name: cat.name, description: cat.description });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await categoryAPI.delete(id);
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container admin-page">
      <div className="section-header">
        <h1>Category Management</h1>
        <Link to="/admin" className="btn btn-outline btn-sm">← Dashboard</Link>
      </div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editing ? 'Edit' : 'Add'} Category</h2>
        <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
        {editing && <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setForm({ name: '', description: '' }); }}>Cancel</button>}
      </form>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Slug</th><th>Description</th><th>Actions</th></tr></thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.name}</td>
              <td>{cat.slug}</td>
              <td>{cat.description}</td>
              <td>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => handleEdit(cat)}>Edit</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => handleDelete(cat._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCategories;
