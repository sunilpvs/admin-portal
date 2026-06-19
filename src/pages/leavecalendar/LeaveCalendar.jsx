import { useEffect, useState } from "react";
import Header from "../../components/Header";
import LeaveCalendarForm from "./LeaveCalendarForm";
import LeaveCalendarTable from "./LeaveCalendarTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";


import * as XLSX from "xlsx";

const LeaveCalendar = () => {
  const [allHolidays, setAllHolidays] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  const [excelFile, setExcelFile] = useState(null);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    // API call here
    setAllHolidays([]);
  };

  const handleDelete = async (id) => {
    toast.success("Holiday deleted successfully");
  };

  const handleSubmit = async (formData) => {
    if (editMode) {
      toast.success("Holiday updated successfully");
    } else {
      toast.success("Holiday added successfully");
    }

    setOpenForm(false);
    setSelectedHoliday(null);
    setEditMode(false);
  };

  const handleEdit = (holiday) => {
    setSelectedHoliday(holiday);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleAdd = () => {
  setSelectedHoliday({
  holiday_name: "",
  holiday_date: "",
  branches: [],
  description: "",
    });

    setEditMode(false);
    setOpenForm(true);
  };

  const handleExcelImport = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const data = e.target.result;

    const workbook = XLSX.read(data, {
      type: "binary",
    });

    const sheetName = workbook.SheetNames[0];

    const worksheet =
      workbook.Sheets[sheetName];

    const jsonData =
      XLSX.utils.sheet_to_json(worksheet);

    const holidays = jsonData.map((row) => ({
      holiday_name: row["Holiday Name"] || "",
      holiday_date: row["Holiday Date"] || "",
      branches: row["Branches"]
        ? row["Branches"]
            .split(",")
            .map((b) => b.trim())
        : [],
      description: row["Description"] || "",
    }));

    setAllHolidays((prev) => [
      ...prev,
      ...holidays,
    ]);

    toast.success("Excel imported successfully");
  };

  reader.readAsBinaryString(file);
};

  return (
    <div className="container mt-4">
       
 <div className="d-flex justify-content-between align-items-start mb-3">
  <div>
    <Header
      title="Holiday Calendar"
      subtitle="Leave Management / Holiday Calendar"
    />
  </div>

  <div className="d-flex gap-2 mt-2">
    <button
      className="btn btn-primary"
      onClick={handleAdd}
    >
      + Add Holiday
    </button>

    <label className="btn btn-success mb-0">
      Import Excel
      <input
        type="file"
        accept=".xlsx,.xls"
        hidden
        onChange={handleExcelImport}
      />
    </label>
  </div>
</div>

      <LeaveCalendarTable
        holidays={allHolidays}
        deleteHoliday={handleDelete}
        editHoliday={handleEdit}
        currentPage={page}
        itemsPerPage={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
      />

      {openForm && (
        <LeaveCalendarForm
          data={selectedHoliday}
          add={handleSubmit}
          close={() => setOpenForm(false)}
          editMode={editMode}
        />
      )}
    </div>
  );
};

export default LeaveCalendar;