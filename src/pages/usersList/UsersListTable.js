import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Header from "../../components/Header";

function UsersListTable({
  users,
  currentUserEmail,
  onSearch,
  searchTerm,
  page,
  setPage,
  limit,
  setLimit,
  totalPages,
  onDelete,
  handleExportExcel, // 👈 add this prop
}) {
  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    }
  };

  return (
    <Box m="20px">
      <Header title="Users List" />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">

        {/* 🔍 Search + Export + Limit */}
        <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">

          {/* Search */}
          <div
            className="position-relative me-3 mb-2"
            style={{ flex: 1, minWidth: "220px" }}
          >
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="form-control"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearch("")}
                className="btn btn-sm position-absolute"
                style={{
                  right: "6px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                ×
              </button>
            )}
          </div>

          {/* Export + Limit */}
          <div className="d-flex align-items-center mb-2">

           

            <label htmlFor="limitSelect" className="form-label me-2 mb-0 text-body">
              Items per page:
            </label>
            <select
              id="limitSelect"
              className="form-select"
              style={{ width: "140px" }}
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value, 10));
                setPage(1);
              }}
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
             {/* ✅ Export Excel button with LEFT MARGIN */}
            <button
              className="btn btn-success me-3 ms-3"
              onClick={handleExportExcel}
            >
              Export Excel
            </button>
          </div>
        </div>

        {/* 📋 Table */}
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Access Module</th>
                <th>User Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-muted text-center">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.user_email}</td>
                    <td>{user.access_level}</td>
                    <td>{user.user_role}</td>
                    <td>
                      {user?.user_email && currentUserEmail ? (
                        user.user_email !== currentUserEmail &&
                        user.module_id !== 2 ? (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              onDelete(user.user_email, user.module_id)
                            }
                          >
                            Delete
                          </button>
                        ) : (
                          <span className="text-muted">Not allowed</span>
                        )
                      ) : (
                        <span className="text-muted">Loading...</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 📄 Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="form-label me-2 mb-0 text-body">
            Showing {users.length} users on this page
          </span>

          <div>
            <button
              className="btn btn-outline-secondary btn-sm me-1"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm me-1 ${
                  page === index + 1
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => goToPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Box>
  );
}

UsersListTable.propTypes = {
  users: PropTypes.array.isRequired,
  currentUserEmail: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
  setLimit: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  handleExportExcel: PropTypes.func.isRequired,
};

export default UsersListTable;
