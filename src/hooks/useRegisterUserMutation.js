import { useMutation } from "@apollo/client";
import { REGISTER_USER_MUTATION } from "@/graphql/queries";

const useRegisterUserMutation = (onSuccess, onError) => {
  const [mutate, { loading, error, data }] = useMutation(
    REGISTER_USER_MUTATION,
    {
      onCompleted: (data) => {
        // console.log("Registration successful:", data.registerUser);
        if (onSuccess) onSuccess(data.registerUser);
      },
      onError: (error) => {
        // console.error("Registration error:", error.message);
        if (onError) onError(error);
      },
    }
  );

  return {
    mutate: (variables) => mutate({ variables }),
    isLoading: loading,
    isError: !!error,
    error,
    isSuccess: !!data,
    data: data?.registerUser,
  };
};

export default useRegisterUserMutation;
