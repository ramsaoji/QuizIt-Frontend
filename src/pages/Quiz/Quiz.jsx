import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { isEmpty } from "lodash";
import { FormProvider, useForm } from "react-hook-form";
import Loader from "@/common/Loader";
import Question from "@/components/Question/Question";
import useGetQuizBySlug from "@/hooks/useGetQuizBySlug";
import useSubmitQuiz from "@/hooks/useSubmitQuiz";
import styles from "./Quiz.module.css";

const Quiz = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const { quizSlug } = useParams();
  const topRef = useRef(null);

  // Use the updated hook to fetch quiz data
  const {
    data: { getQuizBySlug: quizData } = {},
    error: quizDataError,
    loading: isQuizDataLoading,
  } = useGetQuizBySlug(quizSlug);

  const {
    submit: quizMutation,
    data: quizMutationData,
    loading: isQuizMutationLoading,
    error: quizMutationError,
  } = useSubmitQuiz();

  const { title = "", description = "", questions = [] } = quizData ?? {};

  const methods = useForm({
    defaultValues: {
      questions: questions.map(() => ""),
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  // Effects
  useEffect(() => {
    if (formSubmitted && !isEmpty(errors)) {
      // Don't scroll if there are errors
      setFormSubmitted(false); // Reset the flag
    } else if (formSubmitted) {
      // Scroll only if there are no errors
      handleScrollToTop();
      setFormSubmitted(false); // Reset the flag
    }
  }, [formSubmitted, errors]);

  // Functions
  const handleScrollToTop = () => {
    if (topRef.current) {
      window.scrollTo({
        top: topRef.current.offsetTop - 110, // Adjust for not scrolling to the very top
        behavior: "smooth",
      });
    }
  };

  const onSubmit = async (formData) => {
    const submittedAnswers = formData?.questions?.map((answer, index) => ({
      questionId: questions[index]._id,
      selectedAnswer: answer,
    }));

    try {
      const { score, feedback } = await quizMutation(
        quizData._id,
        submittedAnswers
      );

      setUserAnswers(formData.questions);
      setScore(score);
      setFeedback(feedback);
      setShowResults(true);
      setFormSubmitted(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  const handleReset = () => {
    reset({ questions: questions?.map(() => "") });
    setScore(0);
    setUserAnswers([]);
    setShowResults(false);
    setFeedback([]);
    // Delay to ensure reset is fully completed
    setTimeout(() => {
      handleScrollToTop();
    }, 0); // Adjust delay as needed (100ms is usually sufficient)
  };

  if (quizDataError || quizMutationError)
    return (
      <div>Error: {quizDataError.message || quizMutationError.message}</div>
    );

  if (isQuizDataLoading) {
    return (
      <Box className={styles.loader}>
        <Loader />
      </Box>
    );
  }

  return (
    <Box id="top" ref={topRef} className={styles.container}>
      <Box
        sx={{
          width: {
            xs: "100%", // width for mobile devices
            md: "80%", // width for desktop devices
          },
        }}
        className={styles.innerContainer}
      >
        {/* Whole page loader */}
        {isQuizMutationLoading && (
          <Box className={styles.wholePageLoader}>
            <Loader />
          </Box>
        )}
        {/* Top Part */}
        <Box className={styles.topContainer}>
          {/* Quiz Title */}
          <Typography
            className={styles.title}
            sx={{
              fontSize: {
                md: "40px",
                xs: "30px",
              },
            }}
          >
            {title}
          </Typography>
          {/* Quiz Description */}
          <Typography
            className={styles.description}
            sx={{
              fontSize: {
                md: "20px",
                xs: "16px",
              },
            }}
          >
            {description}
          </Typography>
          {/* Score section */}
          {showResults && (
            <Box sx={{ marginTop: "25px" }}>
              <Typography
                className={styles.score}
                sx={{
                  fontSize: {
                    md: "18px",
                    xs: "14px",
                  },
                }}
              >
                {score === questions.length ? (
                  <>
                    🎉🎉 Whoop, whoop! 🎉🎉
                    <br />
                    You nailed it! Every answer was spot-on!
                  </>
                ) : score === 0 ? (
                  <>
                    😬 Oops! Missed all the questions. No worries—try again and
                    you'll ace it next time!
                  </>
                ) : (
                  <>
                    <strong>
                      🏆 Score: {score} out of {questions.length} 🏆
                    </strong>
                    <br />
                    {score > questions.length / 2 ? (
                      <>Keep up the great work!</>
                    ) : (
                      <>Nice try! A bit more practice and you'll get there!</>
                    )}
                  </>
                )}
              </Typography>
            </Box>
          )}
        </Box>
        {/* Form */}
        <Box sx={{ width: "100%" }}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {questions?.map((item, index) => (
                <Box key={item._id} className={styles.questionContainer}>
                  <Question
                    item={item}
                    index={index}
                    showResults={showResults}
                    userAnswers={userAnswers}
                    feedback={feedback}
                  />
                </Box>
              ))}
              {/* Buttons */}
              <Box className={styles.buttonContainer}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={showResults}
                  className={styles.button}
                >
                  Submit
                </Button>
                {showResults && (
                  <Button
                    onClick={handleReset}
                    variant="contained"
                    color="secondary"
                    className={styles.button}
                  >
                    Reset
                  </Button>
                )}
              </Box>
            </form>
          </FormProvider>
        </Box>
      </Box>
    </Box>
  );
};

export default Quiz;
