import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrips } from "../context/TripContext";
import "../styles/TripList.css";

export default function TripList() {
  const navigate = useNavigate();
  const { getCategorizedTrips, deleteTrip } = useTrips();

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  // Get trips from context
  const { currentTrip, upcomingTrips, pastTrips } = getCategorizedTrips();

  const handleViewTrip = (tripId, readOnly = false) => {
    navigate(`/trip/${tripId}/explore`, { state: { readOnly } });
  };

  const handleViewCurrentTrip = (tripId) => {
    handleViewTrip(tripId, false);
  };

  const handleViewPastOrUpcomingTrip = (tripId) => {
    handleViewTrip(tripId, true);
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
      deleteTrip(tripToDelete.id);
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
                  onClick={() => handleViewCurrentTrip(currentTrip.id)}
                >
                  Plan
                </button>
                {currentTrip.canEdit && (
                  <button 
                    className="btn-trip btn-edit"
                    onClick={() => handleEditTrip(currentTrip.id)}
                  >
                    Edit Trip
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
                    onClick={() => handleViewPastOrUpcomingTrip(trip.id)}
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
                    onClick={() => handleViewPastOrUpcomingTrip(trip.id)}
                  >
                    View
                  </button>
                  <button 
                    className="btn-trip btn-delete"
                    onClick={() => handleDeleteTrip(trip.id)}
                  >
                    Delete Trip
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
        <div className="modal-overlay-triplist" onClick={cancelDelete}>
          <div className="modal-content-triplist" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title-triplist">Delete Trip?</h3>
            <p className="modal-message-triplist">
              Are you sure you want to delete <strong>"{tripToDelete?.name}"</strong>?
            </p>
            <p className="modal-warning-triplist">This action cannot be undone.</p>
            <div className="modal-actions-triplist">
              <button 
                className="modal-btn-triplist modal-btn-cancel-triplist"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className="modal-btn-triplist modal-btn-confirm-triplist"
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