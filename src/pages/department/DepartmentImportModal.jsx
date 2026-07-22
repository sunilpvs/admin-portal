import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import { addDepartment } from "../../services/admin/departmentService";
import DepartmentImportReport from "./DepartmentImportReport";

const ACCEPTED_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

const isExcelFile = (file) => {
  if (!file) return false;
  const extension = file.name.split(".").pop()?.toLowerCase();
  return (
    extension === "xlsx" ||
    extension === "xls" ||
    ACCEPTED_TYPES.includes(file.type)
  );
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.error || fallback;

const DepartmentImportModal = ({ close, onImportComplete }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleFileSelection = (file) => {
    if (!file) return;

    if (!isExcelFile(file)) {
      toast.error("Please upload a valid Excel file (.xlsx or .xls).");
      return;
    }

    setSelectedFile(file);
    setImportResult(null);
    toast.success(`File "${file.name}" ready for import.`);
  };

  const handleInputChange = (event) => {
    handleFileSelection(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileSelection(event.dataTransfer.files?.[0]);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImportResult(null);
  };

  const handleImport = async () => {
    if (!selectedFile || isImporting) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsImporting(true);
    setImportResult(null);

    try {
      const response = await addDepartment(formData);
      const result = response?.data || {};

      setImportResult(result);
      toast.success(result.message || "Data imported and inserted successfully.");
      onImportComplete?.();
    } catch (error) {
      console.error("Import failed:", error);
      toast.error(getErrorMessage(error, "Failed to import departments."));
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-semibold">Import Departments</h5>
            <button
              type="button"
              className="btn-close"
              onClick={close}
              disabled={isImporting}
            ></button>
          </div>

          <div className="modal-body">
            <p className="text-muted mb-3">
              Upload the filled Excel template to bulk import departments. Supported
              formats: <strong>.xlsx</strong>, <strong>.xls</strong>
            </p>

            <div
              className={`border rounded-3 p-4 text-center ${
                isDragging ? "border-primary bg-primary bg-opacity-10" : "border-secondary"
              }`}
              style={{
                borderStyle: "dashed",
                cursor: isImporting ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isImporting && fileInputRef.current?.click()}
            >
              <div className="mb-2">
                <span style={{ fontSize: "2rem" }}>📄</span>
              </div>
              <h6 className="mb-1">Drag & drop your Excel file here</h6>
              <p className="text-muted mb-3">or</p>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                disabled={isImporting}
                onClick={(event) => {
                  event.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Browse from computer
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                hidden
                onChange={handleInputChange}
              />
            </div>

            {selectedFile && (
              <div className="alert alert-light border d-flex justify-content-between align-items-center mt-3 mb-0">
                <div>
                  <strong>{selectedFile.name}</strong>
                  <div className="text-muted small">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                {!isImporting && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleRemoveFile}
                  >
                    Remove
                  </button>
                )}
              </div>
            )}

            {isImporting && (
              <div className="mt-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-primary fw-semibold">Importing...</span>
                  <span className="text-muted small">Please wait</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                    role="progressbar"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
            )}

            {importResult && !isImporting && (
              <DepartmentImportReport
                message={importResult.message}
                errors={importResult.errors}
              />
            )}
          </div>

          <div className="modal-footer bg-light">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={close}
              disabled={isImporting}
            >
              {importResult ? "Close" : "Cancel"}
            </button>
            <button
              type="button"
              className={`btn ${selectedFile ? "btn-success" : "btn-outline-success"}`}
              onClick={handleImport}
              disabled={!selectedFile || isImporting}
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DepartmentImportModal.propTypes = {
  close: PropTypes.func.isRequired,
  onImportComplete: PropTypes.func,
};

export default DepartmentImportModal;
