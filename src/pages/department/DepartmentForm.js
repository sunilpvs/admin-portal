import { useState, useEffect } from "react";
import { getStatusByModule } from "../../services/admin/statusService";

const DepartmentForm = ({ data, add, close, editMode }) => {
  const [statusOptions, setStatusOptions] = useState([]);
  const [formData, setFormData] = useState({
    unit: "",
    department: "",
    code: "",
    status: "",
  });

  useEffect(() => {
    setFormData({
      id: data?.id || undefined,
      unit: data?.unit || "",
      department: data?.department || "",
      code: data?.code || "",
      status: data?.status_id?.toString() || "",
    });
    fetchStatusOptions();
  }, [data]);

  const fetchStatusOptions = async () => {
    try {
      const response = await getStatusByModule(["gen"]);
      setStatusOptions(response.data);
    } catch (err) {
      console.error("Failed to fetch status options:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      unit: formData.unit.trim(),
      department: formData.department.trim(),
      code: formData.code.trim(),
      status: parseInt(formData.status, 10),
    };

    if (formData.id) {
      payload.id = formData.id;
    }

    add(payload);
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {editMode ? "Edit Department" : "Add Department"}
              </h5>
              <button type="button" className="btn-close" onClick={close}></button>
            </div>
            <div className="modal-body">
              <input
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="Unit"
                className="form-control mb-2"
                required
              />
              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department"
                className="form-control mb-2"
                required
              />
              <input
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Code"
                className="form-control mb-2"
                required
              />
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
              <button type="submit" className="btn btn-success">
                Save
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

export default DepartmentForm;
