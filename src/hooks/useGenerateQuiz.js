// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";

// // Define the function that will be used by React Query
// const generateQuiz = async (prompt) => {
//   const response = await axios.post(
//     import.meta.env.VITE_GENERATE_QUIZ_API_URL,
//     {
//       prompt,
//     }
//   );
//   return response.data;
// };

// // Define the custom hook
// const useGenerateQuiz = () => {
//   return useMutation({
//     mutationFn: generateQuiz,
//   });
// };

// export default useGenerateQuiz;

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Define the function that will be used by React Query
const generateQuiz = async ({ prompt, token }) => {
  const response = await axios.post(
    import.meta.env.VITE_GENERATE_QUIZ_API_URL,
    { prompt },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token here
        "Content-Type": "application/json",
      },
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
