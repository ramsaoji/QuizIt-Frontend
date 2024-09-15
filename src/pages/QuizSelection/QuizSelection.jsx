import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import QuizCard from "@/components/QuizCard/QuizCard";
import Loader from "@/common/Loader";
import useGetAllQuizzesByCategorySlug from "@/hooks/useGetAllQuizzesByCategorySlug"; // Updated import
import styles from "./QuizSelection.module.css";

const QuizSelection = () => {
  const { categorySlug } = useParams();
  const {
    data: { getAllQuizzesByCategorySlug: allQuizzes } = {}, // Adjusted data structure
    error: quizzesByCategorySlugError,
    loading: isquizzesByCategorySlugLoading,
    refetch: refetchAllQuizzes,
  } = useGetAllQuizzesByCategorySlug(categorySlug);

  useEffect(() => {
    if (categorySlug) {
      refetchAllQuizzes();
    }
  }, [categorySlug]);

  if (quizzesByCategorySlugError)
    return <div>Error: {quizzesByCategorySlugError.message}</div>;

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
            <QuizCard item={item} index={index} />
          </Link>
        ))}
      </Box>
    </>
  );
};

export default QuizSelection;
