import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import mapBackground from '../assets/map.png';
import mapDirections from '../assets/map-directions.png';
import searchIcon from '../assets/search.svg';
import arrowIcon from '../assets/arrow.svg';
import filterIcon from '../assets/filter.svg';
import EventCard from '../components/EventCard';
import BookingPopup from '../components/BookingPopup';
import SortFilterPopup from '../components/SortFilterPopup';
import { allEvents } from '../components/EventsData';
import '../styles/Explore.css';
import '../styles/EventCard.css';

export default function Explore() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [view, setView] = useState('map');
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

  // Handle navigation from itinerary with category filter
  useEffect(() => {
    if (location.state?.filterCategory) {
      setActiveFilters(prev => ({
        ...prev,
        categories: [location.state.filterCategory]
      }));
      setView('list');
      setShowSortFilter(true);
    }
  }, [location.state]);

  // Filter and sort events
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
    const event = allEvents.find(e => e.name === eventName);
    if (event) {
      setBookingEvent({ name: eventName, id: event.id });
      setView('map');
    }
  };

  const handleCloseBooking = () => {
    setBookingEvent(null);
    setView('list');
  };

  const handleAddToItinerary = (event) => {
    // Navigate to itinerary with prefilled event data
    const prefilledData = {
      eventId: event.id,
      title: event.name
    };
    
    // If we're replacing an existing event, include its time slot
    if (location.state?.replacingEvent) {
      prefilledData.start = location.state.replacingEvent.start;
      prefilledData.end = location.state.replacingEvent.end;
    }
    
    navigate('/trip/1/intinerary', { 
      state: { 
        prefilledEvent: prefilledData,
        day: location.state?.replacingEvent?.day
      } 
    });
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
          <>
            <div className={`search-bar-container ${searchTerm || directionMode ? 'expanded' : ''} ${directionMode ? 'direction-mode' : ''}`}>
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
            {directionMode && (
              <button
                className="use-current-location"
                onClick={() => {
                  setStartingAddress('Current Location');
                  setShowDirections(true);
                  setInputValue('');
                }}
              >
                📍 Use Current Location
              </button>
            )}
          </>
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
                    onAddToItinerary={handleAddToItinerary}
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
            eventName={bookingEvent.name}
            eventId={bookingEvent.id}
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