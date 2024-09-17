import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import styles from "@/commonStyles/GlowyButton.module.css";

const GlowyButton = ({
  isSmallScreen,
  path,
  icon,
  smallBtnText,
  bigBtnText,
}) => {
  return (
    <Link to={path}>
      <Button
        variant="outlined"
        className={styles.glowyBtn}
        size={isSmallScreen ? "small" : "medium"}
        sx={{
          height: isSmallScreen ? "30px" : "35px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span className={styles.buttonContent}>
          {icon ?? ""}
          <span>{isSmallScreen ? smallBtnText : bigBtnText}</span>
        </span>
      </Button>
    </Link>
  );
};

export default GlowyButton;
