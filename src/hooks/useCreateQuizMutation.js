import { useMutation } from "@apollo/client";
import { CREATE_QUIZ_MUTATION, GET_ALL_CATEGORIES } from "@/graphql/queries";

const useCreateQuizMutation = (onSuccess, onError) => {
  return useMutation(CREATE_QUIZ_MUTATION, {
    onError,
    onCompleted: (data) => {
      if (onSuccess) {
        onSuccess(data.createQuiz);
      }
    },
    refetchQueries: [{ query: GET_ALL_CATEGORIES }],
  });
};

export default useCreateQuizMutation;
