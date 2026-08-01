
import React, { useState, useEffect } from "react";
import {
  getPaginatedEntities,
  getPrimaryContacts,
} from "../../services/admin/entityService";
import { getCityCombo } from "../../services/admin/cityService";
import { getCountryCombo } from "../../services/admin/countryService";
import { getStateCombo } from "../../services/admin/stateService";
import { getStatusByModule } from "../../services/admin/statusService";

const EntityForm = ({
  data,
  add,
  close,
  editMode,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    entity_name: "",
    cin: "",
    incorp_date: "",
    city_id: "",
    state_id: "",
    country_id: "",
    status: "",
    primary_contact_id: "",
    cc_code: "",
    gst_no: "",
    add1: "",
    add2: "",
    pin: "",
    salutation_name: "",
  });

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [primarycontacts, setPrimaryContacts] =
    useState([]);
  const [statusOptions, setStatusOptions] =
    useState([]);

  // ==============================
  // Load Form Data
  // ==============================
  useEffect(() => {
    fetchDropdowns();

    if (data) {
      const normalized = {
        id: data.id ?? "",
        entity_name:
          data.entity_name ?? "",
        cin: data.cin ?? "",
        incorp_date:
          data.incorp_date ?? "",
        city_id:
          data.city_id?.toString() ?? "",
        state_id:
          data.state_id?.toString() ?? "",
        country_id:
          data.country_id?.toString() ?? "",
        status:
          data.status_id?.toString() ??
          data.status?.toString() ??
          "",
        primary_contact_id:
          data.primary_contact_id?.toString() ??
          "",
        cc_code:
          data.cc_code ?? "",
        gst_no:
          data.gst_no ?? "",
        add1:
          data.add1 ?? "",
        add2:
          data.add2 ?? "",
        pin:
          data.pin ?? "",
        salutation_name:
          data.salutation_name ?? "",
      };

      setFormData(normalized);
    } else {
      setFormData({
        id: "",
        entity_name: "",
        cin: "",
        incorp_date: "",
        city_id: "",
        state_id: "",
        country_id: "",
        status: "",
        primary_contact_id: "",
        cc_code: "",
        gst_no: "",
        add1: "",
        add2: "",
        pin: "",
        salutation_name: "",
      });
    }
  }, [data]);

  // ==============================
  // Fetch Dropdowns
  // ==============================
  const fetchDropdowns = async () => {
    try {
      const [
        _entityData,
        cityData,
        stateData,
        countryData,
        primaryData,
        statusData,
      ] = await Promise.all([
        getPaginatedEntities(),
        getCityCombo(),
        getStateCombo(["id", "state"]),
        getCountryCombo(),
        getPrimaryContacts(),
        getStatusByModule(["gen"]),
      ]);

      setCities(cityData.data || []);
      setStates(stateData.data || []);
      setCountries(countryData.data || []);

      setPrimaryContacts(
        primaryData?.data?.contacts || []
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
    // Create / Add Mode
    // ==============================
    if (!editMode) {
      return (
        (formData.entity_name &&
          formData.entity_name.trim() !== "") ||
        (formData.cin &&
          formData.cin.trim() !== "") ||
        (formData.salutation_name &&
          formData.salutation_name.trim() !== "") ||
        formData.incorp_date ||
        (formData.cc_code &&
          formData.cc_code.trim() !== "") ||
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
        formData.primary_contact_id ||
        formData.status
      );
    }

    // ==============================
    // Edit Mode
    // Only compare fields visible
    // in Edit Mode
    // ==============================
    return (
      (formData.entity_name || "") !==
        (data?.entity_name || "") ||
      (formData.cin || "") !==
        (data?.cin || "") ||
      (formData.salutation_name || "") !==
        (data?.salutation_name || "") ||
      (formData.incorp_date || "") !==
        (data?.incorp_date || "") ||
      String(formData.status || "") !==
        String(
          data?.status_id ??
            data?.status ??
            ""
        )
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
      id: formData.id,
      entity_name:
        formData.entity_name,
      cin: formData.cin,
      incorp_date:
        formData.incorp_date,
      city_id:
        formData.city_id,
      state_id:
        formData.state_id,
      country_id:
        formData.country_id,
      status:
        formData.status,
      primary_contact:
        formData.primary_contact_id,
      cc_code:
        formData.cc_code,
      gst_no:
        formData.gst_no,
      add1:
        formData.add1,
      add2:
        formData.add2,
      pin:
        formData.pin,
      salutation_name:
        formData.salutation_name,
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
                  ? "Edit Entity"
                  : "Add Entity"}
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

                {/* Entity Name */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Entity Name
                  </label>

                  <input
                    name="entity_name"
                    value={
                      formData.entity_name ||
                      ""
                    }
                    onChange={handleChange}
                    
                    className="form-control"
                    required
                  />
                </div>

                {/* CIN */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    CIN Number
                  </label>

                  <input
                    name="cin"
                    value={
                      formData.cin || ""
                    }
                    onChange={handleChange}
                   
                    className="form-control"
                    required
                  />
                </div>

                {/* Salutation Name */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Salutation Name
                  </label>

                  <input
                    name="salutation_name"
                    value={
                      formData.salutation_name ||
                      ""
                    }
                    onChange={handleChange}
                   
                    className="form-control"
                    required
                  />
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
                    required
                  />
                </div>

                {/* Add Mode Fields */}
                {!editMode && (
                  <>
                    {/* Cost Center Code */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Cost Center Code
                      </label>

                      <input
                        name="cc_code"
                        value={
                          formData.cc_code ||
                          ""
                        }
                        onChange={handleChange}
                      
                        className="form-control"
                        required
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
                          formData.gst_no ||
                          ""
                        }
                        onChange={handleChange}
                        
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Address 1 */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Address 1
                      </label>

                      <input
                        name="add1"
                        value={
                          formData.add1 || ""
                        }
                        onChange={handleChange}
                       
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Address 2 */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Address 2
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
                        required
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
                        required
                      >
                        <option value="">
                          Select State
                        </option>

                        {states.map(
                          (st) => (
                            <option
                              key={st.id}
                              value={st.id.toString()}
                            >
                              {st.state}
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
                        required
                      >
                        <option value="">
                          Select Country
                        </option>

                        {countries.map(
                          (ct) => (
                            <option
                              key={ct.id}
                              value={ct.id.toString()}
                            >
                              {ct.country}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Pincode */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Pincode
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
                        name="primary_contact_id"
                        value={
                          formData.primary_contact_id ||
                          ""
                        }
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="">
                          Select Primary Contact
                        </option>

                        {primarycontacts.map(
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
                  </>
                )}

                {/* Status */}
                <div className="col-md-4 mb-3">
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

export default EntityForm;

