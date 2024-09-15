import { StrictMode } from "react";
import { ApolloProvider } from "@apollo/client";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import Layout from "@/Layout";
import QuizCategories from "@/pages/QuizCategories/QuizCategories";
import QuizSelection from "@/pages/QuizSelection/QuizSelection";
import Quiz from "@/pages/Quiz/Quiz";
import QuizGenerate from "@/pages/QuizGenerate/QuizGenerate";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
import client from "@/apolloClient";
import "@/index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <QuizCategories />,
      },
      {
        path: "category/:categorySlug", // Path for category-specific quizzes
        element: <QuizSelection />,
      },
      {
        path: "category/:categorySlug/:quizSlug", // Path for individual quizzes
        element: <Quiz />,
      },
      {
        path: "generate-quiz",
        element: <QuizGenerate />,
      },
    ],
  },
]);

// Create a client
const queryClient = new QueryClient();

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
