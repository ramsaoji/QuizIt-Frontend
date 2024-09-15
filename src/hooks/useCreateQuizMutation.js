import { useMutation } from "@apollo/client";
import { CREATE_QUIZ_MUTATION } from "@/graphql/queries";

const useCreateQuizMutation = (onSuccess, onError) => {
  return useMutation(CREATE_QUIZ_MUTATION, {
    onError,
    onCompleted: (data) => {
      if (onSuccess) {
        onSuccess(data.createQuiz);
      }
    },
  });
};

export default useCreateQuizMutation;
