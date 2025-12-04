import { useState } from 'react';
import mapBackground from '../assets/map.jpg';
import searchIcon from '../assets/search.svg';
import arrowIcon from '../assets/arrow.svg';
import filterIcon from '../assets/filter.svg';
import EventCard from '../components/EventCard';
import BookingPopup from '../components/BookingPopup';
import SortFilterPopup from '../components/SortFilterPopup';
import '../styles/Explore.css';
import '../styles/EventCard.css';

export default function Explore() {
  const [view, setView] = useState('map'); // 'map' or 'list'
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingEvent, setBookingEvent] = useState(null);
  const [showSortFilter, setShowSortFilter] = useState(false);
  const [sortBy, setSortBy] = useState('price-asc');

  const mockEvents = [
    { name: searchTerm || 'Event Name', rating: 4.3, reviews: 310, price: '$$$$', hours: 'Opens 5:00 - Closes 9:00 PM' },
    { name: searchTerm || 'Event Name', rating: 4.1, reviews: 310, price: '$$$$$', hours: 'Opens 5:00 - Closes 9:00 PM' },
    { name: searchTerm || 'Event Name', rating: 4.1, reviews: 310, price: '$$$$', hours: 'Opens 5:00 - Closes 9:00 PM' },
    { name: searchTerm || 'Event Name', rating: 4.1, reviews: 310, price: '$$$', hours: 'Opens 5:00 - Closes 9:00 PM' },
    { name: searchTerm || 'Event Name', rating: 4.1, reviews: 310, price: '$$', hours: 'Opens 5:00 - Closes 9:00 PM' },
    { name: searchTerm || 'Event Name', rating: 4.1, reviews: 310, price: '$', hours: 'Opens 5:00 - Closes 9:00 PM' },
  ];

  const handleSearch = (value) => {
    setSearchTerm(value);
    setView('list');
  };

  const handleToggleView = () => {
    if (view === 'map') {
      setView('list');
    } else {
      setView('map');
      setSearchTerm('');
    }
  };

  const handleBookNow = (eventName) => {
    setBookingEvent(eventName);
    setView('map');
  };

  const handleCloseBooking = () => {
    setBookingEvent(null);
    setView('list');
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters.categories);
    setSortBy(filters.sortBy);
  };

  return (
    <div className="explore-container">
      {/* Map View */}
      <div className="map-view" style={{ backgroundImage: `url(${mapBackground})` }}>
        {/* Search Bar */}
        <div className={`search-bar-container ${searchTerm ? 'expanded' : ''}`}>
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search" 
            defaultValue={searchTerm}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e.target.value);
              }
            }}
          />
        </div>

        {/* Event List Overlay */}
        <div className={`list-view-overlay ${view === 'list' ? 'expanded' : ''} ${searchTerm ? 'search-expanded' : ''} ${bookingEvent ? 'hidden' : ''}`}>
            {/* Toggle Map/List Button */}
            <button className="toggle-view-btn" onClick={handleToggleView}>
              <img 
                src={arrowIcon} 
                alt="Toggle" 
                style={{ 
                  transform: view === 'list' ? 'rotate(180deg)' : 'rotate(0deg)',
                }} 
              />
            </button>

            {/* Sort/Filter */}
            <div className="sort-filter-container">
              <button 
                className="sort-button"
                onClick={() => setShowSortFilter(true)}
              >
                <img src={filterIcon} alt="Filter" />
                <span>Sort/Filter</span>
              </button>
            </div>

            {/* Event List */}
            <div className="event-list">
              {mockEvents.map((event, index) => (
                <EventCard
                  key={index}
                  event={event}
                  index={index}
                  isSelected={selectedEvent === index}
                  onSelect={(idx) => setSelectedEvent(selectedEvent === idx ? null : idx)}
                  onClose={() => setSelectedEvent(null)}
                  onBookNow={handleBookNow}
                />
              ))}
          </div>
        </div>

        {/* Booking Popup */}
        {bookingEvent && (
          <BookingPopup 
            eventName={bookingEvent}
            onClose={handleCloseBooking}
          />
        )}

        {/* Sort/Filter Popup */}
        {showSortFilter && (
          <SortFilterPopup
            onClose={() => setShowSortFilter(false)}
            onApply={handleApplyFilters}
            initialFilters={activeFilters}
            initialSort={sortBy}
          />
        )}
      </div>
    </div>
  );
}