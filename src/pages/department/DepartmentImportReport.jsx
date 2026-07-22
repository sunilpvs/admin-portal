import PropTypes from "prop-types";

const hasReportErrors = (errors) => {
  if (!errors) return false;
  if (Array.isArray(errors)) return errors.length > 0;

  return Object.values(errors).some(
    (value) => Array.isArray(value) && value.length > 0
  );
};

const DepartmentImportReport = ({ message, errors }) => {
  const showErrors = hasReportErrors(errors);
  const duplicatesInExcel = errors?.duplicates_in_excel || [];
  const duplicatesInDb = errors?.duplicates_in_db || [];

  const excelValidationErrors = duplicatesInExcel.filter((item) => item.Error);
  const excelDuplicateRows = duplicatesInExcel.filter((item) => !item.Error);

  return (
    <div className="mt-4">
      <div
        className={`alert ${showErrors ? "alert-warning" : "alert-success"} mb-3`}
        role="alert"
      >
        <strong>{showErrors ? "Import completed with warnings" : "Import successful"}</strong>
        <div className="mt-1">{message}</div>
      </div>

      {!showErrors && (
        <p className="text-success mb-0">
          All records were validated and inserted without any duplicates or errors.
        </p>
      )}

      {excelValidationErrors.length > 0 && (
        <div className="mb-4">
          <h6 className="text-danger fw-semibold mb-2">Validation Errors</h6>
          <div className="table-responsive">
            <table className="table table-sm table-bordered align-middle mb-0">
              <thead className="table-danger">
                <tr>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {excelValidationErrors.map((item, index) => (
                  <tr key={`validation-${index}`}>
                    <td>{item.Error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {excelDuplicateRows.length > 0 && (
        <div className="mb-4">
          <h6 className="text-dark fw-semibold mb-2">Duplicates in Excel</h6>
          <div className="table-responsive">
            <table className="table table-sm table-bordered align-middle mb-0">
              <thead className="table-warning">
                <tr>
                  <th>Row Number</th>
                  <th>Unit</th>
                  <th>Department</th>
                  <th>Code</th>
                </tr>
              </thead>
              <tbody>
                {excelDuplicateRows.map((item, index) => (
                  <tr key={`excel-dup-${index}`}>
                    <td>{item.row_number ?? "-"}</td>
                    <td>{item.data?.unit ?? item.data?.name ?? "-"}</td>
                    <td>{item.data?.department ?? "-"}</td>
                    <td>{item.data?.code ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {duplicatesInDb.length > 0 && (
        <div>
          <h6 className="text-dark fw-semibold mb-2">Duplicates in Database</h6>
          <div className="table-responsive">
            <table className="table table-sm table-bordered align-middle mb-0">
              <thead className="table-info">
                <tr>
                  <th>Name</th>
                  <th>Unit</th>
                  <th>Department</th>
                  <th>Code</th>
                </tr>
              </thead>
              <tbody>
                {duplicatesInDb.map((item, index) => (
                  <tr key={`db-dup-${index}`}>
                    <td>{item.name ?? "-"}</td>
                    <td>{item.unit ?? "-"}</td>
                    <td>{item.department ?? "-"}</td>
                    <td>{item.code ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

DepartmentImportReport.propTypes = {
  message: PropTypes.string,
  errors: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default DepartmentImportReport;
