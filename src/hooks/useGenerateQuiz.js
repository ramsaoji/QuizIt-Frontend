import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Define the function that will be used by React Query
const generateQuiz = async (prompt) => {
  const response = await axios.post(
    import.meta.env.VITE_GENERATE_QUIZ_API_URL,
    {
      prompt,
    }
  );
  return response.data;
};

// Define the custom hook
const useGenerateQuiz = () => {
  return useMutation({
    mutationFn: generateQuiz,
  });
};

export default useGenerateQuiz;
