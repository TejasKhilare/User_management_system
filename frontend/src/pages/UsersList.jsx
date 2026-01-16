import { useEffect, useMemo, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";


export default function UsersList() {
  
  const [rowData, setRowData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);


  const gridRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);


  useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("usersListState"));
  if (saved) {
    setPage(saved.page);
    setPageSize(saved.pageSize);
    setSearchText(saved.searchText);
  }
  setIsHydrated(true);
}, []);
useEffect(() => {
  if (!isHydrated) return;

  localStorage.setItem(
    "usersListState",
    JSON.stringify({ page, pageSize, searchText })
  );
}, [isHydrated, page, pageSize, searchText]);

  useEffect(() => {
    if (!isHydrated) return;
     
    api
      .get("/users", {
        params: {
          page,
          limit: pageSize,
          search: searchText || undefined,
        },
      }) 
      .then((res) => {
       
        const users = res.data.data.map((u, idx) => ({
          index: (page - 1) * pageSize + idx + 1,
          ...u,
        }));

        setRowData(users);
        setTotal(res.data.total);
      })
      .catch(() => {
        logout();
        navigate("/login", { replace: true });
      });
      
  }, [page, pageSize, searchText,isHydrated]);

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

  const handleGridReady = (params) => {
    const updateColumns = () => {
      const isMobile = window.innerWidth < 768;

      params.api.setColumnsVisible(
        ["index", "id", "name"],
        true
      );

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
    <div className="min-h-screen bg-linear-to-br from-blue-200 to-purple-200 p-4 md:p-2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex-1 text-center text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
          Users List
        </h1>
        <button
          onClick={() => {
            localStorage.setItem(
    "usersListState",
    JSON.stringify({ page:1, pageSize:10, searchText:"" })
  );
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
          onChange={(e) => {
            setPage(1);
            setSearchText(e.target.value);
          }}
          className="w-full md:w-64 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="ag-theme-quartz w-full" style={{ height: "290px" }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            suppressCellFocus={true}
            suppressRowClickSelection={true}
            onCellClicked={(params) => {
              if (params.data?.id) {
                navigate(`/users/${params.data.id}`);
              }
            }}
            onGridReady={handleGridReady}
          />
        </div>

        {/* Pagination bar */}
        <div className="flex items-center justify-between mt-4">
          <div>
            Page {page} of {Math.ceil(total / pageSize)}
          </div>

          <div className="flex gap-2">
            <select
              value={pageSize}
              onChange={(e) => {
                setPage(1);
                setPageSize(Number(e.target.value));
              }}
              className="border px-1 py-1 rounded"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <button
              disabled={page === 1}
              onClick={() => setPage(1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              First
            </button>

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
            <button
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage(Math.ceil(total / pageSize))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
