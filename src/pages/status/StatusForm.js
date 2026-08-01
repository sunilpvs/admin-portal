
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const StatusForm = ({
  data,
  add,
  close,
  editMode,
}) => {
  const [formData, setFormData] = useState({
    code: "",
    status: "",
    module: "",
    id: "",
  });

  // ==============================
  // Load Form Data
  // ==============================
  useEffect(() => {
    if (data) {
      setFormData({
        code: data.code || "",
        status: data.status || "",
        module: data.module || "",
        id: data.id || "",
      });
    } else {
      // Reset form for Add Mode
      setFormData({
        code: "",
        status: "",
        module: "",
        id: "",
      });
    }
  }, [data]);

  // ==============================
  // Handle Input Change
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // Check if Form is Dirty
  // ==============================
  const isFormDirty = () => {
    // ==============================
    // Add Mode
    // ==============================
    if (!editMode) {
      return (
        (formData.code &&
          formData.code.trim() !== "") ||
        (formData.status &&
          formData.status.trim() !== "") ||
        (formData.module &&
          formData.module.trim() !== "")
      );
    }

    // ==============================
    // Edit Mode
    // ==============================
    return (
      (formData.code || "") !==
        (data?.code || "") ||
      (formData.status || "") !==
        (data?.status || "") ||
      (formData.module || "") !==
        (data?.module || "")
    );
  };

  // ==============================
  // Close Form Confirmation
  // ==============================
  const handleClose = () => {
    if (isFormDirty()) {
      const confirmClose = window.confirm(
        "You filled some details. If you close now, the entered details will not be saved. Do you want to close?"
      );

      // User clicked Cancel
      if (!confirmClose) {
        return;
      }
    }

    // Close Form
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
  }, [
    formData,
    data,
    editMode,
  ]);

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

    if (
      !formData.code ||
      !formData.status ||
      !formData.module
    ) {
      toast.error(
        "Please fill all fields"
      );
      return;
    }

    const payload = {
      code: formData.code,
      status: formData.status,
      module: formData.module,
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
        background:
          "rgba(0,0,0,0.5)",
        zIndex: 1050,
        overflowY: "auto",
      }}
    >
      <div
        className="modal-dialog modal-lg"
        style={{
          width:
            "calc(100% - 40px)",
          maxWidth: "800px",
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
          <form
            onSubmit={handleSubmit}
          >

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                {editMode
                  ? "Edit Status"
                  : "Add Status"}
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

                {/* Code */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Code
                  </label>

                  <input
                    name="code"
                    value={
                      formData.code || ""
                    }
                    onChange={handleChange}
                  
                    className="form-control"
                    required
                  />
                </div>

                {/* Status */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Status
                  </label>

                  <input
                    name="status"
                    value={
                      formData.status || ""
                    }
                    onChange={handleChange}
                   
                    className="form-control"
                    required
                  />
                </div>

                {/* Module */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Module
                  </label>

                  <input
                    name="module"
                    value={
                      formData.module || ""
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

export default StatusForm;

