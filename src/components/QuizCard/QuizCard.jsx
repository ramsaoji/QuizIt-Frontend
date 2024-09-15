import * as React from "react";
import { Box, Typography } from "@mui/material/";
import { QUIZ_CARD_BG_COLORS } from "@/utils/constants";
import styles from "./QuizCard.module.css";

const QuizCard = ({ item, index, backgroundColor }) => {
  // Dummy
  // const { title = "", category = "Java", quizCount = 10 } = item ?? {};

  const {
    name: categoryName = "",
    title: quizTitle = "",
    description = "",
    quizzes = [],
    questions = [],
  } = item ?? {};
  const isCategoryCard = !quizTitle;
  const quizCount = quizzes?.length ?? "";
  const questionsCount = questions?.length ?? "";
  // Calculate the row number (starting from 0)
  const rowIndex = Math.floor(index / QUIZ_CARD_BG_COLORS.length);

  // Calculate the gradient color index, offsetting each row by the row number
  const colorIndex = (index + rowIndex) % QUIZ_CARD_BG_COLORS.length;

  const bgColor = backgroundColor
    ? backgroundColor
    : QUIZ_CARD_BG_COLORS[colorIndex];

  return (
    <Box
      className={styles.card}
      sx={{
        maxWidth: {
          xs: "auto",
          md: "17rem",
        },
        justifyContent:
          quizCount || questionsCount ? "space-between" : "center",
        background: `linear-gradient(to bottom, ${bgColor.top}, ${bgColor.bottom})`,
        "&:hover": {
          // opacity: 0.9,
          border: "2px solid gray",
          boxShadow:
            "rgba(50, 50, 93, 1) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 4px 8px -3px",
        },
      }}
    >
      {isCategoryCard ? (
        // Category Card
        <>
          {/* Category Name */}
          <Typography className={styles.title}>{categoryName}</Typography>
          {/* Category Description */}
          <Typography className={styles.categoryDescription}>
            {description}
          </Typography>

          {/* Category Footer */}
          {quizCount && (
            <Typography className={styles.footer}>{`${quizCount} - ${
              quizCount === 1 ? "Quiz" : "Quizzes"
            }`}</Typography>
          )}
        </>
      ) : (
        // Quiz Card
        <>
          {/* Quiz Title */}
          <Typography className={styles.title}>{quizTitle}</Typography>
          {/* Quiz Description */}
          <Typography className={styles.quizDescription}>
            {description}
          </Typography>

          {/* Quiz Footer */}
          {questionsCount && (
            <Typography
              className={styles.footer}
            >{`${questionsCount} - Questions`}</Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default QuizCard;
