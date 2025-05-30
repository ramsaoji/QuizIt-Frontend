import * as React from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  styled,
} from "@mui/material/";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { QUIZ_CARD_BG_COLORS } from "@/utils/constants";
import useDeleteCategoryMutation from "@/hooks/useDeleteCategoryMutation";
import useDeleteQuizMutation from "@/hooks/useDeleteQuizMutation";
import { GET_QUIZZES_BY_CATEGORY_SLUG } from "@/graphql/queries";
import styles from "./QuizCard.module.css";

// Styled components for the dialog
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    padding: theme.spacing(1),
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  },
}));

const DialogTitle = styled(MuiDialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 2),
  "& .warning-icon": {
    color: theme.palette.error.main,
    fontSize: "28px",
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(0, 2, 1.5),
  "& .MuiDialogContentText-root": {
    color: theme.palette.text.secondary,
    fontSize: "1rem",
    marginBottom: 0,
  },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(1, 2, 1.5),
  gap: theme.spacing(1),
  "& .MuiButton-root": {
    borderRadius: "8px",
    padding: theme.spacing(0.75, 2),
    textTransform: "none",
    fontWeight: 600,
  },
  "& .cancel-button": {
    color: theme.palette.text.secondary,
  },
  "& .delete-button": {
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
}));

const QuizCard = ({ item, index, backgroundColor, categorySlug }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const client = useApolloClient();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [deleteType, setDeleteType] = React.useState(null);

  const {
    _id,
    name: categoryName = "",
    title: quizTitle = "",
    description = "",
    quizzes = [],
    questions = [],
    category,
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

  const [deleteCategory] = useDeleteCategoryMutation(
    () => {
      enqueueSnackbar("Category deleted successfully", { variant: "success" });
      navigate("/");
    },
    (error) => {
      enqueueSnackbar(error.message || "Failed to delete category", {
        variant: "error",
      });
    }
  );

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory({ variables: { categoryId } });
    } catch (error) {
      console.error("Error deleting category:", error);
      enqueueSnackbar("Failed to delete category", { variant: "error" });
    }
  };

  const [deleteQuiz] = useDeleteQuizMutation(
    categorySlug,
    async (result) => {
      enqueueSnackbar("Quiz deleted successfully", { variant: "success" });

      // If this was the last quiz in the category, delete the category
      if (result.success && category) {
        const remainingQuizzes = await checkRemainingQuizzes();
        if (remainingQuizzes === 0) {
          enqueueSnackbar(
            "This is the last quiz in the category. The category will be deleted.",
            {
              variant: "info",
              autoHideDuration: 3000,
            }
          );
          await handleDeleteCategory(category._id);
        }
      }
    },
    (error) => {
      console.error("Delete quiz error:", error);
      enqueueSnackbar(error.message || "Failed to delete quiz", {
        variant: "error",
      });
    }
  );

  const checkRemainingQuizzes = async () => {
    try {
      // Use the GET_QUIZZES_BY_CATEGORY_SLUG query that's already being refetched
      const response = await client.query({
        query: GET_QUIZZES_BY_CATEGORY_SLUG,
        variables: { slug: categorySlug },
        fetchPolicy: "network-only",
      });
      return response.data?.getAllQuizzesByCategorySlug?.length || 0;
    } catch (error) {
      console.error("Error checking remaining quizzes:", error);
      return 1; // Return 1 to prevent category deletion in case of error
    }
  };

  const handleDelete = (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    setDeleteType(isCategoryCard ? "category" : "quiz");
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    setOpenDialog(false);
    if (deleteType === "category") {
      handleDeleteCategory(_id);
    } else {
      try {
        deleteQuiz({
          variables: {
            quizId: _id,
          },
        });
      } catch (error) {
        console.error("Error in handleDelete:", error);
        enqueueSnackbar("Failed to delete quiz", { variant: "error" });
      }
    }
  };

  const handleCloseDialog = (e) => {
    e?.preventDefault(); // Prevent navigation if event exists
    e?.stopPropagation(); // Prevent event bubbling if event exists
    setOpenDialog(false);
    setDeleteType(null);
  };

  const getDialogContent = () => {
    if (deleteType === "category") {
      return {
        title: "Delete Category",
        content:
          "Are you sure you want to delete this category? This will delete all quizzes in this category.",
      };
    }
    return {
      title: "Delete Quiz",
      content: "Are you sure you want to delete this quiz?",
    };
  };

  const dialogContent = getDialogContent();

  return (
    <>
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
            border: "2px solid gray",
            boxShadow:
              "rgba(50, 50, 93, 1) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 4px 8px -3px",
          },
        }}
      >
        <Box className={styles.cardHeader}>
          <IconButton
            className={styles.deleteButton}
            onClick={handleDelete}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        <Box className={styles.cardContent}>
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
      </Box>

      <StyledDialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        maxWidth="xs"
        fullWidth
        onClick={(e) => e.stopPropagation()} // Prevent click propagation
      >
        <DialogTitle id="delete-dialog-title">
          <WarningAmberIcon className="warning-icon" />
          <Typography variant="h6" component="span">
            {dialogContent.title}
          </Typography>
        </DialogTitle>
        <StyledDialogContent>
          <DialogContentText id="delete-dialog-description">
            {dialogContent.content}
          </DialogContentText>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button
            onClick={handleCloseDialog}
            className="cancel-button"
            size="medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            className="delete-button"
            variant="contained"
            size="medium"
            autoFocus
          >
            Delete
          </Button>
        </StyledDialogActions>
      </StyledDialog>
    </>
  );
};

export default QuizCard;
