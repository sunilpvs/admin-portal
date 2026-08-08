import { useEffect, useState } from "react";

const OfficeLocationForm = ({ data, add, close, editMode }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    office: "",
    status: 1,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id || "",
        name: data.name || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        zip: data.zip || "",
        country: data.country || "",
        office: data.office || "",
        status:
          data.status !== undefined && data.status !== null
            ? Number(data.status)
            : 1,
      });
    } else {
      setFormData({
        id: "",
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        office: "",
        status: 1,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormDirty = () => {
    if (!editMode) {
      return (
        (formData.name && formData.name.trim() !== "") ||
        (formData.address && formData.address.trim() !== "") ||
        (formData.city && formData.city.trim() !== "") ||
        (formData.state && formData.state.trim() !== "") ||
        (formData.zip && formData.zip.trim() !== "") ||
        (formData.country && formData.country.trim() !== "") ||
        (formData.office && formData.office.trim() !== "") ||
        formData.status !== 1
      );
    }

    return (
      (formData.name || "") !== (data?.name || "") ||
      (formData.address || "") !== (data?.address || "") ||
      (formData.city || "") !== (data?.city || "") ||
      (formData.state || "") !== (data?.state || "") ||
      (formData.zip || "") !== (data?.zip || "") ||
      (formData.country || "") !== (data?.country || "") ||
      (formData.office || "") !== (data?.office || "") ||
      String(formData.status) !== String(data?.status ?? 1)
    );
  };

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
  }, [formData, data, editMode]);

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id: formData.id,
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      country: formData.country,
      office: formData.office,
      status: Number(formData.status),
    };

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
          maxWidth: "900px",
          margin: "150px auto 30px auto",
        }}
      >
        <div className="modal-content" style={{ borderRadius: "8px", overflow: "hidden" }}>
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {editMode ? "Edit Office Location" : "Create Office Location"}
              </h5>
              <button type="button" className="btn-close" onClick={handleClose} />
            </div>

            <div className="modal-body" style={{ padding: "24px" }}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Office</label>
                  <input
                    name="office"
                    value={formData.office || ""}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">City</label>
                  <input
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">State</label>
                  <input
                    name="state"
                    value={formData.state || ""}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Zip</label>
                  <input
                    name="zip"
                    value={formData.zip || ""}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Country</label>
                  <input
                    name="country"
                    value={formData.country || ""}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value={1}>Active</option>
                    <option value={2}>In-Active</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfficeLocationForm;