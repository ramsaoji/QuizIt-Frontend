import { useQuery } from "@apollo/client";
import { GET_QUIZ_BY_SLUG } from "@/graphql/queries"; // Ensure this path is correct

const useGetQuizBySlug = (slug) => {
  return useQuery(GET_QUIZ_BY_SLUG, {
    variables: { slug },
    // Optional: configure retry behavior if needed
    retry: false,
    // Optional: cache data for 1 minute
    staleTime: 60000,
    // Optional: keep data in cache for 5 minutes
    cacheTime: 300000,
  });
};

export default useGetQuizBySlug;
