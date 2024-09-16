import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/common/Loader";
import { Box } from "@mui/material";
import styles from "./ProtectedRoute.module.css";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box className={styles.loader}>
        <Loader />
      </Box>
    );
  }

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
