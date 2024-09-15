import { useMutation } from "@apollo/client";
import { UPDATE_QUIZ_WITH_QUESTIONS_MUTATION } from "@/graphql/queries";

const useUpdateQuizWithQuestionsMutation = (onSuccess, onError) => {
  return useMutation(UPDATE_QUIZ_WITH_QUESTIONS_MUTATION, {
    onError,
    onCompleted: (data) => {
      if (onSuccess) {
        onSuccess(data.updateQuizWithQuestions);
      }
    },
  });
};

export default useUpdateQuizWithQuestionsMutation;
