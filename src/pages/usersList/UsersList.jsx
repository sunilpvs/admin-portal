// Inside UsersList.jsx
import { useEffect, useState } from "react";
import UsersListTable from "./UsersListTable";
import { toast } from "react-hot-toast";
import { getPaginatedUsers, deleteUser } from "../../services/admin/accessReqService";
import {getUserDetails} from "../../services/auth/userDetails";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // NEW
  const [totalPages, setTotalPages] = useState(1);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await getPaginatedUsers(page, limit);
      if (res.data.users) {
        setUsers(res.data.users);
        setTotalPages(Math.ceil(res.data.total / res.data.limit));
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to load users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const fetchCurrentUser = async () => {
    try {
      const response = await getUserDetails();
      const current_user_email = response?.data?.userData?.email;
      setCurrentUserEmail(current_user_email);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      toast.error("Failed to load current user.");
    }
  }

  useEffect(() => {
    fetchCurrentUser();
  },[]);


  const handleDeleteUser = async (email, module_id) => {
    try {
      const confirmed = window.confirm(`Are you sure you want to delete ${email}?`);
      if (!confirmed) return;

      const payload = {
        email,
        user_module: module_id,
      };

      const token_resp = await getUserDetails();
      const current_user_email = token_resp?.data?.userData?.email;

      if (current_user_email === email) {
        toast.error("You cannot delete yourself!");
        return;
      }

      if (module_id === 2) {
        toast.error("Default module access cannot be deleted");
      }



      await deleteUser({ data: payload });
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete user.");
    }
  };

  return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <UsersListTable
                users={users}
                currentUserEmail={currentUserEmail}
                onSearch={setSearchTerm}
                searchTerm={searchTerm}
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                totalPages={totalPages}
                onDelete={handleDeleteUser}
            />
          </div>
        </div>
      </div>
  );
};

export default UsersList;
 
 