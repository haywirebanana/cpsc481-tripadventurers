import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TripList.css";

export default function TripList() {
  const navigate = useNavigate();

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  // Sample trip data - in a real app, this would come from an API/state management
  const [currentTrip, setCurrentTrip] = useState({
    id: 1,
    name: "Holidays in YYC!",
    startDate: "Dec. 22, 2025",
    endDate: "Dec. 27, 2025",
    image: '../src/assets/triplist_photos/calgary.jpg',
    canEdit: true
  });

  const [upcomingTrips, setUpcomingTrips] = useState([
    {
      id: 2,
      name: "Raptors in Toronto?",
      startDate: "Jan. 1, 2026",
      endDate: "Jan. 5, 2026",
      image: '../src/assets/triplist_photos/Raptors.jpg',
      canEdit: false
    }
  ]);

  const [pastTrips, setPastTrips] = useState([
    {
      id: 5,
      name: "Summer in Vancouver!",
      startDate: "Aug. 1, 2025",
      endDate: "Aug. 15, 2025",
      image: '../src/assets/triplist_photos/vancouver.jpg',
      canEdit: false
    },
    {
      id: 6,
      name: "Deadmonton... Again?",
      startDate: "July 10, 2025",
      endDate: "July 20, 2025",
      image: '../src/assets/triplist_photos/edmonton.jpg',
      canEdit: true
    }
  ]);

  const handleViewTrip = (tripId) => {
    navigate(`/trip/${tripId}/explore`);
  };

  const handleEditTrip = (tripId) => {
    navigate(`/trip-setup/${tripId}`);
  };

  const handleDeleteTrip = (tripId) => {
    // Show confirmation modal instead of directly deleting
    const trip = pastTrips.find(t => t.id === tripId);
    setTripToDelete(trip);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (tripToDelete) {
      setPastTrips(pastTrips.filter(trip => trip.id !== tripToDelete.id));
      setShowDeleteModal(false);
      setTripToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTripToDelete(null);
  };

  const handleAddTrip = () => {
    navigate("/trip-setup");
  };

  return (
    <div className="trip-list-container">
      <div className="trip-list-content">
        {/* Current Trip Section */}
        {currentTrip && (
          <section className="trip-section">
            <h2 className="section-title">Current Trip</h2>
            
            <div className="trip-card trip-card-large current-trip">
              <div className="card-content">
                <div className="trip-image-placeholder">
                  {currentTrip.image ? (
                    <img src={currentTrip.image} alt={currentTrip.name} />
                  ) : (
                    <div className="image-placeholder-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#96A78D" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="trip-info">
                  <h3 className="trip-name">{currentTrip.name}</h3>
                  <p className="trip-dates">{currentTrip.startDate} - {currentTrip.endDate}</p>
                </div>
              </div>
              
              <div className="trip-actions">
                <button 
                  className="btn-trip btn-view"
                  onClick={() => handleViewTrip(currentTrip.id)}
                >
                  View
                </button>
                {currentTrip.canEdit && (
                  <button 
                    className="btn-trip btn-edit"
                    onClick={() => handleEditTrip(currentTrip.id)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Upcoming Trips Section */}
        {upcomingTrips.length > 0 && (
          <section className="trip-section">
            <h2 className="section-title">Upcoming Trips</h2>
            
            {upcomingTrips.map((trip) => (
              <div key={trip.id} className="trip-card trip-card-small">
                <div className="card-content">
                  <div className="trip-image-placeholder">
                    {trip.image ? (
                      <img src={trip.image} alt={trip.name} />
                    ) : (
                      <div className="image-placeholder-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#96A78D" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="trip-info">
                    <h3 className="trip-name">{trip.name}</h3>
                    <p className="trip-dates">{trip.startDate} - {trip.endDate}</p>
                  </div>
                </div>
                
                <div className="trip-actions">
                  <button 
                    className="btn-trip btn-view"
                    onClick={() => handleViewTrip(trip.id)}
                  >
                    View
                  </button>
                  {trip.canEdit && (
                    <button 
                      className="btn-trip btn-edit"
                      onClick={() => handleEditTrip(trip.id)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Past Trips Section */}
        {pastTrips.length > 0 && (
          <section className="trip-section">
            <h2 className="section-title">Past Trips</h2>
            
            {pastTrips.map((trip) => (
              <div key={trip.id} className="trip-card trip-card-small past-trip">
                <div className="card-content">
                  <div className="trip-image-placeholder">
                    {trip.image ? (
                      <img src={trip.image} alt={trip.name} />
                    ) : (
                      <div className="image-placeholder-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#96A78D" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="trip-info">
                    <h3 className="trip-name">{trip.name}</h3>
                    <p className="trip-dates">{trip.startDate} - {trip.endDate}</p>
                  </div>
                </div>
                
                <div className="trip-actions">
                  <button 
                    className="btn-trip btn-view"
                    onClick={() => handleViewTrip(trip.id)}
                  >
                    View
                  </button>
                  <button 
                    className="btn-trip btn-delete"
                    onClick={() => handleDeleteTrip(trip.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Add Trip Button - Fixed to bottom */}
      <button 
        className="btn-add-trip"
        onClick={handleAddTrip}
      >
        ADD TRIP
      </button>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Delete Trip?</h3>
            <p className="modal-message">
              Are you sure you want to delete <strong>"{tripToDelete?.name}"</strong>?
            </p>
            <p className="modal-warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="modal-btn modal-btn-cancel"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className="modal-btn modal-btn-confirm"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}