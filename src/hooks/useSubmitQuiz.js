import { useMutation } from "@apollo/client";
import { SUBMIT_QUIZ_MUTATION } from "@/graphql/queries"; // Adjust the path as needed

const useSubmitQuiz = () => {
  const [submitQuiz, { data, loading, error }] =
    useMutation(SUBMIT_QUIZ_MUTATION);

  const submit = async (quizId, answers) => {
    try {
      const result = await submitQuiz({ variables: { quizId, answers } });
      return result.data.submitQuiz;
    } catch (err) {
      console.error("Error submitting quiz:", err);
      throw err;
    }
  };

  return {
    submit,
    data: data?.submitQuiz,
    loading,
    error,
  };
};

export default useSubmitQuiz;
