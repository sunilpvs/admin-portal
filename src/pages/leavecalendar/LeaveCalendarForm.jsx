import { useEffect, useState } from "react";



const LeaveCalendarForm = ({
  data,
  add,
  close,
  editMode,
}) => {
  const [formData, setFormData] = useState(data);

  const [branchOptions] = useState([
  "Hyderabad",
  "Bangalore",
  "Chennai",
  "Mumbai",
  "Pune",
]);

  useEffect(() => {
    setFormData(data);
  }, [data]);

const handleChange = (e) => {
  const { name, value, selectedOptions } = e.target;

  if (name === "branches") {
    const selectedBranches = Array.from(
      selectedOptions,
      (option) => option.value
    );

    setFormData({
      ...formData,
      branches: selectedBranches,
    });
  } else {
    setFormData({
      ...formData,
      [name]: value,
    });
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    add(formData);
  };

  return (
    <div
      className="modal d-block"
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
                {editMode
                  ? "Edit Holiday"
                  : "Add Holiday"}
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={close}
              ></button>
            </div>

            <div className="modal-body">

              <input
                type="text"
                name="holiday_name"
                placeholder="Holiday Name"
                value={formData.holiday_name || ""}
                onChange={handleChange}
                className="form-control mb-3"
                required
              />

              <input
                type="date"
                name="holiday_date"
                value={formData.holiday_date || ""}
                onChange={handleChange}
                className="form-control mb-3"
                required
              />

            <div className="mb-3">
  <label className="form-label">Branches</label>

  <select
    multiple
    name="branches"
    value={formData.branches || []}
    onChange={handleChange}
    className="form-control"
    style={{ height: "120px" }}
    required
  >
    {branchOptions.map((branch) => (
      <option key={branch} value={branch}>
        {branch}
      </option>
    ))}
  </select>

  <small className="text-muted">
    Hold Ctrl and select multiple branches
  </small>
</div>

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description || ""}
                onChange={handleChange}
                className="form-control"
                rows="3"
              />

            </div>

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

export default LeaveCalendarForm;