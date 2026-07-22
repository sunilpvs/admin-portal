import { useState, useEffect } from "react";

const LeavePolicyForm = ({
  data,
  add,
  close,
  editMode,
}) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
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
        style={{
          marginLeft: "auto",
          marginRight: "30%",
        }}
      >
        <div className="modal-content">

          <form onSubmit={handleSubmit}>

            <div className="modal-header">
              <h5 className="modal-title">
                {editMode
                  ? "Edit Leave Policy"
                  : "Add Leave Policy"}
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={close}
              />
            </div>

            <div className="modal-body">

              <select
                name="leave_type"
                value={formData.leave_type || ""}
                onChange={handleChange}
                className="form-control mb-3"
                required
              >
                <option value="">
                  Select Leave Type
                </option>
                <option value="Casual Leave">
                  Casual Leave
                </option>
                <option value="Earned Leave">
                  Earned Leave
                </option>
                <option value="Sick Leave">
                  Sick Leave
                </option>
                <option value="Special Leave">
                  Special Leave
                </option>
              </select>

              <input
                type="number"
                name="annual_quota"
                placeholder="Annual Quota"
                value={formData.annual_quota || ""}
                onChange={handleChange}
                className="form-control mb-3"
                required
              />

              <input
                type="number"
                name="year"
                placeholder="Year"
                value={formData.year || ""}
                onChange={handleChange}
                className="form-control mb-3"
                required
              />

              <select
                name="carry_forward"
                value={
                  formData.carry_forward || ""
                }
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">
                  Select Carry Forward
                </option>
                <option value="Yes">
                  Yes
                </option>
                <option value="No">
                  No
                </option>
              </select>

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

export default LeavePolicyForm;