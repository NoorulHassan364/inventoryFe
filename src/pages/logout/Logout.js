import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/signin");
};

export default Logout;
