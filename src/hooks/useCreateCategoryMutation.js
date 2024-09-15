import { useMutation } from "@apollo/client";
import { CREATE_CATEGORY_MUTATION } from "@/graphql/queries";

const useCreateCategoryMutation = (onSuccess, onError) => {
  return useMutation(CREATE_CATEGORY_MUTATION, {
    onError,
    onCompleted: (data) => {
      if (onSuccess) {
        onSuccess(data.createCategory);
      }
    },
  });
};

export default useCreateCategoryMutation;
