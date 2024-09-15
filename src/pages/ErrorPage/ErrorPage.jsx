import React from "react";
import { Box, Typography } from "@mui/material";
import { useRouteError } from "react-router-dom";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./ErrorPage.module.css";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <Navbar />
      <Box className={styles.container}>
        <Typography className={styles.title}>Oops!</Typography>
        <Typography className={styles.subtitle}>
          Sorry, This page doesn't exist.
        </Typography>
        <Typography className={styles.italicText}>
          {error.statusText || error.message}
        </Typography>
      </Box>
    </div>
  );
};

export default ErrorPage;
