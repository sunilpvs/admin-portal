
import { useState, useEffect } from "react";
import { getCountryCombo } from "../../services/admin/countryService";
import { getStateCombo } from "../../services/admin/stateService";

const CityForm = ({ data, add, close, editMode }) => {
  const [formData, setFormData] = useState(data);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    setFormData(data);
    fetchDropdowns();
  }, [data]);

  // ==============================
  // Fetch State & Country
  // ==============================
  const fetchDropdowns = async () => {
    try {
      const stateData = await getStateCombo(["id", "state"]);
      const countryData = await getCountryCombo(["id", "country"]);

      setStates(stateData.data);
      setCountries(countryData.data);
    } catch (err) {
      console.error("Failed to fetch dropdowns:", err);
    }
  };

  // ==============================
  // Handle Input Change
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setFormData({
        ...formData,
        state_id: value,
      });
    } else if (name === "country") {
      setFormData({
        ...formData,
        country_id: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // ==============================
  // Check if User Entered Anything
  // ==============================
const isFormDirty = () => {
  // Create mode
  if (!editMode) {
    return (
      (formData.city && formData.city.trim() !== "") ||
      formData.state_id ||
      formData.country_id
    );
  }

  // Edit mode
  return (
    (formData.city || "") !== (data.city || "") ||
    String(formData.state_id || "") !== String(data.state_id || "") ||
    String(formData.country_id || "") !== String(data.country_id || "")
  );
};

  // ==============================
  // Close Form Confirmation
  // ==============================
  const handleClose = () => {
    // If user has entered some details
    if (isFormDirty()) {
      const confirmClose = window.confirm(
        "You filled some details. If you close now, the entered details will not be saved. Do you want to close?"
      );

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

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [formData]);

  // ==============================
  // Outside Click Handler
  // ==============================
  const handleOutsideClick = (e) => {
    // Only close if clicking the dark background
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
      city: formData.city,
      state: formData.state_id || formData.state,
      country: formData.country_id || formData.country,
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
                {editMode ? "Edit City" : "Create City"}
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

                {/* City */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                {/* State */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    State
                  </label>

                  <select
                    name="state"
                    value={formData.state_id || ""}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">
                      Select State
                    </option>

                    {states.map((state) => (
                      <option
                        key={state.id}
                        value={state.id}
                      >
                        {state.state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Country
                  </label>

                  <select
                    name="country"
                    value={formData.country_id || ""}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">
                      Select Country
                    </option>

                    {countries.map((country) => (
                      <option
                        key={country.id}
                        value={country.id}
                      >
                        {country.country}
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

export default CityForm;

