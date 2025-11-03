import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const StatusForm = ({ data, add, close, editMode }) => {
  const [formData, setFormData] = useState(data || { code: "", status: "", module: "" });

  useEffect(() => {
    setFormData(data || { code: "", status: "", module: "" });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.status || !formData.module) {
      toast.error("Please fill all fields");
      return;
    }
    add(formData);
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered" style={{ marginLeft: "auto", marginRight: "30%" }}>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{editMode ? "Edit Status" : "Add Status"}</h5>
              <button type="button" className="btn-close" onClick={close}></button>
            </div>
            <div className="modal-body">
              <input
                name="code"
                value={formData.code || ""}
                onChange={handleChange}
                placeholder="Code"
                className="form-control mb-2"
                required
              />

              <input
                  name="status"
                  value={formData.status || ""}
                  onChange={handleChange}
                  placeholder="Status"
                  className="form-control mb-2"
                  required
              />

              <input
                  name="module"
                  value={formData.module || ""}
                  onChange={handleChange}
                  placeholder="Module"
                  className="form-control mb-2"
                  required
              />
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

export default StatusForm;