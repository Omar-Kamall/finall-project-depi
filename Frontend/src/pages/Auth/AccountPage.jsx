import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";

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

  return <Loading message="Redirecting..." fullScreen />;
};

export default AccountPage;

