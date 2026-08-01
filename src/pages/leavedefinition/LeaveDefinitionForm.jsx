
import { useEffect, useState } from "react";

const LeaveDefinitionForm = ({
  data,
  add,
  close,
  editMode,
}) => {
  const [formData, setFormData] = useState({
    year: "",
    casual: "",
    earned: "",
    paid: "",
    special: "",
    id: "",
  });

  // ==============================
  // Load Form Data
  // ==============================
  useEffect(() => {
    setFormData({
      year: data?.year || "",
      casual: data?.casual || "",
      earned: data?.earned || "",
      paid: data?.paid || "",
      special: data?.special || "",
      id: data?.id || "",
    });
  }, [data]);

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
    // ADD MODE
    // ==============================
    if (!editMode) {
      return (
        formData.year !== "" ||
        formData.casual !== "" ||
        formData.earned !== "" ||
        formData.paid !== "" ||
        formData.special !== ""
      );
    }

    // ==============================
    // EDIT MODE
    // ==============================
    return (
      String(formData.year || "") !==
        String(data?.year || "") ||

      String(formData.casual || "") !==
        String(data?.casual || "") ||

      String(formData.earned || "") !==
        String(data?.earned || "") ||

      String(formData.paid || "") !==
        String(data?.paid || "") ||

      String(formData.special || "") !==
        String(data?.special || "")
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
    // Close only when clicking
    // the dark background
    if (
      e.target === e.currentTarget
    ) {
      handleClose();
    }
  };

  // ==============================
  // Submit
  // ==============================
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
            "150px auto 30px auto",
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

            {/* ==============================
                Header
            ============================== */}
            <div className="modal-header">
              <h5 className="modal-title">
                {editMode
                  ? "Edit Leave Definition"
                  : "Add Leave Definition"}
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
             

              <div className="row">

                {/* Year */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Year
                  </label>

                  <input
                    type="number"
                    name="year"
                   
                    className="form-control"
                    value={
                      formData.year || ""
                    }
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Casual */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Casual
                  </label>

                  <input
                    type="number"
                    name="casual"
                    
                    className="form-control"
                    value={
                      formData.casual || ""
                    }
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Earned */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Earned
                  </label>

                  <input
                    type="number"
                    name="earned"
                   
                    className="form-control"
                    value={
                      formData.earned || ""
                    }
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Paid */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Paid
                  </label>

                  <input
                    type="number"
                    name="paid"
                  
                    className="form-control"
                    value={
                      formData.paid || ""
                    }
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Special */}
               <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Special
                  </label>

                  <input
                    type="number"
                    name="special"
                   
                    className="form-control"
                    value={
                      formData.special || ""
                    }
                    onChange={handleChange}
                    required
                  />
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

export default LeaveDefinitionForm;

