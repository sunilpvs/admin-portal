import { useState, useEffect } from "react";
import { getPaginatedEntities, getPrimaryContacts } from "../../services/admin/entityService";
import { getCityCombo } from "../../services/admin/cityService";
import { getCountryCombo } from "../../services/admin/countryService";
import { getStateCombo } from "../../services/admin/stateService";
import { getStatusByModule } from "../../services/admin/statusService";

const CostCenterForm = ({ data, add, close }) => {
    const [formData, setFormData] = useState({
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
    const [primaryContacts, setPrimaryContacts] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);

    // Fetch dropdown options on load
    useEffect(() => {
        fetchDropdowns();
    }, []);

    // Pre-fill form when editing
    useEffect(() => {
        if (data) {
            setFormData({
                id: data.id || "",
                cc_code: data.cc_code || "",
                entity_id: data.entity_id || "",
                incorp_date:
                    data.incorp_date && data.incorp_date !== "0000-00-00"
                        ? data.incorp_date
                        : "",
                gst_no: data.gst_no || "",
                add1: data.add1 || "",
                add2: data.add2 || "",
                city_id: data.city_id || "",
                state_id: data.state_id || "",
                country_id: data.country_id || "",
                pin: data.pin || "",
                contact_id: data.contact_id || "",
                status_id: data.status_id || "",
            });
        }
    }, [data]);

    // Fetch dropdown data
    const fetchDropdowns = async () => {
        try {
            const entityData = await getPaginatedEntities();
            const cityData = await getCityCombo();
            const stateData = await getStateCombo(["id", "state"]);
            const countryData = await getCountryCombo();
            const primaryContactData = await getPrimaryContacts();
            const statusData = await getStatusByModule(["gen"]);

            setEntities(entityData.data.entities || []);
            setCities(cityData.data || []);
            setStates(stateData.data || []);
            setCountries(countryData.data || []);
            setPrimaryContacts(primaryContactData.data.contacts || []);
            setStatusOptions(statusData.data || []);
        } catch (err) {
            console.error("Failed to fetch dropdowns:", err);
        }
    };

    // Handle field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Submit form
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
            primary_contact: formData.contact_id,
            status: formData.status_id,
        };

        add(payload);
    };

    return (
        <div
            className="modal d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.5)" }}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                style={{ marginLeft: "auto", marginRight: "30%" }}
            >
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {formData.id ? "Edit Cost Center" : "Add Cost Center"}
                            </h5>
                            <button type="button" className="btn-close" onClick={close}></button>
                        </div>

                        <div className="modal-body">
                            {/* Cost Center Code */}
                            <input
                                name="cc_code"
                                value={formData.cc_code}
                                onChange={handleChange}
                                placeholder="Cost Center Code"
                                className="form-control mb-2"
                                required
                            />

                            {/* Entity Dropdown */}
                            {data && data.id ? (
                                // EDIT MODE → show only current entity, disabled
                                <select
                                    name="entity_id"
                                    value={formData.entity_id}
                                    className="form-control mb-2"
                                    disabled
                                >
                                    <option value={formData.entity_id}>
                                        {data.entity_name || data.entity || "Selected Entity"}
                                    </option>
                                </select>
                            ) : (
                                // ADD MODE → show full dropdown
                                <select
                                    name="entity_id"
                                    value={formData.entity_id}
                                    onChange={handleChange}
                                    className="form-control mb-2"
                                    required
                                >
                                    <option value="">Select Entity</option>
                                    {entities.map((entity) => (
                                        <option key={entity.id} value={entity.id}>
                                            {entity.entity || entity.entity_name}
                                        </option>
                                    ))}
                                </select>
                            )}


                            {/* Incorporation Date */}
                            <input
                                type="date"
                                name="incorp_date"
                                value={formData.incorp_date}
                                onChange={handleChange}
                                className="form-control mb-2"
                            />

                            {/* GST */}
                            <input
                                name="gst_no"
                                value={formData.gst_no}
                                onChange={handleChange}
                                placeholder="GST Number"
                                className="form-control mb-2"
                            />

                            {/* Address */}
                            <input
                                name="add1"
                                value={formData.add1}
                                onChange={handleChange}
                                placeholder="Address Line 1"
                                className="form-control mb-2"
                            />

                            <input
                                name="add2"
                                value={formData.add2}
                                onChange={handleChange}
                                placeholder="Address Line 2"
                                className="form-control mb-2"
                            />

                            {/* City */}
                            <select
                                name="city_id"
                                value={formData.city_id}
                                onChange={handleChange}
                                className="form-control mb-2"
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.city}
                                    </option>
                                ))}
                            </select>

                            {/* State */}
                            <select
                                name="state_id"
                                value={formData.state_id}
                                onChange={handleChange}
                                className="form-control mb-2"
                            >
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state.id} value={state.id}>
                                        {state.state}
                                    </option>
                                ))}
                            </select>

                            {/* Country */}
                            <select
                                name="country_id"
                                value={formData.country_id}
                                onChange={handleChange}
                                className="form-control mb-2"
                            >
                                <option value="">Select Country</option>
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                        {country.country}
                                    </option>
                                ))}
                            </select>

                            {/* PIN */}
                            <input
                                name="pin"
                                value={formData.pin}
                                onChange={handleChange}
                                placeholder="PIN Code"
                                className="form-control mb-2"
                            />

                            {/* Primary Contact */}
                            <select
                                name="contact_id"
                                value={formData.contact_id}
                                onChange={handleChange}
                                className="form-control mb-2"
                            >
                                <option value="">Select Primary Contact</option>
                                {primaryContacts.map((pc) => (
                                    <option key={pc.id} value={pc.id}>
                                        {pc.employee}
                                    </option>
                                ))}
                            </select>

                            {/* Status */}
                            <select
                                name="status_id"
                                value={formData.status_id}
                                onChange={handleChange}
                                className="form-control mb-2"
                            >
                                <option value="">Select Status</option>
                                {statusOptions.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="modal-footer">
                            <button type="submit" className="btn btn-success">
                                Save
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={close}
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
