
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getBranches } from "../../services/hr/holidayCalendarService";

const normalizeBranchOptions = (response) => {
  const raw = Array.isArray(response)
    ? response
    : response?.data ||
      response?.branches ||
      [];

  return raw.map((item) =>
    typeof item === "string"
      ? item
      : item.branch_name ||
        item.name ||
        item.branch
  );
};

const LeaveCalendarForm = ({
  data,
  add,
  close,
  editMode,
}) => {
  const [formData, setFormData] = useState({
    holiday_name: "",
    holiday_date: "",
    branches: [],
    description: "",
    id: "",
  });

  const [branchOptions, setBranchOptions] =
    useState([]);

  // ==============================
  // Load Form Data
  // ==============================
  useEffect(() => {
    setFormData({
      holiday_name:
        data?.holiday_name || "",

      holiday_date:
        data?.holiday_date || "",

      branches:
        Array.isArray(data?.branches)
          ? data.branches
          : [],

      description:
        data?.description || "",

      id: data?.id || "",
    });
  }, [data]);

  // ==============================
  // Fetch Branch Options
  // ==============================
  useEffect(() => {
    const fetchBranchOptions = async () => {
      try {
        const res = await getBranches();

        setBranchOptions(
          normalizeBranchOptions(res)
        );
      } catch (error) {
        console.error(
          "Failed to fetch branches:",
          error
        );

        toast.error(
          "Failed to load branches."
        );
      }
    };

    fetchBranchOptions();
  }, []);

  // ==============================
  // Handle Input Change
  // ==============================
  const handleChange = (e) => {
    const {
      name,
      value,
      selectedOptions,
    } = e.target;

    // Multiple Branch Selection
    if (name === "branches") {
      const selectedBranches =
        Array.from(
          selectedOptions,
          (option) => option.value
        );

      setFormData((prev) => ({
        ...prev,
        branches: selectedBranches,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ==============================
  // Compare Branch Arrays
  // ==============================
  const areBranchesEqual = (
    currentBranches = [],
    originalBranches = []
  ) => {
    if (
      currentBranches.length !==
      originalBranches.length
    ) {
      return false;
    }

    const currentSorted = [
      ...currentBranches,
    ].sort();

    const originalSorted = [
      ...originalBranches,
    ].sort();

    return currentSorted.every(
      (branch, index) =>
        branch === originalSorted[index]
    );
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
        (formData.holiday_name &&
          formData.holiday_name.trim() !== "") ||

        formData.holiday_date ||

        (formData.branches &&
          formData.branches.length > 0) ||

        (formData.description &&
          formData.description.trim() !== "")
      );
    }

    // ==============================
    // EDIT MODE
    // ==============================
    const originalBranches =
      Array.isArray(data?.branches)
        ? data.branches
        : [];

    return (
      (formData.holiday_name || "") !==
        (data?.holiday_name || "") ||

      (formData.holiday_date || "") !==
        (data?.holiday_date || "") ||

      !areBranchesEqual(
        formData.branches || [],
        originalBranches
      ) ||

      (formData.description || "") !==
        (data?.description || "")
    );
  };

  // ==============================
  // Close Form Confirmation
  // ==============================
  const handleClose = () => {
    if (isFormDirty()) {
      const confirmClose =
        window.confirm(
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

    add(formData);
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

            {/* ==============================
                Header
            ============================== */}
            <div className="modal-header">
              <h5 className="modal-title">
                {editMode
                  ? "Edit Holiday"
                  : "Add Holiday"}
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

              {/* Holiday Name */}
              <div className="col-md-6 mb-3">
                <label className="for.m-label">
                  Holiday Name
                </label>

                <input
                  type="text"
                  name="holiday_name"
                  placeholder="Holiday Name"
                  value={
                    formData.holiday_name ||
                    ""
                  }
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Holiday Date */}
             <div className="col-md-6 mb-3">
                <label className="form-label">
                  Holiday Date
                </label>

                <input
                  type="date"
                  name="holiday_date"
                  value={
                    formData.holiday_date ||
                    ""
                  }
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Branches */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Branches
                </label>

                <select
                  multiple
                  name="branches"
                  value={
                    formData.branches || []
                  }
                  onChange={handleChange}
                  className="form-select"
                  style={{
                    height: "120px",
                  }}
                  required
                >
                  {branchOptions.map(
                    (branch) => (
                      <option
                        key={branch}
                        value={branch}
                      >
                        {branch}
                      </option>
                    )
                  )}
                </select>

                <small className="text-muted">
                  Hold Ctrl and select
                  multiple branches
                </small>
              </div>

              {/* Description */}
             <div className="col-md-6 mb-3">
                <label className="form-label">
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Description"
                  value={
                    formData.description ||
                    ""
                  }
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
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

export default LeaveCalendarForm;

