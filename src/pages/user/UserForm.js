import { useEffect, useState } from "react";
//import { getContactsCombo } from "../../services/admin/contactService";
//import { getUserRoles } from "../../services/admin/userRoleService";

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

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      //const contactRes = await getContactsCombo();
      //const roleRes = await getUserRoles();
      //setContacts(contactRes.data || []);
      //setRoles(roleRes.data || []);
    } catch (err) {
      console.error("Dropdown load failed", err);
    }
  };

  // 🔹 Select Contact → Autofill
  const handleContactSelect = (e) => {
    const id = e.target.value;
    const contact = contacts.find((c) => c.id.toString() === id);

    if (!contact) return;

    setFormData((prev) => ({
      ...prev,
      contactId: id,
      firstName: contact.first_name,
      lastName: contact.last_name,
      email: contact.email,
      mobile: contact.mobile,
      contactType: contact.contact_type_name,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Create User</h5>
              <button type="button" className="btn-close" onClick={close}></button>
            </div>

            <div className="modal-body">

              <label className="fw-bold mb-1">
                Select Contact to Create User
              </label>
              <select
                className="form-control mb-3"
                value={formData.contactId}
                onChange={handleContactSelect}
                required
              >
                <option value="">Select Contact</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.first_name} {c.last_name}
                  </option>
                ))}
              </select>

              <input className="form-control mb-2" value={formData.firstName} placeholder="First Name" disabled />
              <input className="form-control mb-2" value={formData.lastName} placeholder="Last Name" disabled />
              <input className="form-control mb-2" value={formData.email} placeholder="Email" disabled />
              <input className="form-control mb-2" value={formData.mobile} placeholder="Mobile" disabled />
              <input className="form-control mb-3" value={formData.contactType} placeholder="Contact Type" disabled />

              <input
                name="username"
                className="form-control mb-2"
                placeholder="User Name"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <select
                name="roleId"
                className="form-control"
                value={formData.roleId}
                onChange={handleChange}
                requiredgetContactsCombo
              >
                <option value="">Select User Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.role_name}
                  </option>
                ))}
              </select>

            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                Create User
              </button>
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

export default UserForm;
