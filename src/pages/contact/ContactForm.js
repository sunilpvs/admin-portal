import { useState, useEffect } from "react";
import { getCountryCombo } from "../../services/admin/countryService";
import { getStateCombo } from "../../services/admin/stateService";
//import { getContactTypeCombo } from "../../services/admin/contactTypeService";

const ContactForm = ({ data, add, close, editMode }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  //const [contactTypes, setContactTypes] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    mobile: "",
    address1: "",
    address2: "",
    city: "Bengaluru",
    state: "",
    pincode: "",
    country: "",
    contactType: "",
    ...data,
  });

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const countryRes = await getCountryCombo();
      const stateRes = await getStateCombo();
      //const contactTypeRes = await getContactCombo();

      setCountries(countryRes.data);
      setStates(stateRes.data);
      //setContactTypes(contactTypeRes.data);
    } catch (err) {
      console.error("Dropdown fetch failed", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { ...formData };
    if (data?.id) payload.id = data.id;

    add(payload);
  };

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {editMode ? "Edit Contact" : "Add Contact"}
              </h5>
              <button type="button" className="btn-close" onClick={close}></button>
            </div>

            <div className="modal-body">

              <input name="firstName" value={formData.firstName}
                onChange={handleChange} placeholder="First Name"
                className="form-control mb-2" required />

              <input name="lastName" value={formData.lastName}
                onChange={handleChange} placeholder="Last Name"
                className="form-control mb-2" />

              <input type="date" name="dob" value={formData.dob}
                onChange={handleChange} className="form-control mb-2" />

              <input type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="Email"
                className="form-control mb-2" />

              <input name="mobile" value={formData.mobile}
                onChange={handleChange} placeholder="Mobile"
                className="form-control mb-2" required />

              <input name="address1" value={formData.address1}
                onChange={handleChange} placeholder="Address Line 1"
                className="form-control mb-2" />

              <input name="address2" value={formData.address2}
                onChange={handleChange} placeholder="Address Line 2"
                className="form-control mb-2" />

              <input name="city" value={formData.city}
                onChange={handleChange} placeholder="City"
                className="form-control mb-2" />

              <select name="state" value={formData.state}
                onChange={handleChange} className="form-control mb-2" required>
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <input name="pincode" value={formData.pincode}
                onChange={handleChange} placeholder="Pincode"
                className="form-control mb-2" />

              <select name="country" value={formData.country}
                onChange={handleChange} className="form-control mb-2" required>
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select name="contactType" value={formData.contactType}
                onChange={handleChange} className="form-control mb-2" required>
                <option value="">Select Contact Type</option>
                
              </select>

            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-success">Save</button>
              <button type="button" className="btn btn-secondary" onClick={close}>
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;