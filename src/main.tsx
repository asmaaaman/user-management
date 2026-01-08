import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: '"IBM Plex Sans Arabic", Arial, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});



ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(

  
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
