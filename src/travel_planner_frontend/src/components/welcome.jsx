import { useNavigate } from "react-router-dom";
import Login from "../login";
import AuthButton from "../auth/authbutton";

const TravelAIGuide = () => {
  const router = useNavigate();
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to Travel AI</h1>
        <p className="welcome-description">
          Your smart companion for personalized travel experiences.
        </p>
        <AuthButton />
      </div>
    </div>
  );
};

export default TravelAIGuide;
