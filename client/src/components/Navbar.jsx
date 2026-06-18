import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SearchBar from './SearchBar';

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">MERN<span>Shop</span></Link>
        <SearchBar />
        <nav className="nav-links">
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/wishlist">Wishlist</NavLink>
              <NavLink to="/cart">Cart</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </>
          )}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-actions">
          <button type="button" className="btn btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {isAuthenticated ? (
            <div className="user-menu">
              <span>{user?.name}</span>
              <Link to="/profile" className="btn btn-outline btn-sm">Profile</Link>
              <button type="button" className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
