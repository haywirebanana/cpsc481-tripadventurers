import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import arrowIcon from '../assets/arrow.svg';
import paymentsuc from '../assets/paymentsuc.png';
import '../styles/BookingPopup.css';

export default function BookingPopup({ eventName, eventId, onClose, replacingEvent = null }) {
  const navigate = useNavigate();
  const [group, setGroup] = useState(1);
  const [selectedDate, setSelectedDate] = useState('2025-12-22');
  const [selectedTime, setSelectedTime] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Validation state
  const [errors, setErrors] = useState({});

  const timeSlots = [
    { time: '12:00 PM - 1:00 PM', start: '12:00 PM', end: '1:00 PM', available: false },
    { time: '1:00 PM - 2:00 PM', start: '1:00 PM', end: '2:00 PM', available: true },
    { time: '2:00 PM - 3:00 PM', start: '2:00 PM', end: '3:00 PM', available: false },
    { time: '3:00 PM - 4:00 PM', start: '3:00 PM', end: '4:00 PM', available: true },
    { time: '4:00 PM - 5:00 PM', start: '4:00 PM', end: '5:00 PM', available: false },
  ];

  // Pre-select time slot if replacing an event and go straight to payment
  // Also transfer booking information from original event
  useEffect(() => {
    if (replacingEvent && selectedTime === null) {
      const matchingSlotIndex = timeSlots.findIndex(
        slot => slot.start === replacingEvent.start && slot.end === replacingEvent.end
      );
      if (matchingSlotIndex !== -1) {
        setSelectedTime(matchingSlotIndex);
        setShowPayment(true); // Go straight to payment page
      }
      
      // Transfer booking information from the original event
      if (replacingEvent.group) {
        setGroup(replacingEvent.group);
      }
      if (replacingEvent.date) {
        setSelectedDate(replacingEvent.date);
      }
    }
  }, [replacingEvent, timeSlots, selectedTime]);

  // Calculate day number from date
  const calculateDayNumber = (dateString) => {
    const baseDate = new Date('2025-12-22');
    const selectedDateObj = new Date(dateString);
    const diffTime = selectedDateObj - baseDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Day 1 is Dec 22
  };

  // Generate random color for event
  const getRandomColor = () => {
    const colors = ['#f2e8ff', '#e8f7ff', '#fff4e6', '#ffe8f0', '#e8fff4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

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
  
  const processBooking = () => {
    const dayNumber = calculateDayNumber(selectedDate);
    const itineraryEvents = JSON.parse(localStorage.getItem('itineraryEvents') || '{}');
    
    if (!itineraryEvents[dayNumber]) {
      itineraryEvents[dayNumber] = [];
    }
    
    const selectedSlot = timeSlots[selectedTime];
    
    // Only check for conflicts if NOT replacing an existing event
    if (!replacingEvent) {
      const timeSlotBooked = itineraryEvents[dayNumber].some(
        event => event.start === selectedSlot.start && 
                 event.end === selectedSlot.end
      );
      
      if (timeSlotBooked) {
        alert('This time slot overlaps with an existing event. Please choose a different time.');
        return;
      }
    } else {
      // If replacing, remove the old event at this time slot
      itineraryEvents[dayNumber] = itineraryEvents[dayNumber].filter(
        event => !(event.start === replacingEvent.start && event.end === replacingEvent.end)
      );
    }
    
    const bookingDescription = `Guests: ${group}\nDate: ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })}\nTime: ${selectedSlot.time}`;

    itineraryEvents[dayNumber].push({
      eventId: eventId,
      start: selectedSlot.start,
      end: selectedSlot.end,
      description: bookingDescription,
      color: getRandomColor()
    });
    
    localStorage.setItem('itineraryEvents', JSON.stringify(itineraryEvents));
    window.dispatchEvent(new Event('itineraryUpdated'));
    setShowSuccessModal(true);
  };
  
  const handlePaymentMethodClick = (method) => {
    const confirmed = window.confirm(`Do you want to open a new window for ${method}?`);
    if (confirmed) {
      processBooking();
    }
  };

  const handleSuccessClose = () => {
    const dayNumber = calculateDayNumber(selectedDate);
    setShowSuccessModal(false);
    navigate('/trip/1/intinerary', { state: { day: dayNumber } });
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
    
    processBooking();
  };

  return (
    <>
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
                    <label>Party Size:</label>
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
                      type="date" 
                      value={selectedDate} 
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min="2025-12-22"
                      max="2025-12-27"
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
                <p className="booking-info-text">
                  Trip Day: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
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
                  <button className="payment-method-btn" onClick={() => handlePaymentMethodClick('PayPal')}>PayPal</button>
                  <button className="payment-method-btn" onClick={() => handlePaymentMethodClick('ApplePay')}>ApplePay</button>
                  <button className="payment-method-btn" onClick={() => handlePaymentMethodClick('GooglePay')}>GooglePay</button>
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

      {showSuccessModal && (
        <div className="modal-overlay-success" onClick={handleSuccessClose}>
          <div className="modal-content-success" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">
              <img src={paymentsuc} alt="Success" />
            </div>
            <h3 className="modal-title-success">Payment Successful!</h3>
            <p className="modal-message-success">
              Your booking has been confirmed and added to your itinerary.
            </p>
            <button 
              className="modal-btn-success"
              onClick={handleSuccessClose}
            >
              View Itinerary
            </button>
          </div>
        </div>
      )}
    </>
  );
}