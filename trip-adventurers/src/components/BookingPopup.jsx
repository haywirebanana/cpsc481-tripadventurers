import { useState } from 'react';
import '../styles/BookingPopup.css';

export default function BookingPopup({ eventName, onClose }) {
  const [group, setGroup] = useState(1);
  const [day, setDay] = useState(1);
  const [selectedTime, setSelectedTime] = useState(null);

  const timeSlots = [
    { time: '12:00pm - 01:00pm', available: true },
    { time: '01:00pm - 02:00pm', available: true },
    { time: '02:30pm - 03:30pm', available: true },
    { time: '07:00pm - 08:30pm', available: false },
  ];

  return (
    <div className="explore-booking-overlay" onClick={onClose}>
      <div className="explore-booking-popup" onClick={(e) => e.stopPropagation()}>
        <button className="explore-booking-close-btn" onClick={onClose}>×</button>
        
        <h2 className="explore-booking-title">{eventName}</h2>
        
        <div className="explore-booking-section">
          <h3 className="section-title">Booking:</h3>
          <p className="cost-info">Costs Per Person: $20</p>
          
          <div className="explore-booking-inputs">
            <div className="input-group">
              <label>Group:</label>
              <input 
                type="number" 
                value={group} 
                onChange={(e) => setGroup(Math.max(1, parseInt(e.target.value) || 1))}
                onKeyDown={(e) => e.preventDefault()}
                min="1"
                className="number-input"
              />
            </div>
            
            <div className="input-group">
              <label>Day:</label>
              <input 
                type="number" 
                value={day} 
                onChange={(e) => setDay(Math.max(1, parseInt(e.target.value) || 1))}
                onKeyDown={(e) => e.preventDefault()}
                min="1"
                className="number-input"
              />
            </div>
          </div>
        </div>
        
        <div className="explore-booking-section">
          <h3 className="section-title">Availability:</h3>
          
          <div className="time-slots">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                className={`time-slot ${!slot.available ? 'unavailable' : ''} ${selectedTime === index ? 'selected' : ''}`}
                onClick={() => slot.available && setSelectedTime(index)}
                disabled={!slot.available}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
        
        <button className="confirm-btn">Confirm</button>
      </div>
    </div>
  );
}
