import { useQuery } from "@apollo/client";
import { GET_QUIZZES_BY_CATEGORY_SLUG } from "@/graphql/queries";

const useGetAllQuizzesByCategorySlug = (categorySlug) => {
  return useQuery(GET_QUIZZES_BY_CATEGORY_SLUG, {
    variables: { slug: categorySlug },
    // Optional: configure retry behavior if needed
    retry: false,
    // Optional: cache data for 1 minute
    staleTime: 60000,
    // Optional: keep data in cache for 5 minutes
    cacheTime: 300000,
  });
};

export default useGetAllQuizzesByCategorySlug;
