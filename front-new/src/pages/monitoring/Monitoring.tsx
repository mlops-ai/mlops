import { useNavigate, useParams } from "react-router-dom";

const Monitoring = () => {
    console.log("Monitoring");

    const navigate = useNavigate();

    const { model_id } = useParams();

    return <div>{model_id}</div>;
};

export default Monitoring;
