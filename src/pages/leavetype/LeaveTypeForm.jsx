import { useState, useEffect } from "react";

const LeaveTypeForm = ({
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
                  ? "Edit Leave Type"
                  : "Add Leave Type"}
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
                name="leave_type_name"
                placeholder="Leave Type Name"
                value={formData.leave_type_name || ""}
                onChange={handleChange}
                className="form-control mb-3"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                rows="4"
                value={formData.description || ""}
                onChange={handleChange}
                className="form-control"
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

export default LeaveTypeForm;