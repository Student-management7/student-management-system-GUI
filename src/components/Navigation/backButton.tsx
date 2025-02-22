import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Importing ArrowLeft icon

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
        <button onClick={handleBack} className="p-2 rounded-full arrow transition">
            <ArrowLeft className="h-7 w-7" />
        </button>
    );
};

export default BackButton;
