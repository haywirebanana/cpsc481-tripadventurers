import phoneIcon from '../assets/phone-icon.svg';
import webLinkIcon from '../assets/web-link-icon.svg';
import navMapsIcon from '../assets/nav-maps-icon.svg';

export default function EventCard({ event, index, isSelected, onSelect, onClose, onBookNow, onDirections, onAddToItinerary }) {  
  return (
    <div 
      className={`explore-event-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(index)}
    >
      {isSelected ? (
        // Expanded view
        <>
          <button className="close-btn" onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}>×</button>
          <h3 className="event-name">{event.name}</h3>
          <div className="event-details">
            <div className="rating">
              <span className="rating-number">{event.rating}</span>
              <span className="stars">{'★'.repeat(Math.floor(event.rating))}{'☆'.repeat(5 - Math.floor(event.rating))}</span>
              <span className="reviews">({event.reviews})</span>
            </div>
            <span className="separator">•</span>
            <span className="price">{event.price}</span>
          </div>
          <p className="event-hours">{event.hours}</p>
          
          <div className="event-location">
            <img src={navMapsIcon} alt="Location" className="icon" />
            <span>67 Someplace, Calgary, AB, Canada</span>
          </div>
          
          <div className="event-website">
            <img src={webLinkIcon} alt="Website" className="icon" />
            <span>EventsAwesome.com</span>
          </div>
          
          <div className="event-phone">
            <img src={phoneIcon} alt="Phone" className="icon" />
            <span>(xxx) xxx-xxxx</span>
          </div>
          
          <div className="event-actions">
            <button 
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onBookNow(event.name);
              }}
            >
              Book Now
            </button>
            <button
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDirections(event.name);
              }}
            >
              Directions
            </button>
          </div>
          
          <button 
            className="itinerary-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToItinerary(event);
            }}
          >
            Add To Itinerary
          </button>
        </>
      ) : (
        // Collapsed view
        <>
          <h3 className="event-name">{event.name}</h3>
          <div className="event-details">
            <div className="rating">
              <span className="rating-number">{event.rating}</span>
              <span className="stars">{'★'.repeat(Math.floor(event.rating))}{'☆'.repeat(5 - Math.floor(event.rating))}</span>
              <span className="reviews">({event.reviews})</span>
            </div>
            <span className="separator">•</span>
            <span className="price">{event.price}</span>
          </div>
          <p className="event-hours">{event.hours}</p>
        </>
      )}
    </div>
  );
}