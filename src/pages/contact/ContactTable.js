import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";

function ContactTable({
  contacts,
  deleteContact,
  editContact,
  currentPage,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  onSearch,
  searchTerm,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "first_name",
    direction: "asc",
  });

  // 🔍 Search filter
  const filteredContacts = contacts.filter((c) =>
    [
      c.first_name,
      c.last_name,
      c.email,
      c.mobile,
      c.city,
      c.state_name,
      c.country_name,
      c.contact_type_name,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // 🔃 Sorting
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;
    const valA = a[key]?.toString().toLowerCase() || "";
    const valB = b[key]?.toString().toLowerCase() || "";
    if (valA < valB) return -1 * dir;
    if (valA > valB) return 1 * dir;
    return 0;
  });

  // 📄 Pagination
  const totalPages = Math.ceil(sortedContacts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = sortedContacts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) onPageChange(page);
  };

  // ↕ Sorting handler
  const handleSort = (column) => {
    setSortConfig((prev) => ({
      key: column,
      direction:
        prev.key === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortArrow = (column) =>
    sortConfig.key === column
      ? sortConfig.direction === "asc"
        ? "▲"
        : "▼"
      : "";

  return (
    <Box m="20px">
      <Header title="Contact Management" subtitle="Admin / Contacts" />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">

        {/* Search + Limit */}
        <div className="d-flex justify-content-between mb-3 flex-wrap">
          <input
            type="text"
            className="form-control mb-2"
            style={{ maxWidth: "300px" }}
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />

          <select
            className="form-select mb-2"
            style={{ width: "200px" }}
            value={itemsPerPage}
            onChange={(e) => {
              onLimitChange(Number(e.target.value));
              onPageChange(1);
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Sr</th>
                <th onClick={() => handleSort("first_name")} style={{ cursor: "pointer" }}>
                  First Name {getSortArrow("first_name")}
                </th>
                <th onClick={() => handleSort("last_name")} style={{ cursor: "pointer" }}>
                  Last Name {getSortArrow("last_name")}
                </th>
                <th>Email</th>
                <th>Mobile</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
                <th>Contact Type</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedContacts.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-muted">
                    No contacts found
                  </td>
                </tr>
              ) : (
                paginatedContacts.map((c, i) => (
                  <tr key={c.id}>
                    <td>{startIndex + i + 1}</td>
                    <td>{c.first_name}</td>
                    <td>{c.last_name}</td>
                    <td>{c.email}</td>
                    <td>{c.mobile}</td>
                    <td>{c.city}</td>
                    <td>{c.state_name}</td>
                    <td>{c.country_name}</td>
                    <td>{c.contact_type_name}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => editContact(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteContact(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between mt-3">
          <span>
            Showing {paginatedContacts.length} of {sortedContacts.length}
          </span>
          <div>
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm me-1 ${
                  currentPage === i + 1
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Box>
  );
}

ContactTable.propTypes = {
  contacts: PropTypes.array.isRequired,
  deleteContact: PropTypes.func.isRequired,
  editContact: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default ContactTable;
