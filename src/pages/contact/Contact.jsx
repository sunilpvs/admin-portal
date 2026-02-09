import { useEffect, useState } from "react";
import ContactForm from "./ContactForm";
import ContactTable from "./ContactTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";



const Contact = () => {
  const [allContacts, setAllContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // 🔹 Fetch contacts (local pagination & search)
  const fetchContacts = async () => {
    try {
      //const res = await getPaginatedContacts(1, 1000);
      //setAllContacts(res.data.contacts || []);
    } catch (err) {
      console.error("Failed to fetch contacts", err);
      toast.error("Failed to load contacts");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // 🗑 Delete
  const handleDelete = async (id) => {
    try {
      //await deleteContact(id);
      toast.success("Contact deleted successfully");
      fetchContacts();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete contact");
    }
  };

  // 💾 Add / Update
  const handleSubmit = async (formData) => {
    try {
      if (editMode) {
        //await editContact(formData.id, formData);
        toast.success("Contact updated successfully");
      } else {
        //await addContact(formData);
        toast.success("Contact added successfully");
      }

      setOpenForm(false);
      setSelectedContact(null);
      setEditMode(false);
      setPage(1);
      fetchContacts();
    } catch (err) {
      console.error("Submit failed", err);
      toast.error("Failed to save contact");
    }
  };

  // ✏ Edit
  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setEditMode(true);
    setOpenForm(true);
  };

  // ➕ Add
  const handleAdd = () => {
    setSelectedContact({
      first_name: "",
      last_name: "",
      email: "",
      mobile: "",
      city: "Bengaluru",
    });
    setEditMode(false);
    setOpenForm(true);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (newSearch) => {
    setSearchTerm(newSearch);
    setPage(1);
  };

  const closeForm = () => {
    setOpenForm(false);
    setSelectedContact(null);
    setEditMode(false);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-12">

          <button
            className="btn btn-primary float-end mb-3"
            onClick={handleAdd}
          >
            + Add Contact
          </button>

          <ContactTable
            contacts={allContacts}
            deleteContact={handleDelete}
            editContact={handleEdit}
            currentPage={page}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onSearch={handleSearchChange}
            searchTerm={searchTerm}
          />

          {openForm && (
            <ContactForm
              data={selectedContact}
              add={handleSubmit}
              close={closeForm}
              editMode={editMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
