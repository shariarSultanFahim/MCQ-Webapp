"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f48b2b", // Orange
    },
    secondary: {
      main: "#43226c", // Pink
    },
  },
  cssVariables: true,
});

export default theme;
