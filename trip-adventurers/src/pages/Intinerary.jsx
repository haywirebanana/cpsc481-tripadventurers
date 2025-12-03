import "../components/itinerary.css";

export default function Itinerary() {
  // Generate hour slots
  const times = Array.from({ length: 24 }, (_, hour) => {
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

  // Example events
  const events = [
    {
      title: "Meuseum Visit",
      start: "8:00 AM",
      end: "9:00 AM",
      color: "#f2e8ff",
    },
    {
      title: "Restaurant",
      start: "10:00 AM",
      end: "11:00 AM",
      color: "#e8f7ff",
    },
    {
      title: "Beach Visit",
      start: "12:00 PM",
      end: "1:00 PM",
      color: "#fff4e6",
    },
  ];

  return (
    <div className="itinerary-container">
      {/* Date Bar */}
      <div className="date-bar" id="date-bar">
        <h2>Day 1</h2>
        </div>
        
      {/* Add Event Button */}
      <div className = "add-event-button">
         <button className="add-event-button" 
         onClick={() => alert("Add Event Clicked")}>+</button>
      </div>
 

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

              const top = (startMinutes / 60) * 90;   // 80px per hour
              const height = (duration / 60) * 80;    // match CSS height
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