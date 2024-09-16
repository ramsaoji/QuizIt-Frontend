import { StrictMode } from "react";
import { ApolloProvider } from "@apollo/client";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import Layout from "@/Layout";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute/PublicRoute";
import SignInOrUp from "@/pages/SignInOrUp/SignInOrUp";
import QuizCategories from "@/pages/QuizCategories/QuizCategories";
import QuizSelection from "@/pages/QuizSelection/QuizSelection";
import Quiz from "@/pages/Quiz/Quiz";
import QuizGenerate from "@/pages/QuizGenerate/QuizGenerate";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
import client from "@/apollo-client-config";
import "@/index.css";

// Create a client
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/signin",
        element: (
          <PublicRoute>
            <SignInOrUp />
          </PublicRoute>
        ),
      },
      {
        index: true,
        element: (
          <ProtectedRoute>
            <QuizCategories />
          </ProtectedRoute>
        ),
      },
      {
        path: "category/:categorySlug", // Path for category-specific quizzes
        element: (
          <ProtectedRoute>
            <QuizSelection />
          </ProtectedRoute>
        ),
      },
      {
        path: "category/:categorySlug/:quizSlug", // Path for individual quizzes
        element: (
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        ),
      },
      {
        path: "generate-quiz",
        element: (
          <ProtectedRoute>
            <QuizGenerate />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SnackbarProvider autoHideDuration={2000}>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={client}>
          <RouterProvider router={router} />
        </ApolloProvider>
      </QueryClientProvider>
    </SnackbarProvider>
  </StrictMode>
);
