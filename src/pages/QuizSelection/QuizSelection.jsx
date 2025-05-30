import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import QuizCard from "@/components/QuizCard/QuizCard";
import Loader from "@/common/Loader";
import useGetAllQuizzesByCategorySlug from "@/hooks/useGetAllQuizzesByCategorySlug";
import styles from "./QuizSelection.module.css";

const QuizSelection = () => {
  const { categorySlug } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: { getAllQuizzesByCategorySlug: allQuizzes } = {},
    error: quizzesByCategorySlugError,
    loading: isquizzesByCategorySlugLoading,
    refetch: refetchAllQuizzes,
  } = useGetAllQuizzesByCategorySlug(categorySlug);

  useEffect(() => {
    if (categorySlug) {
      refetchAllQuizzes().catch((error) => {
        console.error("Error fetching quizzes:", error);
        enqueueSnackbar("Failed to fetch quizzes", { variant: "error" });
      });
    }
  }, [categorySlug]);

  if (quizzesByCategorySlugError) {
    console.error("Quiz category error:", quizzesByCategorySlugError);
    return <div>Error: {quizzesByCategorySlugError.message}</div>;
  }

  if (isquizzesByCategorySlugLoading) {
    return (
      <Box className={styles.loader}>
        <Loader />
      </Box>
    );
  }

  return (
    <>
      <Typography
        className={styles.title}
        sx={{
          fontSize: {
            md: "40px",
            xs: "30px",
          },
        }}
      >
        Select Quiz to Start
      </Typography>
      <Box className={styles.cardGrid}>
        {allQuizzes?.map((item, index) => (
          <Link key={item._id} to={`/category/${categorySlug}/${item.slug}`}>
            <QuizCard item={item} index={index} categorySlug={categorySlug} />
          </Link>
        ))}
      </Box>
    </>
  );
};

export default QuizSelection;
