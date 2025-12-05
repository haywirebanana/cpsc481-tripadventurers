import { useState } from 'react';
import '../styles/EventCard.css';

export default function ItineraryEventCard({ 
  event, 
  index, 
  isSelected, 
  onSelect, 
  onClose, 
  onViewAlternatives,
  onRemove 
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(event.id);
    }, 300);
  };

  return (
    <div 
      className={`event-card-container ${isSelected ? 'selected' : ''} ${isRemoving ? 'removing' : ''}`}
      onClick={() => !isSelected && onSelect(index)}
    >
      {/* Collapsed View */}
      <div className="event-card-collapsed">
        <div className="event-card-info">
          <h3 className="event-card-name">{event.name}</h3>
          <div className="event-card-details">
            <div className="event-card-rating">
              <span className="rating-text">{event.rating}</span>
              <span className="reviews-text">({event.reviews})</span>
            </div>
            <span className="event-card-price">{event.price}</span>
          </div>
        </div>
      </div>

      {/* Expanded View */}
      {isSelected && (
        <div className="event-card-expanded" onClick={(e) => e.stopPropagation()}>
          <button className="event-card-close" onClick={onClose}>×</button>
          
          <h3 className="event-card-name-expanded">{event.name}</h3>
          
          <div className="event-card-details-expanded">
            <div className="event-card-rating-expanded">
              <span className="rating-text-large">{event.rating}</span>
              <span className="reviews-text-large">({event.reviews} reviews)</span>
            </div>
            <span className="event-card-price-expanded">{event.price}</span>
          </div>
          
          <div className="event-card-hours">
            <span className={event.isOpen ? 'hours-open' : 'hours-closed'}>
              {event.hours}
            </span>
          </div>

          <div className="event-card-status">
            <span className="status-badge booked">Already Booked</span>
          </div>
          
          <div className="event-card-actions">
            <button 
              className="event-action-btn alternatives-btn"
              onClick={() => onViewAlternatives(event.category)}
            >
              View Alternatives
            </button>
            <button 
              className="event-action-btn remove-btn"
              onClick={handleRemove}
            >
              Remove from Itinerary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}