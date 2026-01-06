import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import RequireAuth from "./auth/RequireAuth";

function UsersPlaceholder() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Users Page (Protected)</h1>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/users"
          element={
            <RequireAuth>
              <UsersPlaceholder />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
