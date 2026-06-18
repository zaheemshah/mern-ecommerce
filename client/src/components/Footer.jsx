import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>MERNShop</h3>
          <p>Your one-stop destination for quality products at great prices.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/products">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/orders">Order History</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <p>support@mernshop.com</p>
          <p>+1 (555) 123-4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MERNShop. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
