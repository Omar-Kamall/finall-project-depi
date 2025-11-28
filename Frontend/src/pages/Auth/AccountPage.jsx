import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

const AccountPage = () => {
  const isAuthenticated = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      if (isAuthenticated) {
        navigate("/account/profile");
      } else {
        navigate("/account/login");
      }
    }
  }, [isAuthenticated , navigate]);

  return null;
};

export default AccountPage;

