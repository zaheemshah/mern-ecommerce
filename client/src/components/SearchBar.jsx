import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../api/services';
import { formatPrice, getEffectivePrice, getImageUrl } from '../utils/helpers';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const { data } = await productAPI.getSuggestions(query);
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <button type="submit" aria-label="Search">🔍</button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="search-suggestions">
          {suggestions.map((item) => (
            <li key={item._id}>
              <button
                type="button"
                onClick={() => {
                  navigate(`/products/${item._id}`);
                  setShowSuggestions(false);
                  setQuery('');
                }}
              >
                <img src={getImageUrl(item.images?.[0])} alt="" />
                <span>{item.title}</span>
                <span>{formatPrice(getEffectivePrice(item))}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
