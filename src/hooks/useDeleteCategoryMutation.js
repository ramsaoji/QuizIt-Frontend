import { useMutation } from "@apollo/client";
import {
  DELETE_CATEGORY_MUTATION,
  GET_ALL_CATEGORIES,
} from "@/graphql/queries";

const useDeleteCategoryMutation = (onSuccess, onError) => {
  return useMutation(DELETE_CATEGORY_MUTATION, {
    onError,
    onCompleted: (data) => {
      if (data.deleteCategory.success && onSuccess) {
        onSuccess(data.deleteCategory);
      } else if (!data.deleteCategory.success && onError) {
        onError(new Error(data.deleteCategory.message));
      }
    },
    refetchQueries: [{ query: GET_ALL_CATEGORIES }],
  });
};

export default useDeleteCategoryMutation;
