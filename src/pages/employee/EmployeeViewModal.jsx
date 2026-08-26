import PropTypes from "prop-types";

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return String(value);
};

const DetailField = ({ label, value }) => (
  <div className="col-md-4 mb-3">
    <label className="form-label text-muted small mb-1">{label}</label>
    <div className="form-control bg-light">{formatValue(value)}</div>
  </div>
);

DetailField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const EmployeeViewModal = ({ employee, loading, close }) => {
  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{
        position: "fixed",
        top: 0,
        left: "150px",
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 1060,
        overflowY: "auto",
      }}
    >
      <div
        className="modal-dialog modal-xl"
        style={{
          width: "calc(100% - 40px)",
          margin: "30px auto",
        }}
      >
        <div className="modal-content" style={{ borderRadius: "8px" }}>
          <div className="modal-header">
            <h5 className="modal-title">Employee Details</h5>
            <button type="button" className="btn-close" onClick={close} />
          </div>

          <div
            className="modal-body"
            style={{
              maxHeight: "calc(100vh - 180px)",
              overflowY: "auto",
              padding: "24px",
            }}
          >
            {loading ? (
              <div className="text-center py-5 text-muted">Loading employee details...</div>
            ) : !employee ? (
              <div className="text-center py-5 text-muted">No employee details found.</div>
            ) : (
              <>
                <h5 className="border-bottom pb-2 mb-3">Basic Information</h5>
                <div className="row">
                  <DetailField label="Display Name" value={employee.display_name} />
                  <DetailField label="First Name" value={employee.first_name} />
                  <DetailField label="Last Name" value={employee.last_name} />
                  <DetailField label="Date of Birth" value={employee.dob} />
                  <DetailField label="Email" value={employee.email} />
                  <DetailField label="Personal Email" value={employee.personal_email} />
                  <DetailField label="Mobile" value={employee.mobile} />
                  <DetailField label="Employee Code" value={employee.emp_code || employee.old_emp_code} />
                  <DetailField label="Employee Status" value={employee.emp_status === 1 || employee.emp_status === "1" ? "Active" : employee.emp_status === 0 || employee.emp_status === "0" ? "Inactive" : employee.emp_status || "—"} />
                  <DetailField label="Employee Type" value={employee.emp_type} />
                  <DetailField label="Joining Date" value={employee.joining_date} />
                  <DetailField label="Exit Date" value={employee.exit_date} />
                  <DetailField label="M365" value={employee.m365} />
                  <DetailField label="Old Employee Code" value={employee.old_emp_code} />
                </div>

                <h5 className="border-bottom pb-2 mb-3 mt-4">Organization</h5>
                <div className="row">
                  <DetailField label="Entity" value={employee.entity_name} />
                  <DetailField label="Department" value={employee.department} />
                  <DetailField label="Designation" value={employee.designation} />
                </div>

                <h5 className="border-bottom pb-2 mb-3 mt-4">Address</h5>
                <div className="row">
                  <DetailField label="Address 1" value={employee.add1} />
                  <DetailField label="Address 2" value={employee.add2} />
                  <DetailField label="City" value={employee.city} />
                  <DetailField label="State" value={employee.state} />
                  <DetailField label="Country" value={employee.country} />
                  <DetailField label="PIN" value={employee.pin} />
                </div>

                <h5 className="border-bottom pb-2 mb-3 mt-4">Identity & Financial</h5>
                <div className="row">
                  <DetailField label="Aadhar" value={employee.aadhar} />
                  <DetailField label="UAN" value={employee.uan} />
                  <DetailField label="PAN" value={employee.pan} />
                  <DetailField label="ESI No" value={employee.esi} />
                  <DetailField label="Bank Name" value={employee.bank_name} />
                  <DetailField label="Account No" value={employee.bank_account_no} />
                  <DetailField label="IFSC Code" value={employee.ifsc_code} />
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={close}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

EmployeeViewModal.propTypes = {
  employee: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default EmployeeViewModal;
