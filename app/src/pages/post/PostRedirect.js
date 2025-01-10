import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PostRedirect() {
    const navigate = useNavigate();

    const { categoria } = useParams();

    useEffect(() => {
    if (categoria) {
        navigate("/feed?categoria="+categoria);
    } else {
        navigate("/feed");
    }
    }, [navigate]);
    
    return null;
}