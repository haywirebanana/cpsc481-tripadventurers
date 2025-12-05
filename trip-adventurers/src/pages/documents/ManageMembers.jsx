import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrips } from "../../context/TripContext";
import "../../styles/TripSetup.css";
import "../../styles/ManageMembers.css";

export default function TripSetup() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  
  const isEditMode = !!tripId;

  // State for members
  const [planners, setPlanners] = useState(["Person 1", "Person 2", "Person 3"]);
  const [viewers, setViewers] = useState(["Person 4", "Person 5"]);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberModalType, setMemberModalType] = useState(null);

  // Add-member form fields
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("planner");

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

  const handleRemoveMember = (member, role) => {
    if (role === 'planner') {
      setPlanners(planners.filter(p => p !== member));
    } else {
      setViewers(viewers.filter(v => v !== member));
    }
  };

  const handleChangeRole = (member, currentRole) => {
    if (currentRole === 'planner') {
      setPlanners(planners.filter(p => p !== member));
      setViewers([...viewers, member]);
    } else {
      setViewers(viewers.filter(v => v !== member));
      setPlanners([...planners, member]);
    }
  };

  const handleNext = () => {
    navigate("../../documents");
  };

  return (
    <div className="trip-setup-container">
      <div className="trip-setup-content">
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
          Return
        </button>
      </div>

      {/* Add Member Modal */}
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
                        🗑
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
                        🗑
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
    </div>
  );
}