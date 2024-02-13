import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import useAxiosInstance from "./useAxiosInstance.jsx";

const useFetch = (url) => {
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);
  const axios = useAxiosInstance();


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
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
        setLoading(true);
        try {
            const res = await axios.get(url);
            setData(res.data);
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return { data, loading, error, reFetch };

};

useFetch.propTypes = {
    url : PropTypes.string.isRequired
}

export default useFetch;