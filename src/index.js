import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Home from "./Routes/Home";
import Staking from "./Routes/Staking";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Layout from "./Components/Layout/Layout";
import { StyledEngineProvider } from "@mui/material/styles";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Auction from "./Routes/Auction";
import Raffle from "./Routes/Raffle";

const theme = createTheme({
  palette: {
    primary: {
      main: "#9E1D4D",
    },
  },
  typography: {
    fontFamily: "Open Sans, sans-serif",
  },
});

function App() {
  const location = useLocation();

  useEffect(() => {
    const startProgress = () => {
      NProgress.start();
    };

    const endProgress = () => {
      NProgress.done();
    };

    const progressTimeout = setTimeout(() => {
      endProgress();
    }, 500); // Add a timeout to ensure the progress bar is displayed even for quick page loads

    startProgress();

    return () => {
      clearTimeout(progressTimeout);
      endProgress();
    };
  }, [location.pathname]);

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Home | Fada Staking";
      case "/redemption":
        return "Redemption | Fada Staking";
      case "/staking":
        return "Staking | Fada Staking";
      default:
        return "Fada Staking";
    }
  };

  // console.log = function () {};
  // console.warn = function () {};
  // console.error = function () {};

  const [loggedin, setLoggedin] = useState(
    sessionStorage.getItem("testdata")
      ? sessionStorage.getItem("testdata")
      : false
  );

  useEffect(() => {
    sessionStorage.setItem("testdata", loggedin);
  }, [loggedin]);

  return (
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Helmet>
            <title>{getTitle()}</title>
          </Helmet>
          <Layout loggedin={loggedin} setLoggedin={setLoggedin}>
            <Routes>
              <Route
                index
                element={
                  <>
                    {!loggedin ? (
                      <Home setLoggedin={setLoggedin} />
                    ) : (
                      <Staking setLoggedin={setLoggedin} />
                    )}
                  </>
                }
              />
              <Route path="auction" element={<Auction />} />
              <Route path="raffle" element={<Raffle />} />
            </Routes>
          </Layout>
          <ToastContainer
            autoClose={2000}
            hideProgressBar={true}
            closeOnClick
            pauseOnHover
            draggable={true}
            position="top-right"
            toastClassName=""
            bodyClassName=""
            progressClassName=""
            pauseOnFocusLoss={true}
            newestOnTop={true}
            theme="colored"
          />
        </ThemeProvider>
      </StyledEngineProvider>
    </React.StrictMode>
  );
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();
