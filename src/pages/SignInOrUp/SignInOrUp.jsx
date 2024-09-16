import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { auth } from "@/firebase-config";
import useRegisterUserMutation from "@/hooks/useRegisterUserMutation";
import { useAuth } from "@/hooks/useAuth";
import useGetAllCategories from "@/hooks/useGetAllCategories";
import { mapFirebaseError } from "@/utils/constants";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInOrUpContainer = styled(Stack)(({ theme }) => ({
  flex: 1,
  // padding: 20,
  // marginTop: "10vh",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const SignInOrUp = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser, loading: authLoading } = useAuth();
  const [isSignInLoading, setIsSignInLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isSignInOrUpForm, setIsSignInOrUpForm] = useState(true);

  // const { refetch: allCategoriesRefetch } = useGetAllCategories();

  const onRegisterUserMutationSuccess = (data) => {
    // console.log("Registration successful:", data);
    reset();
    navigate("/");
  };

  const onRegisterUserMutationError = (error) => {
    console.error("Registration failed:", error);
    // Handle error, e.g., show an error message
  };

  const {
    mutate: registerUserMutation,
    isLoading: isRegisterUserMutationLoading,
    isSuccess: isRegisterUserMutationSuccess,
  } = useRegisterUserMutation(
    onRegisterUserMutationSuccess,
    onRegisterUserMutationError
  );

  useEffect(() => {
    if (
      (currentUser && !authLoading) ||
      (currentUser && !authLoading && isRegisterUserMutationSuccess)
    ) {
      navigate("/");
    }
  }, [currentUser, authLoading, navigate, isRegisterUserMutationSuccess]);

  const onSubmit = async (data) => {
    setIsSignInLoading(true);

    try {
      let userCredential;
      if (isSignInOrUpForm) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
      } else {
        // First, create the user in Firebase Auth
        userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

        // Update the user's profile with the display name
        await updateProfile(userCredential.user, {
          displayName: data.displayName || data.email.split("@")[0],
        });

        // Then, call your backend mutation to create the user in your database
        await registerUserMutation({
          email: data.email,
          displayName: data.displayName || data.email.split("@")[0],
          uid: userCredential?.user?.uid,
        });
      }
      reset();
      // Navigation will be handled by the useEffect hook monitoring currentUser
    } catch (error) {
      // Custom error handler to map Firebase errors to a structured format
      const { error: customError } = mapFirebaseError(error);

      enqueueSnackbar(customError?.message, {
        variant: "error",
      });
    } finally {
      // allCategoriesRefetch();
      setIsSignInLoading(false);
    }
  };

  const isLoading = isSignInLoading || isRegisterUserMutationLoading;

  return (
    <SignInOrUpContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {isSignInOrUpForm ? "Sign In" : "Sign Up"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              disabled={isLoading}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
              id="password"
              type="password"
              name="password"
              placeholder="••••••"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              disabled={isLoading}
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isSignInOrUpForm ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </Button>

          <Typography sx={{ textAlign: "center" }}>
            {isSignInOrUpForm
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <Typography
              component="span"
              sx={{
                cursor: "pointer",
                color: "primary.main",
              }}
              onClick={() => setIsSignInOrUpForm(!isSignInOrUpForm)}
            >
              {isSignInOrUpForm ? "Sign up" : "Sign in"}
            </Typography>
          </Typography>
        </Box>
      </Card>
    </SignInOrUpContainer>
  );
};

export default SignInOrUp;
