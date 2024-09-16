import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/common/Loader";
import { Box } from "@mui/material";
import styles from "./PublicRoute.module.css";

const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box className={styles.loader}>
        <Loader />
      </Box>
    );
  }

  if (currentUser) {
    // Redirect to home page if user is already authenticated
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
