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
