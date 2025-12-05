import { useState, useMemo } from 'react';
import mapBackground from '../assets/map.png';
import mapDirections from '../assets/map-directions.png';
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
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    sortBy: 'price-asc',
    ratingRange: [1, 5],
    priceRange: [1, 5],
    openNow: false
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingEvent, setBookingEvent] = useState(null);
  const [showSortFilter, setShowSortFilter] = useState(false);
  const [directionMode, setDirectionMode] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [startingAddress, setStartingAddress] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [destinationEvent, setDestinationEvent] = useState('');

  // Comprehensive mock data with all categories
  const allEvents = [
    // Museums (7)
    { name: 'Glenbow Museum', category: 'museum', rating: 4.5, reviews: 892, price: '$$', hours: 'Open • Closes 5:00 PM', isOpen: true },
    { name: 'Heritage Park Historical Village', category: 'museum', rating: 4.7, reviews: 1543, price: '$$$', hours: 'Closed • Opens 10:00 AM Tomorrow', isOpen: false },
    { name: 'TELUS Spark Science Centre', category: 'museum', rating: 4.6, reviews: 2108, price: '$$$', hours: 'Open • Closes 4:00 PM', isOpen: true },
    { name: 'Military Museums', category: 'museum', rating: 4.4, reviews: 567, price: '$', hours: 'Open • Closes 5:00 PM', isOpen: true },
    { name: 'Esker Foundation Contemporary Art Gallery', category: 'museum', rating: 4.3, reviews: 234, price: '$', hours: 'Closed • Opens 12:00 PM Tomorrow', isOpen: false },
    { name: 'Studio Bell', category: 'museum', rating: 4.8, reviews: 1876, price: '$$$$', hours: 'Open • Closes 9:00 PM', isOpen: true },
    { name: 'Calgary Selfie Museum', category: 'museum', rating: 4.2, reviews: 445, price: '$$', hours: 'Closed • Opens 9:00 AM Tomorrow', isOpen: false },
    
    // Restaurants (7)
    { name: 'Porch', category: 'restaurant', rating: 4.6, reviews: 1234, price: '$$$$', hours: 'Open • Closes 10:00 PM', isOpen: true },
    { name: 'Orchard', category: 'restaurant', rating: 4.5, reviews: 987, price: '$$$', hours: 'Open • Closes 11:00 PM', isOpen: true },
    { name: 'The Canadian Brewhouse', category: 'restaurant', rating: 4.7, reviews: 1567, price: '$$$$$', hours: 'Closed • Opens 5:00 PM', isOpen: false },
    { name: 'Bubblemania', category: 'restaurant', rating: 4.4, reviews: 756, price: '$$$', hours: 'Open • Closes 10:00 PM', isOpen: true },
    { name: 'State & Main', category: 'restaurant', rating: 4.8, reviews: 2134, price: '$$$$', hours: 'Closed • Opens 5:30 PM', isOpen: false },
    { name: 'Una Pizza + Wine', category: 'restaurant', rating: 4.3, reviews: 891, price: '$$', hours: 'Open • Closes 11:00 PM', isOpen: true },
    { name: 'Kinjo', category: 'restaurant', rating: 4.5, reviews: 1023, price: '$$$', hours: 'Open • Closes 12:00 AM', isOpen: true },
    
    // Gas Stations (6)
    { name: 'Petro-Canada', category: 'gas', rating: 3.8, reviews: 145, price: '$', hours: 'Open 24 Hours', isOpen: true },
    { name: 'Shell', category: 'gas', rating: 4.0, reviews: 234, price: '$', hours: 'Open 24 Hours', isOpen: true },
    { name: 'Esso', category: 'gas', rating: 3.9, reviews: 198, price: '$', hours: 'Open • Closes 11:00 PM', isOpen: true },
    { name: 'Co-op Gas', category: 'gas', rating: 4.2, reviews: 312, price: '$', hours: 'Open • Closes 10:00 PM', isOpen: true },
    { name: '7-Eleven Gas', category: 'gas', rating: 3.7, reviews: 167, price: '$', hours: 'Open 24 Hours', isOpen: true },
    { name: 'Mobil', category: 'gas', rating: 3.6, reviews: 89, price: '$', hours: 'Open • Closes 12:00 AM', isOpen: true },
    
    // Shopping/Malls (5)
    { name: 'CF Chinook Centre', category: 'shopping', rating: 4.4, reviews: 3421, price: '$$$$', hours: 'Open • Closes 9:00 PM', isOpen: true },
    { name: 'CORE Shopping Centre', category: 'shopping', rating: 4.3, reviews: 2876, price: '$$$', hours: 'Open • Closes 7:00 PM', isOpen: true },
    { name: 'CrossIron Mills', category: 'shopping', rating: 4.2, reviews: 4123, price: '$$$', hours: 'Open • Closes 9:00 PM', isOpen: true },
    { name: 'Market Mall', category: 'shopping', rating: 4.1, reviews: 1987, price: '$$', hours: 'Open • Closes 8:00 PM', isOpen: true },
    { name: 'Southcentre Mall', category: 'shopping', rating: 4.0, reviews: 2345, price: '$$', hours: 'Open • Closes 9:00 PM', isOpen: true },
    
    // Cafés (7)
    { name: 'Phil & Sebastian Coffee Roasters', category: 'cafe', rating: 4.7, reviews: 1876, price: '$$', hours: 'Open • Closes 6:00 PM', isOpen: true },
    { name: 'Monogram Coffee', category: 'cafe', rating: 4.6, reviews: 1432, price: '$$', hours: 'Open • Closes 5:00 PM', isOpen: true },
    { name: 'Rosso Coffee Roasters', category: 'cafe', rating: 4.5, reviews: 2103, price: '$', hours: 'Open • Closes 7:00 PM', isOpen: true },
    { name: 'Analog Coffee', category: 'cafe', rating: 4.4, reviews: 987, price: '$', hours: 'Closed • Opens 7:00 AM Tomorrow', isOpen: false },
    { name: 'Fratello Coffee Roasters', category: 'cafe', rating: 4.3, reviews: 1234, price: '$', hours: 'Open • Closes 6:00 PM', isOpen: true },
    { name: 'Higher Ground Café', category: 'cafe', rating: 4.2, reviews: 678, price: '$$', hours: 'Open • Closes 5:00 PM', isOpen: true },
    { name: 'Vendome Café', category: 'cafe', rating: 4.8, reviews: 1567, price: '$$', hours: 'Closed • Opens 8:00 AM Tomorrow', isOpen: false },
  ];

  // Filter and sort events based on current filters and search term
  const filteredEvents = useMemo(() => {
    let events = [...allEvents];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      events = events.filter(event => 
        event.name.toLowerCase().includes(searchLower) ||
        event.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (activeFilters.categories.length > 0) {
      events = events.filter(event => 
        activeFilters.categories.includes(event.category)
      );
    }

    // Apply rating filter
    events = events.filter(event => 
      event.rating >= activeFilters.ratingRange[0] && 
      event.rating <= activeFilters.ratingRange[1]
    );

    // Apply price filter
    const priceToNumber = (price) => price.length;
    events = events.filter(event => {
      const eventPrice = priceToNumber(event.price);
      return eventPrice >= activeFilters.priceRange[0] && 
             eventPrice <= activeFilters.priceRange[1];
    });

    // Apply "open now" filter
    if (activeFilters.openNow) {
      events = events.filter(event => event.isOpen);
    }

    // Apply sorting
    switch (activeFilters.sortBy) {
      case 'price-asc':
        events.sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));
        break;
      case 'price-desc':
        events.sort((a, b) => priceToNumber(b.price) - priceToNumber(a.price));
        break;
      case 'rating-asc':
        events.sort((a, b) => a.rating - b.rating);
        break;
      case 'rating-desc':
        events.sort((a, b) => b.rating - a.rating);
        break;
      case 'closest':
        // For now, just sort by name (you could add distance data later)
        events.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return events;
  }, [searchTerm, activeFilters]);

  const handleToggleView = () => {
    if (view === 'map') {
      setView('list');
    } else {
      setView('map');
      setSearchTerm('');
      setInputValue(''); // Also clear the input field
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
    setActiveFilters(filters);
  };

  const handleDirectionClick = (eventName) => {
    // Triggered from EventCard's Directions button
    setDirectionMode(true);
    setView('map');
    setShowDirections(false);
    setStartingAddress('');
    setInputValue('');
    setSearchTerm('');
    setDestinationEvent(eventName); // Store the event name
    setSelectedEvent(null); // Close the selected event card
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Don't set searchTerm immediately - wait for Enter key
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (directionMode && inputValue.trim()) {
        // In direction mode, show directions
        setStartingAddress(inputValue);
        setShowDirections(true);
      } else if (!directionMode && inputValue.trim()) {
        // In search mode, perform search
        setSearchTerm(inputValue);
        setView('list');
      }
    }
  };

  const closeDirections = () => {
    setDirectionMode(false);
    setShowDirections(false);
    setStartingAddress('');
    setInputValue('');
    setDestinationEvent('');
    setSearchTerm(''); // Clear search term when closing directions
  };

  return (
    <div className="explore-container">
      {/* Map View */}
      <div className="map-view" style={{ backgroundImage: `url(${showDirections ? mapDirections : mapBackground})` }}>
        {/* Search Bar - Only show when not showing directions */}
        {!showDirections && (
          <div className={`search-bar-container ${searchTerm || directionMode ? 'expanded' : ''}`}>
            <img src={searchIcon} alt="Search" className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder={directionMode ? "Enter starting address and press Enter" : "Search"}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
            />
            {directionMode && (
              <button
                className="close-direction-mode"
                onClick={() => {
                  setDirectionMode(false);
                  setInputValue('');
                  setDestinationEvent('');
                }}
                title="Cancel directions"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Direction Info Panel */}
        {showDirections && (
          <div className="direction-info-panel">
            <button className="close-directions" onClick={closeDirections} title="Close directions">×</button>
            <div className="direction-details">
              <p className="from-label">From: <span>{startingAddress}</span></p>
              <p className="to-label">To: <span>{destinationEvent}</span></p>
              <p className="distance-label">Distance: <span>2.5 km</span></p>
              <p className="time-label">Est. Time: <span>8 mins</span></p>
            </div>
          </div>
        )}

        {/* Event List Overlay */}
        <div className={`list-view-overlay ${view === 'list' ? 'expanded' : ''} ${searchTerm ? 'search-expanded' : ''} ${(bookingEvent || showDirections || directionMode) ? 'hidden' : ''}`}>
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
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <EventCard
                    key={`${event.category}-${index}`}
                    event={event}
                    index={index}
                    isSelected={selectedEvent === index}
                    onSelect={(idx) => setSelectedEvent(selectedEvent === idx ? null : idx)}
                    onClose={() => setSelectedEvent(null)}
                    onBookNow={handleBookNow}
                    onDirections={handleDirectionClick}
                  />
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No results found
                </div>
              )}
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
            initialFilters={activeFilters.categories}
            initialSort={activeFilters.sortBy}
          />
        )}
      </div>
    </div>
  );
}