function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1);

  return (
    <div className="pagination">
      <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Prev
      </button>
      {pageNumbers.map((p, idx) => (
        <span key={p}>
          {idx > 0 && pageNumbers[idx - 1] !== p - 1 && <span className="dots">...</span>}
          <button
            type="button"
            className={p === page ? 'active' : ''}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        </span>
      ))}
      <button type="button" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
}

export default Pagination;
