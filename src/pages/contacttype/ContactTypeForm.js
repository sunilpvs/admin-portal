
import { useState, useEffect } from "react";
import { getStatusByModule } from "../../services/admin/statusService";

const ContactTypeForm = ({
  data,
  add,
  close,
  editMode,
}) => {
  const [status, setStatus] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    status: "",
    id: "",
  });

  // ==============================
  // Load Form Data
  // ==============================
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        status:
          data.status_id?.toString() || "",
        id: data.id || "",
      });
    } else {
      // Reset form for Add Mode
      setFormData({
        name: "",
        status: "",
        id: "",
      });
    }

    fetchDropdowns();
  }, [data]);

  // ==============================
  // Fetch Status Dropdown
  // ==============================
  const fetchDropdowns = async () => {
    try {
      const statusData =
        await getStatusByModule(["GEN"]);

      setStatus(
        statusData?.data || []
      );
    } catch (err) {
      console.error(
        "Failed to fetch dropdowns:",
        err
      );
    }
  };

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
        (formData.name &&
          formData.name.trim() !== "") ||
        formData.status
      );
    }

    // ==============================
    // Edit Mode
    // ==============================
    return (
      (formData.name || "") !==
        (data?.name || "") ||
      String(formData.status || "") !==
        String(data?.status_id || "")
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

    const payload = {
      name: formData.name,
      status: formData.status,
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
                  ? "Edit Contact Type"
                  : "Add Contact Type"}
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

                {/* Contact Type Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Contact Type Name
                  </label>

                  <input
                    name="name"
                    value={
                      formData.name || ""
                    }
                    onChange={handleChange}
                    
                    className="form-control"
                    required
                  />
                </div>

                {/* Status */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      formData.status || ""
                    }
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">
                      Select Status
                    </option>

                    {status.map((s) => (
                      <option
                        key={s.id}
                        value={s.id.toString()}
                      >
                        {s.status}
                      </option>
                    ))}
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

export default ContactTypeForm;

