import { useEffect, useState } from "react";
import axios from '../utils/axiosInstance.js';

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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