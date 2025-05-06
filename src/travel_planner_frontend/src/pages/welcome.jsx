import { useNavigate } from "react-router-dom";
import AuthButton from "../components/authbutton";

const TravelAIGuide = () => {
  const router = useNavigate();
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to Travel AI</h1>
        <p className="welcome-description">
          Your AI-powered travel companion that helps you discover, plan, and
          organize your perfect trip.
        </p>
        <AuthButton />
      </div>
    </div>
  );
};

export default TravelAIGuide;
