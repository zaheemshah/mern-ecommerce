function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="error-message">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-outline" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
