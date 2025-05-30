import { gql } from "@apollo/client";

// Get queries
export const GET_ALL_CATEGORIES = gql`
  query {
    getAllCategories {
      _id
      name
      description
      slug
      quizzes {
        _id
        title
      }
    }
  }
`;

// not used yet
export const GET_CATEGORY_BY_SLUG = gql`
  query GetCategoryBySlug($slug: String!) {
    category(slug: $slug) {
      _id
      name
      description
      quizzes {
        _id
        title
        slug
      }
    }
  }
`;

export const GET_QUIZZES_BY_CATEGORY_SLUG = gql`
  query GetQuizzesByCategorySlug($slug: String!) {
    getAllQuizzesByCategorySlug(slug: $slug) {
      _id
      title
      description
      slug
      category {
        _id
        name
        slug
      }
      questions {
        _id
        question
        options
      }
    }
  }
`;

export const GET_QUIZ_BY_SLUG = gql`
  query GetQuizBySlug($slug: String!) {
    getQuizBySlug(slug: $slug) {
      _id
      title
      description
      questions {
        _id
        question
        options
      }
    }
  }
`;

// Mutations queries
export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory(
    $name: String!
    $description: String!
    $categorySlug: String!
  ) {
    createCategory(
      name: $name
      description: $description
      slug: $categorySlug
    ) {
      _id
      name
      description
      slug
    }
  }
`;

export const CREATE_QUIZ_MUTATION = gql`
  mutation CreateQuiz(
    $title: String!
    $description: String!
    $categorySlug: String!
  ) {
    createQuiz(
      title: $title
      description: $description
      categorySlug: $categorySlug
    ) {
      _id
      title
      description
      slug
    }
  }
`;

export const CREATE_QUESTION_MUTATION = gql`
  mutation CreateQuestion(
    $quizId: ID!
    $question: String!
    $options: [String!]!
    $answer: String!
  ) {
    createQuestion(
      quizId: $quizId
      question: $question
      options: $options
      answer: $answer
    ) {
      _id
      question
      options
      answer
      quiz {
        _id
        title
      }
    }
  }
`;

export const UPDATE_QUIZ_WITH_QUESTIONS_MUTATION = gql`
  mutation UpdateQuizWithQuestions($quizId: ID!, $questionIds: [ID!]!) {
    updateQuizWithQuestions(quizId: $quizId, questionIds: $questionIds) {
      _id
      title
      questions {
        _id
        question
      }
    }
  }
`;

export const SUBMIT_QUIZ_MUTATION = gql`
  mutation SubmitQuiz($quizId: ID!, $answers: [AnswerInput!]!) {
    submitQuiz(quizId: $quizId, answers: $answers) {
      score
      feedback {
        correctAnswer
        isCorrect
      }
    }
  }
`;

export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($email: String!, $displayName: String!, $uid: String!) {
    registerUser(email: $email, displayName: $displayName, uid: $uid) {
      _id
      email
      displayName
    }
  }
`;

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($categoryId: ID!) {
    deleteCategory(categoryId: $categoryId) {
      success
      message
    }
  }
`;

export const DELETE_QUIZ_MUTATION = gql`
  mutation DeleteQuiz($quizId: ID!) {
    deleteQuiz(quizId: $quizId) {
      success
      message
    }
  }
`;
