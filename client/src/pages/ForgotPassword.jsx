import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api/services';
import ErrorMessage from '../components/ErrorMessage';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const { data } = await authAPI.forgotPassword(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        <p>Enter your email and we'll send you a reset link.</p>
        <ErrorMessage message={error} />
        {message && <p className="success-message">{message}</p>}
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        <p><Link to="/login">Back to Login</Link></p>
      </form>
    </div>
  );
}

export default ForgotPassword;
