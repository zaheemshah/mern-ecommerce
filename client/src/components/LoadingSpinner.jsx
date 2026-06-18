function LoadingSpinner({ fullPage = false }) {
  return (
    <div className={`spinner-container ${fullPage ? 'full-page' : ''}`}>
      <div className="spinner" />
    </div>
  );
}

export default LoadingSpinner;
