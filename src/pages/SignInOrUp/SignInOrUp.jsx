import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import useRegisterUserMutation from "@/hooks/useRegisterUserMutation";
import { mapFirebaseError } from "@/utils/constants";
import { auth } from "@/firebase-config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
} from "@mui/icons-material";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";

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

const SignInOrUp = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser, loading: authLoading } = useAuth();
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();
  const [isSignInOrUpForm, setIsSignInOrUpForm] = useState(true);

  const password = watch("password");

  const onRegisterUserMutationSuccess = (data) => {
    reset();
    navigate("/");
  };

  const onRegisterUserMutationError = (error) => {
    console.error("Registration failed:", error);
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
        userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

        await updateProfile(userCredential.user, {
          displayName: data.displayName || data.email.split("@")[0],
        });

        await registerUserMutation({
          email: data.email,
          displayName: data.displayName || data.email.split("@")[0],
          uid: userCredential?.user?.uid,
        });
      }
      reset();
    } catch (error) {
      const { error: customError } = mapFirebaseError(error);
      enqueueSnackbar(customError?.message, {
        variant: "error",
      });
    } finally {
      setIsSignInLoading(false);
    }
  };

  const handleAuthResult = async (result) => {
    if (result) {
      const user = result.user;
      if (user) {
        await registerUserMutation({
          email: user.email,
          displayName: user.displayName || user.email.split("@")[0],
          uid: user.uid,
        });
      }
      navigate("/");
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      let result;
      if (window.matchMedia("(display-mode: standalone)").matches) {
        // PWA or storage-partitioned environment - use redirect
        await signInWithRedirect(auth, provider);
        result = await getRedirectResult(auth);
      } else {
        // Regular browser environment - use popup
        result = await signInWithPopup(auth, provider);
      }

      await handleAuthResult(result);
    } catch (error) {
      const { error: customError } = mapFirebaseError(error);
      enqueueSnackbar(customError?.message, {
        variant: "error",
      });
    }
  };

  const isLoading = isSignInLoading || isRegisterUserMutationLoading;

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
      }}
    >
      <Card variant="outlined" sx={{ maxWidth: 400, width: "100%", p: 3 }}>
        <Typography component="h1" variant="h4" sx={{ mb: 1 }}>
          {isSignInOrUpForm ? "Sign In" : "Sign Up"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
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
              helperText={errors.email?.message}
              id="email"
              type="email"
              placeholder="your@email.com"
              fullWidth
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
              helperText={errors.password?.message}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••"
              fullWidth
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          {!isSignInOrUpForm && (
            <FormControl>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <TextField
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === password || "The passwords do not match",
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••"
                fullWidth
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleToggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isSignInOrUpForm ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </Button>

          <Divider>OR</Divider>

          <Button
            onClick={handleGoogleSignIn}
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            disabled={isLoading}
          >
            Sign in with Google
          </Button>

          <Typography align="center">
            {isSignInOrUpForm
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <Typography
              component="span"
              sx={{ cursor: "pointer", color: "primary.main" }}
              onClick={() => setIsSignInOrUpForm(!isSignInOrUpForm)}
            >
              {isSignInOrUpForm ? "Sign up" : "Sign in"}
            </Typography>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default SignInOrUp;
