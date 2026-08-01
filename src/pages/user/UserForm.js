
import { useEffect, useState } from "react";
// import { getContactsCombo } from "../../services/admin/contactService";
// import { getUserRoles } from "../../services/admin/userRoleService";

const UserForm = ({ add, close }) => {
  const [contacts, setContacts] = useState([]);
  const [roles, setRoles] = useState([]);

  const [formData, setFormData] = useState({
    contactId: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    contactType: "",
    username: "",
    roleId: "",
  });

  // ==============================
  // Load Dropdowns
  // ==============================
  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      // const contactRes = await getContactsCombo();
      // const roleRes = await getUserRoles();

      // setContacts(contactRes.data || []);
      // setRoles(roleRes.data || []);
    } catch (err) {
      console.error("Dropdown load failed", err);
    }
  };

  // ==============================
  // Select Contact → Autofill
  // ==============================
  const handleContactSelect = (e) => {
    const id = e.target.value;

    const contact = contacts.find(
      (c) => c.id.toString() === id
    );

    if (!contact) {
      // Clear contact details if
      // user selects "Select Contact"
      setFormData((prev) => ({
        ...prev,
        contactId: "",
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        contactType: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      contactId: id,
      firstName: contact.first_name || "",
      lastName: contact.last_name || "",
      email: contact.email || "",
      mobile: contact.mobile || "",
      contactType:
        contact.contact_type_name || "",
    }));
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
    return (
      formData.contactId ||
      formData.firstName ||
      formData.lastName ||
      formData.email ||
      formData.mobile ||
      formData.contactType ||
      formData.username ||
      formData.roleId
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

      // User selected Cancel
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
  }, [formData]);

  // ==============================
  // Outside Click Handler
  // ==============================
  const handleOutsideClick = (e) => {
    // Close only when clicking
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
      contact_id: formData.contactId,
      username: formData.username,
      role_id: formData.roleId,
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
        background: "rgba(0,0,0,0.5)",
        zIndex: 1050,
        overflowY: "auto",
      }}
    >
      <div
        className="modal-dialog modal-xl"
        style={{
          width: "calc(100% - 40px)",
        
          margin: "80px auto 30px auto",
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

            {/* ==============================
                Header
            ============================== */}
            <div className="modal-header">
              <h5 className="modal-title">
                Create User
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              />
            </div>

            {/* ==============================
                Body
            ============================== */}
            <div
              className="modal-body"
              style={{
                maxHeight:
                  "calc(100vh - 180px)",
                overflowY: "auto",
                padding: "24px",
              }}
            >
            

              {/* Select Contact */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Select Contact to Create User
                </label>

                <select
                  className="form-select"
                  value={formData.contactId}
                  onChange={handleContactSelect}
                  required
                >
                  <option value="">
                    Select Contact
                  </option>

                  {contacts.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                    >
                      {c.first_name}{" "}
                      {c.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Information */}
              <div className="row">

                {/* First Name */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    First Name
                  </label>

                  <input
                    className="form-control"
                    value={
                      formData.firstName
                    }
                    placeholder="First Name"
                    disabled
                  />
                </div>

                {/* Last Name */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Last Name
                  </label>

                  <input
                    className="form-control"
                    value={
                      formData.lastName
                    }
                    placeholder="Last Name"
                    disabled
                  />
                </div>

                {/* Email */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    className="form-control"
                    value={
                      formData.email
                    }
                    placeholder="Email"
                    disabled
                  />
                </div>

                {/* Mobile */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Mobile
                  </label>

                  <input
                    className="form-control"
                    value={
                      formData.mobile
                    }
                    placeholder="Mobile"
                    disabled
                  />
                </div>

                {/* Contact Type */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Contact Type
                  </label>

                  <input
                    className="form-control"
                    value={
                      formData.contactType
                    }
                    placeholder="Contact Type"
                    disabled
                  />
                </div>

                {/* Username */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    User Name
                  </label>

                  <input
                    name="username"
                    className="form-control"
                    placeholder="User Name"
                    value={
                      formData.username
                    }
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Role */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    User Role
                  </label>

                  <select
                    name="roleId"
                    className="form-select"
                    value={
                      formData.roleId
                    }
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select User Role
                    </option>

                    {roles.map((r) => (
                      <option
                        key={r.id}
                        value={r.id}
                      >
                        {r.role_name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* ==============================
                Footer
            ============================== */}
            <div className="modal-footer">

              <button
                type="submit"
                className="btn btn-success"
              >
                Create User
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

export default UserForm;

