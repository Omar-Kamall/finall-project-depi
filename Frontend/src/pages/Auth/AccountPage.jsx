import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AccountPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate("/account/profile");
      } else {
        navigate("/account/login");
      }
    }
  }, [isAuthenticated, loading, navigate]);

  return null;
};

export default AccountPage;

