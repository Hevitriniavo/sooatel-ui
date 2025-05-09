import { useState, useEffect, useCallback } from 'react';

const useFetch = (urlOrFunction) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(() => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        const url = typeof urlOrFunction === 'function' ? urlOrFunction() : urlOrFunction;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                return response.json();
            })
            .then(result => {
                setData(result);
            })
            .catch(err => {
                setIsError(true);
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [urlOrFunction]);

    useEffect(() => {
        fetchData();
    }, []);

    return { data, isLoading, isError, error };
};

export default useFetch;