import { useState } from 'react';
import museumIcon from '../assets/temaki_museum.svg';
import restaurantIcon from '../assets/utensils.svg';
import gasIcon from '../assets/gasStation.svg';
import mallIcon from '../assets/mall.svg';
import cafeIcon from '../assets/cafe.svg';
import '../styles/SortFilterPopup.css';



export default function SortFilterPopup({ onClose, onApply, initialFilters, initialSort }) {
  const [activeCategories, setActiveCategories] = useState(initialFilters || []);
  const [sortBy, setSortBy] = useState(initialSort || 'price-asc');
  const [ratingRange, setRatingRange] = useState([3, 5]);
  const [priceRange, setPriceRange] = useState([1, 4]);
  const [openNow, setOpenNow] = useState(false);

  const categories = [
    { id: 'museum', label: 'Museums', icon: museumIcon },
    { id: 'restaurant', label: 'Restaurants', icon: restaurantIcon },
    { id: 'gas', label: 'Gas Stations', icon: gasIcon },
    { id: 'shopping', label: 'Shopping/Malls', icon: mallIcon },
    { id: 'cafe', label: 'Cafés', icon: cafeIcon },
  ];

  const sortOptions = [
    { id: 'price-asc', label: 'Price - High to Low' },
    { id: 'price-desc', label: 'Price - Low to High' },
    { id: 'rating-asc', label: 'Ratings - High to Low' },
    { id: 'rating-desc', label: 'Ratings - Low to High' },
    { id: 'closest', label: 'Closest first' },
  ];

  const toggleCategory = (categoryId) => {
    if (activeCategories.includes(categoryId)) {
      setActiveCategories(activeCategories.filter(c => c !== categoryId));
    } else {
      setActiveCategories([...activeCategories, categoryId]);
    }
  };

  const handleClearAll = () => {
    setActiveCategories([]);
    setSortBy('price-asc');
    setRatingRange([3, 5]);
    setPriceRange([1, 4]);
    setOpenNow(false);
  };

  const handleApply = () => {
    onApply({
      categories: activeCategories,
      sortBy,
      ratingRange,
      priceRange,
      openNow,
    });
    onClose();
  };

  return (
    <div className="sort-filter-overlay" onClick={onClose}>
      <div className="sort-filter-popup" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="popup-header">
          <h2 className="popup-title">Sort & Filter</h2>
          <button className="popup-close" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="popup-body">
          {/* Sort By Dropdown */}
          <div className="filter-section">
            <label className="filter-label">Sort by:</label>
            <select 
              className="sort-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filters */}
          <div className="filter-section">
            <label className="filter-label">Categories:</label>
            <div className="category-buttons">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${activeCategories.includes(category.id) ? 'active' : ''}`}
                  onClick={() => toggleCategory(category.id)}
                >
                  <img src={category.icon} alt={category.label} />
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rating Range */}
          <div className="filter-section">
            <div className="range-header">
              <label className="filter-label" style={{ margin: 0 }}>Ratings</label>
              <span className="range-value">
                {ratingRange[0]} to {ratingRange[1]} ★
              </span>
            </div>
            <div className="range-slider-container">
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={ratingRange[0]}
                onChange={(e) => setRatingRange([parseFloat(e.target.value), ratingRange[1]])}
                className="range-slider range-slider-min"
              />
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={ratingRange[1]}
                onChange={(e) => setRatingRange([ratingRange[0], parseFloat(e.target.value)])}
                className="range-slider range-slider-max"
              />
              <div className="range-track">
                <div 
                  className="range-track-active"
                  style={{
                    left: `${((ratingRange[0] - 1) / 4) * 100}%`,
                    width: `${((ratingRange[1] - ratingRange[0]) / 4) * 100}%`
                  }}
                />
              </div>
              <div className="range-labels">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <div className="range-header">
              <label className="filter-label" style={{ margin: 0 }}>Price</label>
              <span className="range-value">
                {priceRange[0]} to {priceRange[1]} $
              </span>
            </div>
            <div className="range-slider-container">
              <input
                type="range"
                min="1"
                max="5"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="range-slider range-slider-min"
              />
              <input
                type="range"
                min="1"
                max="5"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="range-slider range-slider-max"
              />
              <div className="range-track">
                <div 
                  className="range-track-active"
                  style={{
                    left: `${((priceRange[0] - 1) / 4) * 100}%`,
                    width: `${((priceRange[1] - priceRange[0]) / 4) * 100}%`
                  }}
                />
              </div>
              <div className="range-labels">
                <span>$</span>
                <span>$$</span>
                <span>$$$</span>
                <span>$$$$</span>
                <span>$$$$$</span>
              </div>
            </div>
          </div>

          {/* Open Now Toggle */}
          <div className="filter-section checkbox-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={openNow}
                onChange={(e) => setOpenNow(e.target.checked)}
              />
              <span>Open now?</span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="popup-actions">
          <button className="clear-btn" onClick={handleClearAll}>
            Clear all
          </button>
          <button className="done-btn" onClick={handleApply}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}