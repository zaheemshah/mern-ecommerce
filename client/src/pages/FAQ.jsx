const faqs = [
  { q: 'How do I place an order?', a: 'Browse products, add items to your cart, and proceed to checkout. You must be logged in to complete a purchase.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards and secure online payment methods.' },
  { q: 'How long does shipping take?', a: 'Standard shipping takes 3-5 business days. Express shipping is available at checkout.' },
  { q: 'Can I return a product?', a: 'Yes, we offer a 30-day return policy for unused items in original packaging.' },
  { q: 'How do I track my order?', a: 'Visit your Order History page in your dashboard to view order status and tracking details.' },
  { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page and follow the instructions sent to your email.' },
];

function FAQ() {
  return (
    <div className="container static-page">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <details key={idx} className="faq-item">
            <summary>{faq.q}</summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
