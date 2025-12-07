import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrips } from "../context/TripContext";
import "../styles/TripSetup.css";
import "../styles/ManageMembers.css";

export default function TripSetup() {
  const navigate = useNavigate();
  const { tripId } = useParams(); // For edit mode
  const { addTrip, updateTrip, getTripById, deleteTrip } = useTrips();
  
  const isEditMode = !!tripId;

  // State for trip title and image
  const [tripTitle, setTripTitle] = useState("");
  const [tripImage, setTripImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // State for destinations
  const [destinations, setDestinations] = useState([
    {
      id: 1,
      location: "",
      arrivalDate: "",
      departureDate: ""
    }
  ]);

  // State for members
  const [planners, setPlanners] = useState(["Person 1", "Person 2", "Person 3"]);
  const [viewers, setViewers] = useState(["Person 4", "Person 5"]);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberModalType, setMemberModalType] = useState(null); // 'add' or 'edit'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});

  // Add-member form fields
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("planner");

  
  // Confirmation modal states
  const [showDeleteMemberModal, setShowDeleteMemberModal] = useState(false);
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [memberToChangeRole, setMemberToChangeRole] = useState(null);


  // Load existing trip data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const trip = getTripById(tripId);
      if (trip) {
        setTripTitle(trip.name || "");
        setDestinations(trip.destinations);
        setPlanners(trip.planners);
        setViewers(trip.viewers);
        if (trip.image) {
          setImagePreview(trip.image);
        }
      }
    }
  }, [isEditMode, tripId, getTripById]);

  // Add a new destination
  const handleAddDestination = () => {
    const newDestination = {
      id: Date.now(),
      location: "",
      arrivalDate: "",
      departureDate: ""
    };
    setDestinations([...destinations, newDestination]);
  };

  // Remove a destination
  const handleRemoveDestination = (id) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter(dest => dest.id !== id));
    }
  };

  // Update destination field
  const handleDestinationChange = (id, field, value) => {
    setDestinations(destinations.map(dest => 
      dest.id === id ? { ...dest, [field]: value } : dest
    ));
    
    // Clear errors for this field when user starts typing/changing
    if (errors[`dest-${id}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`dest-${id}-${field}`];
      setErrors(newErrors);
    }
  };

  // Validate dates
  const validateDates = () => {
    const newErrors = {};
    
    // Sort destinations by their position in the array
    const sortedDestinations = [...destinations];
    
    sortedDestinations.forEach((dest, index) => {
      // Check if destination has dates
      if (!dest.arrivalDate && !dest.departureDate) {
        return; // Skip validation if no dates are set
      }
      
      // Validate: arrival date must be before or equal to departure date
      if (dest.arrivalDate && dest.departureDate) {
        const arrival = new Date(dest.arrivalDate);
        const departure = new Date(dest.departureDate);
        
        if (arrival > departure) {
          newErrors[`dest-${dest.id}-dates`] = "Arrival date must be before or on the same day as departure date";
        }
      }
      
      // Validate: next destination's arrival should be on or after current destination's departure
      if (index < sortedDestinations.length - 1) {
        const nextDest = sortedDestinations[index + 1];
        
        if (dest.departureDate && nextDest.arrivalDate) {
          const currentDeparture = new Date(dest.departureDate);
          const nextArrival = new Date(nextDest.arrivalDate);
          
          if (nextArrival < currentDeparture) {
            newErrors[`dest-${nextDest.id}-chronology`] = `This arrival date (${nextDest.arrivalDate}) is before the previous destination's departure (${dest.departureDate})`;
          }
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTripImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setTripImage(null);
    setImagePreview(null);
  };

 // Handle member management
  const handleAddMembers = () => {
    setMemberModalType('add');
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberRole("planner");
    setShowMemberModal(true);
  };

  const handleEditMembers = () => {
    setMemberModalType('edit');
    setShowMemberModal(true);
  };

  const closeMemberModal = () => {
    setShowMemberModal(false);
    setMemberModalType(null);
    setEditingMember(null);
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberRole("planner");
  };

  // DELETE MEMBER HANDLERS
  const handleRemoveMember = (member, role) => {
    setMemberToDelete({ member, role });
    setShowDeleteMemberModal(true);
  };

  const confirmRemoveMember = () => {
    if (memberToDelete) {
      const { member, role } = memberToDelete;
      if (role === 'planner') {
        setPlanners(planners.filter(p => p !== member));
      } else {
        setViewers(viewers.filter(v => v !== member));
      }
    }
    setShowDeleteMemberModal(false);
    setMemberToDelete(null);
  };

  const cancelRemoveMember = () => {
    setShowDeleteMemberModal(false);
    setMemberToDelete(null);
  };
 // CHANGE ROLE HANDLERS
  const handleChangeRole = (member, currentRole) => {
    setMemberToChangeRole({ member, currentRole });
    setShowChangeRoleModal(true);
  };

  const confirmChangeRole = () => {
    if (memberToChangeRole) {
      const { member, currentRole } = memberToChangeRole;
      if (currentRole === 'planner') {
        setPlanners(planners.filter(p => p !== member));
        setViewers([...viewers, member]);
      } else {
        setViewers(viewers.filter(v => v !== member));
        setPlanners([...planners, member]);
      }
    }
    setShowChangeRoleModal(false);
    setMemberToChangeRole(null);
  };

  const cancelChangeRole = () => {
    setShowChangeRoleModal(false);
    setMemberToChangeRole(null);
  };

  // Handle delete trip
  const handleDeleteTrip = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteTrip = () => {
    deleteTrip(parseInt(tripId));
    setShowDeleteModal(false);
    navigate("/trip-list");
  };

  const cancelDeleteTrip = () => {
    setShowDeleteModal(false);
  };

  // Handle form submission
  const handleNext = () => {
    // Validate that at least one destination has location
    const hasValidDestination = destinations.some(dest => dest.location.trim() !== "");
    
    if (!hasValidDestination) {
      // alert("Please add at least one destination");
      return;
    }

    // Validate dates
    if (!validateDates()) {
      // alert("Please fix the date errors before continuing");
      return;
    }

    // Prepare trip data
    const tripData = {
      name: tripTitle.trim() || undefined, // Only include if provided
      image: imagePreview || undefined, // Include image if uploaded
      destinations,
      planners,
      viewers
    };

    // Save trip data
    if (isEditMode) {
      updateTrip(parseInt(tripId), tripData);
    } else {
      addTrip(tripData);
    }
    
    // Navigate to trip list
    navigate("/trip-list");
  };

  return (
    <div className="trip-setup-container">

      <div className="trip-setup-content">
        {/* Trip Title Section */}
        <section className="setup-section">
          <h2 className="setup-section-title">Trip Title</h2>
          <input
            type="text"
            className="input-trip-title"
            placeholder="Give your trip a name (optional)"
            value={tripTitle}
            onChange={(e) => setTripTitle(e.target.value)}
          />
        </section>

        {/* Trip Image Section */}
        <section className="setup-section">
          <h2 className="setup-section-title">Trip Image</h2>
          
          {imagePreview ? (
            <div className="image-upload-preview">
              <img src={imagePreview} alt="Trip preview" className="preview-image" />
              <button 
                className="btn-remove-image"
                onClick={handleRemoveImage}
                type="button"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <div className="image-upload-container">
              <label htmlFor="trip-image-upload" className="image-upload-label">
                <div className="image-upload-icon">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#96A78D" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <span className="image-upload-text">Click to upload image</span>
                <span className="image-upload-subtext">(Optional)</span>
              </label>
              <input
                id="trip-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="image-upload-input"
              />
            </div>
          )}
        </section>

        {/* Destinations Section */}
        <section className="setup-section">
          <h2 className="setup-section-title">Destinations</h2>
          
          <div className="destinations-list">
            {destinations.map((destination) => (
              <div key={destination.id} className={`destination-card ${
                errors[`dest-${destination.id}-dates`] || errors[`dest-${destination.id}-chronology`] 
                  ? 'destination-card-error' 
                  : ''
              }`}>
                <button 
                  className="btn-remove-destination"
                  onClick={() => handleRemoveDestination(destination.id)}
                  disabled={destinations.length === 1}
                  aria-label="Remove destination"
                >
                  ×
                </button>
                
                <input
                  type="text"
                  className="input-location"
                  placeholder="City, Province/State, Country"
                  value={destination.location}
                  onChange={(e) => handleDestinationChange(destination.id, 'location', e.target.value)}
                />
                
                <div className="destination-dates">
                  <div className="date-field">
                    <label className="date-label">Arrival:</label>
                    <input
                      type="date"
                      className={`input-date ${
                        errors[`dest-${destination.id}-dates`] || errors[`dest-${destination.id}-chronology`]
                          ? 'input-date-error'
                          : ''
                      }`}
                      value={destination.arrivalDate}
                      onChange={(e) => handleDestinationChange(destination.id, 'arrivalDate', e.target.value)}
                    />
                  </div>
                  
                  <div className="date-field">
                    <label className="date-label">Departure:</label>
                    <input
                      type="date"
                      className={`input-date ${
                        errors[`dest-${destination.id}-dates`]
                          ? 'input-date-error'
                          : ''
                      }`}
                      value={destination.departureDate}
                      onChange={(e) => handleDestinationChange(destination.id, 'departureDate', e.target.value)}
                    />
                  </div>
                </div>

                {/* Error Messages */}
                {errors[`dest-${destination.id}-dates`] && (
                  <div className="error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c97676" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {errors[`dest-${destination.id}-dates`]}
                  </div>
                )}
                {errors[`dest-${destination.id}-chronology`] && (
                  <div className="error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c97676" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {errors[`dest-${destination.id}-chronology`]}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button 
            className="btn-add-destination"
            onClick={handleAddDestination}
          >
            Add Destination
          </button>
        </section>

        {/* Members Section */}
        <section className="setup-section">
          <h2 className="setup-section-title">Members</h2>
          
          <div className="members-container">
            <div className="members-column">
              <h3 className="members-column-title">Planners</h3>
              <div className="members-list">
                {planners.map((planner, index) => (
                  <div key={index} className="member-item">
                    {planner}
                  </div>
                ))}
              </div>
            </div>

            <div className="members-column">
              <h3 className="members-column-title">Viewers</h3>
              <div className="members-list">
                {viewers.map((viewer, index) => (
                  <div key={index} className="member-item">
                    {viewer}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="members-actions">
            <button 
              className="btn-members"
              onClick={handleAddMembers}
            >
              Add Members
            </button>
            <button 
              className="btn-members"
              onClick={handleEditMembers}
            >
              Edit
            </button>
          </div>
        </section>

        {/* Next Button */}
        <button 
          className="btn-next"
          onClick={handleNext}
        >
          DONE
        </button>

        {/* Delete Button - Only in Edit Mode */}
        {isEditMode && (
          <button 
            className="btn-delete-trip"
            onClick={handleDeleteTrip}
          >
            Delete Trip
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay-setup" onClick={cancelDeleteTrip}>
          <div className="modal-content-setup" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title-setup">Delete Trip?</h3>
            <p className="modal-message-setup">
              Are you sure you want to delete <strong>"{tripTitle || 'this trip'}"</strong>?
            </p>
            <p className="modal-warning-setup">This action cannot be undone.</p>
            <div className="modal-actions-setup">
              <button 
                className="modal-btn-setup modal-btn-cancel-setup"
                onClick={cancelDeleteTrip}
              >
                Cancel
              </button>
              <button 
                className="modal-btn-setup modal-btn-confirm-setup"
                onClick={confirmDeleteTrip}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Management Modal - Placeholder */}
      {showMemberModal && memberModalType === "add" && (
        <div className="add-members-overlay" onClick={closeMemberModal}>
          <div
            className="add-members-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="add-members-title">Add a Member</h3>

            <label className="add-members-label">Name</label>
            <input
              className="add-members-input"
              type="text"
              placeholder="Enter name"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
            />

            <label className="add-members-label">Email</label>
            <input
              className="add-members-input"
              type="email"
              placeholder="Enter email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
            />

            <label className="add-members-label">Role</label>
            <select
              className="add-members-input"
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value)}
            >
              <option value="planner">Planner</option>
              <option value="viewer">Viewer</option>
            </select>

            <div className="add-members-buttons">
              <button 
                className="add-members-cancel"
                onClick={closeMemberModal}
              >
                Cancel
              </button>

              <button
                className="add-members-save"
                onClick={() => {
                  if (!newMemberName || !newMemberEmail) return;

                  if (newMemberRole === "planner") {
                    setPlanners([...planners, `${newMemberName} (${newMemberEmail})`]);
                  } else {
                    setViewers([...viewers, `${newMemberName} (${newMemberEmail})`]);
                  }

                  closeMemberModal();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
           {/* Edit Members Modal */}
      {showMemberModal && memberModalType === "edit" && (
        <div className="add-members-overlay" onClick={closeMemberModal}>
          <div
            className="add-members-modal edit-members-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="add-members-title">Manage Members</h3>

            <div className="edit-members-section">
              <h4 className="edit-members-section-title">Planners</h4>
              <div className="edit-members-list">
                {planners.map((planner, index) => (
                  <div key={index} className="edit-member-item">
                    <span className="edit-member-name">{planner}</span>
                    <div className="edit-member-actions">
                      <button
                        className="edit-member-btn"
                        onClick={() => handleChangeRole(planner, 'planner')}
                        title="Change to viewer"
                      >
                        ⇅
                      </button>
                      <button
                        className="edit-member-btn delete-btn"
                        onClick={() => handleRemoveMember(planner, 'planner')}
                        title="Remove member"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="edit-members-section">
              <h4 className="edit-members-section-title">Viewers</h4>
              <div className="edit-members-list">
                {viewers.map((viewer, index) => (
                  <div key={index} className="edit-member-item">
                    <span className="edit-member-name">{viewer}</span>
                    <div className="edit-member-actions">
                      <button
                        className="edit-member-btn"
                        onClick={() => handleChangeRole(viewer, 'viewer')}
                        title="Change to planner"
                      >
                        ⇅
                      </button>
                      <button
                        className="edit-member-btn delete-btn"
                        onClick={() => handleRemoveMember(viewer, 'viewer')}
                        title="Remove member"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="add-members-buttons">
              <button 
                className="add-members-save full-width"
                onClick={closeMemberModal}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Member Confirmation Modal */}
      {showDeleteMemberModal && (
        <div className="modal-overlay-setup" onClick={cancelRemoveMember}>
          <div className="modal-content-setup" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title-setup">Remove Member?</h3>
            <p className="modal-message-setup">
              Are you sure you want to remove <strong>"{memberToDelete?.member}"</strong> from this trip?
            </p>
            <p className="modal-warning-setup">They will no longer have access to this trip.</p>
            <div className="modal-actions-setup">
              <button 
                className="modal-btn-setup modal-btn-cancel-setup"
                onClick={cancelRemoveMember}
              >
                Cancel
              </button>
              <button 
                className="modal-btn-setup modal-btn-remove-setup"
                onClick={confirmRemoveMember}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Role Confirmation Modal */}
      {showChangeRoleModal && (
        <div className="modal-overlay-setup" onClick={cancelChangeRole}>
          <div className="modal-content-setup" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title-setup">Change Member Role?</h3>
            <p className="modal-message-setup">
              Change <strong>"{memberToChangeRole?.member}"</strong> from{' '}
              <strong>{memberToChangeRole?.currentRole === 'planner' ? 'Planner' : 'Viewer'}</strong> to{' '}
              <strong>{memberToChangeRole?.currentRole === 'planner' ? 'Viewer' : 'Planner'}</strong>?
            </p>
            <p className="modal-warning-setup">
              {memberToChangeRole?.currentRole === 'planner' 
                ? 'They will no longer be able to edit trip details.' 
                : 'They will be able to edit trip details.'}
            </p>
            <div className="modal-actions-setup">
              <button 
                className="modal-btn-setup modal-btn-cancel-setup"
                onClick={cancelChangeRole}
              >
                Cancel
              </button>
              <button 
                className="modal-btn-setup modal-btn-confirm-setup"
                onClick={confirmChangeRole}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}