
import { useState, useEffect } from "react";

const CountryForm = ({ data, add, close }) => {
  const [formData, setFormData] = useState({
    country: "",
    code: "",
    currency: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        country: data.country || "",
        code: data.code || "",
        currency: data.currency || "",
        id: data.id || null,
      });
    } else {
      setFormData({
        country: "",
        code: "",
        currency: "",
      });
    }
  }, [data]);

  // ==============================
  // Handle Input Change
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    const shouldUppercase =
      name === "code" ||
      name === "currency";

    setFormData((prev) => ({
      ...prev,
      [name]: shouldUppercase
        ? value.toUpperCase()
        : value,
    }));
  };

  // ==============================
  // Check if Form is Dirty
  // ==============================
  const isFormDirty = () => {
    // ==============================
    // Create Mode
    // ==============================
    if (!data?.id) {
      return (
        (formData.country &&
          formData.country.trim() !== "") ||
        (formData.code &&
          formData.code.trim() !== "") ||
        (formData.currency &&
          formData.currency.trim() !== "")
      );
    }

    // ==============================
    // Edit Mode
    // Check if any value changed
    // ==============================
    return (
      (formData.country || "") !==
        (data.country || "") ||
      (formData.code || "") !==
        (data.code || "") ||
      (formData.currency || "") !==
        (data.currency || "")
    );
  };

  // ==============================
  // Close Form Confirmation
  // ==============================
  const handleClose = () => {
    // Check if there are unsaved changes
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
  }, [formData, data]);

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
      country: formData.country,
      code: formData.code,
      currency: formData.currency,
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
                {data?.id
                  ? "Edit Country"
                  : "Create Country"}
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
                padding: "24px",
              }}
            >
             

              <div className="row">

                {/* Country */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Country
                  </label>

                  <input
                    name="country"
                    value={
                      formData.country || ""
                    }
                    onChange={handleChange}
                  
                    className="form-control"
                    required
                  />
                </div>

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
                    maxLength={3}
                    required
                  />
                </div>

                {/* Currency */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Currency
                  </label>

                  <input
                    name="currency"
                    value={
                      formData.currency || ""
                    }
                    onChange={handleChange}
                   
                    className="form-control"
                    maxLength={4}
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

export default CountryForm;

