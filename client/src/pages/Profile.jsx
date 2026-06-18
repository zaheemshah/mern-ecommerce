import { useState } from 'react';
import { userAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import { getImageUrl } from '../utils/helpers';

function Profile() {
  const { user, loadUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || { street: '', city: '', state: '', zipCode: '', country: '' },
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      formData.append('address', JSON.stringify(form.address));
      if (profileImage) formData.append('profileImage', profileImage);

      await userAPI.updateProfile(formData);
      await loadUser();
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container profile-page">
      <h1>My Profile</h1>
      <form className="profile-form" onSubmit={handleSubmit}>
        <ErrorMessage message={error} />
        {message && <p className="success-message">{message}</p>}
        <div className="profile-avatar">
          <img src={profileImage ? URL.createObjectURL(profileImage) : getImageUrl(user?.profileImage)} alt="Profile" />
          <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} />
        </div>
        <label>
          Name
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          Email
          <input type="email" value={user?.email} disabled />
        </label>
        <label>
          Phone
          <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </label>
        {['street', 'city', 'state', 'zipCode', 'country'].map((field) => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
            <input
              type="text"
              value={form.address[field] || ''}
              onChange={(e) => setForm({ ...form, address: { ...form.address, [field]: e.target.value } })}
            />
          </label>
        ))}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

export default Profile;
