import { render, screen } from "@testing-library/react";
import EmployeeImportReport from "./EmployeeImportReport";
import EmployeeViewModal from "./EmployeeViewModal";

describe("EmployeeImportReport", () => {
  it("shows duplicate entries from the uploaded file and database", () => {
    const errors = {
      duplicates_in_excel: [
        {
          row_number: 12,
          Error: "Row is a duplicate.",
          data: { f_name: "John", l_name: "Doe", email: "john@example.com" },
        },
      ],
      duplicates_in_db: [
        {
          data: {
            email: "jane@example.com",
            entity_id: "1",
          },
        },
      ],
    };

    render(<EmployeeImportReport message="Data imported with warnings." errors={errors} />);

    expect(screen.getByText("Import completed with warnings")).toBeInTheDocument();
    expect(screen.getByText("Duplicates in Excel")).toBeInTheDocument();
    expect(screen.getByText("Duplicates in Database")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("renders employee code and status in the employee details modal", () => {
    const employee = {
      display_name: "John Doe",
      emp_code: "EMP-1001",
      emp_status: 1,
    };

    render(<EmployeeViewModal employee={employee} loading={false} close={() => {}} />);

    expect(screen.getByText("Employee Code")).toBeInTheDocument();
    expect(screen.getByText("EMP-1001")).toBeInTheDocument();
    expect(screen.getByText("Employee Status")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});
