import { useMutation } from "@apollo/client";
import { CREATE_QUESTION_MUTATION } from "@/graphql/queries";

const useCreateQuestionMutation = (onSuccess, onError) => {
  return useMutation(CREATE_QUESTION_MUTATION, {
    onError,
    onCompleted: (data) => {
      if (onSuccess) {
        onSuccess(data.createQuestion);
      }
    },
  });
};

export default useCreateQuestionMutation;
