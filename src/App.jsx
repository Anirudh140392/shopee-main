import React, { useContext } from "react";
import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router";
import PerformanceOverviewComponent from "./assets/pages/performanceOverview";
import Login from "./assets/pages/auth/login";
import History from "./assets/pages/history";
import Navbar from "./Navbar";
import Header from "./Header";
import authContext from "./store/auth/authContext";
import NegativeKeywordsComponent from "./assets/pages/negativeKeywords";
import SmartControl from "./assets/pages/smartControl";
import ProductAnalyticsComponent from "./assets/pages/productAnalytics";

function App() {
  const location = useLocation();
  const { isLoggedIn } = useContext(authContext)
  return (
    <>
      {!location.pathname.includes("/login") &&
        !location.pathname.includes("/signup") && (
          <>
            <Navbar />
            <Header />
          </>
        )}
      <div
        className={`${location.pathname.includes("/login") ||
          location.pathname.includes("/signup")
          ? "auth-main-con"
          : "main-con"
          }`}
      >
        <Routes>
          <Route path="/" element={isLoggedIn ? <PerformanceOverviewComponent /> : <Navigate to="/login" />} />
          <Route path="/rules" element={isLoggedIn ? <SmartControl /> : <Navigate to="/login" />} />
          <Route path="/history" element={isLoggedIn ? <History /> : <Navigate to="/login" />} />
          <Route path="/negative-keywords" element={isLoggedIn ? <NegativeKeywordsComponent /> : <Navigate to="/login" />} />
          <Route path="/product-analytics" element={isLoggedIn ? <ProductAnalyticsComponent /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
