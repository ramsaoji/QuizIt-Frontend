import { useMutation } from "@apollo/client";
import {
  DELETE_QUIZ_MUTATION,
  GET_ALL_CATEGORIES,
  GET_QUIZZES_BY_CATEGORY_SLUG,
} from "@/graphql/queries";

const useDeleteQuizMutation = (categorySlug, onSuccess, onError) => {
  return useMutation(DELETE_QUIZ_MUTATION, {
    onError,
    onCompleted: (data) => {
      if (data.deleteQuiz.success && onSuccess) {
        onSuccess(data.deleteQuiz);
      } else if (!data.deleteQuiz.success && onError) {
        onError(new Error(data.deleteQuiz.message));
      }
    },
    refetchQueries: [
      { query: GET_ALL_CATEGORIES },
      {
        query: GET_QUIZZES_BY_CATEGORY_SLUG,
        variables: { slug: categorySlug },
      },
    ],
  });
};

export default useDeleteQuizMutation;
