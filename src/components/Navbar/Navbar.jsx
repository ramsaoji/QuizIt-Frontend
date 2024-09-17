import React, { useState } from "react";
import {
  Box,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { Link } from "react-router-dom";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { Logout } from "@mui/icons-material";
import { useApolloClient } from "@apollo/client";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase-config";
import GlowyButton from "@/common/GlowyButton";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { currentUser } = useAuth();
  const client = useApolloClient();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
            gap: isSmallScreen ? "20px" : "",
          }}
        >
          {/* Generate Quiz btn */}
          <GlowyButton
            isSmallScreen={isSmallScreen}
            path="/generate-quiz"
            icon={
              <AutoAwesomeOutlinedIcon
                sx={{
                  fontSize: isSmallScreen ? "16px" : "20px",
                  marginRight: "5px",
                }}
              />
            }
            smallBtnText="Gen Quiz"
            bigBtnText="Generate Quiz"
          />

          {/* Avatar and Menu */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleMenuClick}
              aria-controls={openMenu ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
              sx={{ padding: 0 }}
            >
              <Avatar
                className={styles.avatar}
                alt={currentUser?.displayName}
                src={currentUser?.photoURL}
                sx={{
                  width: isSmallScreen ? 36 : 42,
                  height: isSmallScreen ? 36 : 42,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  bgcolor: "#fc816c",
                }}
              />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={openMenu}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            sx={{ zIndex: 9999 }}
          >
            <MenuItem
              sx={{
                textTransform: "capitalize",
                fontWeight: 600,
                color: "#363434",
              }}
            >
              <Avatar
                alt={currentUser?.displayName}
                src={currentUser?.photoURL}
              />
              {currentUser?.displayName}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
