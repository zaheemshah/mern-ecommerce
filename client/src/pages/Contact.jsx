import { useState } from 'react';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="container static-page">
      <h1>Contact Us</h1>
      <p>Have a question? We'd love to hear from you.</p>
      {submitted && <p className="success-message">Thank you! We'll get back to you soon.</p>}
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          Email
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          Message
          <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </label>
        <button type="submit" className="btn btn-primary">Send Message</button>
      </form>
      <div className="contact-info">
        <p><strong>Email:</strong> support@mernshop.com</p>
        <p><strong>Phone:</strong> +1 (555) 123-4567</p>
        <p><strong>Address:</strong> 123 Commerce St, New York, NY 10001</p>
      </div>
    </div>
  );
}

export default Contact;
