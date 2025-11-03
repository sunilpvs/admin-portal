import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";

function CountryTable({
  countries,
  deleteCountry,
  editCountry,
  currentPage,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  onSearch,
  searchTerm,
}) {
  const [sortConfig, setSortConfig] = useState({ key: "country", direction: "asc" });

  // Filter countries based on search term
  const filteredCountries = countries.filter((country) =>
    country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort filtered countries
  const sortedCountries = [...filteredCountries].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;
    if (a[key].toLowerCase() < b[key].toLowerCase()) return -1 * dir;
    if (a[key].toLowerCase() > b[key].toLowerCase()) return 1 * dir;
    return 0;
  });

  const totalPages = Math.ceil(sortedCountries.length / itemsPerPage) || 1;

  // Paginate sorted countries
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCountries = sortedCountries.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (pageNum) => {
    if (onPageChange && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  const handleSort = (column) => {
    if (sortConfig.key === column) {
      setSortConfig({
        key: column,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key: column, direction: "asc" });
    }
  };

  const getSortArrow = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  return (
    <Box m="20px">
      <Header title="Country Management" subtitle="Admin/Country" />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">
        {/* Search and Items Per Page */}
        <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
          <div className="position-relative me-3 mb-2" style={{ flex: 1, minWidth: "200px" }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="form-control"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearch("")}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  fontSize: "16px",
                  cursor: "pointer",
                  color: "#b10000ff",
                }}
              >
                ×
              </button>
            )}
          </div>

          <div className="d-flex align-items-center mb-2">
            <label htmlFor="limitSelect" className="form-label me-2 mb-0 text-body">
              Items per page:
            </label>
            <select
              id="limitSelect"
              className="form-select"
              style={{ width: "250px" }}
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

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th hidden>ID</th>
                <th>Sr. No.</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("country")}>
                  Country <span style={{ float: "right" }}>{getSortArrow("country")}</span>
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("code")}>
                  Code <span style={{ float: "right" }}>{getSortArrow("code")}</span>
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("currency")}>
                  Currency <span style={{ float: "right" }}>{getSortArrow("currency")}</span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCountries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No countries found.
                  </td>
                </tr>
              ) : (
                paginatedCountries.map((data, index) => (
                  <tr key={data.id}>
                    <td hidden>{data.id}</td>
                    <td>{startIndex + index + 1}</td>
                    <td>{data.country}</td>
                    <td>{data.code}</td>
                    <td>{data.currency}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => editCountry(data)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteCountry(data.id)}
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
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="form-label me-2 mb-0 text-body">
            Showing {paginatedCountries.length} of {sortedCountries.length} matching countries
          </span>
          <div>
            <button
              className="btn btn-outline-secondary btn-sm me-1"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm me-1 ${
                  currentPage === index + 1 ? "btn-primary" : "btn-outline-secondary"
                }`}
                onClick={() => goToPage(index + 1)}
              >
                {index + 1}
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

CountryTable.propTypes = {
  countries: PropTypes.array.isRequired,
  deleteCountry: PropTypes.func.isRequired,
  editCountry: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default CountryTable;
