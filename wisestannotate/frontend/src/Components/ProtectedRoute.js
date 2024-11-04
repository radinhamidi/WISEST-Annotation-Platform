import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ condition, redirectPath = '/login', children }) => {
    const navigate = useNavigate()
    if (!condition) {
        navigate('/login')
    } else {
        return children
    }

}

export default ProtectedRoute; 