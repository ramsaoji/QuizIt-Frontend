import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormLabel,
  FormHelperText,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "./GeneratedQuestion.module.css";

const GeneratedQuestion = ({ item, index }) => {
  const { question: questionTitle, options } = item;
  return (
    <div>
      <Accordion
        defaultExpanded={true}
        className={`${styles.accordion} ${styles.accordionDefault}`}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{ minWidth: "32px", minHeight: "32px", fontSize: "32px" }}
            />
          }
          aria-controls={`panel${index}-content`}
          id={`panel${index}-header`}
          className={styles.accordionSummary}
        >
          {questionTitle}
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset">
            <FormLabel component="legend">Options</FormLabel>

            <Box className={styles.optionsContainer}>
              {options?.map((option, optionIndex) => (
                <Typography key={optionIndex}>{`${
                  optionIndex + 1
                }) ${option}`}</Typography>
              ))}
            </Box>
            {/* <FormHelperText
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                marginX: 0,
                color: "#363434",
              }}
            >{`Answer - ${item?.answer}`}</FormHelperText> */}
          </FormControl>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default GeneratedQuestion;
