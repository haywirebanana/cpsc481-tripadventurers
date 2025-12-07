import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import ItineraryEventCard from '../components/ItineraryEventCard';
import { getEventById } from '../components/EventsData.jsx';
import "../styles/itinerary.css";

export default function Itinerary() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in read-only mode
  const isReadOnly = location.state?.readOnly || false;

  // Mock current user - you'd get this from your auth context
  const currentUser = "User1"; // Replace with actual user from context

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
  }

  // Day state
  const [currentDay, setCurrentDay] = useState(1);
  const days = ["Dec 22, 2025", "Dec 23, 2025", "Dec 24, 2025", "Dec 25, 2025", "Dec 26, 2025", "Dec 27, 2025"];
 
  // refs: container + per-day buttons
  const dateScrollRef = useRef(null);
  const dayButtonRefs = useRef([]);
  const prefilledProcessedRef = useRef(false);
  const isUpdatingRef = useRef(false);
  
  // State for modals and selected events
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  
  // form fields
  const [newEvent, setNewEvent] = useState({
    eventId: "",
    title: "",
    start: "",
    end: "",
    description: "",
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
    // Default events with voting
    const defaultEvents = {
      1: [
        { 
          eventId: "tims", 
          start: "8:00 AM", 
          end: "9:00 AM", 
          color: "#f2e8ff",
          votes: { attending: ["User2"], notAttending: [] }
        },
        { 
          eventId: "bubblemania",
          start: "10:00 AM", 
          end: "12:00 PM", 
          color: "#e8f7ff",
          votes: { attending: [], notAttending: [] }
        },
      ],
      2: [
        { 
          eventId: "chinook", 
          start: "9:00 AM", 
          end: "11:00 AM", 
          color: "#fff4e6",
          votes: { attending: ["User1", "User2"], notAttending: ["User3"] }
        },
      ],
    };
    localStorage.setItem('itineraryEvents', JSON.stringify(defaultEvents));
    return defaultEvents;
  });
  
  const events = eventsByDay[currentDay] || [];

  // Save to localStorage whenever eventsByDay changes
  useEffect(() => {
    isUpdatingRef.current = true;
    localStorage.setItem('itineraryEvents', JSON.stringify(eventsByDay));
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 100);
  }, [eventsByDay]);

  // Listen for updates from booking
  useEffect(() => {
    const handleItineraryUpdate = () => {
      // Don't reload if we just updated ourselves
      if (isUpdatingRef.current) return;
      
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
      const { eventId, title, start = "", end = "" } = location.state.prefilledEvent;
      setNewEvent({
        eventId: eventId,
        title: title,
        start: start,
        end: end,
        description: "",
        color: "#fff4e6",
        replacingIndex: location.state?.replacingEvent?.eventIndex
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
  const handleViewAlternatives = (category, originalEvent) => {
    navigate('../explore', { 
      state: { 
        filterCategory: category,
        replacingEvent: {
          start: originalEvent.start,
          end: originalEvent.end,
          day: currentDay,
          eventIndex: selectedEvent
        }
      } 
    });
  };

  // Function to remove event from itinerary
  const handleRemoveEvent = (index) => {
    setEventsByDay(prev => {
      const updated = { ...prev };
      
      // Create a new array without the item at the specified index
      updated[currentDay] = [
        ...prev[currentDay].slice(0, index),
        ...prev[currentDay].slice(index + 1)
      ];
      
      return updated;
    });
    setSelectedEvent(null);
  };

  // Function to handle editing event
  const handleEditEvent = (index, newDescription) => {
    setEventsByDay(prev => {
      const updated = { ...prev };
      updated[currentDay][index] = {
        ...updated[currentDay][index],
        description: newDescription
      };
      return updated;
    });
  };

  // Editable Description Component
  const EditableDescription = ({ description, onSave, readOnly = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState(description);

    const handleSave = () => {
      onSave(editedDescription);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditedDescription(description);
      setIsEditing(false);
    };

    if (isEditing) {
      return (
        <div className="edit-description-container">
          <textarea
            className="modal-textarea-inline"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Add notes or details..."
            rows="3"
            autoFocus
          />
          <div className="edit-buttons">
            <button className="save-edit-btn" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-edit-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="description-display">
        <p className="description-text">
          {description || 'No additional details'}
        </p>
        {!readOnly && (
          <button className="edit-description-btn" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>
    );
  };

  // VOTING FUNCTIONS
  const handleVote = (index, voteType) => {
    setEventsByDay(prev => {
      const updated = { ...prev };
      const event = updated[currentDay][index];
      
      // Initialize votes if not present
      if (!event.votes) {
        event.votes = { attending: [], notAttending: [] };
      }

      // Remove user from both arrays first
      event.votes.attending = event.votes.attending.filter(user => user !== currentUser);
      event.votes.notAttending = event.votes.notAttending.filter(user => user !== currentUser);

      // Add to appropriate array based on vote type
      if (voteType === 'attending') {
        event.votes.attending.push(currentUser);
      } else if (voteType === 'notAttending') {
        event.votes.notAttending.push(currentUser);
      }
      // If voteType is null, user is removing their vote (already removed above)

      return updated;
    });
  };

  // Generate random color for custom events
  const getRandomColor = () => {
    const colors = ['#f2e8ff', '#e8f7ff', '#fff4e6', '#ffe8f0', '#e8fff4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Handle adding custom event
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddEvent = () => {
    if (isAdding) return;
    
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert('Please fill in all fields');
      return;
    }

    if (newEvent.start === "" || newEvent.end === "") {
      alert('Please select start and end times');
      return;
    }

    const startMinutes = timeToMinutes(newEvent.start);
    const endMinutes = timeToMinutes(newEvent.end);
    
    if (endMinutes <= startMinutes) {
      alert('End time must be after start time');
      return;
    }

    // Check for overlapping events ONLY if we're not replacing an existing event
    if (newEvent.replacingIndex === undefined) {
      const existingEvents = eventsByDay[currentDay] || [];
      const hasOverlap = existingEvents.some(event => {
        const existingStart = timeToMinutes(event.start);
        const existingEnd = timeToMinutes(event.end);
        
        // Check if there's any time overlap
        return (startMinutes < existingEnd && endMinutes > existingStart);
      });

      if (hasOverlap) {
        alert('This time slot overlaps with an existing event. Please choose a different time.');
        return;
      }
    }

    setIsAdding(true);

    setEventsByDay(prev => {
      const updated = { ...prev };
      if (!updated[currentDay]) {
        updated[currentDay] = [];
      }
      
      const newEventData = {
        start: newEvent.start,
        end: newEvent.end,
        description: newEvent.description || "",
        color: newEvent.color || getRandomColor(),
        votes: { attending: [], notAttending: [] }
      };

      if (!newEvent.eventId) {
        newEventData.customTitle = newEvent.title;
      } else {
        newEventData.eventId = newEvent.eventId;
      }

      // If we're replacing an event, remove the old one first
      if (newEvent.replacingIndex !== undefined) {
        updated[currentDay] = [
          ...prev[currentDay].slice(0, newEvent.replacingIndex),
          ...prev[currentDay].slice(newEvent.replacingIndex + 1)
        ];
      }

      updated[currentDay].push(newEventData);
      
      return updated;
    });

    setNewEvent({
      eventId: "",
      title: "",
      start: "",
      end: "",
      description: "",
      color: "#fff4e6"
    });
    setAddModalOpen(false);
    
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
      {!isReadOnly && (
        <div className="add-event-button">
          <button
            className="add-event-button"
            onClick={() => setAddModalOpen(true)}
          >
            +
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

            // Get votes
            const votes = itineraryEvent.votes || { attending: [], notAttending: [] };
            const attendingCount = votes.attending.length;
            const notAttendingCount = votes.notAttending.length;
            
            return (
              <div 
                key={index} 
                className={`event-card ${isReadOnly ? 'read-only' : ''}`}
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
                
                {/* Vote indicators on card */}
                {(attendingCount > 0 || notAttendingCount > 0) && (
                  <div className="event-vote-indicators">
                    {attendingCount > 0 && (
                      <span className="vote-indicator attending">
                        ✓ {attendingCount}
                      </span>
                    )}
                    {notAttendingCount > 0 && (
                      <span className="vote-indicator not-attending">
                        ✗ {notAttendingCount}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Card Popup - itinerary version */}
      {selectedEvent !== null && (
        <div className="event-card-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="event-card-container" onClick={(e) => e.stopPropagation()}>
            <div className="event-card-modal">
              {/* Header */}
              <div className="event-card-header">
                <h2 className="event-card-name">
                  {events[selectedEvent].customTitle 
                    ? events[selectedEvent].customTitle
                    : getEventById(events[selectedEvent].eventId)?.name}
                </h2>
                <button className="event-card-close" onClick={() => setSelectedEvent(null)}>×</button>
              </div>

              {/* Time Badge */}
              <div className="event-time-badge">
                <span className="time-badge-text"> {events[selectedEvent].start} – {events[selectedEvent].end}</span>
              </div>

              {/* Voting Section */}
              <div className="voting-section">
                <p className="voting-title">Attending?</p>
                <div className="voting-buttons">
                  <button 
                    className={`vote-btn not-attending ${
                      events[selectedEvent].votes?.notAttending.includes(currentUser) ? 'selected' : ''
                    }`}
                    onClick={() => {
                      const currentVote = events[selectedEvent].votes?.notAttending.includes(currentUser) 
                        ? null 
                        : 'notAttending';
                      handleVote(selectedEvent, currentVote);
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M8 8L24 24M24 8L8 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button 
                    className={`vote-btn attending ${
                      events[selectedEvent].votes?.attending.includes(currentUser) ? 'selected' : ''
                    }`}
                    onClick={() => {
                      const currentVote = events[selectedEvent].votes?.attending.includes(currentUser) 
                        ? null 
                        : 'attending';
                      handleVote(selectedEvent, currentVote);
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M6 16L12 22L26 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Vote Display Boxes */}
              <div className="vote-display-section">
                <div className="vote-display-box not-attending-box">
                  <div className="vote-display-icons">
                    {(events[selectedEvent].votes?.notAttending || []).map((user, idx) => (
                      <div key={idx} className="user-icon not-attending-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8" r="4" fill="#ef4444"/>
                          <path d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20" fill="#ef4444"/>
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="vote-display-box attending-box">
                  <div className="vote-display-icons">
                    {(events[selectedEvent].votes?.attending || []).map((user, idx) => (
                      <div key={idx} className="user-icon attending-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8" r="4" fill="#22c55e"/>
                          <path d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20" fill="#22c55e"/>
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Event Info (for non-custom events) */}
              {!events[selectedEvent].customTitle && getEventById(events[selectedEvent].eventId) && (
                <>
                  {getEventById(events[selectedEvent].eventId).rating > 0 && (
                    <div className="event-card-rating">
                      <span className="rating-stars">★ {getEventById(events[selectedEvent].eventId).rating}</span>
                      <span className="rating-reviews">({getEventById(events[selectedEvent].eventId).reviews} reviews)</span>
                    </div>
                  )}

                  {getEventById(events[selectedEvent].eventId).price && (
                    <div className="event-card-info">
                      <strong>Price:</strong> {getEventById(events[selectedEvent].eventId).price}
                    </div>
                  )}

                  {getEventById(events[selectedEvent].eventId).hours && (
                    <div className="event-card-info">
                      <strong>Hours:</strong> {getEventById(events[selectedEvent].eventId).hours}
                    </div>
                  )}
                </>
              )}

              {/* Notification/Description Section */}
              <div className="event-notification-section">
                <p className="notification-label">Description</p>
                <EditableDescription
                  description={events[selectedEvent].description || ''}
                  onSave={(newDescription) => handleEditEvent(selectedEvent, newDescription)}
                  readOnly={isReadOnly}
                />
              </div>

              {/* Action Buttons */}
              {!isReadOnly && (
                <div className="event-card-actions">
                  {!events[selectedEvent].customTitle && getEventById(events[selectedEvent].eventId) && (
                    <button 
                      className="event-action-btn alternatives-btn"
                      onClick={() => handleViewAlternatives(getEventById(events[selectedEvent].eventId).category, events[selectedEvent])}
                    >
                      View Alternatives
                    </button>
                  )}
                  <button 
                    className="event-action-btn remove-btn"
                    onClick={() => handleRemoveEvent(selectedEvent)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {addModalOpen && (
        <div className="modal-overlay-itinerary-events" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setAddModalOpen(false);
            setNewEvent({
              eventId: "",
              title: "",
              start: "",
              end: "",
              description: "",
              color: "#fff4e6"
            });
          }
        }}>
          <div className="modal-content-itinerary-events" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-itinerary-events">
              <h2 className="modal-title-itinerary-events">Add Event</h2>
              <button className="modal-close-itinerary-events" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setAddModalOpen(false);
                setNewEvent({
                  eventId: "",
                  title: "",
                  start: "",
                  end: "",
                  description: "",
                  color: "#fff4e6"
                });
              }}>×</button>
            </div>
            
            <div className="modal-body-itinerary-events">
              <p className="modal-section-title-itinerary-events">Event Name</p>
              <input
                type="text"
                className="modal-input"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                placeholder="Enter event name"
                disabled={!!newEvent.eventId}
              />

              <p className="modal-section-title-itinerary-events">Start Time</p>
              <select
                value={newEvent.start}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, start: e.target.value })
                }
                className="modal-select"
              >
                <option value="">Select a time</option>
                {times.map((t) => (
                  <option key={`start-${t}`} value={t}>{t}</option>
                ))}
              </select>

              <p className="modal-section-title-itinerary-events">End Time</p>
              <select
                value={newEvent.end}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, end: e.target.value })
                }
                className="modal-select"
              >
                <option value="">Select a time</option>
                {times.map((t) => (
                  <option key={`end-${t}`} value={t}>{t}</option>
                ))}
              </select>

              <p className="modal-section-title-itinerary-events">Description (Optional)</p>
              <textarea
                className="modal-textarea"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                placeholder="Add any additional details..."
                rows="4"
              />
            </div>
            
            <div className="modal-footer-itinerary-events">
              <button 
                className="modal-button-cancel" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAddModalOpen(false);
                  setNewEvent({
                    eventId: "",
                    title: "",
                    start: "",
                    end: "",
                    description: "",
                    color: "#fff4e6"
                  });
                }}
              >
                Cancel
              </button>
              <button
                className="modal-button-itinerary-events"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddEvent();
                }}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}