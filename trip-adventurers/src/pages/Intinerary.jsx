import React, { useEffect, useRef, useState } from "react";
import "../components/itinerary.css";

export default function Itinerary() {

  // Generate hour slots
  const times = Array.from({ length: 25 }, (_, hour) => {
    const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? "AM" : "PM";
    return `${h}:00 ${period}`;
  });

  function timeToMinutes(t) {
  const [time, period] = t.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
  }

  // Day state
  const [currentDay, setCurrentDay] = useState(1);
  const days = ["Dec, 22, 2025", "Dec 23, 2025", "Dec 24, 2025","Dec 25, 2025", "Dec 26, 2025", "Dec 27, 2025"]; // you can expand later
 
  // refs: container + per-day buttons
  const dateScrollRef = useRef(null);
  const dayButtonRefs = useRef([]); // will hold refs for each button
  // helper that centers a button at index (0-based)
  const centerDay = (index) => {
    const container = dateScrollRef.current;
    const btn = dayButtonRefs.current[index];
    if (!container || !btn) return;

    // button's left relative to the scroll container (not page)
    const btnLeft = btn.offsetLeft;
    const btnWidth = btn.offsetWidth;
    const containerWidth = container.clientWidth;

    // compute target scrollLeft so that button center matches container center
    const targetScrollLeft = btnLeft + btnWidth / 2 - containerWidth / 2;

    // clamp within scroll bounds
    const maxScroll = container.scrollWidth - containerWidth;
    const finalScroll = Math.max(0, Math.min(maxScroll, targetScrollLeft));

    container.scrollTo({ left: finalScroll, behavior: "smooth" });
  };

  // when clicking a day: set current day and center it
  const handleDayClick = (index) => {
    setCurrentDay(index + 1);
    // delay slightly (0ms suffices) so DOM updates if necessary
    window.requestAnimationFrame(() => centerDay(index));
  };

    // center initial current day on mount
  useEffect(() => {
    // small timeout lets layout settle on some devices
    const i = currentDay - 1;
    setTimeout(() => centerDay(i), 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    function openEventDetails(eventIndex) {
    setActiveEvent(events[eventIndex]);
    setModalOpen(true);

    function closeModal() {
    setModalOpen(false);
    setActiveEvent(null);
  }
  }
const [addModalOpen, setAddModalOpen] = useState(false);

// form fields
const [newEvent, setNewEvent] = useState({
  title: "",
  start: "",
  end: "",
  description: "",
  color: "#fff4e6"
});

  // Example events
  const eventsByDay = {
    1: [
      { title: "Breakfast at Cafe", 
        start: "8:00 AM", 
        end: "9:00 AM", 
        color: "#f2e8ff", 
        description: "Visiting the local history museum."},

      { title: "Restaurant", 
        start: "10:00 AM", 
        end: "12:00 PM", 
        color: "#e8f7ff", 
        description: "Lunch at a local restaurant."
      },
    ],
    2: [
      { title: "Telus Spark Centre", 
        start: "9:00 AM", 
        end: "11:00 AM", 
        color: "#fff4e6",
        description: "Relaxing at the beach."},
    ],
  };
  const events = eventsByDay[currentDay] || [];
  
  return (
    <div className="itinerary-container">
      {/* Date Bar */}
      <div className="date-bar">
        <div 
          className="date-scroll" 
          role ="list" 
          ref={dateScrollRef}
          aria-label="Days"
          >
          {days.map((day, index) => (
            <button
              key={index}
              ref={(el) => (dayButtonRefs.current[index] = el)} // store ref
              className={`day-tab ${currentDay === index + 1 ? "active" : ""}`}
              onClick={() => handleDayClick(index)}
              >
              {day}
            </button>
          ))}
        </div>
      </div>  

      {/* Add Event Button */}
      <div className = "add-event-button">
        <button
          className="add-event-button"
          onClick={() => setAddModalOpen(true)}
          >
          +
        </button>

      </div>

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
          {events.map((event, index) => {
              const startMinutes = timeToMinutes(event.start);
              const endMinutes = timeToMinutes(event.end);
              const duration = endMinutes - startMinutes;
              const top = (startMinutes / 60) * 100;   // 100px per hour
              const height = (duration / 60) * 98;    // match CSS height
              
              return (
                
                <div 
                  key={index} 
                  className="event-card"
                  role ="button"
                  tabIndex={0}
                  onClick={() => opnModal(event)}
                  style={{ 
                    backgroundColor: event.color,
                    top: `${top}px`, 
                    height: `${height}px`, 
                  }}
                >
                  <h4 className="event-title">{event.title}</h4>
                  <p className="event-time">{event.start} – {event.end} </p>
            </div>
          )})}
        </div>
      </div>
        {addModalOpen && (
          <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
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
                />

                <label>Start Time:</label>
                <select
                  value={newEvent.start}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, start: e.target.value })
                  }
                  className="time-select"
                >
                  <option value="Select a time">Select a time</option>
                  {times.map((t) => (
                    <option key={t} value={t}>{t}</option>
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
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>


                <label>Description:</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                />

                <div className="modal-buttons">
                  <button className="cancel-btn" onClick={() => setAddModalOpen(false)}>
                    Cancel
                  </button>

                <button
                  className="save-btn"
                  onClick={() => {
                    // TODO: Save into eventsByDay later
                    console.log("New event:", newEvent);
                    setAddModalOpen(false);
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