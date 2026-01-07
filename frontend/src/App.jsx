import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import RequireAuth from "./auth/RequireAuth";
import UsersList from "./pages/UsersList.jsx";
import UserDetails from "./pages/UserDetails";
import RequireGuest from "./auth/RequireGuest";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/login"
          element={
             <RequireGuest>
                <Login />
             </RequireGuest>
         }
/>

        <Route
          path="/users"
          element={
            <RequireAuth>
              <UsersList />
            </RequireAuth>
          }
        />
        

        <Route
          path="/"
          element={
            <RequireAuth>
              <UsersList />
            </RequireAuth>
          }
        />
        <Route
          path="/users/:id"
          element={
            <RequireAuth>
              <UserDetails />
            </RequireAuth>
          }
        />
         
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
