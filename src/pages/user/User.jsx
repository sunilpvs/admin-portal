import { useEffect, useState } from "react";
import UserForm from "./UserForm";
import UserTable from "./UserTable";
import { toast } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";



const User = () => {
  const [users, setUsers] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  const fetchUsers = async () => {
    try {
      //const res = await getUsers();
      //setUsers(res.data || []);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setOpenForm(true);
  };

  const handleSubmit = async (payload) => {
    try {
      //await createUser(payload);
      toast.success("User created successfully");
      setOpenForm(false);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to create user");
    }
  };

  const handleDelete = async (id) => {
    try {
      //await deleteUser(id);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container mt-4">
      <button
        className="btn btn-primary float-end mb-3"
        onClick={handleAdd}
      >
        + Create User
      </button>

      <UserTable users={users} onDelete={handleDelete} />

      {openForm && (
        <UserForm add={handleSubmit} close={() => setOpenForm(false)} />
      )}
    </div>
  );
};

export default User;
