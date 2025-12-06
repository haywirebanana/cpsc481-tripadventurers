import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import mapBackground from '../assets/map.jpg';
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
    navigate('/trip/1/intinerary', { 
      state: { 
        prefilledEvent: {
          eventId: event.id,
          title: event.name
        }
      } 
    });
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
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