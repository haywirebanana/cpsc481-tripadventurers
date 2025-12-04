import { useState } from 'react';
import arrowIcon from '../assets/arrow.svg';
import '../styles/BookingPopup.css';

export default function BookingPopup({ eventName, onClose }) {
  const [group, setGroup] = useState(1);
  const [day, setDay] = useState(1);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const timeSlots = [
    { time: '12:00pm - 01:00pm', available: false },
    { time: '01:00pm - 02:00pm', available: true },
    { time: '02:00pm - 03:00pm', available: false },
    { time: '03:00pm - 04:00pm', available: true },
    { time: '04:00pm - 05:00pm', available: false },
  ];

  const handleConfirm = () => {
    setShowPayment(true);
  };

  const handleBack = () => {
    setShowPayment(false);
  };

  return (
    <div className="booking-panel-overlay expanded">
      <button className="toggle-view-btn" onClick={showPayment ? handleBack : onClose}>
        <img 
          src={arrowIcon} 
          alt="Close" 
          style={{ 
            transform: 'rotate(180deg)',
          }} 
        />
      </button>
      
      <div className="booking-panel-content">
        <h2 className="booking-panel-title">{eventName}</h2>
        
        {!showPayment ? (
          <>
            <div className="booking-panel-section">
              <h3 className="booking-section-title">Booking:</h3>
              <p className="booking-cost-info">Costs Per Person: $20</p>
              
              <div className="booking-panel-inputs">
                <div className="booking-input-group">
                  <label>Group:</label>
                  <input 
                    type="number" 
                    value={group} 
                    onChange={(e) => setGroup(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="booking-number-input"
                  />
                </div>
                
                <div className="booking-input-group">
                  <label>Day:</label>
                  <input 
                    type="number" 
                    value={day} 
                    onChange={(e) => setDay(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="booking-number-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="booking-panel-section">
              <h3 className="booking-section-title">Availability:</h3>
              
              <div className="booking-time-slots">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`booking-time-slot ${!slot.available ? 'unavailable' : ''} ${selectedTime === index ? 'selected' : ''}`}
                    onClick={() => slot.available && setSelectedTime(index)}
                    disabled={!slot.available}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              className="booking-confirm-btn" 
              onClick={handleConfirm}
              disabled={selectedTime === null}
            >
              Confirm
            </button>
          </>
        ) : (
          <>
            <div className="booking-panel-section">
              <h3 className="booking-section-title">Booking Information:</h3>
              <p className="booking-info-text">Number Of Guests: {group}</p>
              <p className="booking-info-text">Trip Day: {day}</p>
              <p className="booking-info-text">Time: {selectedTime !== null ? timeSlots[selectedTime].time : 'Not selected'}</p>
              <p className="booking-info-text">Total Costs: ${group * 20}</p>
            </div>
            
            <div className="booking-panel-section">
              <h3 className="booking-section-title">Payment Information:</h3>

              <div className="payment-buttons">
                <button className="payment-method-btn">PayPaL</button>
                <button className="payment-method-btn">ApplePay</button>
                <button className="payment-method-btn">GooglePay</button>
              </div>
              
              <div className="payment-input-group">
                <label>Credit Card #:</label>
                <input 
                  type="text" 
                  className="payment-input"
                  placeholder=""
                />
              </div>
              
              <div className="payment-input-group">
                <label>Card Holder Name:</label>
                <input 
                  type="text" 
                  className="payment-input"
                  placeholder=""
                />
              </div>
              
              <div className="payment-row">
                <div className="payment-input-group">
                  <label>Expiry:</label>
                  <input 
                    type="text" 
                    className="payment-input-small"
                    placeholder="MM/YY"
                  />
                </div>
                
                <div className="payment-input-group">
                  <label>CVV:</label>
                  <input 
                    type="text" 
                    className="payment-input-small"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
            
            <button className="booking-confirm-btn">Confirm</button>
          </>
        )}
      </div>
    </div>
  );
}
