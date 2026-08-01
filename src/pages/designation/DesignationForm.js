
import { useState, useEffect } from "react";
import { getStatusByModule } from "../../services/admin/statusService";

const DesignationForm = ({
  data,
  add,
  close,
  editMode,
}) => {
  const [statusList, setStatusList] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "",
  });

  // ==============================
  // Load Form Data
  // ==============================
  useEffect(() => {
    setFormData({
      name: data?.name || "",
      code: data?.code || "",
      status:
        data?.status_id?.toString() || "",
      id: data?.id || undefined,
    });

    fetchStatuses();
  }, [data]);

  // ==============================
  // Fetch Status Options
  // ==============================
  const fetchStatuses = async () => {
    try {
      const res =
        await getStatusByModule(["gen"]);

      setStatusList(res.data || []);
    } catch (err) {
      console.error(
        "Failed to fetch status list",
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
    // Create Mode
    // ==============================
    if (!editMode) {
      return (
        (formData.name &&
          formData.name.trim() !== "") ||
        (formData.code &&
          formData.code.trim() !== "") ||
        formData.status
      );
    }

    // ==============================
    // Edit Mode
    // Check if any value changed
    // ==============================
    return (
      (formData.name || "") !==
        (data?.name || "") ||
      (formData.code || "") !==
        (data?.code || "") ||
      String(formData.status || "") !==
        String(data?.status_id || "")
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
  }, [formData, data, editMode]);

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
      code: formData.code,
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
        background: "rgba(0,0,0,0.5)",
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
                  ? "Edit Designation"
                  : "Add Designation"}
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

                {/* Designation Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Designation Name
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

                {/* Code */}
                <div className="col-md-6 mb-3">
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

                    {statusList.map((s) => (
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

export default DesignationForm;

