import React, { useState } from "react";
import "./weather.css";
import sunny from "../../assets/sunny.svg";
import accident from "../../assets/accidentt.jpg";
import attention from "../../assets/attention.svg";
import cloud from "../../assets/cloud.svg";
import hailstorm from "../../assets/hailstorm.svg";
import plane from "../../assets/plane.svg";
import protest from "../../assets/protest.svg";
import raining from "../../assets/raining.svg";
import closed from "../../assets/closedd.jpeg";
import thunder from "../../assets/thunder.svg";
import suncloud from "../../assets/weather.svg";


const FORECAST = [
  { id: 1, day: "Day 1", temp: "39 °C", icon: suncloud, prep: "5%", humidity: "30%", wind: "8km/h" },
  { id: 2, day: "Day 2", temp: "18 °C", icon: cloud, prep: "5%", humidity: "43%", wind: "20km/h" },
  { id: 3, day: "Day 3", temp: "11 °C", icon: raining, prep: "90%", humidity: "58%", wind: "11km/h" },
  { id: 4, day: "Day 4", temp: "42 °C", icon: sunny, prep: "19%", humidity: "58%", wind: "3km/h" },
  { id: 5, day: "Day 5", temp: "21 °C", icon: thunder, prep: "86%", humidity: "61%", wind: "18km/h" },
  { id: 6, day: "Day 6", temp: "24 °C", icon: cloud, prep: "25%", humidity: "28%", wind: "24km/h" },
];

const NEWS = [
  {
    id: "n1",
    title: "Accident on Macleod Trail",
    thumbnail: accident,
    excerpt:
      "Accident reported on Macleod Trail. Emergency services responding. Road closures expected.",
    full:
      "October 23, 2025 - A collision occurred on Macleod Trail. Emergency crews are on scene. Expect delays.",
  },
  {
    id: "n2",
    title: "Heritage Museum Closed",
    thumbnail: closed,
    excerpt:
      " Heriage Museum temporarily closed its doors after water damage was discovered.",
    full:
      "October 23, 2025 - Calgary - The Heritage museum temporarily closed its doors after a water pipe leakage caused damage to parts of the building. Restoration is underway; the museum is expected to reopen next week.",
  },
  {
    id: "n3",
    title: "Hailstorm Emergency",
    thumbnail: hailstorm,
    excerpt:
      "Severe hailstorm causing damage in several neighbourhoods. Stay indoors and avoid travel if possible.",
    full:
      "A strong hailstorm passed through the city causing damage. Report any hazards to emergency services.",
  },
    {
    id: "n4",
    title: "Protest Near City Hall",
    thumbnail: protest,
    excerpt:
      "Protest near city hall",
    full:
      "....",
  },
      {
    id: "n5",
    title: "Flights Delayed",
    thumbnail: plane,
    excerpt:
      "Flights delated due to ...",
    full:
      "....",
  },
];

export default function Weather() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeNews, setActiveNews] = useState(null);

  function openNews(news) {
    setActiveNews(news);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setActiveNews(null);
  }

  return (
    <div className="weather-page">
      <section className="forecast-section">
        <div className="forecast-scroll" role="list">
          {FORECAST.map((f) => (
            <article key={f.id} className="forecast-card" role="listitem">
              <div className="forecast-day">{f.day}</div>

              <div className="forecast-icon">
                <img src={f.icon} alt="" />
              </div>

              <div className="forecast-temp">{f.temp}</div>

              <div className="forecast-meta">
                <div>Prep: {f.prep}</div>
                <div>Humidity: {f.humidity}</div>
                <div>Wind: {f.wind}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section className="warning-bar">
        <div className="warning-left">
          <img src={attention} className="warning-icon" alt="Warning" />
        </div>
        <div className="warning-text">
          <div className="warning-title">Weather Warning</div>
          <div className="warning-sub">Extreme Heat: Dangerous temperatures expected to persist throughout the day until 7 PM; residents are urged to stay indoors, avoid outdoor activity, and remain hydrated</div>
        </div>
      </section>

      <hr className="divider" />


      <section className="news-list">
        {NEWS.map((n) => (
          <article className="news-card" key={n.id}>
            <div className="news-thumb">
              <img src={n.thumbnail} alt={n.title} />
            </div>

            <div className="news-body">
              <h3 className="news-title">{n.title}</h3>
              <p className="news-excerpt">{n.excerpt}</p>

              <div className="news-actions">
                <button
                  className="view-btn"
                  onClick={() => openNews(n)}
                  aria-label={`View ${n.title}`}
                >
                  View
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <div style={{ height: 60 }} />

      {modalOpen && activeNews && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeModal}>
              ✖
            </button>

            <div className="modal-thumb">
              <img src={activeNews.thumbnail} alt={activeNews.title} />
            </div>

            <div className="modal-text">
              <h3>{activeNews.title}</h3>
              <p>{activeNews.full}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
