import { useNavigate } from "react-router-dom";

interface MissingPageProps {
  route: string;
  displayText: string;
}

const MissingPage: React.FC<MissingPageProps> = ({ route, displayText }) => {
  const navigate = useNavigate();

  setTimeout(() => {
    navigate(route);
  }, 3000);

  return (
    <div>
      <h1>Oops!</h1>
      <p>Page Not Found</p>
      <div>
        <p> You will be redirected to {displayText} in few seconds!</p>
      </div>
    </div>
  );
};

export default MissingPage;
