
import { useState, useEffect } from "react";

const LeavePolicyForm = ({
  data,
  add,
  close,
  editMode,
}) => {
  // ==============================
  // Form Data
  // ==============================
  const [formData, setFormData] = useState({
    leave_type: "",
    annual_quota: "",
    year: "",
    carry_forward: "",
    ...(data || {}),
  });

  // ==============================
  // Load Data
  // ==============================
  useEffect(() => {
    setFormData({
      leave_type: data?.leave_type || "",
      annual_quota: data?.annual_quota || "",
      year: data?.year || "",
      carry_forward: data?.carry_forward || "",
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
    // ==============================
    // Add Mode
    // ==============================
    if (!editMode) {
      return (
        (formData.leave_type || "") !== "" ||
        (formData.annual_quota || "") !== "" ||
        (formData.year || "") !== "" ||
        (formData.carry_forward || "") !== ""
      );
    }

    // ==============================
    // Edit Mode
    // ==============================
    return (
      String(formData.leave_type || "") !==
        String(data?.leave_type || "") ||

      String(formData.annual_quota || "") !==
        String(data?.annual_quota || "") ||

      String(formData.year || "") !==
        String(data?.year || "") ||

      String(formData.carry_forward || "") !==
        String(data?.carry_forward || "")
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
    // Close only when clicking
    // outside the actual modal
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
              {editMode ? "Edit Leave Policy" : "Create Leave Policy"}
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

              {/* Leave Type */}
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Leave Type
                </label>

                <select
                  name="leave_type"
                  value={formData.leave_type || ""}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">
                    Select Leave Type
                  </option>

                  <option value="Casual Leave">
                    Casual Leave
                  </option>

                  <option value="Earned Leave">
                    Earned Leave
                  </option>

                  <option value="Sick Leave">
                    Sick Leave
                  </option>

                  <option value="Special Leave">
                    Special Leave
                  </option>
                </select>
              </div>

              {/* Annual Quota */}
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Annual Quota
                </label>

                <input
                  type="number"
                  name="annual_quota"
                  value={formData.annual_quota || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Year */}
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Year
                </label>

                <input
                  type="number"
                  name="year"
                  value={formData.year || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Carry Forward */}
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Carry Forward
                </label>

                <select
                  name="carry_forward"
                  value={formData.carry_forward || ""}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">
                    Select Carry Forward
                  </option>

                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>
                </select>
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

export default LeavePolicyForm;

