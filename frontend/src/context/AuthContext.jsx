import { createContext,useState } from "react";
export const AuthContext=createContext(null);

export const AuthProvider=({children})=>{
    const [token,setToken]=useState(localStorage.getItem("token")||null);
    const login=(jwtToken)=>{
        localStorage.setItem("token",jwtToken);
        setToken(jwtToken);
    };
    const logout=()=>{
        localStorage.removeItem("token");
        setToken(null);
    };
    return(
        <AuthContext.Provider value={{token,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
}
