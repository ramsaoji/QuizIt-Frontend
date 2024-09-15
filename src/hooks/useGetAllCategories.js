import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "@/graphql/queries";

const useGetAllCategories = () => {
  return useQuery(GET_ALL_CATEGORIES, {
    // Optional: configure retry behavior if needed
    retry: false,
    // Optional: cache data for 1 minute
    staleTime: 60000,
    // Optional: keep data in cache for 5 minutes
    cacheTime: 300000,
  });
};

export default useGetAllCategories;
