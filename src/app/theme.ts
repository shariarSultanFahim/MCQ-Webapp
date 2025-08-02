"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-funnel-display), sans-serif",
  },
  palette: {
    primary: {
      main: "#274032", // Orange
    },
    secondary: {
      main: "#A7CCCF", // Pink
    },
  },
  cssVariables: true,
});

export default theme;
