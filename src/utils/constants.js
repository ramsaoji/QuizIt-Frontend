export const EXAMPLE_PROMPTS = [
  "Introduction to Python Programming",
  "Basic HTML and CSS",
  "JavaScript ES6 Features",
  "Advanced SQL Queries",
  "Docker Containerization Best Practices",
  "REST API Design Principles",
  "Data Structures in Python",
  "Vue.js Components and Lifecycle",
  "Cloud Computing with AWS Lambda",
  "Machine Learning Algorithms Overview",
];

// export const QUIZ_CARD_BG_COLORS = ["#E54B40", "#E1AA38", "#14AEC6", "#41B97F"];

export const QUIZ_CARD_BG_COLORS = [
  { top: "#F37369", bottom: "#B0251B" },
  { top: "#EEB643", bottom: "#A16E03" },
  { top: "#14AEC6", bottom: "#10707E" },
  { top: "#41B97F", bottom: "#006936" },
];

// Function to generate color map based on categories
export const generateCategoryColorMap = (categories) => {
  const colorMap = {};
  categories.forEach((category, index) => {
    const colorIndex = index % QUIZ_CARD_BG_COLORS.length;
    colorMap[category.category] = QUIZ_CARD_BG_COLORS[colorIndex];
  });
  return colorMap;
};

// Custom error mapping function
export const mapFirebaseError = (error) => {
  switch (error.code) {
    case "auth/invalid-credential":
      return {
        error: {
          code: 400,
          message: "INVALID_LOGIN_CREDENTIALS",
          errors: [
            {
              message: "INVALID_LOGIN_CREDENTIALS",
              domain: "global",
              reason: "invalid",
            },
          ],
        },
      };
    case "auth/user-not-found":
      return {
        error: {
          code: 404,
          message: "USER_NOT_FOUND",
          errors: [
            {
              message: "USER_NOT_FOUND",
              domain: "global",
              reason: "notFound",
            },
          ],
        },
      };
    case "auth/wrong-password":
      return {
        error: {
          code: 401,
          message: "WRONG_PASSWORD",
          errors: [
            {
              message: "WRONG_PASSWORD",
              domain: "global",
              reason: "invalid",
            },
          ],
        },
      };
    // Add more cases as needed for different Firebase error codes

    default:
      return {
        error: {
          code: 500,
          message: "UNKNOWN_ERROR",
          errors: [
            {
              message: error.message || "An unknown error occurred",
              domain: "global",
              reason: "unknown",
            },
          ],
        },
      };
  }
};
