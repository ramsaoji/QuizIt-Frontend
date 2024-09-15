import React from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
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

      <Box className={styles.navLinks}>
        <Link to="/generate-quiz">
          <Button
            variant="outlined"
            className={styles.navBtn}
            size={isSmallScreen ? "small" : "medium"} // Conditional size
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
      </Box>
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
