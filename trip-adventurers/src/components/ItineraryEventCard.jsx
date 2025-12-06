import { useState } from 'react';
import '../styles/itinerary.css';

export default function ItineraryEventCard({ 
  event, 
  index, 
  isSelected, 
  isCustomEvent = false,
  onSelect, 
  onClose, 
  onViewAlternatives,
  onRemove,
  onEdit,
  eventDescription,
  eventTime
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [description, setDescription] = useState(eventDescription || "");

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(event.id);
    }, 300);
  };

  const handleDescriptionSave = () => {
    if (onEdit) {
      // Save the description
      onEdit(index, description);
    }
  };

  return (
    <div className="modal-overlay-itinerary-events" onClick={onClose}>
      <div className="modal-content-itinerary-events-itinerary" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-itinerary-events">
          <h2 className="modal-title-itinerary-events">{event.name}</h2>
          <button className="modal-close-itinerary-events" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body-itinerary-events">
          {isCustomEvent && (
            <div className="event-badge-custom">
              <span className="badge-text">Custom Event</span>
            </div>
          )}
          
          {!isCustomEvent && (
            <div className="event-badge-booked">
              <span className="badge-text">Already Booked</span>
            </div>
          )}

          <p className="modal-section-title-itinerary-events">Time</p>
          <p className="modal-text-itinerary-events">{eventTime}</p>

          <p className="modal-section-title-itinerary-events">Description</p>
          <textarea
            className="modal-textarea-inline"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionSave}
            placeholder="Add event description..."
            rows="4"
          />
        </div>
        
        <div className="modal-footer-itinerary-events">
          {!isCustomEvent && (
            <button 
              className="modal-button-alternatives" 
              onClick={() => onViewAlternatives(event.category)}
            >
              View Alternatives
            </button>
          )}
          <button 
            className="modal-button-remove"
            onClick={handleRemove}
          >
            Remove from Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}