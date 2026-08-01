
import { useState, useEffect } from "react";
import {
  getPaginatedEntities,
  getPrimaryContacts,
} from "../../services/admin/entityService";
import { getCityCombo } from "../../services/admin/cityService";
import { getCountryCombo } from "../../services/admin/countryService";
import { getStateCombo } from "../../services/admin/stateService";
import { getStatusByModule } from "../../services/admin/statusService";

const CostCenterForm = ({
  data,
  add,
  close,
  editMode,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    cc_code: "",
    entity_id: "",
    incorp_date: "",
    gst_no: "",
    add1: "",
    add2: "",
    city_id: "",
    state_id: "",
    country_id: "",
    pin: "",
    contact_id: "",
    status_id: "",
  });

  const [entities, setEntities] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [primaryContacts, setPrimaryContacts] =
    useState([]);
  const [statusOptions, setStatusOptions] =
    useState([]);

  // ==============================
  // Load Form Data
  // ==============================
  useEffect(() => {
    fetchDropdowns();

    if (data) {
      setFormData({
        id: data.id || "",
        cc_code: data.cc_code || "",
        entity_id:
          data.entity_id?.toString() || "",
        incorp_date:
          data.incorp_date &&
          data.incorp_date !== "0000-00-00"
            ? data.incorp_date
            : "",
        gst_no: data.gst_no || "",
        add1: data.add1 || "",
        add2: data.add2 || "",
        city_id:
          data.city_id?.toString() || "",
        state_id:
          data.state_id?.toString() || "",
        country_id:
          data.country_id?.toString() || "",
        pin: data.pin || "",
        contact_id:
          data.contact_id?.toString() || "",
        status_id:
          data.status_id?.toString() || "",
      });
    } else {
      // Reset form for Add Mode
      setFormData({
        id: "",
        cc_code: "",
        entity_id: "",
        incorp_date: "",
        gst_no: "",
        add1: "",
        add2: "",
        city_id: "",
        state_id: "",
        country_id: "",
        pin: "",
        contact_id: "",
        status_id: "",
      });
    }
  }, [data]);

  // ==============================
  // Fetch Dropdown Options
  // ==============================
  const fetchDropdowns = async () => {
    try {
      const [
        entityData,
        cityData,
        stateData,
        countryData,
        primaryContactData,
        statusData,
      ] = await Promise.all([
        getPaginatedEntities(),
        getCityCombo(),
        getStateCombo(["id", "state"]),
        getCountryCombo(),
        getPrimaryContacts(),
        getStatusByModule(["gen"]),
      ]);

      setEntities(
        entityData?.data?.entities || []
      );

      setCities(
        cityData?.data || []
      );

      setStates(
        stateData?.data || []
      );

      setCountries(
        countryData?.data || []
      );

      setPrimaryContacts(
        primaryContactData?.data?.contacts || []
      );

      setStatusOptions(
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
        (formData.cc_code &&
          formData.cc_code.trim() !== "") ||
        formData.entity_id ||
        formData.incorp_date ||
        (formData.gst_no &&
          formData.gst_no.trim() !== "") ||
        (formData.add1 &&
          formData.add1.trim() !== "") ||
        (formData.add2 &&
          formData.add2.trim() !== "") ||
        formData.city_id ||
        formData.state_id ||
        formData.country_id ||
        (formData.pin &&
          formData.pin.trim() !== "") ||
        formData.contact_id ||
        formData.status_id
      );
    }

    // ==============================
    // Edit Mode
    // Entity is disabled,
    // so entity_id is not compared.
    // ==============================
    return (
      (formData.cc_code || "") !==
        (data?.cc_code || "") ||

      (formData.incorp_date || "") !==
        (
          data?.incorp_date &&
          data.incorp_date !== "0000-00-00"
            ? data.incorp_date
            : ""
        ) ||

      (formData.gst_no || "") !==
        (data?.gst_no || "") ||

      (formData.add1 || "") !==
        (data?.add1 || "") ||

      (formData.add2 || "") !==
        (data?.add2 || "") ||

      String(formData.city_id || "") !==
        String(data?.city_id || "") ||

      String(formData.state_id || "") !==
        String(data?.state_id || "") ||

      String(formData.country_id || "") !==
        String(data?.country_id || "") ||

      (formData.pin || "") !==
        (data?.pin || "") ||

      String(formData.contact_id || "") !==
        String(data?.contact_id || "") ||

      String(formData.status_id || "") !==
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
      id: formData.id || "",
      cc_code: formData.cc_code,
      incorp_date: formData.incorp_date,
      gst_no: formData.gst_no,
      add1: formData.add1,
      add2: formData.add2,
      pin: formData.pin,
      entity_id: formData.entity_id,
      city: formData.city_id,
      state: formData.state_id,
      country: formData.country_id,
      primary_contact:
        formData.contact_id,
      status: formData.status_id,
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
          
          margin:
            "80px auto 30px auto",
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
                  ? "Edit Cost Center"
                  : "Add Cost Center"}
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

                {/* Cost Center Code */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Cost Center Code
                  </label>

                  <input
                    name="cc_code"
                    value={
                      formData.cc_code || ""
                    }
                    onChange={handleChange}
                    
                    className="form-control"
                    required
                  />
                </div>

                {/* Entity */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Entity
                  </label>

                  {editMode ? (
                    <select
                      name="entity_id"
                      value={
                        formData.entity_id ||
                        ""
                      }
                      className="form-select"
                      disabled
                    >
                      <option
                        value={
                          formData.entity_id
                        }
                      >
                        {data?.entity_name ||
                          data?.entity ||
                          "Selected Entity"}
                      </option>
                    </select>
                  ) : (
                    <select
                      name="entity_id"
                      value={
                        formData.entity_id ||
                        ""
                      }
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">
                        Select Entity
                      </option>

                      {entities.map(
                        (entity) => (
                          <option
                            key={entity.id}
                            value={entity.id.toString()}
                          >
                            {entity.entity ||
                              entity.entity_name}
                          </option>
                        )
                      )}
                    </select>
                  )}
                </div>

                {/* Incorporation Date */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Incorporation Date
                  </label>

                  <input
                    type="date"
                    name="incorp_date"
                    value={
                      formData.incorp_date ||
                      ""
                    }
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                {/* GST Number */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    GST Number
                  </label>

                  <input
                    name="gst_no"
                    value={
                      formData.gst_no || ""
                    }
                    onChange={handleChange}
                   
                    className="form-control"
                  />
                </div>

                {/* Address 1 */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Address Line 1
                  </label>

                  <input
                    name="add1"
                    value={
                      formData.add1 || ""
                    }
                    onChange={handleChange}
                   
                    className="form-control"
                  />
                </div>

                {/* Address 2 */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Address Line 2
                  </label>

                  <input
                    name="add2"
                    value={
                      formData.add2 || ""
                    }
                    onChange={handleChange}
                  
                    className="form-control"
                  />
                </div>

                {/* City */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    City
                  </label>

                  <select
                    name="city_id"
                    value={
                      formData.city_id ||
                      ""
                    }
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">
                      Select City
                    </option>

                    {cities.map(
                      (city) => (
                        <option
                          key={city.id}
                          value={city.id.toString()}
                        >
                          {city.city}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* State */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    State
                  </label>

                  <select
                    name="state_id"
                    value={
                      formData.state_id ||
                      ""
                    }
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">
                      Select State
                    </option>

                    {states.map(
                      (state) => (
                        <option
                          key={state.id}
                          value={state.id.toString()}
                        >
                          {state.state}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Country */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Country
                  </label>

                  <select
                    name="country_id"
                    value={
                      formData.country_id ||
                      ""
                    }
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">
                      Select Country
                    </option>

                    {countries.map(
                      (country) => (
                        <option
                          key={country.id}
                          value={country.id.toString()}
                        >
                          {country.country}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* PIN Code */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    PIN Code
                  </label>

                  <input
                    name="pin"
                    value={
                      formData.pin || ""
                    }
                    onChange={handleChange}
                   
                    className="form-control"
                  />
                </div>

                {/* Primary Contact */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Primary Contact
                  </label>

                  <select
                    name="contact_id"
                    value={
                      formData.contact_id ||
                      ""
                    }
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">
                      Select Primary Contact
                    </option>

                    {primaryContacts.map(
                      (pc) => (
                        <option
                          key={pc.id}
                          value={pc.id.toString()}
                        >
                          {pc.employee}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Status
                  </label>

                  <select
                    name="status_id"
                    value={
                      formData.status_id ||
                      ""
                    }
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">
                      Select Status
                    </option>

                    {statusOptions.map(
                      (s) => (
                        <option
                          key={s.id}
                          value={s.id.toString()}
                        >
                          {s.status}
                        </option>
                      )
                    )}
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

export default CostCenterForm;

