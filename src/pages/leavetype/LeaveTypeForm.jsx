
import { useState, useEffect } from "react";

const LeaveTypeForm = ({
  data,
  add,
  close,
  editMode,
}) => {
  // ==============================
  // Form Data
  // ==============================
  const [formData, setFormData] = useState({
    leave_type_name: "",
    description: "",
    ...(data || {}),
  });

  // ==============================
  // Load Data
  // ==============================
  useEffect(() => {
    setFormData({
      leave_type_name: data?.leave_type_name || "",
      description: data?.description || "",
      id: data?.id || undefined,
    });
  }, [data]);

  // ==============================
  // Handle Change
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // Check Form Dirty
  // ==============================
  const isFormDirty = () => {
    // Add Mode
    if (!editMode) {
      return (
        (formData.leave_type_name || "").trim() !== "" ||
        (formData.description || "").trim() !== ""
      );
    }

    // Edit Mode
    return (
      (formData.leave_type_name || "") !==
        (data?.leave_type_name || "") ||
      (formData.description || "") !==
        (data?.description || "")
    );
  };

  // ==============================
  // Close Confirmation
  // ==============================
  const handleClose = () => {
    if (isFormDirty()) {
      const confirmClose = window.confirm(
        "You filled some details. If you close now, the entered details will not be saved. Do you want to close?"
      );

      if (!confirmClose) {
        return;
      }
    }

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

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [formData, editMode, data]);

  // ==============================
  // Outside Click Handler
  // ==============================
  const handleOutsideClick = (e) => {
    // Close only when clicking modal background
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // ==============================
  // Submit
  // ==============================
  const handleSubmit = (e) => {
    e.preventDefault();

    add(formData);
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
        background:
          "rgba(0,0,0,0.5)",
        zIndex: 1050,
        overflowY: "auto",
      }}
    >
   <div
        className="modal-dialog modal-xl"
        style={{
          width:
            "calc(100% - 40px)",
         width:"600px",
          margin:
            "150px auto 30px auto",
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
              {editMode ? "Edit Leave Type" : "Create Leave Type"}
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
              maxHeight: "calc(100vh - 180px)",
              overflowY: "auto",
              padding: "24px",
            }}
          >
            
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Leave Type Name
                </label>

                <input
                  type="text"
                  name="leave_type_name"
                  value={formData.leave_type_name || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              </div>
<div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Description
                </label>

                <textarea
                  name="description"
                  rows="5"
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="form-control"
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

export default LeaveTypeForm;

