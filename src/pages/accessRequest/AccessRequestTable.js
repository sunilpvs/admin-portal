import PropTypes from "prop-types";
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import Header from "../../components/Header";
import {useState} from "react";

function AccessReqTable({accessrequests, updateStatus, onSearch, searchTerm}) {
    const [processingId, setProcessingId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedModule, setSelectedModule] = useState("");  // Store the requested module
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredRequests = accessrequests.filter((item) =>
        `${item.requestor_name} ${item.requested_module} ${item.email}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

    const handleOpenModal = (id, module) => {
        setSelectedUserId(id);
        setSelectedRole("");
        setSelectedModule(module);  // Set the requested module
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedUserId(null);
        setSelectedRole("");
        setSelectedModule("");  // Clear the module
    };

    const handleConfirmApproval = () => {
        if (!selectedRole) {
            alert("Please select a role before approving.");
            return;
        }
        setProcessingId(selectedUserId);
        updateStatus(selectedUserId, 11, Number(selectedRole)).finally(() => {
            setProcessingId(null);
            handleCloseModal();
        });
    };

    const handleRejectApproval = () => {
      setProcessingId(selectedUserId);
      updateStatus(selectedUserId, 12).finally(() => {
        setProcessingId(null);
        handleCloseModal();
      });
    }

    const goToPage = (pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };

    return (
        <Box m="20px">
            <Header title="Access Requests" subtitle="Admin Panel / Access Control"/>

            <div className="container mt-4 p-3 bg-white rounded shadow-sm">
                {/* Search */}
                <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
                    <div className="position-relative me-3 mb-2" style={{flex: 1, minWidth: "100px"}}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name, email or module..."
                            value={searchTerm}
                            onChange={(e) => {
                                onSearch(e.target.value);
                                setCurrentPage(1);
                            }}
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
                                    color: "#af0000ff",
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    <table className="table table-hover table-bordered align-middle text-center">
                        <thead className="table-dark">
                        <tr>
                            <th>Sr. No.</th>
                            <th>Requestor Name</th>
                            <th>Requested Module</th>
                            <th>Requestor Email</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedRequests.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-muted text-center">
                                    No access requests found.
                                </td>
                            </tr>
                        ) : (
                            paginatedRequests.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{startIndex + index + 1}</td>
                                    <td>{item.requestor_name}</td>
                                    <td>{item.requested_module}</td>
                                    <td>{item.email}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-success me-2"
                                            disabled={processingId === item.id}
                                            onClick={() => handleOpenModal(item.id, item.requested_module)}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            disabled={processingId === item.id}
                                            onClick={() => {
                                                setProcessingId(item.id);
                                                updateStatus(item.id, 12).finally(() => setProcessingId(null));
                                            }}
                                        >
                                            Reject
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
            Showing {paginatedRequests.length} of {filteredRequests.length} matching requests
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

            {/* Approval Modal */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Approve Access Request</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth variant="outlined" sx={{mt: 2, minWidth: 200}}>
                        <InputLabel id="role-select-label">Select Role</InputLabel>
                        <Select
                            labelId="role-select-label"
                            value={selectedRole}
                            onChange={(e) => {console.log("Selected Role:", e.target.value); setSelectedRole(e.target.value)}}
                            label="Select Role"
                        >
                            {selectedModule === "ADMIN" ? (
                                <MenuItem value={2}>IT Admin</MenuItem>
                            ) : (
                                [
                                    <MenuItem value={6}>VMS Admin</MenuItem>,
                                    <MenuItem value={7}>VMS Management</MenuItem>
                                ]
                            )}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmApproval} variant="contained" color="primary">
                        Approve
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

AccessReqTable.propTypes = {
    accessrequests: PropTypes.array.isRequired,
    updateStatus: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    searchTerm: PropTypes.string.isRequired,
};

export default AccessReqTable;
