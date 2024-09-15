import { useCallback } from "react";
import useCreateCategoryMutation from "./useCreateCategoryMutation";
import useCreateQuestionMutation from "./useCreateQuestionMutation";
import useCreateQuizMutation from "./useCreateQuizMutation";
import useUpdateQuizWithQuestionsMutation from "./useUpdateQuizWithQuestionsMutation";

const useCreateQuizEndToEnd = () => {
  const [createCategory, { loading: isCreatingCategory }] =
    useCreateCategoryMutation();
  const [createQuestion, { loading: isCreatingQuestion }] =
    useCreateQuestionMutation();
  const [createQuiz, { loading: isCreatingQuiz }] = useCreateQuizMutation();
  const [updateQuizWithQuestions, { loading: isUpdatingQuizWithQuestions }] =
    useUpdateQuizWithQuestionsMutation();

  const createQuizEndToEnd = useCallback(
    async (parsedQuizData) => {
      try {
        // Step 1: Create or use existing category
        const existingCategory = parsedQuizData?.existingCategory;
        const categoryResult = existingCategory
          ? { data: { createCategory: existingCategory } }
          : await createCategory({ variables: parsedQuizData?.category });

        const {
          _id: categoryId,
          name: categoryName,
          slug: categorySlug,
        } = categoryResult.data.createCategory;

        // Step 2: Create quiz
        const quizResult = await createQuiz({
          variables: {
            ...parsedQuizData.quiz,
            categorySlug,
          },
        });

        const {
          _id: quizId,
          title: quizName,
          slug: quizSlug,
        } = quizResult.data.createQuiz;

        // Step 3: Create questions
        const questionIds = await Promise.all(
          parsedQuizData?.questions?.map(async (q) => {
            const questionResult = await createQuestion({
              variables: {
                ...q,
                quizId,
              },
            });
            return questionResult.data.createQuestion._id;
          })
        );

        // Step 4: Update quiz with question IDs
        await updateQuizWithQuestions({
          variables: {
            quizId,
            questionIds,
          },
        });

        return {
          message: "Quiz saved successfully",
          categoryName,
          quizName,
          categorySlug,
          quizSlug,
          categoryId,
          quizId,
        };
      } catch (error) {
        console.error("Error creating quiz end-to-end:", error);
        throw new Error("Failed to create quiz. Please try again.");
      }
    },
    [createCategory, createQuiz, createQuestion, updateQuizWithQuestions]
  );

  return {
    createQuizEndToEnd,
    isCreatingCategory,
    isCreatingQuestion,
    isCreatingQuiz,
    isUpdatingQuizWithQuestions,
  };
};

export default useCreateQuizEndToEnd;
