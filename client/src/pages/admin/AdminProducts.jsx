import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../api/services';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatPrice, getImageUrl } from '../../utils/helpers';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', price: '', discountPrice: '', category: '',
    brand: '', stock: '', isFeatured: false, isBestSeller: false,
  });
  const [images, setImages] = useState(null);

  const fetchData = async () => {
    const [prodRes, catRes] = await Promise.all([
      productAPI.getAll({ limit: 100 }),
      categoryAPI.getAll(),
    ]);
    setProducts(prodRes.data.products);
    setCategories(catRes.data.categories);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ title: '', description: '', price: '', discountPrice: '', category: '', brand: '', stock: '', isFeatured: false, isBestSeller: false });
    setImages(null);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || '',
      category: product.category?._id || product.category,
      brand: product.brand,
      stock: product.stock,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (images) Array.from(images).forEach((file) => formData.append('images', file));

    try {
      if (editing) await productAPI.update(editing, formData);
      else await productAPI.create(formData);
      resetForm();
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container admin-page">
      <div className="section-header">
        <h1>Product Management</h1>
        <div>
          <Link to="/admin" className="btn btn-outline btn-sm">← Dashboard</Link>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => { resetForm(); setShowForm(true); }}>Add Product</button>
        </div>
      </div>
      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{editing ? 'Edit' : 'Add'} Product</h2>
          <input placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea placeholder="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="number" placeholder="Price" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input type="number" placeholder="Discount Price" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
          <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          <input type="number" placeholder="Stock" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <label><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
          <label><input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} /> Best Seller</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}
      <table className="admin-table">
        <thead>
          <tr><th>Image</th><th>Title</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td><img src={getImageUrl(p.images?.[0])} alt="" className="table-thumb" /></td>
              <td>{p.title}</td>
              <td>{formatPrice(p.price)}</td>
              <td>{p.stock}</td>
              <td>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProducts;
