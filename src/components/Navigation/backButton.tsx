import { useNavigate } from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };


    return (
        <button
            onClick={handleBack}

        >
              <img className="h-7 w-7 "
              src="/images/button.png"></img>
        </button>

    );
};

export default BackButton;
