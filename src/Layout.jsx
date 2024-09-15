import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./Layout.module.css";

const Layout = () => {
  return (
    <Box className={styles.container}>
      <Navbar />
      <Box
        component="main"
        className={styles.mainContent}
        sx={{
          padding: {
            xs: "32px",
            md: "44px 64px",
          },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
