import { useState } from 'react';
import mapBackground from '../assets/map.jpg';
import restaurantIcon from '../assets/utensils.svg';
import hotelIcon from '../assets/Bed.svg';
import transitIcon from '../assets/transit.svg';
import searchIcon from '../assets/search.svg';
import arrowIcon from '../assets/arrow.svg';
import filterIcon from '../assets/filter.svg';
import '../styles/Explore.css';

export default function Explore() {
  const [view, setView] = useState('map'); // 'map' or 'list'
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const toggleFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const mockEvents = [
    { name: 'Event Name', rating: 4.3, reviews: 310, price: '$$$$', hours: 'Opens 5:00 - Closes 9:00 PM' },
    { name: 'Event Name', rating: 4.1, reviews: 310, price: '$$$$$', hours: 'Opens 5:00 - Closes 9:00 PM' },
    { name: 'Event Name', rating: 4.1, reviews: 310, price: '$$$$', hours: 'Opens 5:00 - Closes 9:00 PM' },
    { name: 'Event Name', rating: 4.1, reviews: 310, price: '$$$', hours: 'Opens 5:00 - Closes 9:00 PM' },
    { name: 'Event Name', rating: 4.1, reviews: 310, price: '$$', hours: 'Opens 5:00 - Closes 9:00 PM' },
    { name: 'Event Name', rating: 4.1, reviews: 310, price: '$', hours: 'Opens 5:00 - Closes 9:00 PM' },
  ];

  return (
    <div className="explore-container">
      {/* Map View */}
      <div className="map-view" style={{ backgroundImage: `url(${mapBackground})` }}>
        {/* Search Bar */}
        <div className="search-bar-container">
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input type="text" className="search-input" placeholder="Search" />
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${activeFilters.includes('restaurant') ? 'active' : ''}`}
            onClick={() => toggleFilter('restaurant')}
          >
            <img src={restaurantIcon} alt="Restaurant" />
            <span>Restaurants</span>
          </button>
          <button 
            className={`filter-btn ${activeFilters.includes('hotel') ? 'active' : ''}`}
            onClick={() => toggleFilter('hotel')}
          >
            <img src={hotelIcon} alt="Hotel" />
            <span>Hotels</span>
          </button>
          <button 
            className={`filter-btn ${activeFilters.includes('transit') ? 'active' : ''}`}
            onClick={() => toggleFilter('transit')}
          >
            <img src={transitIcon} alt="Transit" />
            <span>Transit</span>
          </button>
        </div>

        {/* Event List Overlay */}
        <div className={`list-view-overlay ${view === 'list' ? 'expanded' : ''}`}>
          {/* Toggle Map/List Button */}
          <button className="toggle-view-btn" onClick={() => setView(view === 'map' ? 'list' : 'map')}>
            <img 
              src={arrowIcon} 
              alt="Toggle" 
              style={{ 
                transform: view === 'list' ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }} 
            />
          </button>

          {/* Sort/Filter Dropdown */}
          <div className="sort-filter-container">
            <button className="dropdown-toggle">
              <img src={filterIcon} alt="Filter" />
              <span>Sort/Filter</span>
            </button>
          </div>

          {/* Event List */}
          <div className="event-list">
            {mockEvents.map((event, index) => (
              <div 
                key={index} 
                className={`event-card ${selectedEvent === index ? 'selected' : ''}`}
                onClick={() => setSelectedEvent(selectedEvent === index ? null : index)}
              >
                <h3 className="event-name">{event.name}</h3>
                <div className="event-details">
                  <div className="rating">
                    <span className="stars">{'★'.repeat(Math.floor(event.rating))}{'☆'.repeat(5 - Math.floor(event.rating))}</span>
                    <span className="rating-number">{event.rating}</span>
                    <span className="reviews">({event.reviews})</span>
                  </div>
                  <span className="price" style={{
                    color: event.price.length <= 2 ? '#4CAF50' : event.price.length === 3 ? '#FFA500' : '#FF5722'
                  }}>
                    {event.price}
                  </span>
                </div>
                <p className="event-hours">{event.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}