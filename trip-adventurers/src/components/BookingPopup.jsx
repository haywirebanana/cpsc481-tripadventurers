import { useState } from 'react';
import arrowIcon from '../assets/arrow.svg';
import '../styles/BookingPopup.css';

export default function BookingPopup({ eventName, onClose }) {
  const [group, setGroup] = useState(1);
  const [day, setDay] = useState(1);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  
  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Validation state
  const [errors, setErrors] = useState({});

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
    setErrors({});
  };
  
  const validateCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    return cleaned.length === 16 && /^\d+$/.test(cleaned);
  };
  
  const validateExpiry = (value) => {
    const match = value.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    
    const month = parseInt(match[1], 10);
    
    if (month < 1 || month > 12) return false;
    
    return true;
  };
  
  const validateCVV = (value) => {
    return value.length === 3 && /^\d+$/.test(value);
  };
  
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setCardNumber(formatted);
    if (errors.cardNumber) {
      setErrors({...errors, cardNumber: ''});
    }
  };
  
  const handleExpiryChange = (e) => {
    const rawValue = e.target.value;
    let value = rawValue.replace(/\D/g, '');
    
    if (rawValue.length < expiry.length && rawValue.endsWith('/')) {
      // User is backspacing, remove the slash and the digit before it
      value = value.slice(0, -1);
    }
    
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiry(value);
    if (errors.expiry) {
      setErrors({...errors, expiry: ''});
    }
  };
  
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(value);
    if (errors.cvv) {
      setErrors({...errors, cvv: ''});
    }
  };
  
  const handleCardHolderChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setCardHolder(value);
    if (errors.cardHolder) {
      setErrors({...errors, cardHolder: ''});
    }
  };
  
  const handlePaymentConfirm = () => {
    const newErrors = {};
    
    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!validateCardNumber(cardNumber)) {
      newErrors.cardNumber = 'Invalid card number (16 digits required)';
    }
    
    if (!cardHolder.trim()) {
      newErrors.cardHolder = 'Card holder name is required';
    } else if (cardHolder.trim().length < 3) {
      newErrors.cardHolder = 'Name is too short';
    }
    
    if (!expiry) {
      newErrors.expiry = 'Expiry date is required';
    } else if (!validateExpiry(expiry)) {
      newErrors.expiry = 'Invalid or expired date (MM/YY)';
    }
    
    if (!cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!validateCVV(cvv)) {
      newErrors.cvv = 'Invalid CVV (3 digits required)';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // If validation passes, proceed with booking
    alert('Booking confirmed!');
    onClose();
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
              
              {Object.keys(errors).length > 0 && (
                <div className="error-message">
                  Please check your payment information and try again.
                </div>
              )}

              <div className="payment-buttons">
                <button className="payment-method-btn">PayPaL</button>
                <button className="payment-method-btn">ApplePay</button>
                <button className="payment-method-btn">GooglePay</button>
              </div>
              <div className={`payment-input-group ${errors.cardNumber ? 'input-error' : ''}`}>
                <label>Credit Card #:</label>
                <input 
                  type="text" 
                  className="payment-input"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength="19"
                />
              </div>
              
              <div className={`payment-input-group ${errors.cardHolder ? 'input-error' : ''}`}>
                <label>Card Holder Name:</label>
                <input 
                  type="text" 
                  className="payment-input"
                  placeholder="John Doe"
                  value={cardHolder}
                  onChange={handleCardHolderChange}
                />
              </div>
              
              <div className="payment-row">
                <div className={`payment-input-group ${errors.expiry ? 'input-error' : ''}`}>
                  <label>Expiry:</label>
                  <input 
                    type="text" 
                    className="payment-input-small"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    maxLength="5"
                  />
                </div>
                
                <div className={`payment-input-group ${errors.cvv ? 'input-error' : ''}`}>
                  <label>CVV:</label>
                  <input 
                    type="text" 
                    className="payment-input-small"
                    placeholder="123"
                    value={cvv}
                    onChange={handleCvvChange}
                    maxLength="3"
                  />
                </div>
              </div>
            </div>
            
            <button className="booking-confirm-btn" onClick={handlePaymentConfirm}>Confirm</button>
          </>
        )}
      </div>
    </div>
  );
}
