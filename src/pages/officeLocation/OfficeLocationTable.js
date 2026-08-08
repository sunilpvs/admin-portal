import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Header from "../../components/Header";

function OfficeLocationTable({
  officeLocations,
  total,
  currentPage,
  itemsPerPage,
  loading,
  onPageChange,
  onLimitChange,
  onEdit,
}) {
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  return (
    <Box m="20px">
      <Header title="Office Location Management" subtitle="System Config / Office Locations" />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">
        <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
          <div />

          <div className="d-flex align-items-center mb-2">
            <label className="form-label me-2 mb-0 text-body">Items per page:</label>
            <select
              className="form-select"
              style={{ width: "120px" }}
              value={itemsPerPage}
              onChange={(e) => {
                onLimitChange(parseInt(e.target.value, 10));
                onPageChange(1);
              }}
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Sr. No.</th>
                <th>Name</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Zip</th>
                {/* <th>Country</th>
                <th>Office</th> */}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-muted">
                    Loading office locations...
                  </td>
                </tr>
              ) : officeLocations.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-muted">
                    No office locations found.
                  </td>
                </tr>
              ) : (
                officeLocations.map((item, index) => (
                  <tr key={item.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.address}</td>
                    <td>{item.city}</td>
                    <td>{item.state}</td>
                    <td>{item.zip}</td>
                    {/* <td>{item.country}</td>
                    <td>{item.office}</td> */}
                    <td>{Number(item.status) === 1 ? "Active" : "Inactive"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
          <span className="text-body">
            Showing {officeLocations.length} of {total} office locations
          </span>

          <div>
            <button
              className="btn btn-outline-secondary btn-sm me-1"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm me-1 ${
                  currentPage === i + 1 ? "btn-primary" : "btn-outline-secondary"
                }`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Box>
  );
}

OfficeLocationTable.propTypes = {
  officeLocations: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default OfficeLocationTable;