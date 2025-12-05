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
  const days = ["Day 1", "Day 2", "Day 3","Day 4"]; // you can expand later
 
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


  // Example events
  const eventsByDay = {
    1: [
      { title: "Museum Visit", start: "8:00 AM", end: "9:00 AM", color: "#f2e8ff" },
      { title: "Restaurant", start: "10:00 AM", end: "12:00 PM", color: "#e8f7ff" },
    ],
    2: [
      { title: "Beach", start: "9:00 AM", end: "11:00 AM", color: "#fff4e6" },
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
         <button className="add-event-button" 
         onClick={() => alert("Add Event Clicked")}>
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
              const height = (duration / 60) * 90;    // match CSS height
              
              return (
                <div 
                  key={index} 
                  className="event-card"
                  role ="button"
                  tabIndex={0}
                  onClick={() => alert(`Clicked on ${event.title}`)}
                  style={{ 
                    backgroundColor: event.color,
                    top: `${top}px`, 
                    height: `${height}px`, 
                  }}
                >

              <h4 className="event-title">{event.title}</h4>
              <p className="event-time">
                {event.start} – {event.end} 
              </p>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}