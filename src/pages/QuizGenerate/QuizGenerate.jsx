import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "lodash";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { EXAMPLE_PROMPTS } from "@/utils/constants";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import Loader from "@/common/Loader";
import GeneratedQuiz from "@/components/GeneratedQuiz/GeneratedQuiz";
import useGenerateQuiz from "@/hooks/useGenerateQuiz";
import useCreateQuizEndToEnd from "@/hooks/useCreateQuizEndToEnd";
import { useAuth } from "@/hooks/useAuth";
import styles from "./QuizGenerate.module.css";

const QuizGenerate = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [promptError, setPromptError] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const {
    mutate: generateQuizMutation,
    data: generatedQuizData,
    isPending: isGenerateQuizMutationPending,
    isError: isGenerateQuizMutationError,
    error,
  } = useGenerateQuiz();

  const {
    createQuizEndToEnd,
    isCreatingCategory,
    isCreatingQuestion,
    isCreatingQuiz,
    isUpdatingQuizWithQuestions,
  } = useCreateQuizEndToEnd();

  const isCreateQuizEndToEndLoading =
    isCreatingCategory ||
    isCreatingQuestion ||
    isCreatingQuiz ||
    isUpdatingQuizWithQuestions;

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (
      !isEmpty(generatedQuizData) &&
      !isGenerateQuizMutationPending &&
      !isGenerateQuizMutationError
    ) {
      setQuizData(generatedQuizData);
    }
  }, [
    generatedQuizData,
    isGenerateQuizMutationPending,
    isGenerateQuizMutationError,
  ]);

  const handlePromptChange = (event) => {
    const promptValue = event.target.value;
    setPrompt(promptValue);
  };

  const handleGenerateQuiz = () => {
    setPromptError("");
    if (prompt && currentUser) {
      const token = currentUser?.stsTokenManager?.accessToken;
      generateQuizMutation(
        { prompt, token },
        {
          onError: (errorResponse) => {
            const errorData = errorResponse?.response?.data;
            if (errorData?.error === "Invalid Prompt") {
              console.log("Invalid Prompt Error ---", errorData);
              setPromptError(errorData);
              enqueueSnackbar("Invalid prompt. Please try again.", {
                variant: "warning",
              });
            } else if (errorData?.error === "Internal Server Error") {
              console.error("Server Error ---", errorData.details);
              enqueueSnackbar("An error occurred. Please try again later.", {
                variant: "error",
              });
            } else {
              console.error("Unexpected Error ---", errorResponse);
              enqueueSnackbar("An unexpected error occurred.", {
                variant: "error",
              });
            }
          },
          onSuccess: (data) => {
            if (data.error) {
              console.log("Quiz Generation Error ---", data.message);
              setPromptError(data.message);
              enqueueSnackbar(
                "Failed to generate quiz. Please try a different prompt.",
                {
                  variant: "warning",
                }
              );
            } else {
              console.log("Quiz Generated Successfully ---", data);
              enqueueSnackbar("Quiz generated successfully!", {
                variant: "success",
              });
              // Handle successful quiz generation here (e.g., update state, navigate to quiz view)
            }
          },
        }
      );
    } else {
      setPromptError("Please enter a prompt before generating a quiz.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Prevent default behavior (new line) and trigger quiz generation
      event.preventDefault();
      handleGenerateQuiz();
    }
  };

  const handleSaveQuiz = async () => {
    if (!isEmpty(quizData)) {
      try {
        const result = await createQuizEndToEnd(quizData);
        // console.log("Saved quiz data ---", result);
        enqueueSnackbar(result.message, {
          variant: "success",
        });
        // Navigate to quiz page
        navigate(`/category/${result?.categorySlug}/${result?.quizSlug}`);
      } catch (error) {
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      }
    }
  };

  return (
    <>
      <Box className={styles.headerContainer}>
        <Typography
          className={styles.title}
          sx={{
            fontSize: {
              md: "40px",
              xs: "30px",
            },
          }}
        >
          {quizData?.quiz?.title &&
          !isGenerateQuizMutationPending &&
          !isCreateQuizEndToEndLoading &&
          !promptError
            ? `Generated - ${quizData?.quiz?.title}`
            : "Generate IT Quizzes with AI"}
        </Typography>
        {/* Prompt Box */}
        <Box
          sx={{
            position: "relative",
            width: {
              xs: "100%", // width for mobile devices
              md: "50%", // width for desktop devices
            },
          }}
        >
          <TextField
            id="outlined-basic"
            variant="outlined"
            placeholder="Ex - Quiz on javascript ES6 features..."
            value={prompt}
            onChange={handlePromptChange}
            onKeyDown={handleKeyDown}
            multiline
            minRows={1}
            maxRows={4}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ alignSelf: "flex-start" }}
                >
                  <AutoAwesomeOutlinedIcon
                    sx={{
                      minWidth: "24px",
                      minHeight: "24px",
                      fontSize: "24px !important",
                    }}
                  />
                </InputAdornment>
              ),

              classes: {
                root: styles.textFieldRoot,
                input: styles.textFieldInput,
              },
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-input": {
                marginRight: {
                  md: !isGenerateQuizMutationPending && prompt ? "35px" : "",
                  xs: !isGenerateQuizMutationPending && prompt ? "35px" : "",
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "gray !important",
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "gray !important",
                },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "gray !important",
                },
            }}
          />
          {/* Submit Btn */}
          {!isGenerateQuizMutationPending && prompt && (
            <Box
              sx={{
                position: "absolute",
                top: "11px",
                right: "8px",
                zIndex: 1,
              }}
              onClick={handleGenerateQuiz}
            >
              <Box className={styles.submitBtn}>
                <ArrowUpwardRoundedIcon sx={{ fontSize: "24px" }} />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      {/* Prompt examples */}
      {!isGenerateQuizMutationPending &&
        !isCreateQuizEndToEndLoading &&
        !promptError &&
        !quizData && (
          <Box className={styles.promptExamplesContainer}>
            <Box
              className={styles.promptExample}
              sx={{
                width: {
                  xs: "100%", // width for mobile devices
                  md: "50%", // width for desktop devices
                },
              }}
            >
              <Typography
                sx={{ fontSize: "16px", fontWeight: 600, color: "#363434" }}
              >
                Here are some example prompts you can use to generate quizzes:
              </Typography>
              <Typography component="ul" sx={{ padding: "5px 5px 0 0" }}>
                {EXAMPLE_PROMPTS?.map((prompt, index) => (
                  <Typography key={index} component="li">
                    {`${index + 1}. ${prompt}`}
                  </Typography>
                ))}
              </Typography>
            </Box>
          </Box>
        )}

      {/* Loader */}
      {isGenerateQuizMutationPending && (
        <Box className={styles.loader}>
          <Loader />
        </Box>
      )}
      {isCreateQuizEndToEndLoading && (
        <Box className={styles.wholePageLoader}>
          <Loader />
        </Box>
      )}
      {/* Prompt Error */}
      {!isGenerateQuizMutationPending && promptError && (
        <Box className={styles.promptErrorContainer}>
          <Box
            className={styles.promptError}
            sx={{
              width: {
                xs: "100%", // width for mobile devices
                md: "50%", // width for desktop devices
              },
            }}
          >
            <Typography
              sx={{ fontSize: "16px", fontWeight: 600, color: "#363434" }}
            >
              {`${promptError?.error} -`}
            </Typography>
            <Typography sx={{ padding: "5px 5px 0 0" }}>
              {promptError?.message}
            </Typography>
          </Box>
        </Box>
      )}
      {/* Generated Quiz */}
      {!isGenerateQuizMutationPending &&
        !isGenerateQuizMutationError &&
        quizData && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                width: {
                  xs: "100%", // width for mobile devices
                  md: "80%", // width for desktop devices
                },
              }}
            >
              <GeneratedQuiz generatedQuizData={quizData} />
              <Button
                variant="contained"
                color="primary"
                className={styles.button}
                onClick={handleSaveQuiz}
                sx={{ width: "110px" }}
              >
                Save Quiz
              </Button>
            </Box>
          </Box>
        )}
    </>
  );
};

export default QuizGenerate;
