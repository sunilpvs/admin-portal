import { useEffect, useState } from "react";
import AccessReqTable from "./AccessRequestTable";
import { toast } from "react-hot-toast";
import {
  getPendingAccessRequests,
  updateAccessRequest,
} from "../../services/admin/accessReqService";

const AccessRequests = () => {
  const [accessrequests, setAccessrequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAccessRequests = async () => {
    try {
      const res = await getPendingAccessRequests();

      let data = [];

      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res.data.accessrequests)) {
        data = res.data.accessrequests;
      } else if (Array.isArray(res.data.data)) {
        data = res.data.data;
      } else {
        console.warn("⚠️ Unexpected API structure:", res.data);
      }

      const uniqueAccessRequests = Array.from(
        new Map(data.filter((item) => item.id).map((item) => [item.id, item]))
          .values()
      );

      setAccessrequests(uniqueAccessRequests);
    } catch (err) {
      console.error("Failed to fetch access requests:", err);
      toast.error("Failed to load access requests.");
    }
  };

  useEffect(() => {
    fetchAccessRequests();
  }, []);

  // Updated to accept optional userRole param
  const handleStatusUpdate = async (id, status, userRole = null) => {
    console.log("Clicked status:", status, "UserRole:", userRole);

    const message =
      status === 11
        ? "Request approved successfully."
        : "Request rejected successfully.";

    try {
      // Include user_role in payload if provided
      const payload = { status };
      if (userRole !== null) {
        payload.user_role = userRole;
      }

      const res = await updateAccessRequest(id, payload);

      if (res.status === 200) {
        toast.success(message);

        // Remove from UI
        setAccessrequests((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error("Error while approving request");
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Error updating request status.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
    <AccessReqTable
      accessrequests={accessrequests}
      updateStatus={handleStatusUpdate}
      onSearch={setSearchTerm}
      searchTerm={searchTerm}
    />
    </div></div></div>
  );
};

export default AccessRequests;
