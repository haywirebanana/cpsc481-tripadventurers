import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import ItineraryEventCard from '../components/ItineraryEventCard';
import { getEventById } from '../components/EventsData.jsx';
import "../components/itinerary.css";

export default function Itinerary() {
  const navigate = useNavigate();
  const location = useLocation();

  // Generate hour slots
  const times = Array.from({ length: 25 }, (_, hour) => {
    const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? "AM" : "PM";
    return `${h}:00 ${period}`;
  });

  function timeToMinutes(t) {
    if (!t) return 0;
    const parts = t.trim().split(" ");
    if (parts.length !== 2) return 0;
    
    const [time, period] = parts;
    const timeParts = time.split(":");
    if (timeParts.length !== 2) return 0;
    
    let [h, m] = timeParts.map(Number);
    
    if (period.toUpperCase() === "PM" && h !== 12) {
      h += 12;
    } else if (period.toUpperCase() === "AM" && h === 12) {
      h = 0;
    }
    
    return h * 60 + (m || 0);
    if (!t) return 0;
    const parts = t.trim().split(" ");
    if (parts.length !== 2) return 0;
    
    const [time, period] = parts;
    const timeParts = time.split(":");
    if (timeParts.length !== 2) return 0;
    
    let [h, m] = timeParts.map(Number);
    
    if (period.toUpperCase() === "PM" && h !== 12) {
      h += 12;
    } else if (period.toUpperCase() === "AM" && h === 12) {
      h = 0;
    }
    
    return h * 60 + (m || 0);
  }

  // Day state
  const [currentDay, setCurrentDay] = useState(1);
  const days = ["Dec 22, 2025", "Dec 23, 2025", "Dec 24, 2025", "Dec 25, 2025", "Dec 26, 2025", "Dec 27, 2025"];
 
  // refs: container + per-day buttons
  const dateScrollRef = useRef(null);
  const dayButtonRefs = useRef([]);
  
  // State for modals and selected events
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  
  // form fields
  const [newEvent, setNewEvent] = useState({
    eventId: "",
    title: "",
    start: "",
    end: "",
    color: "#fff4e6"
  });

  // Load events from localStorage
  const [eventsByDay, setEventsByDay] = useState(() => {
    const stored = localStorage.getItem('itineraryEvents');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored events", e);
      }
    }
    // Default events if nothing in localStorage
    const defaultEvents = {
      1: [
        { 
          eventId: "tims", 
          start: "8:00 AM", 
          end: "9:00 AM", 
          color: "#f2e8ff"
        },
        { 
          eventId: "bubblemania",
          start: "10:00 AM", 
          end: "12:00 PM", 
          color: "#e8f7ff"
        },
      ],
      2: [
        { 
          eventId: "chinook", 
          start: "9:00 AM", 
          end: "11:00 AM", 
          color: "#fff4e6"
        },
      ],
    };
    localStorage.setItem('itineraryEvents', JSON.stringify(defaultEvents));
    return defaultEvents;
  });
  
  const events = eventsByDay[currentDay] || [];

  // Save to localStorage whenever eventsByDay changes
  useEffect(() => {
    localStorage.setItem('itineraryEvents', JSON.stringify(eventsByDay));
  }, [eventsByDay]);

  // Listen for updates from booking
  useEffect(() => {
    const handleItineraryUpdate = () => {
      const stored = localStorage.getItem('itineraryEvents');
      if (stored) {
        setEventsByDay(JSON.parse(stored));
      }
    };

    window.addEventListener('itineraryUpdated', handleItineraryUpdate);
    return () => window.removeEventListener('itineraryUpdated', handleItineraryUpdate);
  }, []);

  // Handle navigation from Explore or Booking with specific day or prefilled event
  useEffect(() => {
    if (location.state?.day) {
      setCurrentDay(location.state.day);
      setTimeout(() => centerDay(location.state.day - 1), 50);
    }
    
    if (location.state?.prefilledEvent) {
      const { eventId, title } = location.state.prefilledEvent;
      setNewEvent({
        eventId: eventId,
        title: title,
        start: "",
        end: "",
        color: "#fff4e6"
      });
      setAddModalOpen(true);
    }
  }, [location.state]);

  // helper that centers a button at index (0-based)
  const centerDay = (index) => {
    const container = dateScrollRef.current;
    const btn = dayButtonRefs.current[index];
    if (!container || !btn) return;

    const btnLeft = btn.offsetLeft;
    const btnWidth = btn.offsetWidth;
    const containerWidth = container.clientWidth;

    const targetScrollLeft = btnLeft + btnWidth / 2 - containerWidth / 2;

    const maxScroll = container.scrollWidth - containerWidth;
    const finalScroll = Math.max(0, Math.min(maxScroll, targetScrollLeft));

    container.scrollTo({ left: finalScroll, behavior: "smooth" });
  };

  // when clicking a day: set current day and center it
  const handleDayClick = (index) => {
    setCurrentDay(index + 1);
    setSelectedEvent(null);
    window.requestAnimationFrame(() => centerDay(index));
  };

  // center initial current day on mount
  useEffect(() => {
    const i = currentDay - 1;
    setTimeout(() => centerDay(i), 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to open event details
  const openEventDetails = (itineraryEvent, index) => {
    setSelectedEvent(index);
  };

  // Function to view alternatives - navigate to Explore with filter
  const handleViewAlternatives = (category) => {
    navigate('/explore', { 
      state: { 
        filterCategory: category 
      } 
    });
  };

  // Function to remove event from itinerary
  const handleRemoveEvent = (eventIdOrIndex) => {
    setEventsByDay(prev => {
      const updated = { ...prev };
      
      // If it's a number, it's the index of a custom event
      if (typeof eventIdOrIndex === 'number') {
        updated[currentDay].splice(eventIdOrIndex, 1);
      } else {
        // Otherwise it's an eventId from EventsData
        updated[currentDay] = updated[currentDay].filter(
          event => event.eventId !== eventIdOrIndex
        );
      }
      
      return updated;
    });
    setSelectedEvent(null);
  };

  // Generate random color for custom events
  const getRandomColor = () => {
    const colors = ['#f2e8ff', '#e8f7ff', '#fff4e6', '#ffe8f0', '#e8fff4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Handle adding custom event
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddEvent = () => {
    // Prevent duplicate submissions
    if (isAdding) return;
    
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert('Please fill in all fields');
      return;
    }

    // Validate that times are selected (not default empty value)
    if (newEvent.start === "" || newEvent.end === "") {
      alert('Please select start and end times');
      return;
    }

    // Check if end time is after start time
    const startMinutes = timeToMinutes(newEvent.start);
    const endMinutes = timeToMinutes(newEvent.end);
    
    if (endMinutes <= startMinutes) {
      alert('End time must be after start time');
      return;
    }

    setIsAdding(true);

    setEventsByDay(prev => {
      const updated = { ...prev };
      if (!updated[currentDay]) {
        updated[currentDay] = [];
      }
      
      // If it's a custom event (no eventId from EventsData), store it differently
      if (!newEvent.eventId) {
        // Store as a custom event with title directly
        updated[currentDay].push({
          customTitle: newEvent.title,
          start: newEvent.start.trim(),
          end: newEvent.end.trim(),
          color: newEvent.color || getRandomColor()
        });
      } else {
        // Store as a reference to an event in EventsData
        updated[currentDay].push({
          eventId: newEvent.eventId,
          start: newEvent.start,
          end: newEvent.end,
          color: newEvent.color || getRandomColor()
        });
      }
      
      return updated;
    });

    // Reset form and close modal
    setNewEvent({
      eventId: "",
      title: "",
      start: "",
      end: "",
      color: "#fff4e6"
    });
    setAddModalOpen(false);
    
    // Reset the flag after a short delay
    setTimeout(() => setIsAdding(false), 500);
  };
  
  return (
    <div className="itinerary-container">
      {/* Date Bar */}
      <div className="date-bar">
        <div 
          className="date-scroll" 
          role="list" 
          ref={dateScrollRef}
          aria-label="Days"
        >
          {days.map((day, index) => (
            <button
              key={index}
              ref={(el) => (dayButtonRefs.current[index] = el)}
              className={`day-tab ${currentDay === index + 1 ? "active" : ""}`}
              onClick={() => handleDayClick(index)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>  

      {/* Add Event Button */}
      <div className="add-event-button">
        <button
          className="add-event-button"
          onClick={() => setAddModalOpen(true)}
        >
          +
        </button>
      </div>

      {/* Clear All Button - only show if there are events */}
      {events.length > 0 && (
        <div className="clear-all-button">
          <button
            className="clear-all-btn"
            onClick={() => {
              if (window.confirm(`Clear all events for ${days[currentDay - 1]}?`)) {
                setEventsByDay(prev => {
                  const updated = { ...prev };
                  updated[currentDay] = [];
                  return updated;
                });
              }
            }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Timeline Section */}
      <div className="timeline">
        {/* Time Column */}
        <div className="time-column">
          {times.map((time, index) => (
            <div key={index} className="time-slot">
              {time}
            </div>
          ))}
        </div>

        {/* Event Column */}
        <div className="events-column">
          {events.map((itineraryEvent, index) => {
            // Handle both regular events and custom events
            let displayName;
            const isCustomEvent = !!itineraryEvent.customTitle;

            if (isCustomEvent) {
              displayName = itineraryEvent.customTitle;
            } else {
              const eventData = getEventById(itineraryEvent.eventId);
              if (!eventData) return null;
              displayName = eventData.name;
            }

            const startMinutes = timeToMinutes(itineraryEvent.start);
            const endMinutes = timeToMinutes(itineraryEvent.end);
            const duration = endMinutes - startMinutes;
            const top = (startMinutes / 60) * 100;
            const height = (duration / 60) * 98;
            
            return (
              <div 
                key={index} 
                className="event-card"
                role="button"
                tabIndex={0}
                onClick={() => openEventDetails(itineraryEvent, index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openEventDetails(itineraryEvent, index);
                  }
                }}
                style={{ 
                  backgroundColor: itineraryEvent.color,
                  top: `${top}px`, 
                  height: `${height}px`,
                  cursor: 'pointer'
                }}
              >
                <h4 className="event-title">{displayName}</h4>
                <p className="event-time">{itineraryEvent.start} – {itineraryEvent.end}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Card Popup - itinerary version */}
      {selectedEvent !== null && (
        <div className="event-card-overlay">
          <ItineraryEventCard
            event={
              events[selectedEvent].customTitle 
                ? {
                    name: events[selectedEvent].customTitle,
                    rating: 0,
                    reviews: 0,
                    price: '',
                    hours: '',
                    isOpen: true,
                    category: 'custom',
                    id: selectedEvent
                  }
                : getEventById(events[selectedEvent].eventId)
            }
            index={selectedEvent}
            isSelected={true}
            isCustomEvent={!!events[selectedEvent].customTitle}
            onSelect={() => setSelectedEvent(null)}
            onClose={() => setSelectedEvent(null)}
            onViewAlternatives={handleViewAlternatives}
            onRemove={(id) => {
              // If custom event, pass index; otherwise pass eventId
              if (events[selectedEvent].customTitle) {
                handleRemoveEvent(selectedEvent);
              } else {
                handleRemoveEvent(id);
              }
            }}
          />
        </div>
      )}

      {/* Add Event Modal */}
      {addModalOpen && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setAddModalOpen(false);
            setNewEvent({
              eventId: "",
              title: "",
              start: "",
              end: "",
              color: "#fff4e6"
            });
          }
        }}>
          <div
            className="add-event-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">Add Event</h2>

            <label>Title:</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              placeholder="Event name"
              disabled={!!newEvent.eventId}
              disabled={!!newEvent.eventId}
            />

            <label>Start Time:</label>
            <select
              value={newEvent.start}
              onChange={(e) =>
                setNewEvent({ ...newEvent, start: e.target.value })
              }
              className="time-select"
            >
              <option value="">Select a time</option>
              {times.map((t) => (
                <option key={`start-${t}`} value={t}>{t}</option>
              ))}
            </select>

            <label>End Time:</label>
            <select
              value={newEvent.end}
              onChange={(e) =>
                setNewEvent({ ...newEvent, end: e.target.value })
              }
              className="time-select"
            >
              <option value="">Select a time</option>
              {times.map((t) => (
                <option key={`end-${t}`} value={t}>{t}</option>
              ))}
            </select>

            <div className="modal-buttons">
              <button 
                className="cancel-btn" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAddModalOpen(false);
                  setNewEvent({
                    eventId: "",
                    title: "",
                    start: "",
                    end: "",
                    color: "#fff4e6"
                  });
                }}
              >
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddEvent();
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}