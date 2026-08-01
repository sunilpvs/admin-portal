
import { useState, useEffect } from "react";

const StateForm = ({ data, add, close, editMode }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  // ==============================
  // Handle Input Change
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ==============================
  // Check if Form is Dirty
  // ==============================
  const isFormDirty = () => {
    // ==============================
    // Create Mode
    // ==============================
    if (!editMode) {
      return (
        formData.state &&
        formData.state.trim() !== ""
      );
    }

    // ==============================
    // Edit Mode
    // ==============================
    return (
      (formData.state || "") !==
      (data.state || "")
    );
  };

  // ==============================
  // Close Form Confirmation
  // ==============================
  const handleClose = () => {
    // Check if form has unsaved changes
    if (isFormDirty()) {
      const confirmClose = window.confirm(
        "You filled some details. If you close now, the entered details will not be saved. Do you want to close?"
      );

      // User clicked Cancel
      if (!confirmClose) {
        return;
      }
    }

    // Close form
    close();
  };

  // ==============================
  // ESC Key Handler
  // ==============================
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscKey
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscKey
      );
    };
  }, [formData, editMode, data]);

  // ==============================
  // Outside Click Handler
  // ==============================
  const handleOutsideClick = (e) => {
    // Only close when clicking
    // the dark background
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // ==============================
  // Submit
  // ==============================
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      state: formData.state,
    };

    // Include ID when editing
    if (formData.id) {
      payload.id = formData.id;
    }

    add(payload);
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      onClick={handleOutsideClick}
      style={{
        position: "fixed",
        top: 0,
        left: "150px",
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 1050,
        overflowY: "auto",
      }}
    >
      <div
        className="modal-dialog modal-lg"
        style={{
          width: "calc(100% - 40px)",
          maxWidth: "800px",
          margin: "150px auto 30px auto",
        }}
      >
        <div
          className="modal-content"
          style={{
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <form onSubmit={handleSubmit}>

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                {editMode
                  ? "Edit State"
                  : "Create State"}
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              />
            </div>

            {/* Body */}
            <div
              className="modal-body"
              style={{
                maxHeight:
                  "calc(100vh - 180px)",
                overflowY: "auto",
                padding: "24px",
              }}
            >
             

              <div className="row">

                {/* State */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={
                      formData.state || ""
                    }
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">

              <button
                type="submit"
                className="btn btn-success"
              >
                Save
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default StateForm;

