import { useEffect, useState } from "react";

const LeaveDefinitionForm = ({
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

    add({
      ...formData,
      total:
        Number(formData.casual || 0) +
        Number(formData.earned || 0) +
        Number(formData.paid || 0) +
        Number(formData.special || 0),
    });
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
                  ? "Edit Leave Definition"
                  : "Add Leave Definition"}
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={close}
              />
            </div>

            <div className="modal-body">

              <input
                type="number"
                name="year"
                placeholder="Year"
                className="form-control mb-3"
                value={formData.year || ""}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="casual"
                placeholder="Casual"
                className="form-control mb-3"
                value={formData.casual || ""}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="earned"
                placeholder="Earned"
                className="form-control mb-3"
                value={formData.earned || ""}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="paid"
                placeholder="Paid"
                className="form-control mb-3"
                value={formData.paid || ""}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="special"
                placeholder="Special"
                className="form-control mb-3"
                value={formData.special || ""}
                onChange={handleChange}
                required
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

export default LeaveDefinitionForm;