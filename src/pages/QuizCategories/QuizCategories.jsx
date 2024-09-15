import React, { useMemo, useState } from "react";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import QuizCard from "@/components/QuizCard/QuizCard";
import Loader from "@/common/Loader";
import { generateCategoryColorMap } from "@/utils/constants";
import useGetAllCategories from "@/hooks/useGetAllCategories"; // Updated import
import styles from "./QuizCategories.module.css";

const QuizCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: { getAllCategories: allCategories } = {}, // Adjusted data structure
    error: quizCategoriesError,
    loading: isQuizCategoriesLoading,
  } = useGetAllCategories();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Ensure color map is calculated only when allCategories changes
  const colorMap = useMemo(
    () => generateCategoryColorMap(allCategories ?? []),
    [allCategories]
  );

  const filteredCategories = useMemo(
    () =>
      allCategories?.filter(
        (item) => item?.name.toLowerCase().includes(searchTerm.toLowerCase()) // Adjusted field
      ),
    [allCategories, searchTerm]
  );

  if (quizCategoriesError)
    return <div>Error: {quizCategoriesError.message}</div>;

  if (isQuizCategoriesLoading) {
    return (
      <Box className={styles.loader}>
        <Loader />
      </Box>
    );
  }

  return (
    <>
      {/* Header and Search */}
      <Box className={styles.headerContainer}>
        <Typography
          className={styles.title}
          sx={{
            fontSize: {
              md: "40px",
              xs: "30px",
            },
          }}
        >
          Let's Quiz It
        </Typography>
        {/* Search */}
        <TextField
          id="outlined-basic"
          variant="outlined"
          placeholder="Search Category..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: "32px" }} />
              </InputAdornment>
            ),
            classes: {
              root: styles.textFieldRoot, // Apply root styles
              input: styles.textFieldInput, // Apply input text styles
            },
          }}
          sx={{
            width: {
              xs: "100%", // width for mobile devices
              md: "50%", // width for desktop devices
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "gray !important",
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "gray !important",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "gray !important",
              },
          }}
        />
      </Box>

      {/* Cards */}
      <Box className={styles.cardGrid}>
        {!isEmpty(filteredCategories) &&
          filteredCategories.map((item, index) => (
            <Link key={item._id} to={`/category/${item.slug}`}>
              <QuizCard
                item={item}
                index={index}
                backgroundColor={colorMap[item.name]} // Adjusted field
              />
            </Link>
          ))}
      </Box>

      {/* No search results */}
      {isEmpty(filteredCategories) && !isEmpty(allCategories) && (
        <Typography className={styles.noResults}>
          No search results found...
        </Typography>
      )}
    </>
  );
};

export default QuizCategories;
