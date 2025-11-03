import React, { useState, useEffect } from "react";
import {
  getPaginatedEntities,
  getPrimaryContacts,
} from "../../services/admin/entityService";
import { getCityCombo } from "../../services/admin/cityService";
import { getCountryCombo } from "../../services/admin/countryService";
import { getStateCombo } from "../../services/admin/stateService";
import { getStatusCombo, getStatusByModule} from "../../services/admin/statusService";

const EntityForm = ({ data, add, close, editMode }) => {
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
    pin: ""
  });

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [primarycontacts, setPrimaryContacts] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    fetchDropdowns();

    if (data) {
      const normalized = {
        id: data.id ?? "",
        entity_name: data.entity_name ?? "",
        cin: data.cin ?? "",
        incorp_date: data.incorp_date ?? "",
        city_id: data.city_id?.toString() ?? "",
        state_id: data.state_id?.toString() ?? "",
        country_id: data.country_id?.toString() ?? "",
        status: data.status_id?.toString() ?? data.status?.toString() ?? "",
        primary_contact_id: data.primary_contact_id?.toString() ?? "",
        cc_code: data.cc_code ?? "",
        gst_no: data.gst_no ?? "",
        add1: data.add1 ?? "",
        add2: data.add2 ?? "",
        pin: data.pin ?? ""
      };

      setFormData(normalized);
    }
  }, [data]);

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
      setPrimaryContacts(primaryData?.data?.contacts || []);
      setStatusOptions(statusData?.data || []);
    } catch (err) {
      console.error("Failed to fetch dropdowns:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: formData.id,
      entity_name: formData.entity_name,
      cin: formData.cin,
      incorp_date: formData.incorp_date,
      city_id: formData.city_id,
      state_id: formData.state_id,
      country_id: formData.country_id,
      status: formData.status,
      primary_contact: formData.primary_contact_id,
      cc_code: formData.cc_code,
      gst_no: formData.gst_no,
      add1: formData.add1,
      add2: formData.add2,
      pin: formData.pin
    };
    add(payload);
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered" style={{ marginLeft: "auto", marginRight: "30%" }}>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{editMode ? "Edit Entity" : "Add Entity"}</h5>
              <button type="button" className="btn-close" onClick={close}></button>
            </div>
            <div className="modal-body">
              {/* COMMON FIELDS FOR BOTH MODES */}
              <input
                name="entity_name"
                value={formData.entity_name}
                onChange={handleChange}
                placeholder="Entity Name"
                className="form-control mb-2"
                required
              />
              <input
                name="cin"
                value={formData.cin}
                onChange={handleChange}
                placeholder="CIN Number"
                className="form-control mb-2"
                required
              />
              <input
                type="date"
                name="incorp_date"
                value={formData.incorp_date}
                onChange={handleChange}
                className="form-control mb-2"
                required
              />
              

              {/* FIELDS ONLY VISIBLE IN ADD MODE */}
              {!editMode && (
                <>
                  <input
                    name="cc_code"
                    value={formData.cc_code}
                    onChange={handleChange}
                    placeholder="Cost Center Code"
                    className="form-control mb-2"
                    required
                  />
                  <input
                    name="gst_no"
                    value={formData.gst_no}
                    onChange={handleChange}
                    placeholder="GST Number"
                    className="form-control mb-2"
                    required
                  />
                  <input
                    name="add1"
                    value={formData.add1}
                    onChange={handleChange}
                    placeholder="Address 1"
                    className="form-control mb-2"
                    required
                  />
                  <input
                    name="add2"
                    value={formData.add2}
                    onChange={handleChange}
                    placeholder="Address 2"
                    className="form-control mb-2"
                  />
                  <select
                    name="city_id"
                    value={formData.city_id}
                    onChange={handleChange}
                    className="form-control mb-2"
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id.toString()}>
                        {city.city}
                      </option>
                    ))}
                  </select>
                  <select
                    name="state_id"
                    value={formData.state_id}
                    onChange={handleChange}
                    className="form-control mb-2"
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((st) => (
                      <option key={st.id} value={st.id.toString()}>
                        {st.state}
                      </option>
                    ))}
                  </select>
                  <select
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleChange}
                    className="form-control mb-2"
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map((ct) => (
                      <option key={ct.id} value={ct.id.toString()}>
                        {ct.country}
                      </option>
                    ))}
                  </select>
                  <input
                    name="pin"
                    value={formData.pin}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="form-control mb-2"
                  />
                  <select
                    name="primary_contact_id"
                    value={formData.primary_contact_id}
                    onChange={handleChange}
                    className="form-control mb-2"
                    required
                  >
                    <option value="">Select Primary Contact</option>
                    {primarycontacts.map((pc) => (
                      <option key={pc.id} value={pc.id.toString()}>
                        {pc.employee}
                      </option>
                    ))}
                  </select>


                </>
              )}
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control mb-2"
                required
              >
                <option value="">Select Status</option>
                {statusOptions.map((s) => (
                  <option key={s.id} value={s.id.toString()}>
                    {s.status}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-success">Save</button>
              <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EntityForm;
