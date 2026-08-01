
import { useState, useEffect } from "react";
import { getCountryCombo } from "../../services/admin/countryService";
import { getStateCombo } from "../../services/admin/stateService";
// import { getContactTypeCombo } from "../../services/admin/contactTypeService";

const ContactForm = ({
  data,
  add,
  close,
  editMode,
}) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  // const [contactTypes, setContactTypes] = useState([]);

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
    id: "",
  });

  // ==============================
  // Load Form Data
  // ==============================
  useEffect(() => {
    if (data) {
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        dob: data.dob || "",
        email: data.email || "",
        mobile: data.mobile || "",
        address1: data.address1 || "",
        address2: data.address2 || "",
        city: data.city || "Bengaluru",
        state: data.state?.toString() || "",
        pincode: data.pincode || "",
        country: data.country?.toString() || "",
        contactType:
          data.contactType?.toString() || "",
        id: data.id || "",
      });
    } else {
      // Reset form for Add Mode
      setFormData({
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
        id: "",
      });
    }
  }, [data]);

  // ==============================
  // Fetch Dropdowns
  // ==============================
  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const countryRes =
        await getCountryCombo();

      const stateRes =
        await getStateCombo();

      // const contactTypeRes =
      //   await getContactTypeCombo();

      setCountries(
        countryRes?.data || []
      );

      setStates(
        stateRes?.data || []
      );

      // setContactTypes(
      //   contactTypeRes?.data || []
      // );
    } catch (err) {
      console.error(
        "Dropdown fetch failed",
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
        (formData.firstName &&
          formData.firstName.trim() !== "") ||
        (formData.lastName &&
          formData.lastName.trim() !== "") ||
        formData.dob ||
        (formData.email &&
          formData.email.trim() !== "") ||
        (formData.mobile &&
          formData.mobile.trim() !== "") ||
        (formData.address1 &&
          formData.address1.trim() !== "") ||
        (formData.address2 &&
          formData.address2.trim() !== "") ||
        (formData.city &&
          formData.city !== "Bengaluru") ||
        formData.state ||
        (formData.pincode &&
          formData.pincode.trim() !== "") ||
        formData.country ||
        formData.contactType
      );
    }

    // ==============================
    // Edit Mode
    // ==============================
    return (
      (formData.firstName || "") !==
        (data?.firstName || "") ||

      (formData.lastName || "") !==
        (data?.lastName || "") ||

      (formData.dob || "") !==
        (data?.dob || "") ||

      (formData.email || "") !==
        (data?.email || "") ||

      (formData.mobile || "") !==
        (data?.mobile || "") ||

      (formData.address1 || "") !==
        (data?.address1 || "") ||

      (formData.address2 || "") !==
        (data?.address2 || "") ||

      (formData.city || "") !==
        (data?.city || "") ||

      String(formData.state || "") !==
        String(data?.state || "") ||

      (formData.pincode || "") !==
        (data?.pincode || "") ||

      String(formData.country || "") !==
        String(data?.country || "") ||

      String(formData.contactType || "") !==
        String(data?.contactType || "")
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
      ...formData,
    };

    // Include ID when editing
    if (data?.id) {
      payload.id = data.id;
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
                  ? "Edit Contact"
                  : "Add Contact"}
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

                {/* First Name */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    First Name
                  </label>

                  <input
                    name="firstName"
                    value={
                      formData.firstName || ""
                    }
                    onChange={handleChange}
                   
                    className="form-control"
                    required
                  />
                </div>

                {/* Last Name */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Last Name
                  </label>

                  <input
                    name="lastName"
                    value={
                      formData.lastName || ""
                    }
                    onChange={handleChange}
                   
                    className="form-control"
                  />
                </div>

                {/* Date of Birth */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="dob"
                    value={
                      formData.dob || ""
                    }
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                {/* Email */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email || ""
                    }
                    onChange={handleChange}
                
                    className="form-control"
                  />
                </div>

                {/* Mobile */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Mobile
                  </label>

                  <input
                    name="mobile"
                    value={
                      formData.mobile || ""
                    }
                    onChange={handleChange}
                  
                    className="form-control"
                    required
                  />
                </div>

                {/* City */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    City
                  </label>

                  <input
                    name="city"
                    value={
                      formData.city || ""
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
                    name="address1"
                    value={
                      formData.address1 || ""
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
                    name="address2"
                    value={
                      formData.address2 || ""
                    }
                    onChange={handleChange}
                    
                    className="form-control"
                  />
                </div>

                {/* State */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    State
                  </label>

                  <select
                    name="state"
                    value={
                      formData.state || ""
                    }
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">
                      Select State
                    </option>

                    {states.map((s) => (
                      <option
                        key={s.id}
                        value={s.id}
                      >
                        {s.name ||
                          s.state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pincode */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Pincode
                  </label>

                  <input
                    name="pincode"
                    value={
                      formData.pincode || ""
                    }
                    onChange={handleChange}
                  
                    className="form-control"
                  />
                </div>

                {/* Country */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Country
                  </label>

                  <select
                    name="country"
                    value={
                      formData.country || ""
                    }
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">
                      Select Country
                    </option>

                    {countries.map((c) => (
                      <option
                        key={c.id}
                        value={c.id}
                      >
                        {c.name ||
                          c.country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contact Type */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Contact Type
                  </label>

                  <select
                    name="contactType"
                    value={
                      formData.contactType ||
                      ""
                    }
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">
                      Select Contact Type
                    </option>

                    {/* Contact Type options
                        can be added here */}
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

export default ContactForm;
