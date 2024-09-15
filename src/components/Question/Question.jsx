import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  FormHelperText,
  Button,
  AccordionActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import styles from "./Question.module.css";

const Question = ({ item, index, showResults, feedback, userAnswers }) => {
  const formContext = useFormContext();
  const {
    control = {},
    setValue = () => {},
    formState: { errors = {} } = {},
  } = formContext ?? {};
  const [selectedOption, setSelectedOption] = useState("");

  const { question: questionTitle, options } = item;
  const hasError = !!errors?.questions?.[index] || false;
  const userAnswer = userAnswers[index];
  const correctAnswer = feedback[index]?.correctAnswer;
  const isSelectedAnswerIncorrect = showResults && userAnswer !== correctAnswer;

  useEffect(() => {
    if (showResults) {
      setSelectedOption("");
    }
  }, [showResults]);

  const renderIcon = (option) => {
    if (!showResults) return null;

    if (option === userAnswer && userAnswer !== correctAnswer) {
      return <CancelOutlinedIcon color="error" />;
    } else if (option === correctAnswer && userAnswer !== correctAnswer) {
      return <CheckCircleOutlineIcon color="success" />;
    }

    return null;
  };

  const handleResetOption = () => {
    setValue(`questions.${index}`, "", {
      shouldDirty: true,
      shouldTouch: true,
    });
    setSelectedOption(""); // Clear the selected option
  };

  return (
    <div>
      <Accordion
        defaultExpanded={true}
        className={`${styles.accordion} ${
          hasError || isSelectedAnswerIncorrect
            ? styles.accordionError
            : styles.accordionDefault
        }`}
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
          <FormControl component="fieldset" error={hasError}>
            <FormLabel component="legend">Options</FormLabel>
            <Controller
              name={`questions.${index}`}
              control={control}
              rules={{ required: "Please select an option" }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <RadioGroup
                  onChange={(e) => {
                    onChange(e);
                    setSelectedOption(e.target.value); // Update selected option
                  }}
                  onBlur={onBlur}
                  value={value || ""} // Ensure value is always defined
                  ref={ref}
                >
                  {options.map((option, optionIndex) => (
                    <FormControlLabel
                      key={optionIndex}
                      value={option}
                      control={
                        <Radio
                          sx={{
                            minWidth: "42px",
                            minHeight: "42px",
                            fontSize: "42px",
                          }}
                        />
                      }
                      label={
                        <div className={styles.radioOption}>
                          <span>{option}</span>
                          {renderIcon(option)}
                        </div>
                      }
                      disabled={showResults}
                      sx={{
                        alignItems: "flex-start",
                        margin: 0,
                        "& .MuiFormControlLabel-label": {
                          paddingTop: "8px", // Align with the top of the radio button
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              )}
            />
            {hasError && (
              <FormHelperText error sx={{ marginX: 0 }}>
                <ErrorIcon className={styles.errorIcon} />
                {errors?.questions?.[index]?.message}
              </FormHelperText>
            )}
          </FormControl>
        </AccordionDetails>
        <AccordionActions>
          {selectedOption && !showResults && (
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={handleResetOption}
              disabled={showResults}
            >
              Reset
            </Button>
          )}
        </AccordionActions>
      </Accordion>
    </div>
  );
};

export default Question;
