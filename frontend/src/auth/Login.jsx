import { useState,useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios.js";
import { replace, useNavigate } from "react-router-dom";

export default  function Login(){
    const {login}=useContext(AuthContext);
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState(null);
    const navigate = useNavigate();

    const handleSubmit=async (e)=>{
        e.preventDefault();
        setError(null);
    
    try{
        const res=await api.post("/login",{email,password})
        login(res.data.access_token);
        navigate("/users",{ replace: true });

    }catch(err){
        setError(err.response?.data?.message || "Login failed");    
    }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <p className="text-red-600 text-sm mb-2 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );

}
