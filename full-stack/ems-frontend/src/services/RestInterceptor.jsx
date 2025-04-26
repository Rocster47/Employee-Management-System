import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RestInterceptor = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    navigate("/login");
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [navigate]);
};

export default RestInterceptor;
