import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";



export default function UsersList() {
  const [rowData, setRowData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const token = localStorage.getItem("token");
  const loggedInUserId = token ? Number(jwtDecode(token).sub) : null;

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);


  
/* Fetch users */
  useEffect(() => {
    api
      .get("/users")
      .then((res) => {
  const users = res.data.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    address: u.address,
    role: u.role,
  }));

  //  logged-in user
  const self = users.filter(
    (u) => u.id === loggedInUserId
  );

  // admins (excluding self)
  const admins = users.filter(
    (u) => u.role === "admin" && u.id !== loggedInUserId
  );

  // remaining users
  const others = users.filter(
    (u) => u.role !== "admin" && u.id !== loggedInUserId
  );

  // final ordered list + index recalculation
  const ordered = [...self, ...admins, ...others].map(
    (u, index) => ({
      index: index + 1,
      ...u,
    })
  );

  setRowData(ordered);
})

      .catch(() =>{ 
        logout()
        navigate("/login",{ replace: true });});
  }, [navigate]);

  /* Column definition */
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Index",
        field: "index",
        width: 70,
        cellClass: "font-semibold text-gray-600",
      },
      {
        headerName: "ID",
        field: "id",
        width: 80,
        cellClass: "font-semibold text-gray-700",
      },
      {
        headerName: "Name",
        field: "name",
        flex: 1,
        cellClass: "font-medium text-gray-800",
      },
      {
        headerName: "Email",
        field: "email",
        flex: 1.3,
        cellClass: "text-blue-700",
      },
      {
        headerName: "Contact",
        field: "phone",
        flex: 1,
      },
      {
        headerName: "Address",
        field: "address",
        flex: 2,
        wrapText: true,
        autoHeight: true,
        cellClass: "text-gray-700 leading-snug",
      },
    ],
    []
  );

  /* Responsive column visibility */
  const handleGridReady = (params) => {
    const updateColumns = () => {
      const isMobile = window.innerWidth < 768;

      // Always visible
      params.api.setColumnsVisible(["index", "id", "name"], true);

      // Desktop-only columns
      params.api.setColumnsVisible(
        ["email", "phone", "address"],
        !isMobile
      );

      params.api.sizeColumnsToFit();
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 to-purple-100 p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
  <h1 className="text-center flex-1 text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
    Users List
  </h1>

  <button
    onClick={() => {
      logout();
      navigate("/login", { replace: true });
    }}
    className="ml-4 px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
  >
    Logout
  </button>
</div>

        <div className="mb-4 flex justify-end">
  <input
    type="text"
    placeholder="Search users..."
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    className="w-full md:w-64 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
</div>
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div
          className="ag-theme-quartz w-full"
          style={{ height: "320px" }}   // only grid scrolls
        >
       

          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            getRowId={(params) => params.data.id.toString()}
            pagination={true}
            quickFilterText={searchText}
            paginationPageSize={10}
            rowSelection="single"
            suppressCellFocus={true}         // no cell highlight
            suppressRowClickSelection={true} // full-row select only
            onRowClicked={(row) =>
              navigate(`/users/${row.data.id}`)
            }
            rowClassRules={{
              "bg-blue-100": "node.isSelected()",
            }}
            onGridReady={handleGridReady}
          />
        </div>
      </div>
    </div>
  );
}
