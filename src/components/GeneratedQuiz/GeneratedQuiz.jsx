import React from "react";
import { Box } from "@mui/material";
import GeneratedQuestion from "@/components/GeneratedQuestion/GeneratedQuestion";
import styles from "./GeneratedQuiz.module.css";

const GeneratedQuiz = ({ generatedQuizData }) => {
  const { questions } = generatedQuizData ?? {};
  return (
    <>
      {questions?.map((item, index) => (
        <Box key={index + item.question} className={styles.questionContainer}>
          <GeneratedQuestion
            item={item}
            index={index}
            // showResults={showResults}
            // userAnswers={userAnswers}
            // feedback={feedback}
          />
        </Box>
      ))}
    </>
  );
};

export default GeneratedQuiz;
