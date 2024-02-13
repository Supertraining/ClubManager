import { useEffect, useState } from "react";
import useAxiosInstance from "./useAxiosInstance.jsx";

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const axios = useAxiosInstance();
    useEffect(() => {
        const fetchData = async () => {
            
            try {
                const res = await axios.get(url);
                setData(res.data);
            } catch (error) {
                setError(error)
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const reFetch = async () => {
        
        try {
            const res = await axios.get(url);
            setData(res.data);
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return {data, loading, error, reFetch};

};

export default useFetch;