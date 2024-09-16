import React from "react";
import { Box, Button, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useApolloClient } from "@apollo/client";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase-config";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { currentUser } = useAuth();
  const client = useApolloClient();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await client.clearStore(); // Clears all cached data after sign-out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Box
      className={styles.navbar}
      sx={{
        justifyContent: "space-between",
        padding: {
          xs: "0 32px", // Padding for mobile devices
          md: "0 64px", // Padding for desktop devices
        },
      }}
    >
      {/* NavBrand Desktop */}
      <Box
        className={styles.navBrand}
        sx={{
          display: {
            xs: "none", // Center content on mobile
            md: "block", // Space content on desktop
          },
        }}
      >
        <Link to="/">
          <span>Quiz</span>
          <span>It</span>
        </Link>
      </Box>
      {/* NavBrand Mob */}
      <Box
        className={styles.navBrand}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
          fontSize: "24px",
        }}
      >
        <Link to="/">
          <span>Quiz</span>
          <span>It</span>
        </Link>
      </Box>

      {currentUser && (
        <Box
          className={styles.navLinks}
          sx={{
            gap: isSmallScreen ? "16px" : "",
          }}
        >
          {/* Generate Quiz btn */}
          <Link to="/generate-quiz">
            <Button
              variant="outlined"
              className={styles.navBtn}
              size={isSmallScreen ? "small" : "medium"} // Conditional size
              sx={{ height: isSmallScreen ? "30px" : "35px" }}
            >
              <AutoAwesomeOutlinedIcon
                sx={{
                  fontSize: isSmallScreen ? "16px" : "20px",
                  marginRight: "5px",
                }} // Adjust icon size if needed
              />
              <span>{isSmallScreen ? "Gen Quiz" : "Generate Quiz"}</span>
            </Button>
          </Link>
          {/* Sign Out btn */}
          <Button
            variant="outlined"
            className={styles.navBtn}
            size={isSmallScreen ? "small" : "medium"}
            sx={{
              height: isSmallScreen ? "30px" : "35px",
              minWidth: isSmallScreen ? "32px" : "",
            }}
            onClick={handleSignOut}
          >
            <LogoutIcon
              sx={{
                fontSize: "20px",
                marginRight: isSmallScreen ? "0px" : "5px",
              }}
            />
            {!isSmallScreen && <span>Sign Out</span>}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;

{
  /* <Typography className={styles.navLink}>
          <span>Category</span>
          <ExpandMoreIcon />
        </Typography>
        <Typography className={styles.navLink}>Generate Quiz</Typography>
        <Typography className={styles.navLink}>Contact</Typography> */
}
