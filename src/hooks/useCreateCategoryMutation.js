import { useMutation } from "@apollo/client";
import {
  CREATE_CATEGORY_MUTATION,
  // GET_ALL_CATEGORIES,
} from "@/graphql/queries";

const useCreateCategoryMutation = (onSuccess, onError) => {
  return useMutation(CREATE_CATEGORY_MUTATION, {
    onError,
    onCompleted: (data) => {
      if (onSuccess) {
        onSuccess(data.createCategory);
      }
    },
    // refetchQueries: [{ query: GET_ALL_CATEGORIES }], // Refetch the categories query after the mutation completes
  });
};

export default useCreateCategoryMutation;
